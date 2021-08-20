/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React, { useEffect } from 'react'
import CreatorConsole from '@xrengine/client-core/src/admin/components/CreatorConsole'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { selectCreatorsState } from '@xrengine/client-core/src/socialmedia/reducers/creator/selector'
import { getCreators } from '@xrengine/client-core/src/socialmedia/reducers/creator/service'
import Dashboard from '@xrengine/client-core/src/socialmedia/components/Dashboard'

const mapStateToProps = (state: any): any => {
  return {
    creatorsState: selectCreatorsState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  getCreators: bindActionCreators(getCreators, dispatch)
})

interface Props {
  creatorsState?: any
  getCreators?: any
}

interface Props {
  creatorsState?: any
  getCreators?: any
}

const UsersPage = ({ creatorsState, getCreators }: Props) => {
  useEffect(() => getCreators(), [creatorsState.get('currentCreator')])
  const creators =
    creatorsState && creatorsState.get('fetching') === false && creatorsState.get('creators')
      ? creatorsState.get('creators')
      : null
  return (
    <>
      <div>
        <Dashboard>{creators && <CreatorConsole list={creators} />}</Dashboard>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage)
