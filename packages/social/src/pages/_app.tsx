import React, { useCallback, useEffect, useState } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { ThemeProvider } from 'styled-components'
import { configureStore } from '@xrengine/client-core/src/store'
import { initGA, logPageView } from '@xrengine/client-core/src/common/components/analytics'
import GlobalStyle from '@xrengine/client-core/src/util/GlobalStyle'
import theme from '../../theme'
import { Config } from '@xrengine/common/src/config'
import { SnackbarProvider } from 'notistack'
import { AuthAction } from '@xrengine/client-core/src/user/reducers/auth/AuthAction'
import RouterComp from '../router'
import reducers from '../reducers'
import './styles.scss'
import AppUrlListener from '../components/AppDeepLink'

const App = (): any => {
  const dispatch = useDispatch()

  const initApp = useCallback(() => {
    if (process.env && process.env.NODE_CONFIG) {
      ;(window as any).env = process.env.NODE_CONFIG
    } else {
      ;(window as any).env = ''
    }

    dispatch(AuthAction.restoreAuth())

    initGA()

    logPageView()
  }, [])

  useEffect(initApp, [])

  return (
    <>
      <Helmet>
        <title>{Config.publicRuntimeConfig.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no"
        />
      </Helmet>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <GlobalStyle />
          <RouterComp />
        </SnackbarProvider>
      </ThemeProvider>
    </>
  )
}

const StoreProvider = () => {
  return (
    <Provider store={configureStore(reducers)}>
      <BrowserRouter>
        <AppUrlListener></AppUrlListener>
        <App />
      </BrowserRouter>
    </Provider>
  )
}

export default StoreProvider
