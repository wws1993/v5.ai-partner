// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import '@/animations'

async function bootstrap() {
  /** 开发环境启用 Mock.js 拦截 Ajax */
  if (import.meta.env.DEV) {
    await import('@/mock')
  }

  const { Layout } = await import('@/pages/layout')
  const { Login } = await import('@/pages/login')
  const { Demo } = await import('@/pages/demo')
  const { Chat } = await import('@/pages/chat')

  /** 应用路由表 */
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Chat /> },
        { path: 'login', element: <Login /> },
        { path: 'demo', element: <Demo /> },
      ],
    },
  ])

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

void bootstrap()
