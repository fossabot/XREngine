/**
 * @author Abhishek Pathak <abhi.pathak401@gmail.com>
 */

import React from 'react'
import { CubemapBakeRefreshTypes } from '@xrengine/engine/src/scene/types/CubemapBakeRefreshTypes'
import { CubemapBakeTypes } from '@xrengine/engine/src/scene/types/CubemapBakeTypes'
import BooleanInput from '../inputs/BooleanInput'
import InputGroup from '../inputs/InputGroup'
import SelectInput from '../inputs/SelectInput'
import Vector3Input from '../inputs/Vector3Input'
import { BakePropertyTypes } from './CubemapBakeNodeEditor'

type CubemapBakePropertyEditorProps = {
  element?: any
  editor?: any
  node?: any
}

const cubemapBakeSelectTypes = [
  {
    label: 'Runtime',
    value: CubemapBakeTypes.Realtime
  },
  {
    label: 'Baked',
    value: CubemapBakeTypes.Baked
  }
]

const cubemapBakeRefreshSelectTypes = [
  {
    label: 'On Awake',
    value: CubemapBakeRefreshTypes.OnAwake
  }
  // {
  //     label:"Every Frame",
  //     value:CubemapBakeRefreshTypes.EveryFrame,
  // }
]

const bakeResolutionTypes = [
  {
    label: '128',
    value: 128
  },
  {
    label: '256',
    value: 256
  },
  {
    label: '512',
    value: 512
  },
  {
    label: '1024',
    value: 1024
  },
  {
    label: '2048',
    value: 2048
  }
]

export const CubemapBakeProperties = (props: CubemapBakePropertyEditorProps) => {
  const onChangeProperty = (value, option: string) => {
    ;(props.editor as any).setObjectProperty(`cubemapBakeSettings.${option}`, value)
  }

  const getPropertyValue = (option: string) => {
    const value = (props.node as any)['cubemapBakeSettings'][option]
    return value
  }
  let renderVal = <></>
  const label = props.element.label
  const propertyName = props.element.propertyName

  switch (props.element.type) {
    case BakePropertyTypes.Boolean:
      renderVal = (
        <BooleanInput value={getPropertyValue(propertyName)} onChange={(id) => onChangeProperty(id, propertyName)} />
      )
      break
    case BakePropertyTypes.CubemapBakeType:
      renderVal = (
        /* @ts-ignore */
        <SelectInput
          options={cubemapBakeSelectTypes}
          onChange={(id) => {
            onChangeProperty(id, propertyName)
          }}
          value={getPropertyValue(propertyName)}
        />
      )
      break

    case BakePropertyTypes.RefreshMode:
      renderVal = (
        /* @ts-ignore */
        <SelectInput
          options={cubemapBakeRefreshSelectTypes}
          onChange={(id) => {
            onChangeProperty(id, propertyName)
          }}
          value={getPropertyValue(propertyName)}
        />
      )
      break

    case BakePropertyTypes.Resolution:
      renderVal = (
        /* @ts-ignore */
        <SelectInput
          options={bakeResolutionTypes}
          onChange={(id) => {
            onChangeProperty(id, propertyName)
          }}
          value={getPropertyValue(propertyName)}
        />
      )
      break

    case BakePropertyTypes.Vector:
      renderVal = (
        <Vector3Input
          onChange={(id) => {
            onChangeProperty(id, propertyName)
          }}
          value={getPropertyValue(propertyName)}
        />
      )
      break

    default:
      renderVal = <div>Undefined value Type</div>
      break
  }
  return (
    /* @ts-ignore */
    <InputGroup name={label} label={label}>
      {renderVal}
    </InputGroup>
  )
}
