import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, Table, Button, Space } from 'antd';
import { MicroApp } from '@/components';
import './index.scss';

const Page = (props: any) => {
  const { currentMenu } = props;
  console.log(currentMenu, 'currentMenu', props);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size='middle'>
          <Button type='link'>编辑</Button>
          <Button type='link' danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: '管理员',
    },
    {
      key: '2',
      username: 'user',
      email: 'user@example.com',
      role: '普通用户',
    },
  ];

  const handleMicroChange = (data: any) => {
    const { action, data: changeData } = data;
    // console.log('微应用状态变化', data);
    if (action === 'handleDemoSearch') { 
      console.log('主应用接收到事件, 执行检索', changeData);
    }
  };

  const embedElement = useMemo(() => {
    console.log(currentMenu);
    if (currentMenu?.microAppConfig && currentMenu.microAppConfig.embedType === 'partial') {
      const microAppConfig = currentMenu.microAppConfig;
      console.log('微应用嵌入到主应用中');
      // const container = document.querySelector(microAppConfig.container);
      // if (container) {
      //     return
      // }
      return <MicroApp microAppConfig={microAppConfig} onChange={handleMicroChange} />;
    } else {
      return <Button>默认内容</Button>;
    }
  }, [currentMenu]);

  return (
    <div className='page-content'>
      <div className={'micro-app-wrap'}>{embedElement}</div>
      <div className='user-page'>
        <Card title='用户管理' extra={<Button type='primary'>添加用户</Button>}>
          <Table columns={columns} dataSource={data} />
        </Card>
      </div>
    </div>
  );
};

export default Page;
