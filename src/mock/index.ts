import Mock from 'mockjs'
import { setupChatMock } from './chat'

/** Mock 全局超时，模拟网络延迟 */
Mock.setup({
  timeout: '200-400',
})

/** 注册全部 Mock 路由 */
setupChatMock()

export {}
