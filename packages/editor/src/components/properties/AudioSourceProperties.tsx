import React from 'react'
import InputGroup from '../inputs/InputGroup'
import BooleanInput from '../inputs/BooleanInput'
import SelectInput from '../inputs/SelectInput'
import NumericInputGroup from '../inputs/NumericInputGroup'
import CompoundNumericInput from '../inputs/CompoundNumericInput'
import {
  AudioType,
  AudioTypeOptions,
  DistanceModelOptions,
  DistanceModelType
} from '@xrengine/engine/src/scene/classes/AudioSource'
import useSetPropertySelected from './useSetPropertySelected'
import { useTranslation } from 'react-i18next'
import NumericInput from '../inputs/NumericInput'

/**
 *
 * AudioSourceProperties provides properties to custom audio element on the scene
 * used inside AudioNodeEditor component.
 *
 * @author Robert Long
 * @param       {any} node
 * @param       {any} editor
 * @param       {any} multiEdit
 * @constructor
 */

export function AudioSourceProperties({ node, editor, multiEdit }) {
  const onChangeControls = useSetPropertySelected(editor, 'controls')
  const onChangeAutoPlay = useSetPropertySelected(editor, 'autoPlay')
  const onChangeSynchronize = useSetPropertySelected(editor, 'synchronize')
  const onChangeLoop = useSetPropertySelected(editor, 'loop')
  const onChangeAudioType = useSetPropertySelected(editor, 'audioType')
  const onChangeVolume = useSetPropertySelected(editor, 'volume')
  const onChangeDistanceModel = useSetPropertySelected(editor, 'distanceModel')
  const onChangeRolloffFactor = useSetPropertySelected(editor, 'rolloffFactor')
  const onChangeRefDistance = useSetPropertySelected(editor, 'refDistance')
  const onChangeMaxDistance = useSetPropertySelected(editor, 'maxDistance')
  const onChangeConeInnerAngle = useSetPropertySelected(editor, 'coneInnerAngle')
  const onChangeConeOuterAngle = useSetPropertySelected(editor, 'coneOuterAngle')
  const onChangeConeOuterGain = useSetPropertySelected(editor, 'coneOuterGain')
  const { t } = useTranslation()

  // TODO: Make node audio settings work with multi-edit
  // returning view containing inputs to customize audio element
  return (
    <>
      <InputGroup
        name="Controls"
        label={t('editor:properties.audio.lbl-controls')}
        info={t('editor:properties.audio.info-controls')}
      >
        <BooleanInput value={node.controls} onChange={onChangeControls} />
      </InputGroup>
      <InputGroup
        name="Auto Play"
        label={t('editor:properties.audio.lbl-autoplay')}
        info={t('editor:properties.audio.info-autoplay')}
      >
        <BooleanInput value={node.autoPlay} onChange={onChangeAutoPlay} />
      </InputGroup>
      <InputGroup
        name="Synchronize"
        label={t('editor:properties.audio.lbl-synchronize')}
        info={t('editor:properties.audio.info-synchronize')}
      >
        <NumericInput value={node.synchronize} onChange={onChangeSynchronize} />
      </InputGroup>
      <InputGroup
        name="Loop"
        label={t('editor:properties.audio.lbl-loop')}
        info={t('editor:properties.audio.info-loop')}
      >
        <BooleanInput value={node.loop} onChange={onChangeLoop} />
      </InputGroup>
      <InputGroup name="Audio Type" label={t('editor:properties.audio.lbl-audioType')}>
        <SelectInput options={AudioTypeOptions} value={node.audioType} onChange={onChangeAudioType} />
      </InputGroup>
      <InputGroup name="Volume" label={t('editor:properties.audio.lbl-volume')}>
        <CompoundNumericInput value={node.volume} onChange={onChangeVolume} />
      </InputGroup>
      {!multiEdit && node.audioType === AudioType.PannerNode && (
        <>
          <InputGroup
            name="Distance Model"
            label={t('editor:properties.audio.lbl-distanceModel')}
            info={t('editor:properties.audio.info-distanceModel')}
          >
            <SelectInput options={DistanceModelOptions} value={node.distanceModel} onChange={onChangeDistanceModel} />
          </InputGroup>

          {node.distanceModel === DistanceModelType.Linear ? (
            <InputGroup
              name="Rolloff Factor"
              label={t('editor:properties.audio.lbl-rolloffFactor')}
              info={t('editor:properties.audio.info-rolloffFactor')}
            >
              <CompoundNumericInput
                min={0}
                max={1}
                smallStep={0.001}
                mediumStep={0.01}
                largeStep={0.1}
                value={node.rolloffFactor}
                onChange={onChangeRolloffFactor}
              />
            </InputGroup>
          ) : (
            <NumericInputGroup
              name="Rolloff Factor"
              label={t('editor:properties.audio.lbl-rolloffFactor')}
              info={t('editor:properties.audio.info-rfInfinity')}
              min={0}
              smallStep={0.1}
              mediumStep={1}
              largeStep={10}
              value={node.rolloffFactor}
              onChange={onChangeRolloffFactor}
            />
          )}
          <NumericInputGroup
            name="Ref Distance"
            label={t('editor:properties.audio.lbl-refDistance')}
            info={t('editor:properties.audio.info-refDistance')}
            min={0}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.refDistance}
            onChange={onChangeRefDistance}
            unit="m"
          />
          <NumericInputGroup
            name="Max Distance"
            label={t('editor:properties.audio.lbl-maxDistance')}
            info={t('editor:properties.audio.info-maxDistance')}
            min={0.00001}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.maxDistance}
            onChange={onChangeMaxDistance}
            unit="m"
          />
          <NumericInputGroup
            name="Cone Inner Angle"
            label={t('editor:properties.audio.lbl-coneInnerAngle')}
            info={t('editor:properties.audio.info-coneInnerAngle')}
            min={0}
            max={360}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.coneInnerAngle}
            onChange={onChangeConeInnerAngle}
            unit="°"
            disabled={multiEdit}
          />
          <NumericInputGroup
            name="Cone Outer Angle"
            label={t('editor:properties.audio.lbl-coneOuterAngle')}
            info={t('editor:properties.audio.info-coneOuterAngle')}
            min={0}
            max={360}
            smallStep={0.1}
            mediumStep={1}
            largeStep={10}
            value={node.coneOuterAngle}
            onChange={onChangeConeOuterAngle}
            unit="°"
            disabled={multiEdit}
          />
          <InputGroup
            name="Cone Outer Gain"
            label={t('editor:properties.audio.lbl-coreOuterGain')}
            info={t('editor:properties.audio.info-coreOuterGain')}
          >
            <CompoundNumericInput
              min={0}
              max={1}
              step={0.01}
              value={node.coneOuterGain}
              onChange={onChangeConeOuterGain}
            />
          </InputGroup>
        </>
      )}
    </>
  )
}

export default AudioSourceProperties
