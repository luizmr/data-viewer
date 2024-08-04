import React, { useState } from 'react'
import { Container } from '@mui/material'
import FileUploader from '../../components/FileUploader'
import Filters from '../../components/Filters'
import DataTable from '../../components/DataTable'
import { readXLSXFile } from '../../utils/readXLSX'
import { DataRowType, FiltersType } from '../../types/'
import { isValidFile } from '../../utils/isValidFile'

const DataViewer: React.FC = () => {
  const [data, setData] = useState<DataRowType[]>([])
  const [filters, setFilters] = useState<FiltersType>({})
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false)
  const [fileErrorMessage, setFileErrorMessage] = useState<string>('')
  const noTableMessage = isFileLoading
    ? 'File is being loaded ...'
    : fileErrorMessage || 'No File Uploaded!'

  const handleFileUpload = async (file: File) => {
    setFileErrorMessage('')
    setIsFileLoading(true)

    try {
      const jsonData = await readXLSXFile(file)
      if (isValidFile(jsonData)) {
        setData(jsonData)
      } else {
        throw new Error('File not able to be read!')
      }
    } catch {
      setFileErrorMessage('An error occurred while loading your file. Try again, please!')
    } finally {
      setIsFileLoading(false)
    }
  }

  const handleFileRemoval = () => {
    setData([])
  }

  const handleApplyFilters = (appliedFilters: FiltersType) => {
    setFilters(appliedFilters)
  }

  return (
    <Container>
      <FileUploader
        onFileUpload={handleFileUpload}
        onFileRemoval={handleFileRemoval}
        data={data}
        isFileLoading={isFileLoading}
      />
      <Filters onApplyFilters={handleApplyFilters} data={data} />
      <DataTable data={data} filters={filters} noTableMessage={noTableMessage} />
    </Container>
  )
}

export default DataViewer
