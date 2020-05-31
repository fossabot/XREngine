// TODO: reset player location to center/origin on navigate
// TODO: fix dreamscene models not loading textures/lighting on navigation

import React, { useState, useEffect } from 'react'
import SceneContainer from './scene-container'
import Assets from './assets'
import Environment from './environment'
import Player from '../player/player'
import './style.scss'

import AframeComponentRegisterer from '../aframe/index'

import LandingScene from './landing'
import ExploreScene from './explore'
import DreamScene from './dream'
import DreamSceneScene from './dream-scene'
import VideoScene, { VideoProps } from './video'

import isExternalUrl from '../../../utils/isExternalUrl'

interface Props {
  sceneName?: string,
  manifest?: string,
  title?: string,
  format?: string,
  url?: string
}

export default function RootScene(props: Props): any {
  let [sceneName, setSceneName] = useState(props.sceneName || 'landing')
  const [videoProps, setVideoProps] = useState({
    manifest: props.manifest || '',
    title: props.title || '',
    format: props.format || ''
  } as VideoProps)
  const [dreamUrl, setDreamUrl] = useState(props.url || '')
  const [playerMovementEnabled, setPlayerMovementEnabled] = useState(true)
  // fix for video360 dynamic route
  if (sceneName === 'video360') {
    sceneName = 'video'
  }
  const navigationHandler = e => {
    e.stopPropagation()
    let url = e.detail.url

    if (isExternalUrl(url)) {
      window.location.href = url
    } else {
      if (!url.startsWith('/')) {
        url = '/' + url
      }
      // don't push state when popstate event (e.g. back button clicked)
      // push state (change page url) to new location without reloading page
      if (!e.detail.isPopState) {
        window.history.pushState({
          url: '/',
          as: url
        }, '', url)
      }
      const pathname = window.location.pathname
      let newSceneName = pathname.slice(1) || 'landing'
      if (newSceneName === 'video360') {
        newSceneName = 'video'
      }
      if (newSceneName === 'dreamscene' || newSceneName === 'video') {
        const params = new URLSearchParams(document.location.search.substring(1))
        if (newSceneName === 'dreamscene') {
          setDreamUrl(params.get('url'))
        } else {
          setVideoProps({
            manifest: params.get('manifest'),
            title: params.get('title'),
            format: params.get('format')
          })
        }
      }
      setSceneName(newSceneName)
    }
  }
  // handle change page e.g. browser back button clicked
  function popStateHandler(e) {
    // this condition is to stop a bug where e.state is null
    if (!e.state || !e.state.as) return
    e.preventDefault()
    // use 'as' as the url, from history state.
    navigationHandler({ detail: { url: (e as PopStateEvent).state.as, isPopState: true } })
  }
  useEffect(() => {
    document.addEventListener('navigate', navigationHandler, { once: true })
    window.addEventListener('popstate', popStateHandler)
    return () => {
      document.removeEventListener('navigate', navigationHandler)
      window.removeEventListener('popstate', popStateHandler)
    }
  }, [navigationHandler])

  useEffect(() => {
    if (sceneName === 'video') setPlayerMovementEnabled(false)
    else if (!playerMovementEnabled) setPlayerMovementEnabled(true)
  }, [sceneName])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <SceneContainer>
        <AframeComponentRegisterer />
        <Assets />
        <Player movement-enabled={playerMovementEnabled} />
        {sceneName !== 'video' && sceneName !== 'dreamscene' && <Environment />}

        {sceneName === 'landing' && <LandingScene />}
        {sceneName === 'explore' && <ExploreScene />}
        {sceneName === 'dream' && <DreamScene />}
        {sceneName === 'dreamscene' && <DreamSceneScene url={dreamUrl} />}
        {sceneName === 'video' &&
          <VideoScene
            manifest={videoProps.manifest}
            title={videoProps.title}
            format={videoProps.format} />}
      </SceneContainer>
    </div>
  )
}
