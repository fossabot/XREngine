/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import { Dispatch } from 'redux'
import { dispatchAlertError } from '../../../common/reducers/alert/service'
import { client } from '../../../feathers'
import {
  fetchingArMedia,
  setAdminArMedia,
  setArMedia,
  addAdminArMedia,
  removeArMediaItem,
  fetchingArMediaItem,
  retrievedArMediaItem,
  updateAdminArMedia
} from './actions'
import { upload } from '@xrengine/engine/src/scene/functions/upload'

export function getArMediaService(type?: string, limit: Number = 12) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingArMedia())
      const list = await client.service('ar-media').find({
        query: {
          action: type,
          $limit: limit
        }
      })
      dispatch(setAdminArMedia(list))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getArMedia(type?: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingArMedia())
      const list = await client.service('ar-media').find({ query: { action: type || null } })
      dispatch(setArMedia(list.data))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export function getArMediaItem(itemId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      dispatch(fetchingArMediaItem(itemId))
      const item = await client.service('ar-media').get(itemId)
      dispatch(retrievedArMediaItem(item))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

const uploadFile = async (files) => {
  const manifest = files.manifest instanceof File ? await upload(files.manifest, null) : null
  const audio = files.audio instanceof File ? await upload(files.audio, null) : null
  const dracosis = files.dracosis instanceof File ? await upload(files.dracosis, null) : null
  const preview = files.preview instanceof File ? await upload(files.preview, null) : null
  return {
    manifestId: manifest?.file_id,
    audioId: audio?.file_id,
    dracosisId: dracosis?.file_id,
    previewId: preview?.file_id
  }
}

export function createArMedia(mediaItem: any, files: any) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      const file = await uploadFile(files)
      //@ts-ignore error that this vars are void because upload is defines as void function
      const newItem = await client.service('ar-media').create({
        ...mediaItem,
        ...file
      })
      dispatch(addAdminArMedia(newItem))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}

export const updateArMedia =
  (mediaItem, files, id) =>
  async (dispatch: Dispatch): Promise<any> => {
    const result = await uploadFile(files)
    const newItem = await client.service('ar-media').patch(id, {
      ...mediaItem,
      ...result
    })
    dispatch(updateAdminArMedia(newItem))
    try {
    } catch (error) {
      console.error(error)
      dispatchAlertError(dispatch, error.message)
    }
  }

export function removeArMedia(mediaItemId: string) {
  return async (dispatch: Dispatch): Promise<any> => {
    try {
      await client.service('ar-media').remove(mediaItemId)
      dispatch(removeArMediaItem(mediaItemId))
    } catch (err) {
      console.log(err)
      dispatchAlertError(dispatch, err.message)
    }
  }
}
