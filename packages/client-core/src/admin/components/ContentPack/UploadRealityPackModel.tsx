import classNames from 'classnames'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { selectContentPackState } from '../../reducers/contentPack/selector'
import styles from './ContentPack.module.scss'
import { uploadRealityPack } from '../../reducers/contentPack/service'
import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

interface Props {
  open: boolean
  handleClose: any
  scenes?: any
  avatars?: any
  realityPacks?: any
  uploadRealityPack?: any
}

const mapStateToProps = (state: any): any => {
  return {
    contentPackState: selectContentPackState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  uploadRealityPack: bindActionCreators(uploadRealityPack, dispatch)
})

const AddToContentPackModal = (props: Props): any => {
  const { open, handleClose, scenes, uploadRealityPack } = props

  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [createOrPatch, setCreateOrPatch] = useState('patch')
  const [realityPackURL, setRealityPackURL] = useState('')

  const showError = (err: string) => {
    setError(err)
    setTimeout(() => {
      setError('')
    }, 3000)
  }

  const tryUploadRealityPack = async () => {
    try {
      if (realityPackURL !== '') {
        setProcessing(true)
        await uploadRealityPack({
          uploadURL: realityPackURL
        })
        setProcessing(false)
        closeModal()
      }
    } catch (err) {
      setProcessing(false)
      showError(err.message)
    }
  }

  const closeModal = () => {
    setRealityPackURL('')
    handleClose()
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={props.open}>
          <div
            className={classNames({
              [styles.paper]: true,
              [styles['modal-content']]: true
            })}
          >
            {processing === false && createOrPatch === 'patch' && (
              <div>
                <FormControl>
                  <InputLabel id="contentPackSelect">URL</InputLabel>
                  <TextField
                    className={styles['pack-select']}
                    id="contentPackSelect"
                    value={realityPackURL}
                    onChange={(e) => setRealityPackURL(e.target.value)}
                  />
                  <Button type="submit" variant="contained" color="primary" onClick={tryUploadRealityPack}>
                    Upload Reality Pack
                  </Button>
                </FormControl>
              </div>
            )}
            {processing === true && (
              <div className={styles.processing}>
                <CircularProgress color="primary" />
                <div className={styles.text}>Processing</div>
              </div>
            )}
            {error && error.length > 0 && <h2 className={styles['error-message']}>{error}</h2>}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AddToContentPackModal)
