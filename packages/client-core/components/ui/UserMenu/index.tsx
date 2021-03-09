import LinkIcon from '@material-ui/icons/Link';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import { Network } from '@xr3ngine/engine/src/networking/classes/Network';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { selectAppOnBoardingStep } from '../../../redux/app/selector';
import { selectAuthState } from '../../../redux/auth/selector';
import { updateUserAvatarId, updateUsername, updateUserSettings } from '../../../redux/auth/service';
import { addConnectionByEmail, addConnectionBySms, loginUserByOAuth } from '../../../redux/auth/service';
import { alertSuccess } from '../../../redux/alert/service';
import { provisionInstanceServer } from "../../../redux/instanceConnection/service";
import { Views, UserMenuProps } from './util';
//@ts-ignore
import styles from './style.module.scss';
import ProfileMenu from './menus/ProfileMenu';
import AvatarMenu from './menus/AvatarMenu';
import SettingMenu from './menus/SettingMenu';
import ShareMenu from './menus/ShareMenu';
import AvatarSelectMenu from './menus/AvatarSelectMenu';
import { WebGLRendererSystem } from '@xr3ngine/engine/src/renderer/WebGLRendererSystem';
import { EngineEvents } from '@xr3ngine/engine/src/ecs/classes/EngineEvents';

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
    authState: selectAuthState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  updateUsername: bindActionCreators(updateUsername, dispatch),
  updateUserAvatarId: bindActionCreators(updateUserAvatarId, dispatch),
  updateUserSettings: bindActionCreators(updateUserSettings, dispatch),
  alertSuccess: bindActionCreators(alertSuccess, dispatch),
  provisionInstanceServer: bindActionCreators(provisionInstanceServer, dispatch),
  loginUserByOAuth: bindActionCreators(loginUserByOAuth, dispatch),
  addConnectionBySms: bindActionCreators(addConnectionBySms, dispatch),
  addConnectionByEmail: bindActionCreators(addConnectionByEmail, dispatch),
  logoutUser: bindActionCreators(addConnectionByEmail, dispatch),
  removeUser: bindActionCreators(addConnectionByEmail, dispatch),
});

