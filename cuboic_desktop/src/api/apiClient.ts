import axios from 'axios'

export const API_BASE = 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: API_BASE,
})

// Intercept requests to attach the latest JWT token from Electron's secure storage
apiClient.interceptors.request.use(async (config) => {
  try {
    if (window.ipcRenderer) {
      const auth = await window.ipcRenderer.invoke('auth:get-token')
      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
        // Attach outlet context to headers as well for backend generic resolving
        if (auth.outletId) {
            config.headers['X-Outlet-Id'] = auth.outletId
        }
      }
    }
  } catch (error) {
    console.warn("Failed to attach secure token to API request")
  }
  return config
})
