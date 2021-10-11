import { User } from '@xrengine/common/src/interfaces/User'
import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { useAuthState } from '../../../user/reducers/auth/AuthState'
import { AuthService } from '../../../user/reducers/auth/AuthService'
import { DialogAction } from '../../reducers/dialog/DialogActions'
import SignIn from '../../../user/components/Auth/Login'
import Dropdown from '../../../user/components/Profile/ProfileDropdown'
import { useTranslation } from 'react-i18next'
import styles from './NavUserWidget.module.scss'
import Button from '@material-ui/core/Button'

interface Props {
  login?: boolean
}

const NavUserBadge = (props: Props): any => {
  const { login } = props
  const dispatch = useDispatch()

  const { t } = useTranslation()
  useEffect(() => {
    handleLogin()
  }, [])

  const handleLogout = () => {
    dispatch(AuthService.logoutUser())
  }

  const handleLogin = () => {
    const params = new URLSearchParams(document.location.search)
    const showLoginDialog = params.get('login')
    if (showLoginDialog === String(true)) {
      dispatch(DialogAction.dialogShow({ children: <SignIn /> }))
    }
  }
  const auth = useAuthState()
  const isLoggedIn = auth.isLoggedIn.value
  const user = auth.user
  // const userName = user && user.name

  return (
    <div className={styles.userWidget}>
      {isLoggedIn && (
        <div className={styles.flex}>
          <Dropdown avatarUrl={user && user.avatarUrl} auth={auth} logoutUser={handleLogout} />
        </div>
      )}
      {!isLoggedIn && login === true && (
        <Button
          variant="contained"
          color="primary"
          className={styles.loginButton}
          onClick={() =>
            dispatch(
              DialogAction.dialogShow({
                children: <SignIn />
              })
            )
          }
        >
          {t('common:navUserWidget.login')}
        </Button>
      )}
    </div>
  )
}

export default NavUserBadge
