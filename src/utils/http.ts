import axios from 'axios'
import store from '@/store'

const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10 * 1000
})

http.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  return config
})
http.interceptors.response.use((response) => {
  store.commit('setLoading', false)
  return response.data
})

export default http
