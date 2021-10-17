import { resolveAuthUser } from '@xrengine/common/src/interfaces/AuthUser'
import { IdentityProvider } from '@xrengine/common/src/interfaces/IdentityProvider'
import { resolveUser, resolveWalletUser } from '@xrengine/common/src/interfaces/User'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { MessageTypes } from '@xrengine/engine/src/networking/enums/MessageTypes'
// TODO: Decouple this
// import { endVideoChat, leave } from '@xrengine/engine/src/networking/functions/SocketWebRTCClientFunctions';
import axios from 'axios'
import { isDev } from '@xrengine/common/src/utils/isDev'

import querystring from 'querystring'
import { store, useDispatch } from '../../store'
import { v1 } from 'uuid'
import { client } from '../../feathers'
import { validateEmail, validatePhoneNumber, Config } from '@xrengine/common/src/config'
import { UserAction } from './UserAction'
import { AuthAction, EmailLoginForm, EmailRegistrationForm } from './AuthAction'
import { setAvatar } from '@xrengine/engine/src/avatar/functions/avatarFunctions'
import { _updateUsername } from '@xrengine/engine/src/networking/utils/chatSystem'
import { accessAuthState } from './AuthState'
import { hasComponent, addComponent, getComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'
import { WebCamInputComponent } from '@xrengine/engine/src/input/components/WebCamInputComponent'
import { isBot } from '@xrengine/engine/src/common/functions/isBot'
import { ProximityComponent } from '../../proximity/components/ProximityComponent'
import { Engine } from '@xrengine/engine/src/ecs/classes/Engine'
import { getEid } from '@xrengine/engine/src/networking/utils/getUser'
import { UserNameComponent } from '@xrengine/engine/src/scene/components/UserNameComponent'
import { useWorld } from '@xrengine/engine/src/ecs/functions/SystemHooks'
import { accessLocationState } from '../../social/state/LocationState'
import { accessPartyState } from '../../social/state/PartyState'
import { AlertService } from '../../common/state/AlertService'

export const AuthService = {
  doLoginAuto: async (allowGuest?: boolean, forceClientAuthReset?: boolean) => {
    const dispatch = useDispatch()
    try {
      const authData = getStoredAuthState()
      let accessToken =
        forceClientAuthReset !== true && authData && authData.authUser ? authData.authUser.accessToken : undefined

      if (allowGuest !== true && accessToken == null) {
        return
      }

      if (forceClientAuthReset === true) await (client as any).authentication.reset()
      if (allowGuest === true && (accessToken == null || accessToken.length === 0)) {
        const newProvider = await client.service('identity-provider').create({
          type: 'guest',
          token: v1()
        })
        accessToken = newProvider.accessToken
      }

      await (client as any).authentication.setAccessToken(accessToken as string)
      let res
      try {
        res = await (client as any).reAuthenticate()
      } catch (err) {
        if (err.className === 'not-found' || (err.className === 'not-authenticated' && err.message === 'jwt expired')) {
          await dispatch(AuthAction.didLogout())
          await (client as any).authentication.reset()
          const newProvider = await client.service('identity-provider').create({
            type: 'guest',
            token: v1()
          })
          accessToken = newProvider.accessToken
          await (client as any).authentication.setAccessToken(accessToken as string)
          res = await (client as any).reAuthenticate()
        } else {
          throw err
        }
      }
      if (res) {
        if (res['identity-provider']?.id == null) {
          await dispatch(AuthAction.didLogout())
          await (client as any).authentication.reset()
          const newProvider = await client.service('identity-provider').create({
            type: 'guest',
            token: v1()
          })
          accessToken = newProvider.accessToken
          await (client as any).authentication.setAccessToken(accessToken as string)
          res = await (client as any).reAuthenticate()
        }
        const authUser = resolveAuthUser(res)
        if (isDev) globalThis.userId = authUser.identityProvider.userId
        dispatch(AuthAction.loginUserSuccess(authUser))
        await AuthService.loadUserData(authUser.identityProvider.userId)
      } else {
        console.log('****************')
      }
    } catch (err) {
      console.error(err)
      dispatch(AuthAction.didLogout())

      // if (window.location.pathname !== '/') {
      //   window.location.href = '/';
      // }
    }
  },
  loadUserData: (userId: string): any => {
    return client
      .service('user')
      .get(userId)
      .then((res: any) => {
        if (res.user_setting == null) {
          return client
            .service('user-settings')
            .find({
              query: {
                userId: userId
              }
            })
            .then((settingsRes) => {
              if (settingsRes.total === 0) {
                return client
                  .service('user-settings')
                  .create({
                    userId: userId
                  })
                  .then((newSettings) => {
                    res.user_setting = newSettings

                    return Promise.resolve(res)
                  })
              }
              res.user_setting = settingsRes.data[0]
              return Promise.resolve(res)
            })
        }
        return Promise.resolve(res)
      })
      .then((res: any) => {
        const dispatch = useDispatch()
        const user = resolveUser(res)
        dispatch(AuthAction.loadedUserData(user))
      })
      .catch((err: any) => {
        console.log(err)
        AlertService.dispatchAlertError('Failed to load user data')
      })
  },
  loginUserByPassword: async (form: EmailLoginForm) => {
    const dispatch = useDispatch()
    {
      // check email validation.
      if (!validateEmail(form.email)) {
        AlertService.dispatchAlertError('Please input valid email address')

        return
      }

      dispatch(AuthAction.actionProcessing(true))
      ;(client as any)
        .authenticate({
          strategy: 'local',
          email: form.email,
          password: form.password
        })
        .then((res: any) => {
          const authUser = resolveAuthUser(res)

          if (!authUser.identityProvider.isVerified) {
            ;(client as any).logout()

            dispatch(AuthAction.registerUserByEmailSuccess(authUser.identityProvider))
            window.location.href = '/auth/confirm'
            return
          }

          dispatch(AuthAction.loginUserSuccess(authUser))
          AuthService.loadUserData(authUser.identityProvider.userId).then(() => (window.location.href = '/'))
        })
        .catch((err: any) => {
          console.log(err)

          dispatch(AuthAction.loginUserError('Failed to login'))
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  loginUserByXRWallet: async (wallet: any) => {
    const dispatch = useDispatch()
    {
      try {
        dispatch(AuthAction.actionProcessing(true))

        const credentials: any = parseUserWalletCredentials(wallet)
        console.log(credentials)

        const walletUser = resolveWalletUser(credentials)

        //TODO: This is temp until we move completely to XR wallet
        const oldId = accessAuthState().user.id.value
        walletUser.id = oldId

        loadXRAvatarForUpdatedUser(walletUser)
        dispatch(AuthAction.loadedUserData(walletUser))
      } catch (err) {
        console.log(err)
        dispatch(AuthAction.loginUserError('Failed to login'))
        AlertService.dispatchAlertError(err.message)
      } finally {
        dispatch(AuthAction.actionProcessing(false))
      }
    }
  },
  loginUserByOAuth: async (service: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))
      const token = accessAuthState().authUser.accessToken.value
      const path = window.location.pathname
      const queryString = querystring.parse(window.location.search.slice(1))
      const redirectObject = {
        path: path
      } as any
      if (queryString.instanceId && queryString.instanceId.length > 0)
        redirectObject.instanceId = queryString.instanceId
      let redirectUrl = `${
        Config.publicRuntimeConfig.apiServer
      }/oauth/${service}?feathers_token=${token}&redirect=${JSON.stringify(redirectObject)}`

      window.location.href = redirectUrl
    }
  },
  loginUserByJwt: async (accessToken: string, redirectSuccess: string, redirectError: string): any => {
    const dispatch = useDispatch()
    {
      try {
        dispatch(AuthAction.actionProcessing(true))
        await (client as any).authentication.setAccessToken(accessToken as string)
        const res = await (client as any).authenticate({
          strategy: 'jwt',
          accessToken
        })

        const authUser = resolveAuthUser(res)

        dispatch(AuthAction.loginUserSuccess(authUser))
        await AuthService.loadUserData(authUser.identityProvider.userId)
        dispatch(AuthAction.actionProcessing(false))
        window.location.href = redirectSuccess
      } catch (err) {
        console.log(err)
        dispatch(AuthAction.loginUserError('Failed to login'))
        AlertService.dispatchAlertError(err.message)
        window.location.href = `${redirectError}?error=${err.message}`
        dispatch(AuthAction.actionProcessing(false))
      }
    }
  },
  logoutUser: async () => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))
      ;(client as any)
        .logout()
        .then(() => dispatch(AuthAction.didLogout()))
        .catch(() => dispatch(AuthAction.didLogout()))
        .finally(() => {
          dispatch(AuthAction.actionProcessing(false))
          AuthService.doLoginAuto(true, true)
        })
    }
  },
  registerUserByEmail: (form: EmailRegistrationForm) => {
    console.log('1 registerUserByEmail')
    const dispatch = useDispatch()
    {
      console.log('2 dispatch', dispatch)
      dispatch(AuthAction.actionProcessing(true))
      client
        .service('identity-provider')
        .create({
          token: form.email,
          password: form.password,
          type: 'password'
        })
        .then((identityProvider: any) => {
          console.log('3 ', identityProvider)
          dispatch(AuthAction.registerUserByEmailSuccess(identityProvider))
          window.location.href = '/auth/confirm'
        })
        .catch((err: any) => {
          console.log('error', err)
          dispatch(AuthAction.registerUserByEmailError(err.message))
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => {
          console.log('4 finally', dispatch)
          dispatch(AuthAction.actionProcessing(false))
        })
    }
  },
  verifyEmail: async (token: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      client
        .service('authManagement')
        .create({
          action: 'verifySignupLong',
          value: token
        })
        .then((res: any) => {
          dispatch(AuthAction.didVerifyEmail(true))
          AuthService.loginUserByJwt(res.accessToken, '/', '/')
        })
        .catch((err: any) => {
          console.log(err)
          dispatch(AuthAction.didVerifyEmail(false))
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  resendVerificationEmail: async (email: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      client
        .service('authManagement')
        .create({
          action: 'resendVerifySignup',
          value: {
            token: email,
            type: 'password'
          }
        })
        .then(() => dispatch(AuthAction.didResendVerificationEmail(true)))
        .catch(() => dispatch(AuthAction.didResendVerificationEmail(false)))
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  forgotPassword: async (email: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))
      console.log('forgotPassword', email)
      client
        .service('authManagement')
        .create({
          action: 'sendResetPwd',
          value: {
            token: email,
            type: 'password'
          }
        })
        .then(() => dispatch(AuthAction.didForgotPassword(true)))
        .catch(() => dispatch(AuthAction.didForgotPassword(false)))
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  resetPassword: async (token: string, password: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      client
        .service('authManagement')
        .create({
          action: 'resetPwdLong',
          value: { token, password }
        })
        .then((res: any) => {
          console.log(res)
          dispatch(AuthAction.didResetPassword(true))
          window.location.href = '/'
        })
        .catch((err: any) => {
          console.log(err)
          dispatch(AuthAction.didResetPassword(false))
          window.location.href = '/'
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  createMagicLink: async (emailPhone: string, linkType?: 'email' | 'sms') => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      let type = 'email'
      let paramName = 'email'
      const enableEmailMagicLink =
        (Config.publicRuntimeConfig.auth && Config.publicRuntimeConfig.auth.enableEmailMagicLink) ?? true
      const enableSmsMagicLink =
        (Config.publicRuntimeConfig.auth && Config.publicRuntimeConfig.auth.enableSmsMagicLink) ?? false

      if (linkType === 'email') {
        type = 'email'
        paramName = 'email'
      } else if (linkType === 'sms') {
        type = 'sms'
        paramName = 'mobile'
      } else {
        const stripped = emailPhone.replace(/-/g, '')
        if (validatePhoneNumber(stripped)) {
          if (!enableSmsMagicLink) {
            AlertService.dispatchAlertError('Please input valid email address')

            return
          }
          type = 'sms'
          paramName = 'mobile'
          emailPhone = '+1' + stripped
        } else if (validateEmail(emailPhone)) {
          if (!enableEmailMagicLink) {
            AlertService.dispatchAlertError('Please input valid phone number')

            return
          }
          type = 'email'
        } else {
          AlertService.dispatchAlertError('Please input valid email or phone number')

          return
        }
      }

      client
        .service('magic-link')
        .create({
          type,
          [paramName]: emailPhone
        })
        .then((res: any) => {
          console.log(res)
          dispatch(AuthAction.didCreateMagicLink(true))
          AlertService.dispatchAlertSuccess('Login Magic Link was sent. Please check your Email or SMS.')
        })
        .catch((err: any) => {
          console.log(err)
          dispatch(AuthAction.didCreateMagicLink(false))
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  addConnectionByPassword: async (form: EmailLoginForm, userId: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      client
        .service('identity-provider')
        .create({
          token: form.email,
          password: form.password,
          type: 'password',
          userId
        })
        .then((res: any) => {
          const identityProvider = res as IdentityProvider
          return AuthService.loadUserData(identityProvider.userId)
        })
        .catch((err: any) => {
          console.log(err)
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  addConnectionByEmail: async (email: string, userId: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))
      client
        .service('magic-link')
        .create({
          email,
          type: 'email',
          userId
        })
        .then((res: any) => {
          const identityProvider = res as IdentityProvider
          if (identityProvider.userId != null) return AuthService.loadUserData(identityProvider.userId)
        })
        .catch((err: any) => {
          console.log(err)
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  addConnectionBySms: async (phone: string, userId: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      let sendPhone = phone.replace(/-/g, '')
      if (sendPhone.length === 10) {
        sendPhone = '1' + sendPhone
      }

      client
        .service('magic-link')
        .create({
          mobile: sendPhone,
          type: 'sms',
          userId
        })
        .then((res: any) => {
          const identityProvider = res as IdentityProvider
          if (identityProvider.userId != null) return AuthService.loadUserData(identityProvider.userId)
        })
        .catch((err: any) => {
          console.log(err)
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  addConnectionByOauth: async (oauth: 'facebook' | 'google' | 'github' | 'linkedin' | 'twitter', userId: string) => {
    const dispatch = useDispatch()
    {
      window.open(`${Config.publicRuntimeConfig.apiServer}/auth/oauth/${oauth}?userId=${userId}`, '_blank')
    }
  },
  removeConnection: async (identityProviderId: number, userId: string) => {
    const dispatch = useDispatch()
    {
      dispatch(AuthAction.actionProcessing(true))

      client
        .service('identity-provider')
        .remove(identityProviderId)
        .then(() => {
          return AuthService.loadUserData(userId)
        })
        .catch((err: any) => {
          console.log(err)
          AlertService.dispatchAlertError(err.message)
        })
        .finally(() => dispatch(AuthAction.actionProcessing(false)))
    }
  },
  refreshConnections: (userId: string) => {
    AuthService.loadUserData(userId)
  },
  updateUserSettings: async (id: any, data: any) => {
    const dispatch = useDispatch()
    const res = await client.service('user-settings').patch(id, data)
    dispatch(AuthAction.updatedUserSettingsAction(res))
  },
  uploadAvatar: async (data: any) => {
    const dispatch = useDispatch()
    {
      const token = accessAuthState().authUser.accessToken.value
      const selfUser = accessAuthState().user
      const res = await axios.post(`${Config.publicRuntimeConfig.apiServer}/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + token
        }
      })
      await client.service('user').patch(selfUser.id.value, {
        name: selfUser.name.value
      })
      const result = res.data
      AlertService.dispatchAlertSuccess('Avatar updated')
      dispatch(AuthAction.avatarUpdated(result))
    }
  },
  uploadAvatarModel: async (model: any, thumbnail: any, avatarName?: string, isPublicAvatar?: boolean) => {
    const dispatch = useDispatch()
    {
      const token = accessAuthState().authUser.accessToken.value
      const name = avatarName ? avatarName : model.name.substring(0, model.name.lastIndexOf('.'))
      const [modelURL, thumbnailURL] = await Promise.all([
        client.service('upload-presigned').get('', {
          query: { type: 'avatar', fileName: name + '.glb', fileSize: model.size, isPublicAvatar: isPublicAvatar }
        }),
        client.service('upload-presigned').get('', {
          query: {
            type: 'user-thumbnail',
            fileName: name + '.png',
            fileSize: thumbnail.size,
            mimeType: thumbnail.type,
            isPublicAvatar: isPublicAvatar
          }
        })
      ])

      const modelData = new FormData()
      Object.keys(modelURL.fields).forEach((key) => modelData.append(key, modelURL.fields[key]))
      modelData.append('acl', 'public-read')
      modelData.append(modelURL.local ? 'media' : 'file', model)
      if (modelURL.local) {
        let uploadPath = 'avatars'

        if (modelURL.fields.Key) {
          uploadPath = modelURL.fields.Key
          uploadPath = uploadPath.substring(0, uploadPath.lastIndexOf('/'))
        }

        modelData.append('uploadPath', uploadPath)
        modelData.append('id', `${name}.glb`)
        modelData.append('skipStaticResource', 'true')
      }

      console.log('modelData', modelData)
      // Upload Model file to S3
      const modelOperation =
        modelURL.local === true
          ? axios.post(`${Config.publicRuntimeConfig.apiServer}/media`, modelData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token
              }
            })
          : axios.post(modelURL.url, modelData)
      return modelOperation
        .then(async (res) => {
          const thumbnailData = new FormData()
          Object.keys(thumbnailURL.fields).forEach((key) => thumbnailData.append(key, thumbnailURL.fields[key]))
          thumbnailData.append('acl', 'public-read')
          thumbnailData.append(thumbnailURL.local === true ? 'media' : 'file', thumbnail)
          if (thumbnailURL.local) {
            let uploadPath = 'avatars'

            if (thumbnailURL.fields.Key) {
              uploadPath = thumbnailURL.fields.Key
              uploadPath = uploadPath.substring(0, uploadPath.lastIndexOf('/'))
            }
            thumbnailData.append('uploadPath', uploadPath)
            thumbnailData.append('name', `${name}.png`)
            thumbnailData.append('skipStaticResource', 'true')
          }

          const modelCloudfrontURL = `https://${modelURL.cacheDomain}/${modelURL.fields.Key}`
          const thumbnailCloudfrontURL = `https://${thumbnailURL.cacheDomain}/${thumbnailURL.fields.Key}`
          const selfUser = accessAuthState().user
          const existingModel = await client.service('static-resource').find({
            query: {
              name: name,
              staticResourceType: 'avatar',
              userId: isPublicAvatar ? null : selfUser.id.value
            }
          })
          const existingThumbnail = await client.service('static-resource').find({
            query: {
              name: name,
              staticResourceType: 'user-thumbnail',
              userId: isPublicAvatar ? null : selfUser.id.value
            }
          })
          // Upload Thumbnail file to S3
          const thumbnailOperation =
            thumbnailURL.local === true
              ? axios.post(`${Config.publicRuntimeConfig.apiServer}/media`, thumbnailData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + token
                  }
                })
              : axios.post(thumbnailURL.url, thumbnailData)
          await thumbnailOperation
            .then((res) => {
              // Save URLs to backend
              Promise.all([
                existingModel.total > 0
                  ? client.service('static-resource').patch(existingModel.data[0].id, {
                      url: modelCloudfrontURL,
                      key: modelURL.fields.Key
                    })
                  : client.service('static-resource').create({
                      name,
                      staticResourceType: 'avatar',
                      url: modelCloudfrontURL,
                      key: modelURL.fields.Key,
                      userId: isPublicAvatar ? null : selfUser.id.value
                    }),
                existingThumbnail.total > 0
                  ? client.service('static-resource').patch(existingThumbnail.data[0].id, {
                      url: thumbnailCloudfrontURL,
                      key: thumbnailURL.fields.Key
                    })
                  : client.service('static-resource').create({
                      name,
                      staticResourceType: 'user-thumbnail',
                      url: thumbnailCloudfrontURL,
                      mimeType: 'image/png',
                      key: thumbnailURL.fields.Key,
                      userId: isPublicAvatar ? null : selfUser.id.value
                    })
              ])
                .then((_) => {
                  if (isPublicAvatar !== true) {
                    dispatch(AuthAction.userAvatarIdUpdated(res))
                    client
                      .service('user')
                      .patch(selfUser.id.value, { avatarId: name })
                      .then((_) => {
                        AlertService.dispatchAlertSuccess('Avatar Uploaded Successfully.')
                        if (Network?.instance?.transport)
                          (Network.instance.transport as any).sendNetworkStatUpdateMessage({
                            type: MessageTypes.AvatarUpdated,
                            userId: selfUser.id.value,
                            avatarId: name,
                            avatarURL: modelCloudfrontURL,
                            thumbnailURL: thumbnailCloudfrontURL
                          })
                      })
                  }
                })
                .catch((err) => {
                  console.error('Error occurred while saving Avatar.', err)

                  // IF error occurs then removed Model and thumbnail from S3
                  client
                    .service('upload-presigned')
                    .remove('', { query: { keys: [modelURL.fields.Key, thumbnailURL.fields.Key] } })
                })
            })
            .catch((err) => {
              console.error('Error occurred while uploading thumbnail.', err)

              // IF error occurs then removed Model and thumbnail from S3
              client.service('upload-presigned').remove('', { query: { keys: [modelURL.fields.Key] } })
            })
        })
        .catch((err) => {
          console.error('Error occurred while uploading model.', err)
        })
    }
  },
  removeAvatar: async (keys: [string]) => {
    const dispatch = useDispatch()
    {
      await client
        .service('upload-presigned')
        .remove('', {
          query: { keys }
        })
        .then((_) => {
          AlertService.dispatchAlertSuccess('Avatar Removed Successfully.')
          AuthService.fetchAvatarList()
        })
    }
  },
  fetchAvatarList: async () => {
    const selfUser = accessAuthState().user
    const dispatch = useDispatch()
    {
      const result = await client.service('static-resource').find({
        query: {
          $select: ['id', 'key', 'name', 'url', 'staticResourceType', 'userId'],
          staticResourceType: {
            $in: ['avatar', 'user-thumbnail']
          },
          $or: [{ userId: selfUser.id.value }, { userId: null }],
          $limit: 1000
        }
      })
      dispatch(AuthAction.updateAvatarList(result.data))
    }
  },
  updateUsername: async (userId: string, name: string) => {
    const dispatch = useDispatch()
    {
      client
        .service('user')
        .patch(userId, {
          name: name
        })
        .then((res: any) => {
          AlertService.dispatchAlertSuccess('Username updated')
          dispatch(AuthAction.usernameUpdated(res))
        })
    }
  },
  updateUserAvatarId: async (userId: string, avatarId: string, avatarURL: string, thumbnailURL: string) => {
    const dispatch = useDispatch()
    {
      client
        .service('user')
        .patch(userId, {
          avatarId: avatarId
        })
        .then((res: any) => {
          // dispatchAlertSuccess(dispatch, 'User Avatar updated');
          dispatch(AuthAction.userAvatarIdUpdated(res))
          if (Network?.instance?.transport)
            (Network.instance.transport as any).sendNetworkStatUpdateMessage({
              type: MessageTypes.AvatarUpdated,
              userId,
              avatarId,
              avatarURL,
              thumbnailURL
            })
        })
    }
  },
  removeUser: async (userId: string) => {
    const dispatch = useDispatch()
    {
      await client.service('user').remove(userId)
      await client.service('identity-provider').remove(null, {
        where: {
          userId: userId
        }
      })
      AuthService.logoutUser()
    }
  }
}

const parseUserWalletCredentials = (wallet) => {
  return {
    user: {
      id: 'did:web:example.com',
      displayName: 'alice',
      icon: 'https://material-ui.com/static/images/avatar/1.jpg'
      // session // this will contain the access token and helper methods
    }
  }
}

const getAvatarResources = (user) => {
  return client.service('static-resource').find({
    query: {
      name: user.avatarId,
      staticResourceType: { $in: ['user-thumbnail', 'avatar'] },
      $or: [{ userId: null }, { userId: user.id }],
      $sort: {
        userId: -1
      },
      $limit: 2
    }
  })
}

const loadAvatarForUpdatedUser = async (user) => {
  if (user.instanceId == null && user.channelInstanceId == null) return Promise.resolve(true)

  const world = useWorld()

  return new Promise(async (resolve) => {
    const networkUser = world?.clients?.get(user.id)

    // If network is not initialized then wait to be initialized.
    if (!networkUser) {
      setTimeout(async () => {
        await loadAvatarForUpdatedUser(user)
        resolve(true)
      }, 200)
      return
    }

    if (networkUser?.avatarDetail?.avatarId === user.avatarId) {
      resolve(true)
      return
    }

    // Fetch Avatar Resources for updated user.
    const avatars = await getAvatarResources(user)

    if (avatars?.data && avatars.data.length === 2) {
      const avatarURL = avatars?.data[0].staticResourceType === 'avatar' ? avatars?.data[0].url : avatars?.data[1].url
      const thumbnailURL =
        avatars?.data[0].staticResourceType === 'user-thumbnail' ? avatars?.data[0].url : avatars?.data[1].url

      networkUser.avatarDetail = { avatarURL, thumbnailURL, avatarId: user.avatarId }

      //Find entityId from network objects of updated user and dispatch avatar load event.
      const world = Engine.defaultWorld
      const userEntity = world.getUserAvatarEntity(user.id)
      setAvatar(userEntity, user.avatarId, avatarURL)
    } else {
      await loadAvatarForUpdatedUser(user)
    }
    resolve(true)
  })
}

const loadXRAvatarForUpdatedUser = async (user) => {
  if (!user || !user.id) Promise.resolve(true)

  return new Promise(async (resolve) => {
    const networkUser = Engine.defaultWorld.clients.get(user.id)

    // If network is not initialized then wait to be initialized.
    if (!networkUser) {
      setTimeout(async () => {
        await loadAvatarForUpdatedUser(user)
        resolve(true)
      }, 200)
      return
    }

    const avatarURL = user.avatarUrl
    const thumbnailURL = user.avatarUrl

    networkUser.avatarDetail = { avatarURL, thumbnailURL, avatarId: user.avatarId }

    //Find entityId from network objects of updated user and dispatch avatar load event.
    const world = Engine.defaultWorld
    const userEntity = world.getUserAvatarEntity(user.id)
    setAvatar(userEntity, user.avatarId, avatarURL)
    resolve(true)
  })
}

if (!Config.publicRuntimeConfig.offlineMode) {
  client.service('user').on('patched', async (params) => {
    const selfUser = accessAuthState().user
    const user = resolveUser(params.userRelationship)

    console.log('User patched', user)
    await loadAvatarForUpdatedUser(user)
    _updateUsername(user.id, user.name)

    const eid = getEid(user.id)
    console.log('adding username component to user: ' + user.name + ' eid: ' + eid)
    if (eid !== undefined) {
      if (!hasComponent(eid, UserNameComponent)) {
        addComponent(eid, UserNameComponent, { username: user.name })
      } else {
        getComponent(eid, UserNameComponent).username = user.name
      }
    }

    if (selfUser.id.value === user.id) {
      store.dispatch(UserAction.clearLayerUsers())
      if (selfUser.channelInstanceId.value !== user.channelInstanceId)
        store.dispatch(UserAction.clearChannelLayerUsers())
      store.dispatch(AuthAction.userUpdated(user))
      if (user.partyId) {
        // setRelationship('party', user.partyId);
      }
      if (user.instanceId !== selfUser.instanceId.value) {
        const parsed = new URL(window.location.href)
        let query = parsed.searchParams
        query.set('instanceId', user?.instanceId || '')
        parsed.search = query.toString()

        if (history.pushState) {
          window.history.replaceState({}, '', parsed.toString())
        }
      }
      const world = Engine.defaultWorld
      if (typeof world.localClientEntity !== 'undefined') {
        if (!hasComponent(world.localClientEntity, ProximityComponent, world) && isBot(window)) {
          addComponent(
            world.localClientEntity,
            ProximityComponent,
            {
              usersInRange: [],
              usersInIntimateRange: [],
              usersInHarassmentRange: [],
              usersLookingTowards: []
            },
            world
          )
        }
        if (!hasComponent(world.localClientEntity, WebCamInputComponent, world)) {
          addComponent(
            world.localClientEntity,
            WebCamInputComponent,
            {
              emotions: []
            },
            world
          )
        }
        console.log('added web cam input component to local client')
      }
    } else {
      if (user.channelInstanceId != null && user.channelInstanceId === selfUser.channelInstanceId.value)
        store.dispatch(UserAction.addedChannelLayerUser(user))
      if (user.instanceId != null && user.instanceId === selfUser.instanceId.value) {
        store.dispatch(UserAction.addedLayerUser(user))
        store.dispatch(UserAction.displayUserToast(user, { userAdded: true }))
      }
      if (user.instanceId !== selfUser.instanceId.value) {
        store.dispatch(UserAction.removedLayerUser(user))
        store.dispatch(UserAction.displayUserToast(user, { userRemoved: true }))
      }
      if (user.channelInstanceId !== selfUser.channelInstanceId.value)
        store.dispatch(UserAction.removedChannelLayerUser(user))
    }
  })
  client.service('location-ban').on('created', async (params) => {
    const selfUser = accessAuthState().user
    const party = accessPartyState().party.value
    const selfPartyUser =
      party && party.partyUsers ? party.partyUsers.find((partyUser) => partyUser.id === selfUser.id.value) : {}
    const currentLocation = accessLocationState().currentLocation.location
    const locationBan = params.locationBan
    if (selfUser.id.value === locationBan.userId && currentLocation.id.value === locationBan.locationId) {
      // TODO: Decouple and reenable me!
      // endVideoChat({ leftParty: true });
      // leave(true);
      if (selfPartyUser != undefined && selfPartyUser?.id != null) {
        await client.service('party-user').remove(selfPartyUser.id)
      }
      const user = resolveUser(await client.service('user').get(selfUser.id.value))
      store.dispatch(AuthAction.userUpdated(user))
    }
  })
}

export function getStoredAuthState() {
  if (!window) {
    return undefined
  }
  const rawState = localStorage.getItem(Config.publicRuntimeConfig.localStorageKey)
  if (!rawState) {
    return undefined
  }
  const state = JSON.parse(rawState)
  return state
}

export function saveAuthState(state: any) {
  if (state.isLoggedIn) localStorage.setItem(Config.publicRuntimeConfig.localStorageKey, JSON.stringify(state))
}
