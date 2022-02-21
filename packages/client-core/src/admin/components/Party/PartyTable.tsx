import React, { useState } from 'react'
import { useDispatch } from '../../../store'
import { useAuthState } from '../../../user/services/AuthService'
import ConfirmModel from '../../common/ConfirmModel'
import { useFetchAdminParty } from '../../common/hooks/party.hooks'
import TableComponent from '../../common/Table'
import { partyColumns, PartyData, PartyPropsTable } from '../../common/variables/party'
import { PartyService, PARTY_PAGE_LIMIT, usePartyState } from '../../services/PartyService'
import { useStyles } from '../../styles/ui'
import ViewParty from './ViewParty'

const PartyTable = (props: PartyPropsTable) => {
  const { search } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(PARTY_PAGE_LIMIT)
  const [popConfirmOpen, setPopConfirmOpen] = useState(false)
  const [partyName, setPartyName] = useState('')
  const [partyId, setPartyId] = useState('')
  const [viewModel, setViewModel] = useState(false)
  const [partyAdmin, setPartyAdmin] = useState('')
  const [editMode, setEditMode] = useState(false)

  const authState = useAuthState()
  const user = authState.user
  const adminPartyState = usePartyState()
  const adminParty = adminPartyState
  const adminPartyData = adminParty.parties?.value || []
  const adminPartyCount = adminParty.total.value

  //Call custom hooks
  useFetchAdminParty(user, adminParty, adminPartyState, PartyService, search)

  const handlePageChange = (event: unknown, newPage: number) => {
    const incDec = page < newPage ? 'increment' : 'decrement'
    PartyService.fetchAdminParty(incDec)
    setPage(newPage)
  }

  const handleCloseModel = () => {
    setPopConfirmOpen(false)
  }

  const submitRemoveParty = async () => {
    await PartyService.removeParty(partyId)
    setPopConfirmOpen(false)
  }

  const openViewModel = (open: boolean, party: any) => {
    setPartyAdmin(party)
    setViewModel(open)
  }

  const closeViewModel = () => {
    setViewModel(false)
    setPartyAdmin('')
    setEditMode(false)
  }

  const handleEditMode = (open: boolean) => {
    setEditMode(open)
  }

  const createData = (el: any, id: string, instance: any, location: any): PartyData => {
    return {
      el,
      id,
      instance,
      location,
      action: (
        <>
          <a href="#h" className={classes.actionStyle} onClick={() => openViewModel(true, el)}>
            <span className={classes.spanWhite}>View</span>
          </a>
          <a
            href="#h"
            className={classes.actionStyle}
            onClick={() => {
              setPopConfirmOpen(true)
              setPartyName(instance)
              setPartyId(id)
            }}
          >
            <span className={classes.spanDange}>Delete</span>
          </a>
        </>
      )
    }
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const rows = adminPartyData?.map((el) => {
    return createData(
      el,
      el.id,
      el?.instance?.ipAddress || <span className={classes.spanNone}>None</span>,
      el.location?.name || <span className={classes.spanNone}>None</span>
    )
  })

  return (
    <React.Fragment>
      <TableComponent
        rows={rows}
        column={partyColumns}
        page={page}
        rowsPerPage={rowsPerPage}
        count={adminPartyCount}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
      <ConfirmModel
        popConfirmOpen={popConfirmOpen}
        handleCloseModel={handleCloseModel}
        submit={submitRemoveParty}
        name={partyName}
        label={'party with instance of '}
      />
      <ViewParty
        openView={viewModel}
        closeViewModel={closeViewModel}
        partyAdmin={partyAdmin}
        editMode={editMode}
        handleEditMode={handleEditMode}
      />
    </React.Fragment>
  )
}

export default PartyTable
