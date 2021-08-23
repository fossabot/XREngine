import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import { createUser as createUserAction, fetchStaticResource } from '../../reducers/admin/user/service'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { fetchUserRole } from '../../reducers/admin/user/service'
import { selectAdminState } from '../../reducers/admin/selector'
import DialogContentText from '@material-ui/core/DialogContentText'
import CreateUserRole from './CreateUserRole'
import DialogActions from '@material-ui/core/DialogActions'
import Container from '@material-ui/core/Container'
import DialogTitle from '@material-ui/core/DialogTitle'
import { formValid } from './validation'
import { selectAuthState } from '../../../user/reducers/auth/selector'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { useStyles, useStyle } from './styles'
import { selectAdminUserState } from '../../reducers/admin/user/selector'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { getScopeTypeService } from '../../reducers/admin/scope/service'
import { selectScopeState } from '../../reducers/admin/scope/selector'

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

interface Props {
  open: boolean
  handleClose: any
  adminState?: any
  createUserAction?: any
  authState?: any
  patchUser?: any
  fetchUserRole?: any
  closeViewModel: any
  adminUserState?: any
  fetchStaticResource?: any
  getScopeTypeService?: any
  adminScopeState?: any
}
const mapStateToProps = (state: any): any => {
  return {
    adminState: selectAdminState(state),
    authState: selectAuthState(state),
    adminUserState: selectAdminUserState(state),
    adminScopeState: selectScopeState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  createUserAction: bindActionCreators(createUserAction, dispatch),
  fetchUserRole: bindActionCreators(fetchUserRole, dispatch),
  fetchStaticResource: bindActionCreators(fetchStaticResource, dispatch),
  getScopeTypeService: bindActionCreators(getScopeTypeService, dispatch)
})

