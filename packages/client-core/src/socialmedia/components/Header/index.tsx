import React, { useEffect, useState } from "react";
import Router from "next/router";

import styles from './Header.module.scss';
import Avatar from "@material-ui/core/Avatar";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { selectCreatorsState } from "../../reducers/creator/selector";
import { getLoggedCreator } from "../../reducers/creator/service";
import { PopupLogin } from "../PopupLogin/PopupLogin";
import { IndexPage } from "@xr3ngine/social/pages/login";
import { selectAuthState } from "../../../user/reducers/auth/selector";

const mapStateToProps = (state: any): any => {
  return {
    creatorState: selectCreatorsState(state),
    authState: selectAuthState(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getLoggedCreator: bindActionCreators(getLoggedCreator, dispatch),
});

interface Props{
  creatorState?: any;
  getLoggedCreator? : any;
  logo?:string;
  authState?:any
}
const AppHeader = ({creatorState, getLoggedCreator, logo, authState}: Props) => {
  useEffect(()=>getLoggedCreator(),[]);  
  const creator = creatorState && creatorState.get('fetching') === false && creatorState.get('currentCreator');
  let checkGuest = null;
  const [buttonPopup , setButtonPopup] = useState(false);
  const status = authState.get('authUser')?.identityProvider.type;
    if(status === 'guest') {

     checkGuest = true;
    }else {
     
     checkGuest = false;
    }

  return (
    <nav className={styles.headerContainer}>
       <PopupLogin trigger={buttonPopup} setTrigger={setButtonPopup}>
          <IndexPage />
          </PopupLogin>
          {logo && <img onClick={()=>Router.push('/')} src={logo} className="header-logo" alt="ARC" />}
          <button type={"button"} onClick={()=>Router.push('/volumetric')} title={"volumetric"} className="header-logo">VolumetricDemo</button>
          {creator && (checkGuest? ' ' :
            <Avatar onClick={()=> Router.push({ pathname: '/creator', query:{ creatorId: creator.id}})} 
            alt={creator.username} src={creator.avatar} />
          )}
         
    </nav>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
