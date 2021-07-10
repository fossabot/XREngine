import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { EditorContext } from '../contexts/EditorContext'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../dnd'
import useUpload from './useUpload'
import { CloudUploadAlt } from '@styled-icons/fa-solid/CloudUploadAlt'
import { useTranslation } from 'react-i18next'

/**
 * DropZoneBackground provides styles for the view port area where we drag and drop objects.
 *
 * @author Robert Long
 * @param {styled component}
 */
const DropZoneBackground = (styled as any).div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
  opacity: ${({ isOver, canDrop }) => (isOver && canDrop ? '1' : '0')};
  pointer-events: ${({ isDragging }) => (isDragging ? 'auto' : 'none')};

  h3 {
    font-size: 1.5em;
    margin-top: 12px;
  }
`

/**
 * AssetDropZone function used to create view port where we can drag and drop objects.
 *
 * @author Robert Long
 * @param       {any} afterUpload
 * @param       {any} uploadOptions
 * @constructor
 */
export function AssetDropZone({ afterUpload, uploadOptions }) {
  const editor = useContext(EditorContext)
  const { t } = useTranslation()

  const onUpload = useUpload(uploadOptions)

  const [{ canDrop, isOver, isDragging }, onDropTarget] = useDrop({
    accept: [ItemTypes.File],
    drop(item: any) {
      onUpload(item.files).then((assets) => {
        if (assets) {
          //editor.setSource(editor.defaultUploadSource.id);

          if (afterUpload) {
            afterUpload(assets)
          }
        }
      })
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
      isDragging: monitor.getItem() !== null && monitor.canDrop()
    })
  })

  //returning dropzone view
  return (
    <DropZoneBackground ref={onDropTarget} isDragging={isDragging} canDrop={canDrop} isOver={isOver}>
      <CloudUploadAlt size={48} />
      <h3>{t('editor:asset.dropZone.title')}</h3>
    </DropZoneBackground>
  )
}

//creating propTypes for AssetDropZone
AssetDropZone.propTypes = {
  afterUpload: PropTypes.func,
  uploadOptions: PropTypes.object
}
export default AssetDropZone
