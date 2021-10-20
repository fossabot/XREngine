import React, { useRef, useState, useCallback, ReactNode } from 'react'
import Portal from './Portal'
import Positioner from './Positioner'
import Overlay from './Overlay'

interface PopoverProp {
  children?: ReactNode
  padding?: any
  position?: any
  renderContent?: any
  disabled?: boolean
}

/**
 *
 * @author Robert Long
 * @param {any} children
 * @param {any} padding
 * @param {any} position
 * @param {any} renderContent
 * @param {any} disabled
 * @param {any} rest
 * @returns
 */
export function Popover({ children, padding, position, renderContent, disabled, ...rest }: PopoverProp) {
  const popoverTriggerRef = useRef()
  const [isOpen, setIsOpen] = useState(false)

  /**
   *
   * @author Robert Long
   */
  const onOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true)
    }
  }, [setIsOpen, disabled])

  /**
   *
   * @author Robert Long
   */
  const onClose = useCallback(
    (e) => {
      setIsOpen(false)
      e.stopPropagation()
    },
    [setIsOpen]
  )

  /**
   *
   * @author Robert Long
   */
  const onPreventClose = useCallback((e) => {
    e.stopPropagation()
  }, [])

  /**
   *
   * @author Robert Long
   */
  const getTargetRef = useCallback(() => {
    return popoverTriggerRef
  }, [popoverTriggerRef])

  return (
    <div ref={popoverTriggerRef} onClick={onOpen} {...rest}>
      {children}
      {isOpen && (
        <Portal>
          <Overlay onClick={onClose} />
          <Positioner onClick={onPreventClose} getTargetRef={getTargetRef} padding={padding} position={position}>
            {renderContent({ onClose })}
          </Positioner>
        </Portal>
      )}
    </div>
  )
}

export default Popover
