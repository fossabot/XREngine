import React, { useEffect, createContext, useContext } from 'react'
import useHover from '../hooks/useHover'

const AudioPreviewContext = createContext(new Audio())

/**
 * AudioPreview cused to provides the options for audio.
 *
 * @author Robert Long
 * @param       {String} src
 * @param       {String} children
 * @constructor
 */
export function AudioPreview({ src, children }) {
  const audio = useContext(AudioPreviewContext)
  const [hoverRef, isHovered] = useHover()

  useEffect(() => {
    if (isHovered) {
      audio.src = src
      audio.play()
    } else {
      audio.pause()
    }
  }, [isHovered, src, audio])
  /* @ts-ignore */
  return <div ref={hoverRef}>{children}</div>
}

export default AudioPreview
