import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NodeEditor from './NodeEditor'
import InputGroup from '../inputs/InputGroup'
import ImageInput from '../inputs/ImageInput'
import Vector2Input from '../inputs/Vector2Input'
import { Water } from '@styled-icons/fa-solid/Water'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'
import ColorInput from '../inputs/ColorInput'
import NumericInputGroup from '../inputs/NumericInputGroup'

//declaring properties for OceanNodeEditor
type OceanNodeEditorProps = {
  editor: any
  node: any
  t: Function
}

/**
 * OceanNodeEditor provides the editor to customize properties.
 *
 * @author Robert Long
 * @type {class component}
 */
export class OceanNodeEditor extends Component<OceanNodeEditorProps> {
  // declaring propTypes for OceanNodeEditor
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  }

  constructor(props: OceanNodeEditorProps) {
    super(props)
    this.props = props
  }

  //setting iconComponent name
  static iconComponent = Water

  //setting description and will appears on editor view
  static description = i18n.t('editor:properties.ocean.description')

  declare props: OceanNodeEditorProps

  onChangeProperty = (name) => {
    return (value) => {
      this.props.editor.setPropertySelected(name, value)
    }
  }

  //rendering view for OceanNodeEditor
  render() {
    OceanNodeEditor.description = this.props.t('editor:properties.ocean.description')
    return (
      <NodeEditor {...this.props} description={OceanNodeEditor.description}>
        {/* @ts-ignore */}
        <InputGroup name="Normal Map" label={this.props.t('editor:properties.ocean.lbl-normalMap')}>
          <ImageInput value={this.props.node.normalMap} onChange={this.onChangeProperty('normalMap')} />
        </InputGroup>

        {/* @ts-ignore */}
        <InputGroup name="Distortion Map" label={this.props.t('editor:properties.ocean.lbl-distortionMap')}>
          <ImageInput value={this.props.node.distortionMap} onChange={this.onChangeProperty('distortionMap')} />
        </InputGroup>

        {/* @ts-ignore */}
        <InputGroup name="Environment Map" label={this.props.t('editor:properties.ocean.lbl-envMap')}>
          <ImageInput value={this.props.node.envMap} onChange={this.onChangeProperty('envMap')} />
        </InputGroup>

        {/* @ts-ignore */}
        <InputGroup name="Color" label={this.props.t('editor:properties.ocean.lbl-color')}>
          <ColorInput value={this.props.node.color} onChange={this.onChangeProperty('color')} disabled={false} />
        </InputGroup>
        {/* @ts-ignore */}
        <InputGroup name="Shallow Color" label={this.props.t('editor:properties.ocean.lbl-shallowWaterColor')}>
          <ColorInput
            value={this.props.node.shallowWaterColor}
            onChange={this.onChangeProperty('shallowWaterColor')}
            disabled={false}
          />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Shallow to Deep Distance"
          label={this.props.t('editor:properties.ocean.lbl-shallowToDeepDistance')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.shallowToDeepDistance}
          onChange={this.onChangeProperty('shallowToDeepDistance')}
        />
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Opacity Fade Distance"
          label={this.props.t('editor:properties.ocean.lbl-opacityFadeDistance')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.opacityFadeDistance}
          onChange={this.onChangeProperty('opacityFadeDistance')}
        />
        {/* @ts-ignore */}
        <InputGroup name="Opacity Range" label={this.props.t('editor:properties.ocean.lbl-opacityRange')}>
          <Vector2Input value={this.props.node.opacityRange} onChange={this.onChangeProperty('opacityRange')} />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Shininess"
          label={this.props.t('editor:properties.ocean.lbl-shininess')}
          min={0}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={1.0}
          value={this.props.node.shininess}
          onChange={this.onChangeProperty('shininess')}
        />
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Reflectivity"
          label={this.props.t('editor:properties.ocean.lbl-reflectivity')}
          min={0}
          max={1}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.reflectivity}
          onChange={this.onChangeProperty('reflectivity')}
        />
        {/* @ts-ignore */}
        <InputGroup name="Foam Color" label={this.props.t('editor:properties.ocean.lbl-foamColor')}>
          <ColorInput
            value={this.props.node.foamColor}
            onChange={this.onChangeProperty('foamColor')}
            disabled={false}
          />
        </InputGroup>
        {/* @ts-ignore */}
        <InputGroup name="Foam Speed" label={this.props.t('editor:properties.ocean.lbl-foamSpeed')}>
          <Vector2Input value={this.props.node.foamSpeed} onChange={this.onChangeProperty('foamSpeed')} />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Foam Tiling"
          label={this.props.t('editor:properties.ocean.lbl-foamTiling')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.foamTiling}
          onChange={this.onChangeProperty('foamTiling')}
        />
        {/* @ts-ignore */}
        <InputGroup name="Big Wave Tiling" label={this.props.t('editor:properties.ocean.lbl-bigWaveTiling')}>
          <Vector2Input value={this.props.node.bigWaveTiling} onChange={this.onChangeProperty('bigWaveTiling')} />
        </InputGroup>
        {/* @ts-ignore */}
        <InputGroup name="Big Wave Speed" label={this.props.t('editor:properties.ocean.lbl-bigWaveSpeed')}>
          <Vector2Input value={this.props.node.bigWaveSpeed} onChange={this.onChangeProperty('bigWaveSpeed')} />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Big Wave Height"
          label={this.props.t('editor:properties.ocean.lbl-bigWaveHeight')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.bigWaveHeight}
          onChange={this.onChangeProperty('bigWaveHeight')}
        />
        {/* @ts-ignore */}
        <InputGroup name="Wave Speed" label={this.props.t('editor:properties.ocean.lbl-waveSpeed')}>
          <Vector2Input value={this.props.node.waveSpeed} onChange={this.onChangeProperty('waveSpeed')} />
        </InputGroup>
        {/* @ts-ignore */}
        <InputGroup name="Wave Scale" label={this.props.t('editor:properties.ocean.lbl-waveScale')}>
          <Vector2Input value={this.props.node.waveScale} onChange={this.onChangeProperty('waveScale')} />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Wave Tiling"
          label={this.props.t('editor:properties.ocean.lbl-waveTiling')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.waveTiling}
          onChange={this.onChangeProperty('waveTiling')}
        />
        {/* @ts-ignore */}
        <InputGroup
          name="Wave Distortion Speed"
          label={this.props.t('editor:properties.ocean.lbl-waveDistortionSpeed')}
        >
          <Vector2Input
            value={this.props.node.waveDistortionSpeed}
            onChange={this.onChangeProperty('waveDistortionSpeed')}
          />
        </InputGroup>
        {/* @ts-ignore */}
        <NumericInputGroup
          name="Wave Distortion Tiling"
          label={this.props.t('editor:properties.ocean.lbl-waveDistortionTiling')}
          min={0}
          smallStep={0.001}
          mediumStep={0.01}
          largeStep={0.1}
          value={this.props.node.waveDistortionTiling}
          onChange={this.onChangeProperty('waveDistortionTiling')}
        />
      </NodeEditor>
    )
  }
}

export default withTranslation()(OceanNodeEditor)
