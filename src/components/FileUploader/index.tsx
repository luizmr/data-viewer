import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import { DataRowType } from '../../types'

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  onFileRemoval: () => void
  data: DataRowType[]
  isFileLoading: boolean
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  onFileRemoval,
  data,
  isFileLoading,
}) => {
  const isDataLoaded = data.length !== 0
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <Box marginY={4} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h4" gutterBottom>
        FMSCA Data Viewer
      </Typography>
      {isDataLoaded ? (
        <Button variant="outlined" color="error" onClick={onFileRemoval}>
          Remove File
        </Button>
      ) : (
        <Button variant="contained" component="label" disabled={isFileLoading}>
          Upload File
          <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleFileChange} />
        </Button>
      )}
    </Box>
  )
}

export default FileUploader
