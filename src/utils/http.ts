import axios from 'axios'
import store from '@/store'

const http = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://duanhf.cn:8099/',
  timeout: 10 * 1000
})

http.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})
http.interceptors.response.use((response) => {
  store.commit('setLoading', false)
  return response.data
}, (e) => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

export default http
