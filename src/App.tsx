import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DataViewer from './page/DataViewer'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataViewer />} />
      </Routes>
    </Router>
  )
}

export default App
