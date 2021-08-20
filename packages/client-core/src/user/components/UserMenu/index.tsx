import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import LinkIcon from '@material-ui/icons/Link'
import PersonIcon from '@material-ui/icons/Person'
import FilterHdrIcon from '@material-ui/icons/FilterHdr'
import SettingsIcon from '@material-ui/icons/Settings'
// TODO: Reenable me! Disabled because we don't want the client-networking dep in client-core, need to fix this
// import { provisionInstanceServer } from "@xrengine/client-networking/src/reducers/instanceConnection/service";
import { EngineEvents } from '@xrengine/engine/src/ecs/classes/EngineEvents'
import { enableInput } from '@xrengine/engine/src/input/systems/ClientInputSystem'
import { EngineRenderer } from '@xrengine/engine/src/renderer/WebGLRendererSystem'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { alertSuccess } from '../../../common/reducers/alert/service'
import { selectAppOnBoardingStep } from '../../../common/reducers/app/selector'
import { selectAuthState } from '../../reducers/auth/selector'
import {
  fetchAvatarList,
  removeAvatar,
  updateUserAvatarId,
  updateUserSettings,
  uploadAvatarModel
} from '../../reducers/auth/service'
import AvatarMenu from './menus/AvatarMenu'
import AvatarSelectMenu from './menus/AvatarSelectMenu'
import ProfileMenu from './menus/ProfileMenu'
import SettingMenu from './menus/SettingMenu'
import ShareMenu from './menus/ShareMenu'
import LocationMenu from './menus/LocationMenu'
import CreateLocationMenu from './menus/CreateLocationMenu'
import styles from './UserMenu.module.scss'
import { UserMenuProps, Views } from './util'

type StateType = {
  currentActiveMenu: any
  profileMenuOpen: boolean
  username: any
  userSetting: any
  graphics: any
  hideLogin: boolean
}

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
    authState: selectAuthState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  updateUserAvatarId: bindActionCreators(updateUserAvatarId, dispatch),
  updateUserSettings: bindActionCreators(updateUserSettings, dispatch),
  alertSuccess: bindActionCreators(alertSuccess, dispatch),
  // provisionInstanceServer: bindActionCreators(provisionInstanceServer, dispatch),
  uploadAvatarModel: bindActionCreators(uploadAvatarModel, dispatch),
  fetchAvatarList: bindActionCreators(fetchAvatarList, dispatch),
  removeAvatar: bindActionCreators(removeAvatar, dispatch)
})

