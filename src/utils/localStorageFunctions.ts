import { FiltersType } from '../types'

const saveFiltersToLocalStorage = (filters: FiltersType, item: string) => {
  localStorage.setItem(item, JSON.stringify(filters))
}

const loadFiltersFromLocalStorage = (item: string) => {
  const savedFilters = localStorage.getItem(item)
  return savedFilters ? JSON.parse(savedFilters) : {}
}

export { saveFiltersToLocalStorage, loadFiltersFromLocalStorage }
