import * as React from 'react'
import {
  Avatar,
  BadgeCountObject,
  Button,
  ButtonVariant,
  Divider,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core'
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon'
import BellIcon from '@patternfly/react-icons/dist/esm/icons/bell-icon'
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon'
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon'
import imgAvatar from '../bgimages/avatarImg.svg'
import { useAuth } from '../User/AuthProvider'
import { Redirect, useLocation } from 'react-router-dom'

export interface HeaderToolbarProps {
  notificationCount: number
  notificationDrawerExpanded
  setNotificationDrawerExpanded
}

const HeaderToolbar: React.FunctionComponent<HeaderToolbarProps> = ({
  notificationCount = 0,
  notificationDrawerExpanded,
  setNotificationDrawerExpanded
}: HeaderToolbarProps) => {
  let auth = useAuth()
  let location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = React.useState(false)
  const [isFullKebabDropdownOpen, setIsFullKebabDropdownOpen] = React.useState(false)

  const badgeCountObjectNotRead: BadgeCountObject = {
    isRead: false,
    count: notificationCount,
    className: 'custom-badge-unread'
  }

  const toggleNotificationDrawer = () => {
    setNotificationDrawerExpanded(!notificationDrawerExpanded)
  }

  const onDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const onDropdownSelect = () => {
    setIsDropdownOpen(false)
  }

  const onKebabDropdownToggle = () => {
    setIsKebabDropdownOpen(!isKebabDropdownOpen)
  }

  const onKebabDropdownSelect = () => {
    setIsKebabDropdownOpen(false)
  }

  const onFullKebabDropdownToggle = () => {
    setIsFullKebabDropdownOpen(!isFullKebabDropdownOpen)
  }

  const onFullKebabDropdownSelect = () => {
    setIsFullKebabDropdownOpen(false)
  }

  const adminDropdownItems = (
    <>
      <DropdownItem key='admin user management'>
        <Button component='a' href='/admin' variant='link'>
          User Management
        </Button>
      </DropdownItem>
      <DropdownItem key='admin logout'>
        <Button component='a' onClick={() => auth.logOut()} variant='link'>
          Logout
        </Button>
      </DropdownItem>
    </>
  )

  const guestDropdownItems = (
    <>
      <DropdownItem key='guest login'>
        <Button component='a' href='/login' variant='link'>
          Login
        </Button>
      </DropdownItem>
      <DropdownItem key='guest new user'>
        <Button component='a' href='/signin' variant='link'>
          Sign In
        </Button>
      </DropdownItem>
    </>
  )

  const userDropdownItems = (
    <>
      <DropdownItem key='user profile'>My profile</DropdownItem>
      <DropdownItem key='user logout'>
        <Button component='a' onClick={() => auth.logOut()} variant='link'>
          Logout
        </Button>
      </DropdownItem>
    </>
  )

  function getUserDropdownItems() {
    //let isLoggedIn = false;
    //let isLoggedAdmin = false;
    if (auth.isLogged()) {
      if (auth.isAdmin()) {
        return adminDropdownItems
      } else {
        return userDropdownItems
      }
    } else {
      return guestDropdownItems
    }
  }

  return (
    <Toolbar id='toolbar' isFullHeight isStatic>
      <ToolbarContent>
        <ToolbarGroup variant='icon-button-group' align={{ default: 'alignRight' }} spacer={{ default: 'spacerNone', md: 'spacerMd' }}>
          <ToolbarItem>
            <Button
              aria-label='Notifications'
              variant={ButtonVariant.plain}
              icon={<BellIcon />}
              onClick={toggleNotificationDrawer}
              countOptions={badgeCountObjectNotRead}
            />
          </ToolbarItem>
          <ToolbarGroup variant='icon-button-group' visibility={{ default: 'hidden', lg: 'visible' }}>
            <ToolbarItem>
              <Button
                component='a'
                href='https://basil-the-fusa-spice.readthedocs.io/'
                target='_blank'
                aria-label='Help'
                variant={ButtonVariant.plain}
                icon={<QuestionCircleIcon />}
              />
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarGroup>
        <ToolbarItem visibility={{ default: 'hidden', md: 'visible' }}>
          <Dropdown
            isOpen={isDropdownOpen}
            onSelect={onDropdownSelect}
            onOpenChange={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
            popperProps={{ position: 'right' }}
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={onDropdownToggle}
                isFullHeight
                isExpanded={isDropdownOpen}
                icon={<Avatar src={imgAvatar} alt='' />}
              >
                {auth.isLogged() ? auth.userEmail : 'Guest'}
              </MenuToggle>
            )}
          >
            <DropdownList>{getUserDropdownItems()}</DropdownList>
          </Dropdown>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )
}

export { HeaderToolbar }
