import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataRowType, FiltersType } from '../../types/'
import { useSearchParams } from 'react-router-dom'
import { Typography } from '@mui/material'
import { isValidDate } from '../../utils/isValidDate'

interface DataTableProps {
  data: DataRowType[]
  filters: FiltersType
  noTableMessage: string
}

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

const DataTable: React.FC<DataTableProps> = ({ data, filters, noTableMessage }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState<number>(Number(searchParams.get('page') || 0))
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('pageSize') || 20))
  const isDataLoaded = data.length !== 0

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

  const handlePageChange = (paginationModel: GridPaginationModel) => {
    setPage(paginationModel.page)
    setPageSize(paginationModel.pageSize)
  }

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((key) => {
      if (
        !filters[key as keyof FiltersType] ||
        (filters[key as keyof FiltersType] as string) === 'ALL'
      )
        return true
      const value = row[key as keyof DataRowType]
      if (typeof value === 'string') {
        if (
          key === 'created_dt' ||
          key === 'data_source_modified_dt' ||
          key === 'out_of_service_date'
        ) {
          const filterDate = new Date(filters[key] as string)
          if (!isValidDate(filterDate)) return false
          const rowDate = new Date(value)
          return isValidDate(rowDate) && rowDate >= filterDate
        }

        return value
          .toLowerCase()
          .includes((filters[key as keyof FiltersType] as string).toLowerCase())
      } else if (typeof value === 'number') {
        if (key === 'power_units') {
          return value === Number(filters[key as keyof FiltersType])
        }
        return String(value).includes(String(filters[key as keyof FiltersType]))
      }
      return false
    })
  })

  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return (
    <div style={{ height: 600, width: '100%', marginTop: '32px', marginBottom: '32px' }}>
      {isDataLoaded ? (
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
        />
      ) : (
        <Typography variant="h5" textAlign="center">
          {noTableMessage}
        </Typography>
      )}
    </div>
  )
}

export default DataTable
