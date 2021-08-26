import React, { useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import NumericInput from './NumericInput'
import styled from 'styled-components'
import { CaretLeft } from '@styled-icons/boxicons-regular/CaretLeft'
import { CaretRight } from '@styled-icons/boxicons-regular/CaretRight'
import { InfoTooltip } from '../layout/Tooltip'

/**
 *
 * @author Robert Long
 */
const StepperInputContainer = (styled as any).div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 24px;

  input {
    border-left-width: 0;
    border-right-width: 0;
    border-radius: 0;
  }
`

/**
 *
 * @author Robert Long
 */
const StepperButton = (styled as any).button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.value ? props.theme.blue : props.theme.toolbar)};

  border: 1px solid ${(props) => props.theme.border};
  color: ${(props) => props.theme.text};

  width: 20px;
  padding: 0;

  ${(props) =>
    props.left
      ? `border-top-left-radius: 4px; border-bottom-left-radius: 4px;`
      : `border-top-right-radius: 4px; border-bottom-right-radius: 4px;`}

  :hover {
    background-color: ${(props) => props.theme.blueHover};
  }

  :active {
    background-color: ${(props) => props.theme.blue};
  }
`

/**
 *
 *
 * @author Robert Long
 * @param {any} style
 * @param {any} className
 * @param {any} decrementTooltip
 * @param {any} incrementTooltip
 * @param {any} rest
 * @returns
 */
export function NumericStepperInput({ style, className, decrementTooltip, incrementTooltip, ...rest }) {
  const inputRef = useRef() as any

  const onDecrement = useCallback(() => {
    inputRef.current.decrement()
  }, [inputRef])

  const onIncrement = useCallback(() => {
    inputRef.current.increment()
  }, [inputRef])

  return (
    <StepperInputContainer style={style} className={className}>
      <InfoTooltip info={decrementTooltip} position="bottom">
        <StepperButton left onClick={onDecrement}>
          <CaretLeft size={16} />
        </StepperButton>
      </InfoTooltip>
      <NumericInput ref={inputRef} {...rest} />
      <InfoTooltip info={incrementTooltip} position="bottom">
        <StepperButton right onClick={onIncrement}>
          <CaretRight size={16} />
        </StepperButton>
      </InfoTooltip>
    </StepperInputContainer>
  )
}

/**
 *
 * @author Robert Long
 */
NumericStepperInput.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  decrementTooltip: PropTypes.string,
  incrementTooltip: PropTypes.string
}
export default NumericStepperInput
