import { FiltersType } from '../types'

const hasValidKeys = (obj: any): obj is FiltersType => {
  return (
    typeof obj === 'object' &&
    obj.created_dt &&
    typeof obj.created_dt === 'string' &&
    obj.id &&
    typeof obj.id === 'number'
  )
}

export const isValidFile = (arr: any[]): arr is FiltersType[] => {
  return Array.isArray(arr) && arr.every(hasValidKeys)
}
