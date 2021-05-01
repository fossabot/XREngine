/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React from "react";

import HomeIcon from '@material-ui/icons/Home';
// import WhatshotIcon from '@material-ui/icons/Whatshot';

// @ts-ignore
import styles from './Footer.module.scss';
import Avatar from "@material-ui/core/Avatar";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { useEffect } from "react";
import { selectCreatorsState } from "../../reducers/creator/selector";
import { getLoggedCreator } from "../../reducers/creator/service";
import { selectAuthState } from "../../../user/reducers/auth/selector";
// import { PopupLogin } from "../PopupLogin/PopupLogin";
// import IndexPage from "@xr3ngine/social/pages/login";
import { updateArMediaState, updateCreatorFormState, updateCreatorPageState, updateFeedPageState, updateNewFeedPageState } from "../../reducers/popupsState/service";
import { selectPopupsState } from "../../reducers/popupsState/selector";
import ViewMode from "../ViewMode/ViewMode";


const mapStateToProps = (state: any): any => {
  return {
    creatorState: selectCreatorsState(state),
    authState: selectAuthState(state), 
    popupsState: selectPopupsState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getLoggedCreator: bindActionCreators(getLoggedCreator, dispatch),
  updateCreatorPageState: bindActionCreators(updateCreatorPageState, dispatch),
  updateCreatorFormState: bindActionCreators(updateCreatorFormState, dispatch),
  updateFeedPageState: bindActionCreators(updateFeedPageState, dispatch),
  updateArMediaState: bindActionCreators(updateArMediaState, dispatch),
});
interface Props{
  creatorState?:any;
  getLoggedCreator?: any;
  updateCreatorPageState?: typeof updateCreatorPageState;
  updateNewFeedPageState?: typeof updateNewFeedPageState;
  authState?: any;
  popupsState?: any;
  updateCreatorFormState?:typeof updateCreatorFormState;
  updateFeedPageState?:typeof updateFeedPageState;
  updateArMediaState?:typeof updateArMediaState;
}
const AppFooter = ({creatorState, getLoggedCreator, authState, updateCreatorPageState, popupsState, updateCreatorFormState, updateFeedPageState, updateArMediaState}: Props) => {
  useEffect(()=>getLoggedCreator(),[]);  


  const creator = creatorState && creatorState.get('fetching') === false && creatorState.get('currentCreator'); 
  // const checkGuest = authState.get('authUser')?.identityProvider?.type === 'guest' ? true : false;
  const handleOpenCreatorPage = (id) =>{
    updateCreatorPageState(true, id);
  };

  const onGoHome = () =>{
    updateCreatorPageState(false);
    updateCreatorFormState(false);
    updateFeedPageState(false);
    updateArMediaState(false);
  };
  return (
    <>
    <nav className={styles.footerContainer}>
        {/* <HomeIcon onClick={()=> {checkGuest ? setButtonPopup(true) : history.push('/');}} fontSize="large" className={styles.footerItem}/> */}
        <HomeIcon onClick={()=> onGoHome()} fontSize="large" className={styles.footerItem}/>
        {/* <PopupLogin trigger={buttonPopup} setTrigger={setButtonPopup}>
          <IndexPage />
        </PopupLogin> */}
        {/* <AddCircleIcon onClick={()=> {checkGuest ? setButtonPopup(true) : history.push('/newfeed');}} style={{fontSize: '5em'}} className={styles.footerItem}/> */}
        {/* <AddCircleIcon onClick={()=> {handleOpenNewFeedPage()}} style={{fontSize: '5em'}} className={styles.footerItem}/> */}
        <ViewMode/>
        {/*hided for now*/}
        {/* {creator && <WhatshotIcon htmlColor="#FF6201" onClick={()=>{checkGuest ? setButtonPopup(true) : history.push('/notifications');}} /> } */}
        {/* {creator && ( 
          <Avatar onClick={()=> {checkGuest ? setButtonPopup(true) : handleOpenCreatorPage(creator.id);}} 
          alt={creator.username} src={creator.avatar} />
        )} */}        
        <Avatar onClick={()=> {handleOpenCreatorPage(creatorState?.get('currentCreator')?.id);}} alt={creator?.username} src={creator?.avatar} />
    </nav>   
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AppFooter);

