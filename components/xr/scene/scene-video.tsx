import React from 'react'
// @ts-ignore
import { Entity, Scene } from 'aframe-react'
import Assets from './assets'
import Video360 from '../video360/Video360Room'
import './style.scss'

type State = {
  appRendered?: boolean
  color?: string
}

export default class VideoScene extends React.Component<State> {
  state: State = {
    appRendered: false,
    color: 'red'
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      require('aframe')
      require('networked-aframe')

      this.setState({ appRendered: true })
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {this.state.appRendered && (
          <Scene
            class="scene"
            renderer="antialias: true"
            background="color: #FAFAFA"
          >
            <Assets/>
            <Video360/>
            <Entity camera={{}} look-controls={{}} position={{ x: 0, y: 1.6, z: 0 }}>
              <Entity cursor={{ rayOrigin: 'mouse' }} raycaster={{ objects: '#player-vr-ui,#videotext' }} >
              </Entity>
            </Entity>
          </Scene>
        )}
      </div>
    )
  }
}
