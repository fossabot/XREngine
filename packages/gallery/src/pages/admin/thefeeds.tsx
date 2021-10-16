/**
 * @author Gleb Ordinsky <glebordinskijj@gmail.com>
 */
import React, { useEffect } from 'react'
import Dashboard from '@xrengine/social/src/components/Dashboard'
import { bindActionCreators, Dispatch } from 'redux'
import { useDispatch } from '@xrengine/client-core/src/store'
import { TheFeedsService } from '@xrengine/client-core/src/social/state/TheFeedsService'
import { AuthService } from '@xrengine/client-core/src/user/state/AuthService'
import TheFeedsConsole from '@xrengine/social/src/components/admin/Feeds'
import { useTheFeedsState } from '@xrengine/client-core/src/social/state/TheFeedsState'

// const thefeeds = '';
// conts Feeds = '';

interface Props {}

const TheFeeds = (props: Props) => {
  const dispatch = useDispatch()
  const theFeedsState = useTheFeedsState()
  const create = (data) => {
    TheFeedsService.createTheFeedsNew(data)
  }
  const deleteTheFeed = (id) => {
    TheFeedsService.removeTheFeeds(id)
  }
  const update = (obj) => {
    TheFeedsService.updateTheFeedsAsAdmin(obj)
  }

  useEffect(() => {
    AuthService.doLoginAuto(true, true)
    TheFeedsService.getTheFeedsNew()
  }, [])
  const TheFeedsList = theFeedsState?.thefeeds?.value || []
  return (
    <>
      <div>
        <Dashboard>
          <TheFeedsConsole create={create} list={TheFeedsList} deleteTheFeed={deleteTheFeed} update={update} />
        </Dashboard>
      </div>
    </>
  )
}

export default TheFeeds
