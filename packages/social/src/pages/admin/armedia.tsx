/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React, { useEffect } from 'react'

import Dashboard from '@xrengine/social/src/components/Dashboard'
import ArMediaDashboard from '@xrengine/social/src/components/admin/Armedia'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { useArMediaState } from '@xrengine/social/src/reducers/arMedia/ArMediaState'
import { ArMediaService } from '@xrengine/social/src/reducers/arMedia/ArMediaService'

const ArMediaPage = () => {
  const arMediaState = useArMediaState()
  useEffect(() => ArMediaService.getArMedia('admin'), [])
  const arMediaList =
    arMediaState.fetching.value === false && arMediaState.adminList ? arMediaState.adminList.value : null
  return (
    <>
      <div>
        <Dashboard>
          {/* <ArMediaConsole list={arMediaList} /> */}
          <ArMediaDashboard list={arMediaList} />
        </Dashboard>
      </div>
    </>
  )
}

export default ArMediaPage