const CreateUser = (props: Props) => {
  const {
    open,
    handleClose,
    closeViewModel,
    authState,
    fetchUserRole,
    adminUserState,
    fetchStaticResource,
    createUserAction,
    getScopeTypeService,
    adminScopeState
  } = props

  const classes = useStyles()
  const classesx = useStyle()
  const [openCreateaUserRole, setOpenCreateUserRole] = React.useState(false)
  const [state, setState] = React.useState({
    name: '',
    avatar: '',
    userRole: '',
    scopeType: [],
    formErrors: {
      name: '',
      avatar: '',
      userRole: '',
      scopeType: ''
    }
  })

  const [openWarning, setOpenWarning] = React.useState(false)
  const [error, setError] = React.useState('')

  const user = authState.get('user')
  const userRole = adminUserState.get('userRole')
  const userRoleData = userRole ? userRole.get('userRole') : []
  const staticResource = adminUserState.get('staticResource')
  const staticResourceData = staticResource.get('staticResource')
  const adminScopes = adminScopeState.get('scopeType').get('scopeType')

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchUserRole()
    }
    const role = userRole ? userRole.get('updateNeeded') : false
    if (role === true && user.id) fetchData()
    if (user.id && staticResource.get('updateNeeded')) {
      fetchStaticResource()
    }
    if (adminScopeState.get('scopeType').get('updateNeeded') && user.id) {
      getScopeTypeService()
    }
  }, [adminUserState, user])

  const createUserRole = () => {
    setOpenCreateUserRole(true)
  }

  const handleUserRoleClose = () => {
    setOpenCreateUserRole(false)
  }

  const handleCloseWarning = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenWarning(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let temp = state.formErrors
    switch (name) {
      case 'name':
        temp.name = value.length < 2 ? 'Name is required!' : ''
        break
      case 'avatar':
        temp.avatar = value.length < 2 ? 'Avatar is required!' : ''
        break
      case 'userRole':
        temp.userRole = value.length < 2 ? 'User role is required!' : ''
        break

      default:
        break
    }
    setState({ ...state, [name]: value, formErrors: temp })
  }

  const handleSubmit = () => {
    const data = {
      name: state.name,
      avatarId: state.avatar,
      userRole: state.userRole,
      scopeType: state.scopeType
    }
    let temp = state.formErrors
    if (!state.name) {
      temp.name = "Name can't be empty"
    }
    if (!state.avatar) {
      temp.avatar = "Avatar can't be empty"
    }
    if (!state.userRole) {
      temp.userRole = "User role can't be empty"
    }
    if (!state.scopeType.length) {
      temp.scopeType = "Scope type can't be empty"
    }
    setState({ ...state, formErrors: temp })
    if (formValid(state, state.formErrors)) {
      createUserAction(data)
      closeViewModel(false)
      setState({
        ...state,
        name: '',
        avatar: '',
        userRole: '',
        scopeType: []
      })
    } else {
      setError('Please fill all required field')
      setOpenWarning(true)
    }
  }

  return (
    <React.Fragment>
      <Drawer classes={{ paper: classesx.paper }} anchor="right" open={open} onClose={handleClose(false)}>
        <Container maxWidth="sm" className={classes.marginTp}>
          <DialogTitle id="form-dialog-title" className={classes.texAlign}>
            Create New User
          </DialogTitle>
          <label>Name</label>
          <Paper component="div" className={state.formErrors.name.length > 0 ? classes.redBorder : classes.createInput}>
            <InputBase
              className={classes.input}
              name="name"
              placeholder="Enter name"
              style={{ color: '#fff' }}
              autoComplete="off"
              value={state.name}
              onChange={handleChange}
            />
          </Paper>
          <label>Avatar</label>
          <Paper
            component="div"
            className={state.formErrors.avatar.length > 0 ? classes.redBorder : classes.createInput}
          >
            <FormControl fullWidth>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={state.avatar}
                fullWidth
                displayEmpty
                onChange={handleChange}
                className={classes.select}
                name="avatar"
                MenuProps={{ classes: { paper: classesx.selectPaper } }}
              >
                <MenuItem value="" disabled>
                  <em>Select avatar</em>
                </MenuItem>
                {staticResourceData.map((el) => (
                  <MenuItem value={el.name} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
          <label>User role</label>
          <Paper
            component="div"
            className={state.formErrors.userRole.length > 0 ? classes.redBorder : classes.createInput}
          >
            <FormControl fullWidth>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={state.userRole}
                fullWidth
                displayEmpty
                onChange={handleChange}
                className={classes.select}
                name="userRole"
                MenuProps={{ classes: { paper: classesx.selectPaper } }}
              >
                <MenuItem value="" disabled>
                  <em>Select user role</em>
                </MenuItem>
                {userRoleData.map((el) => (
                  <MenuItem value={el.role} key={el.role}>
                    {el.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
          <DialogContentText className={classes.marginBottm}>
            {' '}
            <span className={classes.select}>Don't see user role? </span>{' '}
            <a href="#h" className={classes.textLink} onClick={createUserRole}>
              Create One
            </a>{' '}
          </DialogContentText>

          <label>Grant Scope</label>
          <Paper
            component="div"
            className={state.formErrors.scopeType.length > 0 ? classes.redBorder : classes.createInput}
          >
            <Autocomplete
              onChange={(event, value) =>
                setState({ ...state, scopeType: value, formErrors: { ...state.formErrors, scopeType: '' } })
              }
              multiple
              className={classes.selector}
              classes={{ paper: classesx.selectPaper, inputRoot: classes.select }}
              id="tags-standard"
              options={adminScopes}
              disableCloseOnSelect
              filterOptions={(options) =>
                options.filter((option) => state.scopeType.find((scopeType) => scopeType.type === option.type) == null)
              }
              getOptionLabel={(option) => option.type}
              renderInput={(params) => <TextField {...params} placeholder="Select scope" />}
            />
          </Paper>

          <DialogActions>
            <Button className={classesx.saveBtn} onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={handleClose(false)} className={classesx.saveBtn}>
              Cancel
            </Button>
          </DialogActions>
          <Snackbar
            open={openWarning}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseWarning} severity="warning">
              {' '}
              {error}{' '}
            </Alert>
          </Snackbar>
        </Container>
      </Drawer>
      <CreateUserRole open={openCreateaUserRole} handleClose={handleUserRoleClose} />
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser)
