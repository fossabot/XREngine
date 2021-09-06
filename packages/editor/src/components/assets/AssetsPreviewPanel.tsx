import React, { useImperativeHandle, useState } from 'react'
import styled from 'styled-components'
import { AudioPreviewPanel } from './AssetPreviewPanels/AudioPreviewPanel'
import { ImagePreviewPanel } from './AssetPreviewPanels/ImagePreviewPanel'
import { ModelPreviewPanel } from './AssetPreviewPanels/ModelPreviewPanel'
import { PreviewUnavailable } from './AssetPreviewPanels/PreviewUnavailable'
import { VedioPreviewPanel } from './AssetPreviewPanels/VedioPreviewPanel'

/**
 *
 * @author Abhishek Pathak
 */

const AssetHeading = styled.div`
  text-align: center;
  font-size: 150%;
  padding-bottom: 20px;
`

/**
 * Used to see the Preview of the Asset in the FileBrowser Panel
 *
 * @author Abhishek Pathak <abhi.pathak401@gmail.com>
 */

export const AssetsPreviewPanel = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ onLayoutChanged, onSelectionChanged }))
  const [layoutStateChanged, useLayoutStateChanged] = useState(0)
  const [previewPanel, usePreviewPanel] = useState({
    PreviewSource: null,
    resourceProps: { resourceUrl: '', name: '' }
  })

  const onLayoutChanged = () => {
    console.log('Layout is Changed:')
  }

  const onSelectionChanged = (props) => {
    renderPreview(props)
  }

  const renderPreview = (props) => {
    console.log('Render Preview Function')
    switch (props.contentType) {
      case 'model/gltf':
      case 'model/gltf-binary':
        const modelPreviewPanel = {
          PreviewSource: ModelPreviewPanel,
          resourceProps: { resourceUrl: props.resourceUrl, name: props.name }
        }
        usePreviewPanel(modelPreviewPanel)
        break
      case 'image/png':
      case 'image/jpeg':
        const imagePreviewPanel = {
          PreviewSource: ImagePreviewPanel,
          resourceProps: { resourceUrl: props.resourceUrl, name: props.name }
        }
        usePreviewPanel(imagePreviewPanel)
        break

      case 'video/mp4':
        const vedioPreviewPanel = {
          PreviewSource: VedioPreviewPanel,
          resourceProps: { resourceUrl: props.resourceUrl, name: props.name }
        }
        usePreviewPanel(vedioPreviewPanel)
        break
      case 'audio/mpeg':
        const audioPreviewPanel = {
          PreviewSource: AudioPreviewPanel,
          resourceProps: { resourceUrl: props.resourceUrl, name: props.name }
        }
        usePreviewPanel(audioPreviewPanel)
        break

      default:
        const unavailable = {
          PreviewSource: PreviewUnavailable,
          resourceProps: { resourceUrl: props.resourceUrl, name: props.name }
        }
        usePreviewPanel(unavailable)
        break
    }
  }

  return (
    <>
      {console.log('Rendering Asset Preview Panel')}
      <div>
        <AssetHeading>{previewPanel.resourceProps.name}</AssetHeading>
      </div>
      {previewPanel.PreviewSource && <previewPanel.PreviewSource resourceProps={previewPanel.resourceProps} />}
    </>
  )
})
