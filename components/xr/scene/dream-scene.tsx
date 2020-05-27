import React, { useEffect, useState } from 'react'
import { Entity } from 'aframe-react'
import Skybox from './skybox'
import Lights from './lights'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setAppLoaded } from '../../../redux/app/actions'
import { selectAppState } from '../../../redux/app/selector'

export interface DreamSceneProps {
  url: string
}
// loading progress bar is reset back to 0 as a result of this.
// that might be ok if we can track progress of the gltf loading
// we can edit the aframe source code (our xrchat/aframe version)
// by registering onProgress callback here:
// https://github.com/aframevr/aframe/blob/master/src/components/gltf-model.js#L35
// emitting an event, and updating progress bar accordingly.
// A fully solution could be to integrate this with assets loading bar so loading bar doesn't reset back to 0
export default function DreamSceneScene(props: DreamSceneProps) {
  const [gltfLoaded, setGltfLoaded] = useState(false)
  const loaded = useSelector(state => selectAppState(state)).get('loaded')
  const dispatch = useDispatch()
  const setLoaded = loaded => dispatch(setAppLoaded(loaded))
  useEffect(() => {
    setLoaded(gltfLoaded)
  }, [loaded, gltfLoaded])
  return (
    <Entity>
      {props.url && <Entity gltf-model={`url(${props.url})`} events={{
        'model-error': err => {
          console.error('Error loading gltf model', err)
        },
        'model-loaded': () => {
          console.log('gltf model loaded.')
          setGltfLoaded(true)
        }
      }} />}
      <Lights />
      <Skybox />
    </Entity>
  )
}
