import * as XLSX from 'xlsx'
import { DataRowType } from '../types/DataRowType'
import formatDateString from './formatDateString'

export const readXLSXFile = (url: string): Promise<DataRowType[]> => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.arrayBuffer()
    })
    .then((arrayBuffer) => {
      const data = new Uint8Array(arrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData: DataRowType[] = XLSX.utils.sheet_to_json(worksheet)

      // Convert Excel serial dates to string dates
      const processedData = jsonData
        .map((row) => {
          if (row.out_of_service_date) {
            row.out_of_service_date = convertExcelDate(Number(row.out_of_service_date))
          }
          return row
        })
        .map((row) => {
          return {
            ...row,
            created_dt: formatDateString(row.created_dt),
            data_source_modified_dt: formatDateString(row.data_source_modified_dt),
            out_of_service_date: formatDateString(row.out_of_service_date),
          }
        })

      return processedData
    })
    .catch((error) => {
      console.error('Error reading XLSX file:', error)
      throw error
    })
}

const convertExcelDate = (serial: number): string => {
  const excelBaseDate = new Date(Date.UTC(1899, 11, 30))
  const utc_days = Math.floor(serial)
  const fractional_day = serial - utc_days
  const date_info = new Date(excelBaseDate.getTime() + utc_days * 86400 * 1000)

  const total_seconds = Math.floor(86400 * fractional_day)
  const hours = Math.floor(total_seconds / 3600)
  const minutes = Math.floor((total_seconds % 3600) / 60)
  const seconds = total_seconds % 60

  const resultDate = new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds,
  )

  return resultDate.toISOString().split('T')[0]
}
