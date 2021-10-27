import React from 'react'
import {
  Accessibility,
  CalendarViewDay,
  Code,
  Dashboard as DashboardIcon,
  DirectionsRun,
  GroupAdd,
  NearMe,
  PersonAdd,
  PhotoAlbum,
  PhotoLibrary,
  Settings,
  SupervisorAccount,
  Toys,
  Casino,
  Shuffle
} from '@material-ui/icons'
import RemoveFromQueueIcon from '@material-ui/icons/RemoveFromQueue'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople'

export const SidebarItems = (
  allowedRoutes,
  openLocation,
  openUser,
  openScene,
  openSetting,
  setOpenLocation,
  setOpenUser,
  setOpenScene,
  setOpenSetting
) => [
  {
    items: [
      {
        name: 'user:dashboard.dashboard',
        path: '/admin',
        icon: <DashboardIcon style={{ color: 'white' }} />
      }
    ]
  },
  {
    items: [
      allowedRoutes.projects && {
        name: 'user:dashboard.projects',
        path: '/admin/projects',
        icon: <Code style={{ color: 'white' }} />
      }
    ]
  },
  {
    items: [
      allowedRoutes.routes && {
        name: 'user:dashboard.routes',
        path: '/admin/routes',
        icon: <Shuffle style={{ color: 'white' }} />
      }
    ]
  },
  {
    title: 'Location',
    open: openLocation,
    icon: <NearMe style={{ color: 'white' }} />,
    click: () => setOpenLocation(!openLocation),
    items: [
      allowedRoutes.location && {
        name: 'user:dashboard.locations',
        path: '/admin/locations',
        icon: <NearMe style={{ color: 'white' }} />
      },
      allowedRoutes.instance && {
        name: 'user:dashboard.instance',
        path: '/admin/instance',
        icon: <DirectionsRun style={{ color: 'white' }} />
      }
    ]
  },
  {
    items: [
      allowedRoutes.party && {
        name: 'user:dashboard.parties',
        path: '/admin/parties',
        icon: <CalendarViewDay style={{ color: 'white' }} />
      }
    ]
  },
  {
    title: 'User',
    open: openUser,
    icon: <SupervisorAccount style={{ color: 'white' }} />,
    click: () => setOpenUser(!openUser),
    items: [
      allowedRoutes.user && {
        name: 'user:dashboard.users',
        path: '/admin/users',
        icon: <SupervisorAccount style={{ color: 'white' }} />
      },
      allowedRoutes.invites && {
        name: 'user:dashboard.invites',
        path: '/admin/invites',
        icon: <PersonAdd style={{ color: 'white' }} />
      },
      allowedRoutes.groups && {
        name: 'user:dashboard.groups',
        path: '/admin/groups',
        icon: <GroupAdd style={{ color: 'white' }} />
      }
    ]
  },
  {
    title: 'Scene',
    open: openScene,
    icon: <Casino style={{ color: 'white' }} />,
    click: () => setOpenScene(!openScene),
    items: [
      allowedRoutes.scene && {
        name: 'user:dashboard.scenes',
        path: '/admin/scenes',
        icon: <PhotoLibrary style={{ color: 'white' }} />
      },
      allowedRoutes.globalAvatars && {
        name: 'user:dashboard.avatars',
        path: '/admin/avatars',
        icon: <Accessibility style={{ color: 'white' }} />
      },
      allowedRoutes.contentPacks && {
        name: 'user:dashboard.content',
        path: '/admin/content-packs',
        icon: <PhotoAlbum style={{ color: 'white' }} />
      }
    ]
  },
  {
    title: 'Setting',
    open: openSetting,
    icon: <Settings style={{ color: 'white' }} />,
    click: () => setOpenSetting(!openSetting),
    items: [
      {
        name: 'user:dashboard.setting',
        path: '/admin/settings',
        icon: <Settings style={{ color: 'white' }} />
      },
      allowedRoutes.bot && {
        name: 'user:dashboard.bots',
        path: '/admin/bots',
        icon: <Toys style={{ color: 'white' }} />
      }
    ]
  }
]

export const SocialSidebarItems = () => [
  {
    title: 'Social',
    items: [
      {
        name: 'social:dashboard.feeds',
        path: '/admin/feeds',
        icon: <ViewModuleIcon style={{ color: 'white' }} />
      },
      {
        name: 'social:dashboard.arMedia',
        path: '/admin/armedia',
        icon: <EmojiPeopleIcon style={{ color: 'white' }} />
      },
      {
        name: 'social:dashboard.creator',
        path: '/admin/creator',
        icon: <RemoveFromQueueIcon style={{ color: 'white' }} />
      }
    ]
  }
]
