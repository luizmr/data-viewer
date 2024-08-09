import React from 'react'
import { Container } from '@mui/material'
import Filters from '../../components/Filters'
import DataTable from '../../components/DataTable'
import PageHeader from '../../components/PageHeader'
import OutOfServiceBarChart from '../../components/OutOfServiceBarChart'

const TableDataViewer: React.FC = () => {
  return (
    <Container>
      <PageHeader title={'Main Table Data Viewer'} />
      <Filters />
      <DataTable />
      <OutOfServiceBarChart />
    </Container>
  )
}

export default TableDataViewer
