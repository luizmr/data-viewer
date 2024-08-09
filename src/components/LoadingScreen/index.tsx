import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading data...
      </Typography>
    </Box>
  )
}

export default LoadingScreen
