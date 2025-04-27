import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, Tabs, Divider, Form, DatePicker, TreeSelect, Space } from "@yisa/webui";
import { DoubleBottomOutlined, DoubleTopOutlined } from "@yisa/webui/es/Icon";
import dayjs from 'dayjs'
import { TableListHeaderProps } from './interface';
import type { Dayjs } from 'dayjs';
import { EventValue } from '@yisa/webui/es/DatePicker/picker/interface';

const { RangePicker } = DatePicker

const treeData = [
  {
    title: 'PBG产品事业群',
    value: '001',
    key: '001',
    children: [
      {
        title: '青岛研发资源部',
        value: '0011',
        key: '0011',
      },
      {
        title: '武汉研发资源部',
        value: '0012',
        key: '0012',
        children: [
          {
            title: '后端',
            value: '00121',
            key: '00121'
          },
          {
            title: '前端',
            value: '00122',
            key: '00122'
          },
          {
            title: 'UX',
            value: '00123',
            key: '00123'
          }
        ]
      },
    ],
  },
  {
    title: 'CRI中央研究院',
    value: '002',
    key: '002',
    children: [
      {
        title: '产品部',
        value: '0021',
        key: '0021',
        disabled: true,
      },
      {
        title: '中台资源部',
        value: '0022',
        key: '0022',
      },
    ],
  },
]

const PageHeader = (props: TableListHeaderProps) => {

  const {
    onChange,
    ajaxLoading
  } = props

  const formRef = useRef({
    tabs: '1',
    search_keys: '',
    start_time: '',
    endTime: '',
    tree_ids: '',
  })

  const [form, setForm] = useState<{
    search_keys: string;
    date: [EventValue<Dayjs>, EventValue<Dayjs>];
    tree_ids: string[];
  }>({
    search_keys: '',
    date: [null, null],
    tree_ids: [],
  })

  const [show, setShow] = useState(false)

  const diviChange = () => {
    setShow((e) => !e)
  }

  const tabsChange = (e: string) => {
    formRef.current.tabs = e
    buttonSearch()
  }

  const keysChange = (e: any) => {
    setForm({
      ...form,
      search_keys: e.target.value
    })
  }

  const timeChange = (date: any, dateString: [string, string]) => {
    setForm({
      ...form,
      date: date
    })
  }

  const treeChange = (ids: string[]) => {
    setForm({
      ...form,
      tree_ids: ids
    })
  }

  const resetSearch = () => {
    form.search_keys = ''
    form.date = [null, null]
    form.tree_ids = []
    setForm({
      ...form
    })
    buttonSearch()
  }

  const buttonSearch = () => {
    formRef.current.search_keys = form.search_keys
    formRef.current.start_time = form.date[0] ? dayjs(form.date[0]).format('YYYY-MM-DD HH:mm:ss') : ''
    formRef.current.endTime = form.date[1] ? dayjs(form.date[1]).format('YYYY-MM-DD HH:mm:ss') : ''
    formRef.current.tree_ids = form.tree_ids.join(',')
    onChange?.(formRef.current)
  }



  useEffect(() => {
    onChange?.(formRef.current, true)
  }, []);

  return (
    <>
      <Tabs type='line' defaultActiveKey={formRef.current.tabs} onChange={tabsChange} data={[
        { key: "1", name: '应用管理' },
        { key: "2", name: '档案管理' }
      ]} />

      <div className='search-group-box'>

        <Form layout='vertical' colon={false} inline>
          <Form.Item label='关键字' style={{ width: '318px' }}>
            <Input placeholder='请输入关键字检索' value={form.search_keys} onChange={keysChange} />
          </Form.Item>

          <Form.Item label='发布时间' style={{ width: '338px' }}>
            <RangePicker
              value={form.date}
              showTime
              onChange={timeChange}
            />
          </Form.Item>

          <Form.Item label='发布部门' style={{ width: '318px' }}>
            <TreeSelect
              maxTagCount={1}
              value={form.tree_ids}
              placeholder='请选择部门'
              treeData={treeData}
              onChange={treeChange}
              treeCheckable
            />
          </Form.Item>

          <Form.Item label='隐藏1' style={{ width: '318px', display: show ? '' : 'none' }}>
            <Input placeholder='请输入关键字检索' />
          </Form.Item>

          <Form.Item label='隐藏2' style={{ width: '318px', display: show ? '' : 'none' }}>
            <Input placeholder='请输入关键字检索' />
          </Form.Item>

          <Form.Item label=' '>
            <Space size={10}>
              <Button loading={ajaxLoading} onClick={buttonSearch} type='primary'>查询</Button>
              <Button onClick={resetSearch} type='default'>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '0px' }} orientation="center">
          <span onClick={diviChange} >
            {
              show ? <>收起<DoubleTopOutlined /></> : <>展开<DoubleBottomOutlined /></>
            }
          </span>
        </Divider>
      </div>
    </>
  )
}

export default PageHeader
