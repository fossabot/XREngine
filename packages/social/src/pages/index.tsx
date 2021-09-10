import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import AppHeader from '@xrengine/social/src/components/Header'
import FeedMenu from '@xrengine/social/src/components/FeedMenu'
import AppFooter from '@xrengine/social/src/components/Footer'
import { selectCreatorsState } from '@xrengine/social/src/reducers/creator/selector'
// import {Stories} from '@xrengine/client-core/src/socialmedia/components/Stories';
import { selectAuthState } from '@xrengine/client-core/src/user/reducers/auth/selector'
import { selectWebXrNativeState } from '@xrengine/social/src/reducers/webxr_native/selector'

import { User } from '@xrengine/common/src/interfaces/User'
import { doLoginAuto } from '@xrengine/client-core/src/user/reducers/auth/service'
import { createCreator } from '@xrengine/social/src/reducers/creator/service'
import { getWebXrNative, changeWebXrNative } from '@xrengine/social/src/reducers/webxr_native/service'

import CreatorPopup from '@xrengine/social/src/components/popups/CreatorPopup'
import FeedPopup from '@xrengine/social/src/components/popups/FeedPopup'
import CreatorFormPopup from '@xrengine/social/src/components/popups/CreatorFormPopup'
import ArMediaPopup from '@xrengine/social/src/components/popups/ArMediaPopup'
import FeedFormPopup from '@xrengine/social/src/components/popups/FeedFormPopup'
import SharedFormPopup from '@xrengine/social/src/components/popups/SharedFormPopup'
import Onboard from '@xrengine/social/src/components/OnBoard'
import FeedOnboarding from '@xrengine/social/src/components/FeedOnboarding'
// @ts-ignore
import styles from './index.module.scss'
import Button from '@material-ui/core/Button'

import image from '/static/images/image.jpg'
import mockupIPhone from '/static/images/mockupIPhone.jpg'
import Splash from '@xrengine/social/src/components/Splash'
import { isIOS } from '@xrengine/client-core/src/util/platformCheck'
import TermsAndPolicy from '@xrengine/social/src/components/TermsandPolicy'
import Blocked from '@xrengine/social/src/components/Blocked'
import { WebXRStart } from '../components/popups/WebXR'

const mapStateToProps = (state: any): any => {
  return {
    auth: selectAuthState(state),
    creatorsState: selectCreatorsState(state),
    webxrnativeState: selectWebXrNativeState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  doLoginAuto: bindActionCreators(doLoginAuto, dispatch),
  createCreator: bindActionCreators(createCreator, dispatch),
  getWebXrNative: bindActionCreators(getWebXrNative, dispatch),
  changeWebXrNative: bindActionCreators(changeWebXrNative, dispatch)
})

const Home = ({
  createCreator,
  doLoginAuto,
  auth,
  creatorsState,
  webxrnativeState,
  changeWebXrNative,
  getWebXrNative
}) => {
  /*hided for now*/

  useEffect(() => {
    if (auth) {
      // const user = auth.get('authUser')?.identityProvider.type === 'guest' ? auth.get('user') as User : auth.get('authUser')?.identityProvider as User;
      //   const userId = user ? user.id : null;
      //   if(userId){}
      createCreator()
    }
  }, [auth])

  useEffect(() => {
    doLoginAuto(true)
    getWebXrNative()
  }, [])

  const [onborded, setOnborded] = useState(true)
  const [feedOnborded, setFeedOnborded] = useState(true)
  const [splashTimeout, setSplashTimeout] = useState(true)
  const [feedHintsOnborded, setFeedHintsOnborded] = useState(true)
  const [view, setView] = useState('featured')

  const currentCreator = creatorsState.get('currentCreator')
  const currentTime = new Date(Date.now()).toISOString()

  useEffect(() => {
    if (!!currentCreator && !!currentCreator.createdAt) {
      currentTime.slice(0, -5) === currentCreator.createdAt.slice(0, -5) && setOnborded(false)
    }
  }, [currentCreator])

  const webxrRecorderActivity = webxrnativeState.get('webxrnative')

  const changeOnboarding = () => {
    setOnborded(true)
    setFeedOnborded(false)
    setFeedHintsOnborded(false)
  }
  const platformClass = isIOS ? styles.isIos : ''
  const hideContentOnRecord = webxrRecorderActivity ? styles.hideContentOnRecord : ''

  if (!currentCreator || currentCreator === null || (splashTimeout && currentCreator.isBlocked == false)) {
    //add additional duration Splash after initialized user
    const splash = setTimeout(() => {
      setSplashTimeout(false)
      clearTimeout(splash)
    }, 5000)
    return <Splash />
  }

  if (currentCreator.isBlocked == true) {
    return (
      <div>
        <Splash />
        <Blocked />
      </div>
    )
  }

  // if (!onborded) return <Onboard setOnborded={changeOnboarding} image={image} mockupIPhone={mockupIPhone} />

  return (
    <div className={platformClass + ' ' + hideContentOnRecord}>
      {/*{!feedOnborded && <FeedOnboarding setFeedOnborded={setFeedOnborded} />}*/}
      <div className={webxrRecorderActivity ? styles.hideContent + ' ' + styles.viewport : styles.viewport}>
        <AppHeader />
        {/* <Stories stories={stories} /> */}
        <FeedMenu view={view} setView={setView} />
        <AppFooter setView={setView} />
        {currentCreator && (!!!currentCreator.terms || !!!currentCreator.policy) && <TermsAndPolicy />}
        <ArMediaPopup />
        <WebXRStart
          feedHintsOnborded={feedHintsOnborded}
          webxrRecorderActivity={webxrRecorderActivity}
          setContentHidden={changeWebXrNative}
          setFeedHintsOnborded={setFeedHintsOnborded}
        />
        <CreatorPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
        <FeedPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
        <CreatorFormPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
        <FeedFormPopup setView={setView} />
        <SharedFormPopup setView={setView} />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
