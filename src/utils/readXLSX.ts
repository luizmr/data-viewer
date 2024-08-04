import * as XLSX from 'xlsx'
import { DataRowType } from '../types/DataRowType'

export const readXLSXFile = (file: File): Promise<DataRowType[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData: DataRowType[] = XLSX.utils.sheet_to_json(worksheet)

      // Convert Excel serial dates to string dates
      const processedData = jsonData.map((row) => {
        if (row.out_of_service_date) {
          row.out_of_service_date = convertExcelDate(Number(row.out_of_service_date))
        }
        return row
      })

      resolve(processedData)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsArrayBuffer(file)
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
