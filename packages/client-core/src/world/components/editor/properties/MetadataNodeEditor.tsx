import React from 'react'
import { Analytics } from '@styled-icons/material/Analytics/Analytics.esm'
import NodeEditor from './NodeEditor'
import InputGroup from '../inputs/InputGroup'
import StringInput from '../inputs/StringInput'
import { withTranslation } from 'react-i18next'

export function MetadataNodeEditor(props: { editor?: any; node?: any; t: any }) {
  const { node, editor, t } = props

  const onChangeData = (value) => {
    editor.setPropertySelected('_data', value)
  }

  const description = 'Metadata Node for the Digital Being'

  return (
    <NodeEditor {...props} description={description}>
      {/* @ts-ignore */}
      <InputGroup name="Data" label="Data">
        {/* @ts-ignore */}
        <StringInput value={node._data} onChange={onChangeData} />
      </InputGroup>
    </NodeEditor>
  )
}

MetadataNodeEditor.iconComponent = Analytics
MetadataNodeEditor.description = 'Metadata Node for the Digital Being'
export default withTranslation()(MetadataNodeEditor)
