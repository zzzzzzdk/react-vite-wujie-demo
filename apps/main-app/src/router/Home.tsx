import { useEffect } from "react";
import { useSelector, RootState } from "@/store";
import findHomePath from "@/utils/findHomePath";
import { useLocation, useNavigate } from 'react-router-dom'

function Home() {
  const location = useLocation()
  const navigate = useNavigate();
  const menuData = useSelector((state: RootState) => {
    return state.user.menu
  })

  useEffect(() => {
    // 重定向到当前首页
    if (location.pathname === '/') {
      const homePath = findHomePath(menuData)
      navigate(homePath)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<></>)
}

export default Home