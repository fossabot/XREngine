import React, { useRef, ReactNode, useCallback } from 'react'
import Portal from '../layout/Portal'
import { getStepSize, toPrecision } from '../../functions/utils'
import styled from 'styled-components'
import { ArrowsAltH } from '@styled-icons/fa-solid/ArrowsAltH'
import Overlay from '../layout/Overlay'
import { clamp } from '@xrengine/engine/src/common/functions/MathLerpFunctions'
import {} from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useHookstate } from '@hookstate/core'

/**
 *
 * @author Robert Long
 */
const ScrubberContainer = (styled as any).div`
  cursor: ew-resize;
  user-select: none;
`

/**
 *
 * @author Robert Long
 */
const Cursor = (styled as any)(ArrowsAltH).attrs(({ x, y }) => ({
  style: {
    transform: `translate(${x}px,${y}px)`
  }
}))`
  position: absolute;
  width: 20px;

  path {
    stroke: white;
    strokeWidth: 20px;
    fill: black;
  }
`

type ScrubberProp = {
  tag?: any
  children?: ReactNode
  smallStep?: number
  mediumStep?: number
  largeStep?: number
  sensitivity?: number
  min?: number
  max?: number
  precision?: number
  convertFrom?: any
  convertTo?: any
  value?: any
  onChange: Function
  onCommit?: Function
}

/**
 *
 * @author Robert Long
 */
const Scrubber = (props: ScrubberProp) => {
  const state = useHookstate({
    isDragging: false,
    startValue: null,
    delta: null,
    mouseX: null,
    mouseY: null
  })

  const scrubberEl = useRef(null)

  const handleMouseMove = (event) => {
    const { smallStep, mediumStep, largeStep, sensitivity, min, max, precision, convertTo, onChange } = props

    if (state.isDragging.value) {
      const mX = state.mouseX.value + event.movementX
      const mY = state.mouseY.value + event.movementY
      const nextDelta = state.delta.value + event.movementX
      const stepSize = getStepSize(event, smallStep, mediumStep, largeStep)
      const nextValue = state.startValue.value + Math.round(nextDelta / sensitivity) * stepSize
      const clampedValue = clamp(nextValue, min, max)
      const roundedValue = precision ? toPrecision(clampedValue, precision) : clampedValue
      const finalValue = convertTo(roundedValue)
      onChange(finalValue)

      state.delta.set(nextDelta)
      state.mouseX.set(mX)
      state.mouseY.set(mY)
    }
  }

  const handleMouseUp = () => {
    const { onCommit, value } = props

    if (state.isDragging.value) {
      state.isDragging.set(false)
      state.startValue.set(null)
      state.delta.set(null)
      state.mouseX.set(null)
      state.mouseY.set(null)

      if (onCommit) {
        onCommit(value)
      }

      document.exitPointerLock()
    }

    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const handleMouseDown = (event) => {
    const { convertFrom, value } = props

    state.isDragging.set(true)
    state.startValue.set(convertFrom(value))
    state.delta.set(0)
    state.mouseX.set(event.clientX)
    state.mouseY.set(event.clientY)

    scrubberEl?.current?.requestPointerLock()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const {
    tag,
    children,
    smallStep,
    mediumStep,
    largeStep,
    sensitivity,
    min,
    max,
    precision,
    convertFrom,
    convertTo,
    value,
    onChange,
    onCommit,
    ...rest
  } = props

  return (
    <ScrubberContainer as={tag} ref={scrubberEl} onMouseDown={handleMouseDown} {...rest}>
      {children}
      {state.isDragging.value && (
        <Portal>
          <Overlay pointerEvents="none">
            <Cursor x={state.mouseX.value} y={state.mouseY.value} />
          </Overlay>
        </Portal>
      )}
    </ScrubberContainer>
  )
}

Scrubber.defaultProps = {
  tag: 'label',
  smallStep: 0.025,
  mediumStep: 0.1,
  largeStep: 0.25,
  sensitivity: 5,
  min: -Infinity,
  max: Infinity,
  convertFrom: (value) => value,
  convertTo: (value) => value
}

/**
 *
 * @author Robert Long
 */
export default React.memo(Scrubber)
