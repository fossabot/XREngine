import React, { Fragment, useState } from 'react'
import UserProfile from './UserIcon'
import UserSettings from './UserSettings'
import Subscription from './Subscription'
import Friends from './Friends'
import Groups from './Groups'
import Party from './Party'
import Invite from './Invite'
import './style.scss'
import {
    Settings,
    AccountCircle,
    Cake,
    Mail,
    SupervisedUserCircle,
    Group,
} from '@material-ui/icons'
import {
    Backdrop,
    Fade,
    Modal,
    Tab,
    Tabs
} from '@material-ui/core'

interface Props {
  open: boolean
  handleClose: any
  avatarUrl: string
  auth: any
}

const TabPanel = (props: any): any => <Fragment>{props.value === props.index && props.children}</Fragment>

const ProfileModal = (props: Props): any => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event: any, newValue: number): void => {
    event.preventDefault()
    setTabIndex(newValue)
  }
  const avatar = (
    <TabPanel value={tabIndex} index={0}>
      <UserProfile avatarUrl={props.avatarUrl} auth={props.auth} />
    </TabPanel>
  )
  const settings = (
    <TabPanel value={tabIndex} index={1}>
      <UserSettings />
    </TabPanel>
  )
  // const account = (
  //   <TabPanel value={tabIndex} index={2}>
  //     Accounts
  //   </TabPanel>
  // )
  const subscription = (
    <TabPanel value={tabIndex} className="subscription-profile" index={2}>
      <Subscription auth={props.auth}/>
    </TabPanel>
  )
  const friends = (
      <TabPanel value={tabIndex} index={3}>
        <Friends auth={props.auth} />
      </TabPanel>
  )
    const groups = (
        <TabPanel value={tabIndex} index={4}>
            <Groups auth={props.auth} />
        </TabPanel>
    )
    const party = (
        <TabPanel value={tabIndex} index={5}>
            <Party auth={props.auth} />
        </TabPanel>
    )
  const invite = (
      <TabPanel value={tabIndex} index={6}>
        <Invite auth={props.auth} />
      </TabPanel>
  )
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="modal"
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={props.open}>
          <div className="paper">
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              aria-label="Login Configure"
            >
              <Tab
                icon={<AccountCircle style={{ fontSize: 30 }} />}
                label="Profile"
              />
              <Tab
                icon={<Settings style={{ fontSize: 30 }} />}
                label="Settings"
              />
              {/* <Tab */}
              {/* icon={<AccountBoxIcon style={{ fontSize: 30 }} />} */}
              {/* label="Accounts" */}
              {/* /> */}
              <Tab
                icon={<SupervisedUserCircle style={{ fontSize: 30 }} />}
                label="Subscription"
              />
              <Tab
                icon={<SupervisedUserCircle style={{ fontSize: 30}} />}
                label="Friends"
              />
            <Tab
                icon={<Group style={{ fontSize: 30}} />}
                label="Groups"
            />
                <Tab
                    icon={<Cake style={{ fontSize: 30}} />}
                    label="Party"
                />
              <Tab
                  icon={<Mail style={{ fontSize: 30}} />}
                  label="Invite"
              />
            </Tabs>
            {avatar}
            {settings}
            {/* {account} */}
            {subscription}
            {friends}
            {groups}
            {party}
            {invite}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

export default ProfileModal
