import React, { useState } from 'react'
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material'

interface PageHeaderProps {
  title: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  const [open, setOpen] = useState(false)

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setOpen(true)
    } catch (error) {
      console.error('Failed to copy the URL:', error)
    }
  }

  const handleCloseSnackbar = () => {
    setOpen(false)
  }

  return (
    <Box marginY={4} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCopyClick}>
        Copy URL
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="URL copied to clipboard"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          URL copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PageHeader
