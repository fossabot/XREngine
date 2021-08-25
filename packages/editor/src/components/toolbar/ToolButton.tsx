import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { InfoTooltip } from '../layout/Tooltip'

/**
 *
 * @author Robert Long
 */
const StyledToolButton = (styled as any).button`
  width: 40px;
  height: 40px;
  border: none;
  color: ${(props) => props.theme.white};
  cursor: pointer;
  position: relative;

  background-color: ${(props) => (props.isSelected ? props.theme.blue : props.theme.toolbar)};

  &:hover {
    background-color: ${(props) => (props.isSelected ? props.theme.blueHover : props.theme.panel2)};
  }
`

/**
 *
 * @author Robert Long
 */
const Icon = (styled as any).div`
  width: 14px;
  height: 14px;
  font-size: 14px;
`

/**
 *
 * @author Robert Long
 * @param {any} id
 * @param {any} icon
 * @param {any} onClick
 * @param {any} isSelected
 * @param {any} tooltip
 * @returns
 */
export function ToolButton({ id, icon, onClick, isSelected, tooltip }) {
  return (
    <InfoTooltip id={id} info={tooltip} position="bottom">
      <StyledToolButton isSelected={isSelected} onClick={onClick}>
        <Icon as={icon} />
      </StyledToolButton>
    </InfoTooltip>
  )
}

/**
 *
 * @author Robert Long
 */
ToolButton.propTypes = {
  id: PropTypes.string,
  icon: PropTypes.object,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  tooltip: PropTypes.string
}
export default ToolButton
