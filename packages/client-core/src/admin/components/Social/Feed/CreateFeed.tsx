import React, { useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DialogActions from '@material-ui/core/DialogActions'
import Container from '@material-ui/core/Container'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useStyles, useStyle } from './styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import { formValid } from './validation'
import { createFeed } from '../../../reducers/admin/Social/feeds/service'
import { any } from 'prop-types'

interface Props {
  open: boolean
  handleClose: (open: boolean) => void
  closeViewModel: (open: boolean) => void
  createFeed?: (data: Record<string, string>) => void
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  createFeed: bindActionCreators(createFeed, dispatch)
})

const CreateFeeds = (props: Props) => {
  const { open, handleClose, createFeed, closeViewModel } = props
  const classes = useStyles()
  const classesx = useStyle()
  const [state, setState] = useState({
    title: '',
    description: '',
    video: '',
    preview: '',
    formErrors: {
      title: '',
      description: '',
      video: '',
      preview: ''
    }
  })

  const handleChange = (e) => {
    const { name } = e.target
    const value = e.target.files ? e.target.files[0] : e.target.value
    let temp = state.formErrors
    switch (name) {
      case 'title':
        temp.title = value.length < 2 ? 'Title is required!' : ''
        break
      case 'description':
        temp.description = value.length < 2 ? 'Description is required!' : ''
        break
      case 'video':
        temp.video = value.length < 2 ? 'Video is required!' : ''
        break
      case 'preview':
        temp.preview = value.length < 2 ? 'Preview is required!' : ''
        break
      default:
        break
    }
    setState({ ...state, [name]: value, formErrors: temp })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    let temp = state.formErrors
    if (!state.title) {
      temp.title = "Title can't be empty"
    }
    if (!state.description) {
      temp.description = 'Description is required'
    }
    if (!state.video) {
      temp.video = 'Video is required'
    }
    if (!state.preview) {
      temp.preview = 'Manifest is required'
    }
    setState({ ...state, formErrors: temp })
    if (formValid(state, state.formErrors)) {
      createFeed({ title: state.title, description: state.description, video: state.video, preview: state.preview })
      // createArMedia({ type, title }, { manifest, audio, dracosis, preview })
      // closeViewModel(false)
      // setState({
      //   ...state,
      //   title: '',
      //   type: '',
      //   audio: '',
      //   manifest: '',
      //   dracosis: '',
      //   preview: ''
      // })
    }
  }

  console.log(state)

  return (
    <React.Fragment>
      <Drawer classes={{ paper: classesx.paper }} anchor="right" open={open} onClose={() => closeViewModel(false)}>
        <Container maxWidth="sm" className={classes.marginTp}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <DialogTitle id="form-dialog-title" className={classes.texAlign}>
              Create New Feed
            </DialogTitle>
            <label>Title</label>
            <Paper
              component="div"
              className={state.formErrors.title.length > 0 ? classes.redBorder : classes.createInput}
            >
              <InputBase
                className={classes.input}
                name="title"
                placeholder="Enter title"
                style={{ color: '#fff' }}
                autoComplete="off"
                value={state.title}
                onChange={handleChange}
              />
            </Paper>
            <label>Description</label>
            <Paper
              component="div"
              className={state.formErrors.description.length > 0 ? classes.redBorder : classes.createInput}
            >
              <InputBase
                className={classes.input}
                name="description"
                placeholder="Enter description"
                style={{ color: '#fff' }}
                autoComplete="off"
                value={state.description}
                onChange={handleChange}
              />
            </Paper>
            <span>Preview image</span>
            <Paper
              component="div"
              className={state.formErrors.preview.length > 0 ? classes.redBorder : classes.createInput}
            >
              <Button variant="contained" className={classes.btn} startIcon={<PhotoCamera />}>
                <input
                  name="preview"
                  onChange={handleChange}
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                />
              </Button>
            </Paper>

            <span>Video</span>
            <Paper
              component="div"
              className={state.formErrors.video.length > 0 ? classes.redBorder : classes.createInput}
            >
              <Button variant="contained" className={classes.btn} startIcon={<CloudUploadIcon />}>
                <input
                  name="video"
                  onChange={handleChange}
                  accept="video/*"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                />
              </Button>
            </Paper>

            <DialogActions>
              <Button
                className={classesx.saveBtn}
                type="submit"
                // onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button onClick={() => closeViewModel(false)} className={classesx.saveBtn}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Container>
      </Drawer>
    </React.Fragment>
  )
}

export default connect(null, mapDispatchToProps)(CreateFeeds)
