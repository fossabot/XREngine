/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import { Card, CardContent, CardMedia, Typography, Avatar } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { useCreatorState } from '../../reducers/creator/CreatorState'
import { CreatorService } from '../../reducers/creator/CreatorService'
// @ts-ignore
import styles from './Creators.module.scss'
import { selectPopupsState } from '../../reducers/popupsState/selector'
import { updateCreatorPageState } from '../../reducers/popupsState/service'

const mapStateToProps = (state: any): any => {
  return {
    popupsState: selectPopupsState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  updateCreatorPageState: bindActionCreators(updateCreatorPageState, dispatch)
})

interface Props {
  popupsState?: any

  updateCreatorPageState?: typeof updateCreatorPageState
}

const Creators = ({ popupsState, updateCreatorPageState }: Props) => {
  const creatorsState = useCreatorState()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(CreatorService.getCreators())
  }, [])
  const creators =
    creatorsState.creators.creators?.value && creatorsState.creators.fetchingCreators?.value === false
      ? creatorsState.creators.creators.value
      : null

  const handleCreatorView = (id) => {
    updateCreatorPageState(false)
    updateCreatorPageState(true, id)
  }

  const currentCreator = creatorsState.creators.currentCreator?.id?.value
  useEffect(() => {
    dispatch(CreatorService.getBlockedList(currentCreator))
  }, [])
  const blackList = creatorsState?.creators?.blocked.value
  // console.log(Array.from(new Set(blackList?.map((item: any) => item.id))))

  return (
    <section className={styles.creatorContainer}>
      {/*     <h3>Featured Creators</h3> */}
      {creators &&
        blackList &&
        creators.length > 0 &&
        creators
          ?.filter((person) => person.isBlocked < 1)
          .map((item, itemIndex) => (
            <Card
              className={styles.creatorItem}
              elevation={0}
              key={itemIndex}
              onClick={() => handleCreatorView(item.id)}
            >
              {item.avatar ? (
                <CardMedia className={styles.previewImage} image={item.avatar || <PersonPinIcon />} title={item.name} />
              ) : (
                <section className={styles.previewImage}>
                  <Avatar className={styles.avatarPlaceholder} />
                </section>
              )}
              <CardContent>
                <Typography className={styles.titleContainer}>
                  {item.name}
                  {item.verified === 1 && (
                    <VerifiedUserIcon htmlColor="#007AFF" style={{ fontSize: '13px', margin: '0 0 0 5px' }} />
                  )}
                </Typography>
                <Typography className={styles.usernameContainer}>{item.username}</Typography>
              </CardContent>
            </Card>
          ))}
    </section>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Creators)
