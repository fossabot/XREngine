import { Link } from '@styled-icons/fa-solid/Link'
import React, { Component } from 'react'
import Editor from '../Editor'
import InputGroup from '../inputs/InputGroup'
import StringInput from '../inputs/StringInput'
import NodeEditor from './NodeEditor'
import i18n from 'i18next'
import { withTranslation } from 'react-i18next'

//declaring properties for LinkNodeEditor
type LinkNodeEditorProps = {
  editor?: Editor
  node?: object
  t: Function
}

/**
 * LinkNodeEditor provides the editor for properties of LinkNode.
 *
 * @author Robert Long
 * @type {class component}
 */
export class LinkNodeEditor extends Component<LinkNodeEditorProps, {}> {
  // initializing iconComponent image name
  static iconComponent = Link

  //initializing description and will appears on LinkNodeEditor view
  static description = i18n.t('editor:properties.link.description')

  //function to handle change in href property of LinkNode
  onChangeHref = (href) => {
    this.props.editor.setPropertySelected('href', href)
  }

  //rendering view of editor for properties of LinkNode
  render() {
    LinkNodeEditor.description = this.props.t('editor:properties.link.description')
    const node = this.props.node
    return (
      /* @ts-ignore */
      <NodeEditor description={LinkNodeEditor.description} {...this.props}>
        {/* @ts-ignore */}
        <InputGroup name="Url" label={this.props.t('editor:properties.link.lbl-url')}>
          {/* @ts-ignore */}
          <StringInput value={node.href} onChange={this.onChangeHref} />
        </InputGroup>
      </NodeEditor>
    )
  }
}

export default withTranslation()(LinkNodeEditor)
