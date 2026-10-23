import { useIsLogin } from '@/hooks/useIsLogin'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'

export function Layout() {
  const isLogin = useIsLogin()

  return (
    <div className="size-full bg-center bg-cover bg-no-repeat relative" style={{ backgroundImage: 'url(/imgs/bg.png)' }}>
      <img src="/imgs/logo.png" alt="logo" className="w-32 absolute top-[26px] left-[34px] pointer-events-none" />

      <div id="nav" className={classNames(['', isLogin && 'hidden'])}>
        123123
      </div>

      <div id="view" className='size-full flex justify-center items-center'>
        <Outlet />
      </div>
    </div>
  )
}