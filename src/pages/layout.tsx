import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="size-full bg-center bg-cover bg-no-repeat relative" style={{ backgroundImage: 'url(/imgs/bg.png)' }}>
      <img src="/imgs/logo.png" alt="logo" className="w-32 absolute top-[26px] left-[34px] pointer-events-none" />
      <Outlet />
    </div>
  )
}