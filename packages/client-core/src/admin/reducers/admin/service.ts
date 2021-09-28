import { Dispatch } from 'redux'
import { VideoCreationForm, VideoUpdateForm, videoCreated, videoUpdated, videoDeleted } from './actions'

import axios from 'axios'
import { Config } from '@xrengine/common/src/config'
import { client } from '../../../feathers'
import { AlertService } from '../../../common/reducers/alert/AlertService'
import { PublicVideo, videosFetchedSuccess, videosFetchedError } from '../../../media/components/video/actions'
import { accessAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'

export function createVideo(data: VideoCreationForm) {
  return async (dispatch: Dispatch, getState: any) => {
    const token = accessAuthState().authUser.accessToken.value
    try {
      const res = await axios.post(`${Config.publicRuntimeConfig.apiServer}/video`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      })
      const result = res.data
      AlertService.dispatchAlertSuccess(dispatch, 'Video uploaded')
      dispatch(videoCreated(result))
    } catch (err) {
      AlertService.dispatchAlertError(dispatch, 'Video upload error: ' + err.response.data.message)
    }
  }
}

export function updateVideo(data: VideoUpdateForm) {
  return (dispatch: Dispatch): any => {
    client
      .service('static-resource')
      .patch(data.id, data)
      .then((updatedVideo) => {
        AlertService.dispatchAlertSuccess(dispatch, 'Video updated')
        dispatch(videoUpdated(updatedVideo))
      })
  }
}

export function deleteVideo(id: string) {
  return (dispatch: Dispatch): any => {
    client
      .service('static-resource')
      .remove(id)
      .then((removedVideo) => {
        AlertService.dispatchAlertSuccess(dispatch, 'Video deleted')
        dispatch(videoDeleted(removedVideo))
      })
  }
}

export function fetchAdminVideos() {
  return (dispatch: Dispatch): any => {
    client
      .service('static-resource')
      .find({
        query: {
          $limit: 100,
          mimeType: 'application/dash+xml'
        }
      })
      .then((res: any) => {
        for (const video of res.data) {
          video.metadata = JSON.parse(video.metadata)
        }
        const videos = res.data as PublicVideo[]
        return dispatch(videosFetchedSuccess(videos))
      })
      .catch(() => dispatch(videosFetchedError('Failed to fetch videos')))
  }
}