const UserMenu = (props: UserMenuProps): any => {
  const {
    authState,
    updateUsername,
    updateUserAvatarId,
    alertSuccess,
    addConnectionByEmail,
    addConnectionBySms,
    loginUserByOAuth,
    logoutUser,
    removeUser,
  } = props;
  const selfUser = authState.get('user') || {};

  const [username, setUsername] = useState(selfUser?.name);
  const [setting, setUserSetting] = useState(selfUser?.user_setting);
  const [graphics, setGraphicsSetting] = useState({
    resolution: WebGLRendererSystem.scaleFactor,
    shadows: WebGLRendererSystem.shadowQuality,
    automatic: WebGLRendererSystem.automatic,
    pbr: WebGLRendererSystem.usePBR,
    postProcessing: WebGLRendererSystem.usePostProcessing,
  });

  const [waitingForLogout, setWaitingForLogout] = useState(false);
  const [currentActiveMenu, setCurrentActiveMenu] = useState({} as any);
  const [actorEntityID, setActorEntityID] = useState(null);

  const onEngineLoaded = () => {
    EngineEvents.instance?.addEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, graphicsSettingsLoaded);
    EngineEvents.instance?.addEventListener(EngineEvents.EVENTS.CLIENT_ENTITY_LOAD, clientEntityLoaded);
    document.removeEventListener('ENGINE_LOADED', onEngineLoaded);
  }

  document.addEventListener('ENGINE_LOADED', onEngineLoaded);

  const clientEntityLoaded = (ev: any) => {
    const id = ev.id;
    Network.instance.localClientEntity = id;
    setActorEntityID(id);
    updateCharacterComponent(id, selfUser?.avatarId)
    EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CLIENT_ENTITY_LOAD, clientEntityLoaded);
  }
  
  const graphicsSettingsLoaded = (ev) => {
    EngineEvents.instance?.addEventListener(WebGLRendererSystem.EVENTS.QUALITY_CHANGED, updateGraphics);
    EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, graphicsSettingsLoaded);
  }

  useEffect(() => {
    selfUser && setUsername(selfUser.name);
  }, [selfUser.name]);

  useEffect(() => {
    selfUser && setUserSetting({ ...selfUser.user_setting });
  }, [selfUser.user_setting]);

  const updateGraphics = (ev: any) => {
    setGraphicsSettings(ev.detail);
  }

  useEffect(() => {
    return function cleanup() {
      EngineEvents.instance.removeEventListener(WebGLRendererSystem.EVENTS.QUALITY_CHANGED, updateGraphics);
    };
  }, [])

  useEffect(() => {
    if (waitingForLogout === true && authState.get('authUser') != null && authState.get('user') != null && authState.get('user').userRole === 'guest') {
      setWaitingForLogout(false);
      location.reload();
    }
  }, [authState]);

  const menus = [
    { id: Views.Profile, iconNode: PersonIcon },
    { id: Views.Settings, iconNode: SettingsIcon },
    { id: Views.Share, iconNode: LinkIcon },
  ];

  const menuPanel = {
    [Views.Profile]: ProfileMenu,
    [Views.Settings]: SettingMenu,
    [Views.Share]: ShareMenu,
    [Views.Avatar]: AvatarMenu,
    [Views.AvatarUpload]: AvatarSelectMenu,
  };

  const handleUpdateUsername = () => {
    const name = username.trim();
    if (!name) return;
    if (selfUser.name.trim() !== name) {
      updateUsername(selfUser.id, name);
    }
  };

  const updateCharacterComponent = (entityID, avatarId?: string) => {
    EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.LOAD_AVATAR, entityID, avatarId: avatarId || selfUser?.avatarId });
  }

  const setAvatar = (avatarId: string) => {
    if (actorEntityID && avatarId) {
      updateCharacterComponent(actorEntityID, avatarId);
      updateUserAvatarId(selfUser.id, avatarId);
    }
  }

  const setUserSettings = (newSetting: any): void => {
    setUserSetting({ ...setting, ...newSetting });
    updateUserSettings(selfUser.user_setting.id, setting);
  }

  const setGraphicsSettings = (newSetting: any): void => {
    setGraphicsSetting({ ...graphics, ...newSetting });
  }

  const setActiveMenu = (e): void => {
    const identity = e.currentTarget.id.split('_');
    setCurrentActiveMenu(
      currentActiveMenu && currentActiveMenu.id === identity[0]
        ? null
        : menus[identity[1]]
    );
  }

  const changeActiveMenu = (menu) => {
    setCurrentActiveMenu(menu ? { id: menu } : null);
  }

  const renderMenuPanel = () => {
    if (!currentActiveMenu) return null;

    let args = {};
    switch (currentActiveMenu.id) {
      case Views.Profile: 
        args = {
          username,
          userRole: selfUser?.userRole,
          avatarId: selfUser?.avatarId,
          setUsername,
          updateUsername: handleUpdateUsername,
          changeActiveMenu,
          logoutUser,
          removeUser,
          loginUserByOAuth,
          addConnectionByEmail,
          addConnectionBySms,
        };
        break;
      case Views.Avatar:
        args = {
          setAvatar,
          changeActiveMenu,
          avatarId: selfUser?.avatarId,
        };
        break;
      case Views.Settings:
        args = {
          setting,
          setUserSettings,
          graphics,
          setGraphicsSettings,
        };
        break;
      case Views.Share:
        args = { alertSuccess };
        break;
      case Views.AvatarUpload:
        args = {
          userId: selfUser?.id,
          changeActiveMenu,
          loginUserByOAuth,
          addConnectionByEmail,
          addConnectionBySms,
        };
        break;
      // case Views.Login: return renderLoginPage();
      // case Views.DeleteAccount: return renderAccountDeletePage();
      default: return null;
    }

    const Panel = menuPanel[currentActiveMenu.id];

    return <Panel {...args} />
  };

  return (
    <>
      <section className={styles.settingContainer}>
        <div className={styles.iconContainer}>
          {menus.map((menu, index) => {
            return (
              <span
                key={index}
                id={menu.id + '_' + index}
                onClick={setActiveMenu}
                className={`${styles.materialIconBlock} ${currentActiveMenu && currentActiveMenu.id === menu.id ? styles.activeMenu : null}`}
              >
                <menu.iconNode className={styles.icon} />
              </span>
            )
          })}
        </div>
        {currentActiveMenu
          ? renderMenuPanel()
          : null}
      </section>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);
