import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { FiltersType } from '../../types/'
import { useSearchParams } from 'react-router-dom'
import { useDataContext } from '../../context'

const columns: GridColDef[] = [
  { field: 'created_dt', headerName: 'Created Date', width: 150 },
  { field: 'data_source_modified_dt', headerName: 'Modified Date', width: 150 },
  { field: 'entity_type', headerName: 'Entity', width: 150 },
  { field: 'operating_status', headerName: 'Operating Status', width: 150 },
  { field: 'legal_name', headerName: 'Legal Name', width: 200 },
  { field: 'dba_name', headerName: 'DBA Name', width: 200 },
  { field: 'physical_address', headerName: 'Physical Address', width: 250 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'usdot_number', headerName: 'DOT', width: 150 },
  { field: 'mc_mx_ff_number', headerName: 'MC/MX/FF', width: 150 },
  { field: 'power_units', headerName: 'Power Units', width: 150 },
  { field: 'out_of_service_date', headerName: 'Out of Service Date', width: 150 },
]

const DataTable: React.FC = () => {
  const { filters, filteredData } = useDataContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState<number>(Number(searchParams.get('page') || 0))
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('pageSize') || 20))

  const handlePageChange = (paginationModel: GridPaginationModel) => {
    setPage(paginationModel.page)
    setPageSize(paginationModel.pageSize)
  }

  useEffect(() => {
    const params: { [key: string]: string } = {}
    params.page = page.toString()

    if (pageSize) params.pageSize = pageSize.toString()

    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof FiltersType]) {
        params[key] = filters[key as keyof FiltersType] as string
      }
    })

    setSearchParams(params)
  }, [filters, page, pageSize, setSearchParams])

  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return (
    <div style={{ height: 600, width: '100%', marginTop: '32px', marginBottom: '32px' }}>
      <DataGrid
        rows={paginatedData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: page, pageSize: pageSize },
          },
        }}
        onPaginationModelChange={handlePageChange}
        pageSizeOptions={[20, 50]}
        pagination
        paginationMode="server"
        rowCount={filteredData.length}
        disableColumnFilter
      />
    </div>
  )
}

export default DataTable
