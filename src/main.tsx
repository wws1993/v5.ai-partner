// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import '@/animations'
import { Layout } from '@/pages/layout'
import { Login } from '@/pages/login'
import { Demo } from '@/pages/demo'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Login /> },   // /
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