import { useLocation } from "react-router-dom"

export function useIsLogin() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/login'
  return hideNav
}
