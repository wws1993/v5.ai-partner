import { Outlet } from 'react-router-dom'
import { Nav } from '@/components/Nav'

export function Layout() {
  return (
    <div className="size-full bg-center bg-cover bg-no-repeat relative" style={{ backgroundImage: 'url(/imgs/bg.png)' }}>
      <img src="/imgs/logo.png" alt="logo" className="w-32 absolute top-[26px] left-[34px] pointer-events-none" />

      <div id="view" className="size-full flex justify-center items-stretch md:items-center">
        {/* PC端容器 */}
        <div id="container" className="relative flex h-full w-full items-stretch justify-center md:w-6xl">
          {/* 导航栏 */}
          <Nav />
          {/* 内容区域 */}
          <Outlet />
        </div>
      </div>
    </div >
  )
}