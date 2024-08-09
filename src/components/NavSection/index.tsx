import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'

const Nav: React.FC = () => {
  const location = useLocation()

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          component={Link}
          to="/"
          style={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}
        >
          Main Table
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/pivot"
          style={{ fontWeight: location.pathname === '/pivot' ? 'bold' : 'normal' }}
        >
          Pivot Table
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Nav
