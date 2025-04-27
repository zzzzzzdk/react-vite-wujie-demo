import React, { useEffect, useState } from 'react'
import { Button } from '@yisa/webui';


const Page = (props) => {

  const [data, setData] = useState([1, 2, 3, 4])

  return (
    <div className="page-content error-test">
      <div>错误页面测试</div>
      <div>
        <Button onClick={() => { setData('') }}>点击报错，返回  './#/' 页面</Button>
      </div>
      {
        data.map((item, index) => {
          return <div key={index}>{index}</div>
        })
      }
    </div>
  )
}

export default Page
