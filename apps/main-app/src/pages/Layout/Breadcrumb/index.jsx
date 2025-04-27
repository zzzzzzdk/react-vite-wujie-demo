import React from 'react'
import { useSelector } from 'react-redux';
import { Breadcrumb } from '@yisa/webui'
import { Link } from 'react-router-dom'


export default () => {

  const routerData = useSelector((state) => {
    return state.comment.routerData
  });

  return <Breadcrumb className='layout-breadcrumb'>
    {
      routerData.breadcrumb && routerData.breadcrumb.length ?
        routerData.breadcrumb.map((item, index) => {
          return <Breadcrumb.Item key={index} >
            {
              item.path ?
                <Link target={item.target || '_self'} to={item.path}>
                  {item.text}
                </Link> :
                item.text
            }
          </Breadcrumb.Item>
        }) : null
    }
  </Breadcrumb>
}