const UserMenu = (props: UserMenuProps): any => {
  const { authState, updateUserAvatarId, alertSuccess, uploadAvatarModel, fetchAvatarList, enableSharing, hideLogin } =
    props

  let menus = [
    { id: Views.Profile, iconNode: PersonIcon },
    { id: Views.Settings, iconNode: SettingsIcon },
    { id: Views.Share, iconNode: LinkIcon }
    //  { id: Views.Location, iconNode: FilterHdrIcon },
  ]

  if (enableSharing === false) {
    const share = menus.find((el) => el.id === Views.Share)
    menus = menus.filter((el) => el.id !== share.id)
  }

  const menuPanel = {
    [Views.Profile]: ProfileMenu,
    [Views.Settings]: SettingMenu,
    [Views.Share]: ShareMenu,
    [Views.Avatar]: AvatarMenu,
    [Views.AvatarUpload]: AvatarSelectMenu,
    [Views.Location]: LocationMenu,
    [Views.NewLocation]: CreateLocationMenu
  }

  const [engineLoaded, setEngineLoaded] = useState(false)

  const selfUser = authState.get('user') || {}
  const avatarList = authState.get('avatarList') || []

  const [currentActiveMenu, setCurrentActiveMenu] = useState(enableSharing === false ? (menus[0] as any) : null)
  const [activeLocation, setActiveLocation] = useState(null)

  const [userSetting, setUserSetting] = useState(selfUser?.user_setting)
  const [graphics, setGraphicsSetting] = useState({})

  useEffect(() => {
    EngineEvents.instance?.addEventListener(EngineRenderer.EVENTS.QUALITY_CHANGED, updateGraphicsSettings)

    return () => {
      EngineEvents.instance?.removeEventListener(EngineRenderer.EVENTS.QUALITY_CHANGED, updateGraphicsSettings)
    }
  }, [])
  const onEngineLoaded = () => {
    setEngineLoaded(true)
    document.removeEventListener('ENGINE_LOADED', onEngineLoaded)
  }
  document.addEventListener('ENGINE_LOADED', onEngineLoaded)

  const setAvatar = (avatarId: string, avatarURL: string, thumbnailURL: string) => {
    if (selfUser) {
      updateUserAvatarId(selfUser.id, avatarId, avatarURL, thumbnailURL)
    }
  }

  const setUserSettings = (newSetting: any): void => {
    const setting = { ...userSetting, ...newSetting }
    setUserSetting(setting)
    updateUserSettings(selfUser.user_setting.id, setting)
  }

  const updateGraphicsSettings = (newSetting: any): void => {
    const setting = { ...graphics, ...newSetting }
    setGraphicsSetting(setting)
  }

  const setActiveMenu = (e): void => {
    const identity = e.currentTarget.id.split('_')
    const enabled = Boolean(currentActiveMenu && currentActiveMenu.id === identity[0])
    setCurrentActiveMenu(enabled ? null : menus[identity[1]])
    if (EngineEvents.instance)
      enableInput({
        keyboard: enabled,
        mouse: enabled
      })
  }

  const changeActiveMenu = (menu) => {
    if (currentActiveMenu !== null) {
      const enabled = Boolean(menu)
      if (EngineEvents.instance)
        enableInput({
          keyboard: !enabled,
          mouse: !enabled
        })
    }
    setCurrentActiveMenu(menu ? { id: menu } : null)
  }

  const changeActiveLocation = (location) => {
    setActiveLocation(location)
    setCurrentActiveMenu({ id: Views.NewLocation })
  }

  const updateLocationDetail = (location) => {
    setActiveLocation({ ...location })
  }

  const renderMenuPanel = () => {
    if (!currentActiveMenu) return null

    let args = {}
    switch (currentActiveMenu.id) {
      case Views.Profile:
        args = {
          changeActiveMenu: changeActiveMenu,
          hideLogin
        }
        break
      case Views.Avatar:
        args = {
          setAvatar: setAvatar,
          changeActiveMenu: changeActiveMenu,
          removeAvatar: removeAvatar,
          fetchAvatarList: fetchAvatarList,
          avatarList: avatarList,
          avatarId: selfUser?.avatarId,
          enableSharing: enableSharing
        }
        break
      case Views.Settings:
        args = {
          setting: userSetting,
          setUserSettings: setUserSettings,
          graphics: graphics,
          setGraphicsSettings: updateGraphicsSettings
        }
        break
      case Views.Share:
        args = { alertSuccess: alertSuccess }
        break
      case Views.AvatarUpload:
        args = {
          userId: selfUser?.id,
          changeActiveMenu: changeActiveMenu,
          uploadAvatarModel: uploadAvatarModel
        }
        break
      case Views.Location:
        args = {
          changeActiveLocation
        }
        break
      case Views.NewLocation:
        args = {
          location: activeLocation,
          changeActiveMenu,
          updateLocationDetail
        }
        break
      default:
        return null
    }

    const Panel = menuPanel[currentActiveMenu.id]

    // @ts-ignore
    return <Panel {...args} />
  }

  return (
    <>
      {engineLoaded && (
        <ClickAwayListener onClickAway={() => changeActiveMenu(null)} mouseEvent="onMouseDown">
          <section className={styles.settingContainer}>
            <div className={styles.iconContainer}>
              {menus.map((menu, index) => {
                return (
                  <span
                    key={index}
                    id={menu.id + '_' + index}
                    onClick={setActiveMenu}
                    className={`${styles.materialIconBlock} ${
                      currentActiveMenu && currentActiveMenu.id === menu.id ? styles.activeMenu : null
                    }`}
                  >
                    <menu.iconNode className={styles.icon} />
                  </span>
                )
              })}
            </div>
            {currentActiveMenu ? renderMenuPanel() : null}
          </section>
        </ClickAwayListener>
      )}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)
