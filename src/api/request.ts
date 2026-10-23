import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiResponse } from '@/typings'

/** 创建带拦截器的 axios 实例（强制 XHR，便于 Mock.js 拦截） */
const request: AxiosInstance = axios.create({
  /** 接口前缀 */
  baseURL: '/',
  /** 超时毫秒 */
  timeout: 15000,
  /** 默认 JSON（浏览器默认 XHR，可被 Mock.js 劫持） */
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截：可在此注入 token 等 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config
  },
  (error: unknown) => Promise.reject(error),
)

/** 响应拦截：统一解包业务 data，非 0 码抛错 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    /** 业务响应体 */
    const payload = response.data
    if (payload && typeof payload === 'object' && 'code' in payload) {
      if (payload.code === 0) {
        return payload.data as never
      }
      return Promise.reject(new Error(payload.message || '请求失败'))
    }
    return response.data as never
  },
  (error: unknown) => Promise.reject(error),
)

export default request
