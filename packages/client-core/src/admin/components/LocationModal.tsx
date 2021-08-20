import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import Fade from '@material-ui/core/Fade'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Modal from '@material-ui/core/Modal'
import Select from '@material-ui/core/Select'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { createLocation, patchLocation, removeLocation } from '../reducers/admin/location/service'
import { selectAppState } from '../../common/reducers/app/selector'
import { selectAuthState } from '../../user/reducers/auth/selector'
import styles from './Admin.module.scss'
import Tooltip from '@material-ui/core/Tooltip'
import { useTranslation } from 'react-i18next'
import { selectAdminSceneState } from '../reducers/admin/scene/selector'
import { selectAdminLocationState } from '../reducers/admin/location/selector'

interface Props {
  open: boolean
  handleClose: any
  location: any
  editing: boolean
  adminState?: any
  createLocation?: any
  patchLocation?: any
  removeLocation?: any
  adminSceneState?: any
  adminLocationState?: any
}

const mapStateToProps = (state: any): any => {
  return {
    appState: selectAppState(state),
    authState: selectAuthState(state),
    adminSceneState: selectAdminSceneState(state),
    adminLocationState: selectAdminLocationState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  createLocation: bindActionCreators(createLocation, dispatch),
  patchLocation: bindActionCreators(patchLocation, dispatch),
  removeLocation: bindActionCreators(removeLocation, dispatch)
})

const LocationModal = (props: Props): any => {
  const {
    open,
    handleClose,
    location,
    editing,
    createLocation,
    patchLocation,
    removeLocation,
    adminSceneState,
    adminLocationState
  } = props

  const [name, setName] = useState('')
  const [sceneId, setSceneId] = useState('')
  const [maxUsers, setMaxUsers] = useState(10)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [instanceMediaChatEnabled, setInstanceMediaChatEnabled] = useState(false)
  const [locationType, setLocationType] = useState('private')
  const adminScenes = adminSceneState.get('scenes').get('scenes')
  const locationTypes = adminLocationState.get('locationTypes').get('locationTypes')
  const [state, setState] = React.useState({
    feature: false,
    lobby: false
  })
  const { t } = useTranslation()

  const submitLocation = () => {
    const submission = {
      name: name,
      sceneId: sceneId,
      maxUsersPerInstance: maxUsers,
      location_setting: {
        locationType: locationType,
        instanceMediaChatEnabled: instanceMediaChatEnabled,
        videoEnabled: videoEnabled
      },
      isLobby: state.lobby,
      isFeatured: state.feature
    }

    if (editing === true) {
      patchLocation(location.id, submission)
    } else {
      createLocation(submission)
    }

    handleClose()
  }

  const deleteLocation = () => {
    removeLocation(location.id)
    handleClose()
  }

  useEffect(() => {
    if (editing === true) {
      setName(location.name)
      setSceneId(location.sceneId || '')
      setMaxUsers(location.maxUsersPerInstance)
      setVideoEnabled(location.location_setting.videoEnabled)
      setInstanceMediaChatEnabled(location.location_setting.instanceMediaChatEnabled)
      setLocationType(location.location_setting.locationType)
      setState({
        lobby: location.isLobby,
        feature: location.isFeature
      })
    } else {
      setName('')
      setSceneId('')
      setMaxUsers(10)
      setVideoEnabled(false)
      setInstanceMediaChatEnabled(false)
      setLocationType('private')
    }
  }, [location])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={handleClose}
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
            {editing === true && (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="id"
                label="ID"
                name="id"
                disabled
                defaultValue={location?.id}
              >
                {location.id}
              </TextField>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label={t('admin:components.locationModel.lbl-name')}
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              type="number"
              variant="outlined"
              margin="normal"
              fullWidth
              id="maxUsers"
              label={t('admin:components.locationModel.lbl-maxuser')}
              name="name"
              required
              value={maxUsers}
              onChange={(e) => setMaxUsers(parseInt(e.target.value))}
            />
            <FormControl>
              <InputLabel id="scene">{t('admin:components.locationModel.lbl-scene')}</InputLabel>
              <Select labelId="scene" id="scene" value={sceneId} onChange={(e) => setSceneId(e.target.value as string)}>
                {adminScenes.map((scene) => (
                  <MenuItem key={scene.sid} value={scene.sid}>{`${scene.name} (${scene.sid})`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="locationType">{t('admin:components.locationModel.lbl-type')}</InputLabel>
              <Select
                labelId="locationType"
                id="locationType"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value as string)}
              >
                {locationTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    {type.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              <FormControl style={{ color: 'black' }}>
                <FormControlLabel
                  color="primary"
                  control={
                    <Switch
                      checked={videoEnabled}
                      onChange={(e) => setVideoEnabled(e.target.checked)}
                      name="videoEnabled"
                    />
                  }
                  label={t('admin:components.locationModel.lbl-ve')}
                />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl style={{ color: 'black' }}>
                <FormControlLabel
                  color="primary"
                  control={
                    <Switch
                      checked={instanceMediaChatEnabled}
                      onChange={(e) => setInstanceMediaChatEnabled(e.target.checked)}
                      name="instanceMediaChatEnabled"
                    />
                  }
                  label={t('admin:components.locationModel.lbl-gme')}
                />
              </FormControl>
            </FormGroup>

            {!location.isLobby && (
              <FormControlLabel
                control={<Checkbox checked={state.lobby} onChange={handleChange} name="lobby" color="primary" />}
                label={t('admin:components.locationModel.lbl-lobby')}
              />
            )}
            <FormControlLabel
              control={<Checkbox checked={state.feature} onChange={handleChange} name="feature" color="primary" />}
              label={t('admin:components.locationModel.lbl-featured')}
            />
            <FormGroup row className={styles.locationModalButtons}>
              {editing === true && (
                <Button type="submit" variant="contained" color="primary" onClick={submitLocation}>
                  {t('admin:components.locationModel.lbl-update')}
                </Button>
              )}
              {editing !== true && (
                <Button type="submit" variant="contained" color="primary" onClick={submitLocation}>
                  {t('admin:components.locationModel.lbl-create')}
                </Button>
              )}
              <Button type="submit" variant="contained" onClick={handleClose}>
                {t('admin:components.locationModel.lbl-cancel')}
              </Button>
              {editing === true && (
                <Tooltip
                  title={state.lobby ? t('admin:components.locationModel.tooltipCanNotBeDeleted') : ''}
                  arrow
                  placement="top"
                >
                  <span>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={deleteLocation}
                      disabled={location.isLobby}
                    >
                      {t('admin:components.locationModel.lbl-delete')}
                    </Button>
                  </span>
                </Tooltip>
              )}
            </FormGroup>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationModal)
