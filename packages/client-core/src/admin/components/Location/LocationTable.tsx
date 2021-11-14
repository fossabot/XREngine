import React, { ReactElement, useEffect } from 'react'
import { LocationService } from '../../services/LocationService'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useLocationStyles, useLocationStyle } from './styles'
import { useAuthState } from '../../../user/services/AuthService'
import { useLocationState } from '../../services/LocationService'
import { useInstanceState } from '../../services/InstanceService'
import { useUserState } from '../../services/UserService'
import { SceneService } from '../../services/SceneService'
import { useSceneState } from '../../services/SceneService'
import { UserService } from '../../services/UserService'
import { InstanceService } from '../../services/InstanceService'
import { useErrorState } from '../../../common/services/ErrorService'
import { useDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { locationColumns, LocationProps } from './variable'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TablePagination from '@mui/material/TablePagination'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import ViewLocation from './ViewLocation'
import { LOCATION_PAGE_LIMIT } from '../../services/LocationService'

const LocationTable = (props: LocationProps) => {
  const classes = useLocationStyles()
  const classex = useLocationStyle()
  const adminInstanceState = useInstanceState()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(LOCATION_PAGE_LIMIT)
  const [popConfirmOpen, setPopConfirmOpen] = React.useState(false)
  const [locationId, setLocationId] = React.useState('')
  const [viewModel, setViewModel] = React.useState(false)
  const [locationAdmin, setLocationAdmin] = React.useState('')
  const dispatch = useDispatch()
  const authState = useAuthState()
  const user = authState.user
  const adminScopeReadErrMsg = useErrorState().readError.scopeErrorMessage
  const adminLocationState = useLocationState()
  const adminLocations = adminLocationState
  console.log(adminLocations)
  const adminLocationCount = adminLocationState.total
  const { t } = useTranslation()
  const adminUserState = useUserState()
  const handlePageChange = (event: unknown, newPage: number) => {
    const incDec = page < newPage ? 'increment' : 'decrement'
    LocationService.fetchAdminLocations(incDec)
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  useEffect(() => {
    if (user?.id?.value !== null && adminLocationState.updateNeeded.value && !adminScopeReadErrMsg?.value) {
      LocationService.fetchAdminLocations()
    }
    if (user?.id.value != null) {
      // && adminSceneState.scenes.updateNeeded.value === true) {
      SceneService.fetchAdminScenes('all')
    }
    if (user?.id.value != null && adminLocationState.updateNeeded.value === true) {
      LocationService.fetchLocationTypes()
    }
    if (user?.id.value != null && adminUserState.updateNeeded.value === true) {
      UserService.fetchUsersAsAdmin()
    }
    if (user?.id.value != null && adminInstanceState.updateNeeded.value === true) {
      InstanceService.fetchAdminInstances()
    }
  }, [
    authState.user?.id?.value,
    // adminSceneState.scenes.updateNeeded.value,
    adminInstanceState.updateNeeded.value,
    adminLocationState.updateNeeded.value
  ])

  const openViewModel = (open: boolean, location: any) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setLocationAdmin(location)
    setViewModel(open)
  }

  const closeViewModel = (open) => {
    setViewModel(open)
  }

  const createData = (
    el: any,
    id: string,
    name: string,
    sceneId: string,
    maxUsersPerInstance: string,
    scene: string,
    type: string,
    tags: any,
    instanceMediaChatEnabled: ReactElement<any, any>,
    videoEnabled: ReactElement<any, any>
  ) => {
    return {
      el,
      id,
      name,
      sceneId,
      maxUsersPerInstance,
      scene,
      type,
      tags,
      instanceMediaChatEnabled,
      videoEnabled,
      action: (
        <>
          <a href="#h" className={classex.actionStyle} onClick={openViewModel(true, el)}>
            <span className={classex.spanWhite}>View</span>
          </a>
          <a
            href="#h"
            className={classex.actionStyle}
            onClick={() => {
              setPopConfirmOpen(true)
              setLocationId(id)
            }}
          >
            {' '}
            <span className={classex.spanDange}>Delete</span>{' '}
          </a>
        </>
      )
    }
  }

  const rows = adminLocations.locations.value.map((el) => {
    return createData(
      el,
      el.id,
      el.name,
      el.sceneId,
      el.maxUsersPerInstance,
      el.slugifiedName,
      el.location_setting?.locationType,
      <div>
        {' '}
        {el.isFeatured && (
          <Chip
            style={{ marginLeft: '5px' }}
            avatar={<Avatar>F</Avatar>}
            label={t('admin:components.index.featured')}
            //  onClick={handleClick}
          />
        )}
        {el.isLobby && (
          <Chip
            avatar={<Avatar>L</Avatar>}
            label={t('admin:components.index.lobby')}
            // onClick={handleClick}
          />
        )}{' '}
      </div>,
      <div> {el.location_setting?.instanceMediaChatEnabled ? 'Yes' : 'No'} </div>,
      <div> {el.location_setting?.videoEnabled ? 'Yes' : 'No'}</div>
    )
  })

  return (
    <div>
      <React.Fragment>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {locationColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className={classex.tableCellHeader}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, id) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {locationColumns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id} align={column.align} className={classex.tableCellBody}>
                          {value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[12]}
          component="div"
          count={adminLocationCount.value}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          className={classex.tableFooter}
        />
      </React.Fragment>
      <Dialog
        open={popConfirmOpen}
        onClose={() => setPopConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.paperDialog }}
      >
        <DialogTitle id="alert-dialog-title">Confirm location deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setPopConfirmOpen(false)} className={classes.spanNone}>
            Cancel
          </Button>
          <Button
            className={classes.spanDange}
            onClick={async () => {
              await LocationService.removeLocation(locationId)
              setPopConfirmOpen(false)
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <ViewLocation openView={viewModel} closeViewModel={closeViewModel} locationAdmin={locationAdmin} />
    </div>
  )
}

export default LocationTable
