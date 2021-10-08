/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React from 'react'

import HomeIcon from '@material-ui/icons/Home'
// import WhatshotIcon from '@material-ui/icons/Whatshot';

// @ts-ignore
import styles from './Footer.module.scss'
import Avatar from '@material-ui/core/Avatar'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useCreatorState } from '../../reducers/creator/CreatorState'
import { CreatorService } from '../../reducers/creator/CreatorService'
// import { PopupLogin } from "../PopupLogin/PopupLogin";
// import IndexPage from "@xrengine/social/pages/login";
import { PopupsStateService } from '../../reducers/popupsState/PopupsStateService'
import ViewMode from '../ViewMode/ViewMode'

interface Props {
  setView?: any
}
const AppFooter = ({ setView, onGoRegistration }: any) => {
  const dispatch = useDispatch()
  const creatorState = useCreatorState()
  useEffect(() => {
    dispatch(CreatorService.getLoggedCreator())
  }, [])

  // const checkGuest = authState.get('authUser')?.identityProvider?.type === 'guest' ? true : false;
  const handleOpenCreatorPage = (id) => {
    dispatch(PopupsStateService.updateCreatorPageState(true, id))
  }

  const onGoHome = () => {
    dispatch(PopupsStateService.updateCreatorPageState(false))
    dispatch(PopupsStateService.updateCreatorFormState(false))
    dispatch(PopupsStateService.updateFeedPageState(false))
    dispatch(PopupsStateService.updateNewFeedPageState(false))
    dispatch(PopupsStateService.updateArMediaState(false))
    dispatch(PopupsStateService.updateShareFormState(false))
    setView('featured')
  }

  return (
    <nav className={styles.footerContainer}>
      {/* <HomeIcon onClick={()=> {checkGuest ? setButtonPopup(true) : history.push('/');}} fontSize="large" className={styles.footerItem}/> */}
      <img src="/assets/tabBar.png" onClick={() => onGoHome()} className={styles.footerItem} />
      {/* <PopupLogin trigger={buttonPopup} setTrigger={setButtonPopup}>
          <IndexPage />
        </PopupLogin> */}
      {/* <AddCircleIcon onClick={()=> {checkGuest ? setButtonPopup(true) : history.push('/newfeed');}} style={{fontSize: '5em'}} className={styles.footerItem}/> */}
      {/* <AddCircleIcon onClick={()=> {handleOpenNewFeedPage()}} style={{fontSize: '5em'}} className={styles.footerItem}/> */}
      <ViewMode onGoRegistration={onGoRegistration} />
      {/*hided for now*/}
      {/* {creator && <WhatshotIcon htmlColor="#FF6201" onClick={()=>{checkGuest ? setButtonPopup(true) : history.push('/notifications');}} /> } */}
      {/* {creator && ( 
          <Avatar onClick={()=> {checkGuest ? setButtonPopup(true) : handleOpenCreatorPage(creator.id);}} 
          alt={creator.username} src={creator.avatar} />
        )} */}
      <Avatar
        onClick={() => {
          onGoRegistration(() => {
            handleOpenCreatorPage(creatorState.creators.currentCreator?.id?.value)
          })
        }}
        alt={creatorState.creators.currentCreator?.username?.value}
        className={styles.footerAvatar}
        src={
          creatorState.creators.currentCreator?.avatar?.value
            ? creatorState.creators.currentCreator?.avatar?.value
            : '/assets/userpic.png'
        }
      />
    </nav>
  )
}

export default AppFooter
