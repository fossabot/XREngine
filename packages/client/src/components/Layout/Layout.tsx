import { Forum, FullscreenExit, People, ZoomOutMap } from '@material-ui/icons'
import { ThemeProvider } from '@material-ui/styles'
import { Alerts } from '@xrengine/client-core/src/common/components/Alerts'
import { UIDialog } from '@xrengine/client-core/src/common/components/Dialog/Dialog'
import NavMenu from '@xrengine/client-core/src/common/components/NavMenu'
import UserToast from '@xrengine/client-core/src/common/components/Toast/UserToast'
import { setUserHasInteracted } from '@xrengine/client-core/src/common/reducers/app/actions'
import { selectAppOnBoardingStep, selectAppState } from '@xrengine/client-core/src/common/reducers/app/selector'
import { Config } from '@xrengine/common/src/config'
import { selectLocationState } from '@xrengine/client-core/src/social/reducers/location/selector'
import { theme as defaultTheme } from '@xrengine/client-core/src/theme'
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import { EngineEvents } from '@xrengine/engine/src/ecs/classes/EngineEvents'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { bindActionCreators, Dispatch } from 'redux'
import LeftDrawer from '../Drawer/Left'
import RightDrawer from '../Drawer/Right'
import Harmony from '../Harmony'
import Me from '../Me'
import PartyVideoWindows from '../PartyVideoWindows'
import styles from './Layout.module.scss'

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
  appState?: any
  locationState?: any
  login?: boolean
  pageTitle: string
  children?: any
  hideVideo?: boolean
  hideFullscreen?: boolean
  setUserHasInteracted?: any
  onBoardingStep?: number
  theme?: any
}
const mapStateToProps = (state: any): any => {
  return {
    appState: selectAppState(state),
    locationState: selectLocationState(state),
    onBoardingStep: selectAppOnBoardingStep(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  setUserHasInteracted: bindActionCreators(setUserHasInteracted, dispatch)
})

const Layout = (props: Props): any => {
  const path = useLocation().pathname
  const { pageTitle, children, appState, setUserHasInteracted, login, locationState, onBoardingStep } = props
  const userHasInteracted = appState.get('userHasInteracted')
  const authUser = useAuthState().authUser
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [topDrawerOpen, setTopDrawerOpen] = useState(false)
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(true)
  const [harmonyOpen, setHarmonyOpen] = useState(false)
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

  const initialClickListener = () => {
    setUserHasInteracted()
    window.removeEventListener('click', initialClickListener)
    window.removeEventListener('touchend', initialClickListener)
  }

  useEffect(() => {
    if (userHasInteracted === false) {
      window.addEventListener('click', initialClickListener)
      window.addEventListener('touchend', initialClickListener)
    }
  }, [])

  const openInvite = (): void => {
    setLeftDrawerOpen(false)
    setTopDrawerOpen(false)
    setRightDrawerOpen(true)
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, { harmonyOpen: harmonyOpen })
    }
    return child
  })
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
    setHarmonyOpen(true)
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
              {!props.hideVideo && harmonyOpen !== true && (
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
                {props.hideFullscreen ? null : fullScreenActive && harmonyOpen !== true ? (
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

            <Harmony
              setHarmonyOpen={setHarmonyOpen}
              setDetailsType={setDetailsType}
              setGroupFormOpen={setGroupFormOpen}
              setGroupFormMode={setGroupFormMode}
              setGroupForm={setGroupForm}
              setSelectedUser={setSelectedUser}
              setSelectedGroup={setSelectedGroup}
              setLeftDrawerOpen={setLeftDrawerOpen}
              setRightDrawerOpen={setRightDrawerOpen}
              harmonyHidden={harmonyOpen === false}
            />
            <Fragment>
              <UIDialog />
              <Alerts />
              {childrenWithProps}
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
              {user?.userRole.value !== 'guest' && harmonyOpen === false && (
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

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
