import { Forum, FullscreenExit, People, ZoomOutMap } from '@material-ui/icons'
import { ThemeProvider } from '@material-ui/styles'
import { Alerts } from '@xrengine/client-core/src/common/components/Alerts'
import { UIDialog } from '@xrengine/client-core/src/common/components/Dialog/Dialog'
import NavMenu from '@xrengine/client-core/src/common/components/NavMenu'
import UserToast from '@xrengine/client-core/src/common/components/Toast/UserToast'
import { AppAction } from '@xrengine/client-core/src/common/state/AppActions'
import { useAppState } from '@xrengine/client-core/src/common/state/AppState'
import { Config } from '@xrengine/common/src/config'
import { theme as defaultTheme } from '@xrengine/client-core/src/theme'
import { useAuthState } from '@xrengine/client-core/src/user/state/AuthState'
import { EngineEvents } from '@xrengine/engine/src/ecs/classes/EngineEvents'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Helmet } from 'react-helmet'
import { useDispatch } from '@xrengine/client-core/src/store'
import { useLocation } from 'react-router-dom'
import LeftDrawer from '../Drawer/Left'
import RightDrawer from '../Drawer/Right'
import Harmony from '../Harmony'
import Me from '../Me'
import PartyVideoWindows from '../PartyVideoWindows'
import styles from './Layout.module.scss'
import { respawnAvatar } from '@xrengine/engine/src/avatar/functions/respawnAvatar'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { useWorld } from '@xrengine/engine/src/ecs/functions/SystemHooks'

const siteTitle: string = Config.publicRuntimeConfig.siteTitle

const engineRendererCanvasId = 'engine-renderer-canvas'

const initialSelectedUserState = {
  id: '',
  name: '',
  userRole: '',
  identityProviders: [],
  relationType: {},
  inverseRelationType: {},
  avatarUrl: ''
}

const initialGroupForm = {
  id: '',
  name: '',
  groupUsers: [],
  description: ''
}

interface Props {
  login?: boolean
  pageTitle: string
  children?: any
  hideVideo?: boolean
  hideFullscreen?: boolean
  theme?: any
  harmonyOpen?: any
  setHarmonyOpen?: any
}

