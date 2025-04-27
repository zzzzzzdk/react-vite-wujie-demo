import React, { useEffect, useState } from 'react'
import { Button } from '@yisa/webui';
import "./index.scss"

const Page = () => {

  const [data, setData] = useState([1, 2, 3, 4])

  return (
    <div className="page-content">
      <div>微前端测测试</div>
      <div className='micro-app-wrap'>
        <micro-app name='my-app' url='http://localhost:8084/#/home'></micro-app>
      </div>
    </div>
  )
}

export default Page
