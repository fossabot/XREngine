/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Typography, CardHeader, Avatar, IconButton } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import DeleteIcon from '@material-ui/icons/Delete'

import { PopupsStateService } from '../../reducers/popupsState/PopupsStateService'
import { usePopupsStateState } from '../../reducers/popupsState/PopupsStateState'
import { CreatorService } from '../../reducers/creator/CreatorService'

interface Props {
  creator?: any
}

const CreatorAsTitle = ({ creator }: any) => {
  const dispatch = useDispatch()
  const popupsState = usePopupsStateState()
  const removeBlockedUser = (blokedCreatorId) => {
    dispatch(CreatorService.unBlockCreator(blokedCreatorId))
  }

  return creator ? (
    <CardHeader
      avatar={
        <Avatar
          src={creator.avatar}
          alt={creator.username}
          onClick={() => {
            if (popupsState.popups.creatorPage?.value === true) {
              dispatch(PopupsStateService.updateCreatorPageState(false))
              const intervalDelay = setTimeout(() => {
                clearInterval(intervalDelay)
                dispatch(PopupsStateService.updateCreatorPageState(true, creator.id))
              }, 100)
            } else {
              dispatch(PopupsStateService.updateCreatorPageState(true, creator.id))
            }
          }}
        />
      }
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6">
            {creator.username}
            {creator.verified === true && (
              <VerifiedUserIcon htmlColor="#007AFF" style={{ fontSize: '13px', margin: '0 0 0 5px' }} />
            )}
          </Typography>
          <IconButton aria-label="delete" color="primary" onClick={() => removeBlockedUser(creator.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      }
    />
  ) : (
    <></>
  )
}

export default CreatorAsTitle