const Layout = (props: Props): any => {
  const path = useLocation().pathname
  const { pageTitle, children, login } = props
  const userHasInteracted = useAppState().userHasInteracted
  const authUser = useAuthState().authUser
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [topDrawerOpen, setTopDrawerOpen] = useState(false)
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(true)
  const [fullScreenActive, setFullScreenActive] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [detailsType, setDetailsType] = useState('')
  const [groupFormOpen, setGroupFormOpen] = useState(false)
  const [groupFormMode, setGroupFormMode] = useState('')
  const [groupForm, setGroupForm] = useState(initialGroupForm)
  const [selectedUser, setSelectedUser] = useState(initialSelectedUserState)
  const [selectedGroup, setSelectedGroup] = useState(initialGroupForm)
  const user = useAuthState().user
  const handle = useFullScreenHandle()

  const dispatch = useDispatch()

  const initialClickListener = () => {
    dispatch(AppAction.setUserHasInteracted())
    window.removeEventListener('click', initialClickListener)
    window.removeEventListener('touchend', initialClickListener)
  }

  useEffect(() => {
    if (userHasInteracted.value === false) {
      window.addEventListener('click', initialClickListener)
      window.addEventListener('touchend', initialClickListener)
    }
  }, [])

  const openInvite = (): void => {
    setLeftDrawerOpen(false)
    setTopDrawerOpen(false)
    setRightDrawerOpen(true)
  }

  const reportChange = useCallback((state) => {
    if (state) {
      setFullScreenActive(state)
    } else {
      setFullScreenActive(state)
    }
  }, [])

  useEffect((() => {
    function handleResize() {
      if (window.innerWidth > 768) setExpanded(true)
    }

    window.addEventListener('resize', handleResize)

    // disable all browser-handling of touch gestures (document panning/zooming)
    // touch-action is non-inhered, so apply to all elements on the page
    const sheet = document.createElement('style')
    sheet.innerHTML = `
      html {
        overflow: hidden;
        -webkit-user-select: none;
        user-select: none;
      }
      * { 
        touch-action: none;
      }
    `
    document.head.appendChild(sheet)

    return (_) => {
      window.removeEventListener('resize', handleResize)
      document.head.removeChild(sheet)
    }
  }) as any)

  const openHarmony = (): void => {
    const canvas = document.getElementById(engineRendererCanvasId) as HTMLCanvasElement
    if (canvas?.style != null) canvas.style.width = '0px'
    props.setHarmonyOpen(true)
    EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.SUSPEND_POSITIONAL_AUDIO })
  }

  const toggleExpanded = () => setExpanded(!expanded)

  const iOS = (): boolean => {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    )
  }

  const respawnCallback = (): void => {
    respawnAvatar(useWorld().localClientEntity)
  }

  //info about current mode to conditional render menus
  // TODO: Uncomment alerts when we can fix issues
  return (
    <>
      <FullScreen handle={handle} onChange={reportChange}>
        <ThemeProvider theme={props.theme ?? defaultTheme}>
          <section>
            <Helmet>
              <title>
                {siteTitle} | {pageTitle}
              </title>
            </Helmet>
            <header>
              {path === '/login' && <NavMenu login={login} />}
              {!props.hideVideo && props.harmonyOpen !== true && (
                <>
                  {expanded ? (
                    <section className={styles.locationUserMenu}>
                      {authUser?.accessToken?.value != null && authUser.accessToken.value.length > 0 && <Me />}
                      <PartyVideoWindows />
                    </section>
                  ) : null}
                  <button
                    type="button"
                    className={styles.expandMenu + ' ' + (expanded ? styles.expanded : '')}
                    onClick={toggleExpanded}
                  >
                    <People />
                  </button>
                  <UserToast />
                </>
              )}
            </header>

            {!iOS() && (
              <>
                {props.hideFullscreen ? null : fullScreenActive && props.harmonyOpen !== true ? (
                  <button type="button" className={styles.fullScreen} onClick={handle.exit}>
                    <FullscreenExit />
                  </button>
                ) : (
                  <button type="button" className={styles.fullScreen} onClick={handle.enter}>
                    <ZoomOutMap />
                  </button>
                )}
              </>
            )}

            <button type="button" className={styles.respawn} id="respawn" onClick={respawnCallback}>
              <img src="/static/restart.svg" />
            </button>

            <Harmony
              setHarmonyOpen={props.setHarmonyOpen}
              setDetailsType={setDetailsType}
              setGroupFormOpen={setGroupFormOpen}
              setGroupFormMode={setGroupFormMode}
              setGroupForm={setGroupForm}
              setSelectedUser={setSelectedUser}
              setSelectedGroup={setSelectedGroup}
              setLeftDrawerOpen={setLeftDrawerOpen}
              setRightDrawerOpen={setRightDrawerOpen}
              harmonyHidden={props.harmonyOpen === false}
            />
            <Fragment>
              <UIDialog />
              <Alerts />
              {children}
            </Fragment>
            {authUser?.accessToken?.value != null &&
              authUser.accessToken.value.length > 0 &&
              user?.id?.value != null &&
              user.id.value.length > 0 && (
                <Fragment>
                  <LeftDrawer
                    harmony={true}
                    detailsType={detailsType}
                    setDetailsType={setDetailsType}
                    groupFormOpen={groupFormOpen}
                    setGroupFormOpen={setGroupFormOpen}
                    groupFormMode={groupFormMode}
                    setGroupFormMode={setGroupFormMode}
                    groupForm={groupForm}
                    setGroupForm={setGroupForm}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    openBottomDrawer={bottomDrawerOpen}
                    leftDrawerOpen={leftDrawerOpen}
                    setLeftDrawerOpen={setLeftDrawerOpen}
                    setRightDrawerOpen={setRightDrawerOpen}
                    setBottomDrawerOpen={setBottomDrawerOpen}
                  />
                </Fragment>
              )}
            {authUser?.accessToken?.value != null &&
              authUser.accessToken.value.length > 0 &&
              user?.id?.value != null &&
              user.id.value.length > 0 && (
                <Fragment>
                  <RightDrawer rightDrawerOpen={rightDrawerOpen} setRightDrawerOpen={setRightDrawerOpen} />
                </Fragment>
              )}
            {/*{authUser?.accessToken != null && authUser.accessToken.length > 0 && user?.id != null &&*/}
            {/*  <Fragment>*/}
            {/*    <BottomDrawer bottomDrawerOpen={bottomDrawerOpen} setBottomDrawerOpen={setBottomDrawerOpen} setLeftDrawerOpen={setLeftDrawerOpen} />*/}
            {/*  </Fragment>*/}
            {/*}*/}
            <footer>
              {user?.userRole.value !== 'guest' && props.harmonyOpen === false && (
                <div className={styles['harmony-toggle']} onClick={() => openHarmony()}>
                  <Forum />
                </div>
              )}
            </footer>
          </section>
        </ThemeProvider>
      </FullScreen>
    </>
  )
}

export default Layout
