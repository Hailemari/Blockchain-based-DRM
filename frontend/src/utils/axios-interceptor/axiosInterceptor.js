import axios from 'axios'
import url from '../../api/api'
// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json'
    // We initially leave the Authorization header empty
  }
})

// Add a request interceptor to update headers before each request is sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage and update the Authorization header
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error)
  }
)


export default axiosInstance