import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { DataRowType, FiltersType } from '../types'
import {
  loadFiltersFromLocalStorage,
  saveFiltersToLocalStorage,
} from '../utils/localStorageFunctions'
import { isValidDate } from '../utils/isValidDate'
import { PIVOT_DATA_KEY, USER_FILTERS_KEY } from '../constants'

interface DataContextProps {
  data: DataRowType[]
  setData: React.Dispatch<React.SetStateAction<DataRowType[]>>
  filteredData: DataRowType[]
  setFilteredData: React.Dispatch<React.SetStateAction<DataRowType[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  errorMessage: string
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  filters: FiltersType
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>
  pivotSharedData: Record<string, any>
  setPivotSharedData: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataRowType[]>([])
  const [filteredData, setFilteredData] = useState<DataRowType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [filters, setFilters] = useState<FiltersType>(loadFiltersFromLocalStorage(USER_FILTERS_KEY))
  const [pivotSharedData, setPivotSharedData] = useState<FiltersType>(
    loadFiltersFromLocalStorage(PIVOT_DATA_KEY),
  )

  const temporaryFilteredData = data.filter((row) => {
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

  useEffect(() => {
    setFilteredData(temporaryFilteredData)
  }, [temporaryFilteredData])

  useEffect(() => {
    saveFiltersToLocalStorage(pivotSharedData, PIVOT_DATA_KEY)
  }, [pivotSharedData])

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        filteredData,
        setFilteredData,
        isLoading,
        setIsLoading,
        errorMessage,
        setErrorMessage,
        filters,
        setFilters,
        pivotSharedData,
        setPivotSharedData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}
