/**
 * @author Tanya Vykliuk <tanya.vykliuk@gmail.com>
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import TextField from '@material-ui/core/TextField'
import MessageIcon from '@material-ui/icons/Message'
import styles from './NewComment.module.scss'
import { addCommentToFeed } from '../../reducers/feedComment/service'
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import PopupLogin from '../PopupLogin/PopupLogin'
import { useTranslation } from 'react-i18next'

const mapStateToProps = (state: any): any => {
  return {}
}
const mapDispatchToProps = (dispatch: Dispatch): any => ({
  addCommentToFeed: bindActionCreators(addCommentToFeed, dispatch)
})

interface Props {
  addCommentToFeed?: typeof addCommentToFeed
  feedId: any
}

const NewComment = ({ addCommentToFeed, feedId }: Props) => {
  const [composingComment, setComposingComment] = useState('')
  const [buttonPopup, setButtonPopup] = useState(false)
  const { t } = useTranslation()
  const commentRef = React.useRef<HTMLInputElement>()

  const handleComposingCommentChange = (event: any): void => {
    setComposingComment(event.target.value)
  }
  const handleAddComment = () => {
    composingComment.trim().length > 0 && addCommentToFeed(feedId, composingComment)
    setComposingComment('')
  }
  const checkGuest = useAuthState().authUser?.identityProvider?.type?.value === 'guest' ? true : false

  return (
    <section className={styles.messageContainer}>
      <TextField
        ref={commentRef}
        value={composingComment}
        onChange={handleComposingCommentChange}
        fullWidth
        placeholder={t('social:comment.add')}
      />
      <MessageIcon
        className={styles.sendButton}
        onClick={() => (checkGuest ? setButtonPopup(true) : handleAddComment())}
      />
      <PopupLogin trigger={buttonPopup} setTrigger={setButtonPopup}>
        {/* <IndexPage /> */}
      </PopupLogin>
    </section>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NewComment)
