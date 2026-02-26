/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header names {key: string, label: string}
 * @returns {string} CSV formatted string
 */
function convertToCSV(data, headers) {
  if (!data || data.length === 0) return ''

  const headerRow = headers.map((h) => h.label).join(',')

  const dataRows = data.map((row) => {
    return headers
      .map((h) => {
        const value = row[h.key]
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header definitions {key: string, label: string}
 * @param {string} filename - Name of the file (without extension)
 */
export function exportToCSV(data, headers, filename = 'export') {
  const csvContent = convertToCSV(data, headers)
  const timestamp = new Date().toISOString().slice(0, 10)
  downloadCSV(csvContent, `${filename}_${timestamp}.csv`)
}
