import { ThemeProvider } from '@material-ui/core';
import { Forum, FullscreenExit, People, ZoomOutMap } from '@material-ui/icons';
import { Alerts } from '@xr3ngine/client-core/components/ui/Common/Alerts';
import { UIDialog } from '@xr3ngine/client-core/components/ui/Dialog/Dialog';
import Me from '@xr3ngine/client-core/components/ui/Me';
import NavMenu from '@xr3ngine/client-core/components/ui/NavMenu';
import UserToast from "@xr3ngine/client-core/components/ui/Toast/UserToast";
import { setUserHasInteracted } from '@xr3ngine/client-core/redux/app/actions';
import { selectAppOnBoardingStep, selectAppState } from '@xr3ngine/client-core/redux/app/selector';
import { selectAuthState } from '@xr3ngine/client-core/redux/auth/selector';
import { selectLocationState } from '@xr3ngine/client-core/redux/location/selector';
import theme from '@xr3ngine/client-core/theme';
import Harmony from "@xr3ngine/common/client-networking/components/Harmony";
import InstanceChat from '@xr3ngine/client-networking/components/InstanceChat';
import PartyVideoWindows from '@xr3ngine/common/client-networking/components/PartyVideoWindows';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import LeftDrawer from '../Drawer/Left';
import RightDrawer from '../Drawer/Right';
//@ts-ignore
import styles from './Layout.module.scss';

const { publicRuntimeConfig } = getConfig();
const siteTitle: string = publicRuntimeConfig.siteTitle;

const engineRendererCanvasId = 'engine-renderer-canvas';

const initialSelectedUserState = {
  id: '',
  name: '',
  userRole: '',
  identityProviders: [],
  relationType: {},
  inverseRelationType: {},
  avatarUrl: ''
};

const initialGroupForm = {
  id: '',
  name: '',
  groupUsers: [],
  description: ''
};

