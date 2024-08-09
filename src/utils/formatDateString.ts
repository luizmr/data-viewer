const formatDateString = (dateStr: string, isMonthYearFormat = false): string => {
  if (dateStr) {
    const date = new Date(dateStr)

    if (isNaN(date.getTime())) {
      return ''
    }

    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()

    if (isMonthYearFormat) {
      return `${month}/${year}`
    }

    return `${month}/${day}/${year}`
  }

  return ''
}

export default formatDateString
