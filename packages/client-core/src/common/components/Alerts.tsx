import React from 'react'
import { useDispatch } from '@xrengine/client-core/src/store'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import { useAlertState } from '../state/AlertState'
import { AlertService } from '../state/AlertService'
import Box from '@material-ui/core/Box'
import styles from './Common.module.scss'

interface Props {}

const AlertsComponent = (props: Props): any => {
  const dispatch = useDispatch()
  const handleClose = (e: any): void => {
    e.preventDefault()
    AlertService.alertCancel()
  }
  const alert = useAlertState()
  const type = alert.type
  const message = alert.message
  let svgtypeicon = ''
  let svgtypeclass = ''
  let alertBoxContainerclass = ''
  let alerttitle = ''

  if (type.value == 'success') {
    svgtypeicon = '/Notification_Success.svg'
    svgtypeclass = styles.svgiconsuccess
    alertBoxContainerclass = styles.alertBoxContainersuccess
    alerttitle = 'Event was successful'
  } else if (type.value == 'error') {
    svgtypeicon = '/Notification_Error.svg'
    svgtypeclass = styles.svgiconerror
    alertBoxContainerclass = styles.alertBoxContainererror
    alerttitle = 'An error was encountered'
  } else {
    svgtypeicon = '/Notification_InProgress.svg'
    svgtypeclass = styles.svgiconprogress
    alertBoxContainerclass = styles.alertBoxContainerprogress
    alerttitle = 'Event in progress'
  }

  return (
    <div className={styles.alertContainer}>
      {type.value === 'none' || message.value === '' ? (
        <Box />
      ) : (
        <Box m={1} className={styles.BoxContainer}>
          <Alert
            className={alertBoxContainerclass}
            variant="filled"
            severity={type.value}
            icon={<img src={svgtypeicon} className={svgtypeclass}></img>}
            onClose={(e) => handleClose(e)}
          >
            <div className={styles.divalertContainer}>
              <AlertTitle className={styles.alerttitle}>{alerttitle}</AlertTitle>
              {message.value}
            </div>
          </Alert>
        </Box>
      )}
    </div>
  )
}

const AlertsWrapper = (props: any): any => <AlertsComponent {...props} />

export const Alerts = AlertsWrapper
