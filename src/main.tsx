// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import '@/animations'
import { Layout } from '@/pages/layout'
import { Login } from '@/pages/login'
import { Demo } from '@/pages/demo'
import { Chat } from '@/pages/chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Chat /> },   // /
      { path: 'login', element: <Login /> }, // /login
      { path: 'demo', element: <Demo /> },   // /demo
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)