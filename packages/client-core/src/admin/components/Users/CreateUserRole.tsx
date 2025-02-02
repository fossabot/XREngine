import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React from 'react'
import { UserRoleService } from '../../services/UserRoleService'
import { useUserStyle, useUserStyles } from './styles'

interface Props {
  open: boolean
  handleClose: any
}

const createUser = (props: Props) => {
  const { open, handleClose } = props
  const classes = useUserStyles()
  const classx = useUserStyle()
  const [role, setRole] = React.useState('')

  const createUserRole = async () => {
    await UserRoleService.createUserRoleAction({ role })
    handleClose()
    setRole('')
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classx.paperDialog }}
      >
        <DialogTitle id="form-dialog-title">Create new user role </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="role"
            label="User Role"
            type="text"
            fullWidth
            value={role}
            className={classes.marginBottm}
            onChange={(e) => setRole(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createUserRole} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default createUser
