import React, { useState, useEffect } from 'react'
import Lottie from 'react-lottie'
import { randomNumber } from '@xrengine/engine/src/common/functions/MathRandomFunctions'
import styles from '../Loader.module.scss'

const Loaders = [
  '4-dots',
  'bool',
  'bouncing-ball',
  'carga-de-dos-servicios',
  'heart-loading',
  'loading-animation',
  'noodle',
  'orange-circle',
  'pancake',
  'pulsing-button'
]

const LottieLoader = () => {
  const [animation, setAnimation] = useState<any>(null)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  useEffect(() => {
    const pathIndex = randomNumber(0, Loaders.length, Math.random)
    const path = Loaders[parseInt(pathIndex)]

    import(/* @vite-ignore */ `./${path}.json`).then((res) => {
      setAnimation(res)
    })
  }, [])

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.backdrop}></div>
      <Lottie options={{ ...defaultOptions, animationData: animation }} height={200} width={200} />
    </div>
  )
}

export default LottieLoader
