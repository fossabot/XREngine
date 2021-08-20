import { Map } from '@styled-icons/fa-solid/Map'
import i18n from 'i18next'
import React from 'react'
import { withTranslation } from 'react-i18next'
import BooleanInput from '../inputs/BooleanInput'
import InputGroup from '../inputs/InputGroup'
import StringInput from '../inputs/StringInput'
import NodeEditor from './NodeEditor'
/**
 * [BoxColliderNodeEditor is used to provide properties to customize box collider element]
 * @type {[component class]}
 */

export function MapNodeEditor(props: { editor?: any; node?: any; t: any }) {
  console.log('Props are', props)
  const { node, editor, t } = props

  const onChangeStartLatitude = (payload) => {
    editor.setPropertySelected('startLatitude', payload)
  }

  const onChangeStartLongitude = (payload) => {
    editor.setPropertySelected('startLongitude', payload)
  }

  const onChangeUseGeolocation = (payload) => {
    editor.setPropertySelected('useDeviceGeolocation', payload)
  }

  const onChangeShowRasterTiles = (payload) => {
    editor.setPropertySelected('showRasterTiles', payload)
  }

  const onToggleDebug = (payload) => {
    editor.setPropertySelected('enableDebug', payload)
  }

  //defining description and shows this description in NodeEditor  with title of elementt,
  // available to add in scene in assets.
  const description = i18n.t('editor:properties.map.description')

  return (
    <NodeEditor {...props} description={description}>
      {/* @ts-ignore */}
      <InputGroup
        name="Start at device's geolocation?"
        label={t('editor:properties.map.lbl-useDeviceGeolocation')}
        info={t('editor:properties.map.info-useDeviceGeolocation')}
      >
        <BooleanInput value={node.useDeviceGeolocation} onChange={onChangeUseGeolocation} />
      </InputGroup>
      {/* @ts-ignore */}
      <InputGroup name="Start Latitude" label={t('editor:properties.map.lbl-startLatitude')}>
        <StringInput
          /* @ts-ignore */
          value={node.startLatitude}
          onChange={onChangeStartLatitude}
        />
      </InputGroup>
      {/* @ts-ignore */}
      <InputGroup name="Start Longitude" label={t('editor:properties.map.lbl-startLongitude')}>
        <StringInput
          /* @ts-ignore */
          value={node.startLongitude}
          onChange={onChangeStartLongitude}
        />
      </InputGroup>
      {/* @ts-ignore */}
      <InputGroup
        name="Show Raster Tiles?"
        label={t('editor:properties.map.lbl-showRasterTiles')}
        info={t('editor:properties.map.info-showRasterTiles')}
      >
        <BooleanInput value={node.showRasterTiles} onChange={onChangeShowRasterTiles} />
      </InputGroup>
      {/* @ts-ignore */}
      <InputGroup
        name="Enable debugging code?"
        label={t('editor:properties.map.lbl-enableDebug')}
        info={t('editor:properties.map.info-enableDebug')}
      >
        <BooleanInput value={node.enableDebug} onChange={onToggleDebug} />
      </InputGroup>
    </NodeEditor>
  )
}

MapNodeEditor.iconComponent = Map

export default withTranslation()(MapNodeEditor)
