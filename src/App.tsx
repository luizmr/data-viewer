import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TableDataViewer from './page/TableDataViewer'
import PivotDataViewer from './page/PivotDataViewer'
import Nav from './components/NavSection'
import { DataProvider, useDataContext } from './context'
import { readXLSXFile } from './utils/readXLSX'
import { isValidFile } from './utils/isValidFile'
import LoadingScreen from './components/LoadingScreen'

const AppContent: React.FC = () => {
  const { setData, setFilteredData, isLoading, setIsLoading, setErrorMessage } = useDataContext()

  useEffect(() => {
    handleFileUpload('/data/FMSCA_records.xlsx')
  }, [])

  const handleFileUpload = async (url: string) => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const jsonData = await readXLSXFile(url)

      if (isValidFile(jsonData)) {
        setData(jsonData)
        setFilteredData(jsonData)
      } else {
        throw new Error('File not able to be read!')
      }
    } catch {
      setErrorMessage('An error occurred while loading your file. Try again, please!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Nav />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<TableDataViewer />} />
          <Route path="/pivot" element={<PivotDataViewer />} />
        </Routes>
      )}
    </>
  )
}

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <AppContent />
      </Router>
    </DataProvider>
  )
}

export default App
