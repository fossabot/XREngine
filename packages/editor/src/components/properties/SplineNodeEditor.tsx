import React from 'react'
import NodeEditor from './NodeEditor'
import TimelineIcon from '@mui/icons-material/Timeline'
import { useTranslation } from 'react-i18next'
import { PropertiesPanelButton } from '../inputs/Button'

/**
 * Define properties for SplineNodeEditor component.
 *
 * @author Hamza Mushtaq
 * @type {Object}
 */
type SplineNodeEditorProps = {
  node?: object
}

/**
 * SplineNodeEditor used to create and customize splines in the scene.
 *
 * @author Hamza Mushtaq
 * @param       {Object} props
 * @constructor
 */

export const SplineNodeEditor = (props: SplineNodeEditorProps) => {
  const { t } = useTranslation()

  const onAddNode = () => {
    props.node?.onAddNodeToSpline()
  }

  return (
    <NodeEditor description={t('editor:properties.spline.description')} {...props}>
      <PropertiesPanelButton onClick={onAddNode}>{t('editor:properties.spline.lbl-addNode')}</PropertiesPanelButton>
    </NodeEditor>
  )
}

SplineNodeEditor.iconComponent = TimelineIcon

export default SplineNodeEditor
