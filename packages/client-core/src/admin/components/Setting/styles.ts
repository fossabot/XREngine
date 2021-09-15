import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { BorderBottom } from '@material-ui/icons'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    rootId: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400
    },
    iconButton: {
      padding: 10
    },
    select: {
      color: '#f1f1f1 !important'
    },
    selectPaper: {
      background: '#343b41',
      color: '#f1f1f1'
    },
    divider: {
      height: 28,
      margin: 4
    },
    settings: {
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center',
      background: '#43484F',
      color: '#FFF',
      width: '310px',
      // height: '80vh',
      position: 'fixed',
      padding: '2px 18px 2px 18px'
    },
    settingsHeading: {
      color: 'orange',
      textAlign: 'center',
      marginBottom: '10px',
      fontWeight: 300,
      lineHeight: 1.7,
      fontSize: '20px',
      Border: '2px solid #FFF'
    },
    settingContainer: {
      background: '#343b41',
      width: '370px',
      height: '150px',
      padding: '60px'
    },
    contents: {
      padding: '10px',
      background: '#43484F !important'
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      color: '#f1f1f1'
    },
    createInput: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
      marginBottom: '15px',
      background: '#343b41',
      border: '1px solid #23282c',
      color: '#f1f1f1 !important'
    },
    container: {
      padding: '3px',
      display: 'flex ',
      flexDirection: 'column'
    },
    loginBtn: {
      background: '#F0FFF0'
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    clientSettingsContainer: {
      padding: '50px'
    },
    Paper: {
      padding: '0px 10px 6px 10px',
      background: '#1f252d'
    },
    focused: {
      background: '#15171B'
    },
    autoFocused: {
      background: '#15171B'
    },
    notFocused: {
      background: '#43484F'
    }
  })
)
