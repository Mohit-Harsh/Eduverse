export default function formatFileSize(bytes) {
  if (bytes === 0) return '0 b'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const formattedSize = (bytes / Math.pow(k, i)).toFixed(2) // Format to 2 decimal places

  return `${formattedSize} ${units[i]}`
}
