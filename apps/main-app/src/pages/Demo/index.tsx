import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from 'antd';
import { MicroApp } from '@/components';
import './index.scss';

const Page = (props: any) => {
  const { currentMenu } = props;
  console.log(currentMenu, 'currentMenu', props);
  const [data, setData] = useState([1, 2, 3, 4]);

  const embedElement = useMemo(() => {
    console.log(currentMenu);
    if (currentMenu?.microAppConfig && currentMenu.microAppConfig.embedType === 'partial') {
      const microAppConfig = currentMenu.microAppConfig;
      console.log('微应用嵌入到主应用中');
      // const container = document.querySelector(microAppConfig.container);
      // if (container) {
      //     return
      // }
      return <MicroApp microAppConfig={microAppConfig} />;
    } else {
      return <Button>默认内容</Button>;
    }
  }, [currentMenu]);

  return (
    <div className='page-content'>
      <div>微前端测测试</div>
      <div className={'micro-app-wrap'}>{embedElement}</div>
    </div>
  );
};

export default Page;
