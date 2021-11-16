import React, { Component } from 'react'
import NodeEditor from './NodeEditor'
import { Cubes } from '@styled-icons/fa-solid/Cubes'
import { useTranslation } from 'react-i18next'

type GroupNodeEditorProps = {
  node?: object
}

/**
 * GroupNodeEditor used to render group of multiple objects.
 *
 * @author Robert Long
 * @type {class component}
 */
export const GroupNodeEditor = (props: GroupNodeEditorProps) => {
  const { t } = useTranslation()

  return <NodeEditor {...props} description={t('editor:properties.group.description')} />
}

GroupNodeEditor.iconComponent = Cubes

export default GroupNodeEditor
