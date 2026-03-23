export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const baseUrl = getApiBaseUrl()

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath
}