interface Props {
  appState?: any;
  authState?: any;
  locationState?: any;
  login?: boolean;
  pageTitle: string;
  children?: any;
  setUserHasInteracted?: any;
  onBoardingStep?: number;
}
const mapStateToProps = (state: any): any => {
  return {
    appState: selectAppState(state),
    authState: selectAuthState(state),
    locationState: selectLocationState(state),
    onBoardingStep: selectAppOnBoardingStep(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  setUserHasInteracted: bindActionCreators(setUserHasInteracted, dispatch)
});

const Layout = (props: Props): any => {
  const path = useRouter().pathname;
  const {
    pageTitle,
    children,
    appState,
    authState,
    setUserHasInteracted,
    login,
    locationState,
    onBoardingStep
  } = props;
  const userHasInteracted = appState.get('userHasInteracted');
  const authUser = authState.get('authUser');
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [topDrawerOpen, setTopDrawerOpen] = useState(false);
  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false);
  const [harmonyOpen, setHarmonyOpen] = useState(false);
  const [fullScreenActive, setFullScreenActive] = useState(false);
  const [ expanded, setExpanded ] = useState(true);
  const [detailsType, setDetailsType] = useState('');
  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [groupFormMode, setGroupFormMode] = useState('');
  const [groupForm, setGroupForm] = useState(initialGroupForm);
  const [selectedUser, setSelectedUser] = useState(initialSelectedUserState);
  const [selectedGroup, setSelectedGroup] = useState(initialGroupForm);
  const user = authState.get('user');
  const handle = useFullScreenHandle();

  const initialClickListener = () => {
    setUserHasInteracted();
    window.removeEventListener('click', initialClickListener);
    window.removeEventListener('touchend', initialClickListener);
  };

  useEffect(() => {
    if (userHasInteracted === false) {
      window.addEventListener('click', initialClickListener);
      window.addEventListener('touchend', initialClickListener);
    }
  }, []);

  const openInvite = (): void => {
    setLeftDrawerOpen(false);
    setTopDrawerOpen(false);
    setRightDrawerOpen(true);
  };

  const childrenWithProps = React.Children.map(children, child => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      const mapped = React.Children.map((child as any).props.children, child => {
        if (React.isValidElement(child)) { // @ts-ignore
          return React.cloneElement(child, { harmonyOpen: harmonyOpen });
        }
      });
      return mapped;
    }
    return child;
  });
  const reportChange = useCallback((state) => {
    if (state) {
      setFullScreenActive(state);
    } else {
      setFullScreenActive(state);
    }
  }, []);

  useEffect((() => {
    function handleResize() {
      if (window.innerWidth > 768) setExpanded(true);
    }

    window.addEventListener('resize', handleResize);

    return _ => {
      window.removeEventListener('resize', handleResize);
    };
  }) as any);

  const openHarmony = (): void => {
    const canvas = document.getElementById(engineRendererCanvasId) as HTMLCanvasElement;
    if (canvas?.style != null) canvas.style.width = '0px';
    setHarmonyOpen(true);
  };

  const toggleExpanded = () => setExpanded(!expanded);

  //info about current mode to conditional render menus
  // TODO: Uncomment alerts when we can fix issues
  return (
    <>
      <FullScreen handle={handle} onChange={reportChange}>
        <ThemeProvider theme={theme}>
          <section>
            <Head>
              <title>
                {siteTitle} | {pageTitle}
              </title>
            </Head>
            <header>
              {path === '/login' && <NavMenu login={login} />}
              { harmonyOpen !== true
                ? (
                  <>
                    {expanded
                      ? <section className={styles.locationUserMenu}>
                        {authUser?.accessToken != null && authUser.accessToken.length > 0 && <Me /> }
                        <PartyVideoWindows />
                      </section> : null}
                    <button type="button" className={styles.expandMenu + ' ' + (expanded ? styles.expanded : '')} onClick={toggleExpanded}><People /></button>
                    <UserToast />
                  </>
                ) : null}
            </header>

            {fullScreenActive && harmonyOpen !== true
              ? <button type="button" className={styles.fullScreen} onClick={handle.exit}>
                  <FullscreenExit />
                </button>
              : <button type="button" className={styles.fullScreen} onClick={handle.enter}>
                <ZoomOutMap />
              </button>}

            {harmonyOpen === true && <Harmony
                setHarmonyOpen={setHarmonyOpen}
                setDetailsType={setDetailsType}
                setGroupFormOpen={setGroupFormOpen}
                setGroupFormMode={setGroupFormMode}
                setGroupForm={setGroupForm}
                setSelectedUser={setSelectedUser}
                setSelectedGroup={setSelectedGroup}
                setLeftDrawerOpen={setLeftDrawerOpen}
                setRightDrawerOpen={setRightDrawerOpen}
            />}
            <Fragment>
              <UIDialog />
              <Alerts />
              {childrenWithProps}
            </Fragment>
            {authUser?.accessToken != null && authUser.accessToken.length > 0 && user?.id != null &&
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
                    setBottomDrawerOpen={setBottomDrawerOpen} />
              </Fragment>
            }
            {authUser?.accessToken != null && authUser.accessToken.length > 0 && user?.id != null &&
              <Fragment>
                <RightDrawer rightDrawerOpen={rightDrawerOpen} setRightDrawerOpen={setRightDrawerOpen} />
              </Fragment>
            }
            {/*{authUser?.accessToken != null && authUser.accessToken.length > 0 && user?.id != null &&*/}
            {/*  <Fragment>*/}
            {/*    <BottomDrawer bottomDrawerOpen={bottomDrawerOpen} setBottomDrawerOpen={setBottomDrawerOpen} setLeftDrawerOpen={setLeftDrawerOpen} />*/}
            {/*  </Fragment>*/}
            {/*}*/}
            <footer>
              {locationState.get('currentLocation')?.get('location')?.id &&
                authState.get('authUser') != null && authState.get('isLoggedIn') === true && user?.instanceId != null &&
                !leftDrawerOpen && !rightDrawerOpen && !topDrawerOpen && !bottomDrawerOpen &&
                <InstanceChat setBottomDrawerOpen={setBottomDrawerOpen} />}
              { user?.userRole !== 'guest' && harmonyOpen === false && <div className={styles['harmony-toggle']} onClick={() => openHarmony()}><Forum /></div> }
            </footer>
          </section>
        </ThemeProvider>
      </FullScreen>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
