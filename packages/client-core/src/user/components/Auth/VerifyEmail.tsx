import React, { useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { EmptyLayout } from '../../../common/components/Layout/EmptyLayout'
import { verifyEmail } from '../../reducers/auth/service'
import styles from './Auth.module.scss'
import { useTranslation } from 'react-i18next'

interface Props {
  auth: any
  type: string
  token: string
  verifyEmail: typeof verifyEmail
}

export const VerifyEmail = (props: Props): any => {
  const { verifyEmail, token } = props
  const { t } = useTranslation()

  useEffect(() => {
    verifyEmail(token)
  }, [])

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="md">
        <div className={styles.paper}>
          <Typography component="h1" variant="h5">
            {t('user:auth.verifyEmail.header')}
          </Typography>

          <Box mt={3}>
            <Typography variant="body2" color="textSecondary" align="center">
              {t('user:auth.verifyEmail.processing')}
            </Typography>
          </Box>
        </div>
      </Container>
    </EmptyLayout>
  )
}
