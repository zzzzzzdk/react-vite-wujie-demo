import React, { useState, useRef } from 'react'
import { Message, Button, Table, Pagination, PopConfirm, Space, Tooltip, Tag, Switch, Modal } from "@yisa/webui";
import { PaginationProps } from '@yisa/webui/es/Pagination/interface';
import { SorterResult, ColumnProps } from '@yisa/webui/es/Table/interface'
import { createRandom } from "@/utils";
import character from '@/config/character.config';
import { ResultBox } from '@yisa/webui_business'
import ajax, { ApiResponse } from "@/services";
import { Link } from "react-router-dom";
import { useRequest } from 'ahooks';
import Header from './header';
import { TableListProps, ParamsType, ResultRowType } from './interface';
import './index.scss'

const Page = (props: TableListProps) => {

  const {
    params = {},
    onChangePath = () => { },
    isDestroy = () => false
  } = props

  const pageDataRef = useRef({
    // ajax 计数
    ajaxNum: 0,
    // 最后一次搜索使用的数据
    searchForm: {
      sorterField: params.sorterField || 'descend',
      sorterOrder: params.sorterOrder || 'descend',
      pn: params.pn || 1,
      pageSize: params.pageSize || character.pageSizeOptions[0]
    },

    // 是否是分页加载中
    ajaxpnLoading: false,

    // 返回结果默认值
    defaultResultData: {
      data: [],
      totalRecords: 0
    }
  })

  const pageData = pageDataRef.current

  const [searchForm, setSearchForm] = useState<ParamsType>(pageData.searchForm)

  const [resultData, setResultData] = useState<ApiResponse<ResultRowType[]>>(pageData.defaultResultData)

  const [ajaxLoading, setAjaxLoading] = useState(true)

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([])

  const [moreDelVisible, setMoreDelVisible] = React.useState(false)


  const search = () => {
    if (!pageData.ajaxpnLoading) {
      setResultData(pageData.defaultResultData)
    }
    getData(pageData.searchForm)
    setSearchForm({ ...pageData.searchForm })
  }

  const { run } = useRequest(async () => search(), {
    debounceWait: 200,
    manual: true
  });

  const changePn = (pn: number, pageSize: number) => {
    if (pageData.searchForm.pageSize == pageSize) {
      pageData.searchForm.pn = pn
    } else {
      pageData.searchForm.pn = 1
      pageData.searchForm.pageSize = pageSize
    }
    pageData.ajaxpnLoading = true
    search()
  }

  const handleTableChange = (pagination: PaginationProps, sorter: SorterResult) => {
    pageData.searchForm.pn = 1
    pageData.searchForm.sorterField = sorter.field || 'descend'
    pageData.searchForm.sorterOrder = sorter.direction || 'descend'
    run()
  }


  const getData = (formData: ParamsType) => {
    if (isDestroy()) return
    formData = { ...formData }
    onChangePath(formData)
    setAjaxLoading(true)
    setSelectedRowKeys([])
    let _ajaxNum = ++pageData.ajaxNum
    ajax.table.getList<ParamsType, ResultRowType[]>(formData)
      .then((res) => {
        console.log(res)
        if (_ajaxNum === pageData.ajaxNum && !isDestroy()) {
          if (res.data && res.data.length) {
            res.data.forEach((item, index) => {
              item.sortT = formData.pageSize ?? 1 * (formData.pn ?? 1 - 1) + index + 1
              item.idT = createRandom()
            })
            pageData.ajaxpnLoading = false
            setAjaxLoading(false)
            setResultData(res)
          } else {
            if (pageData.searchForm.pn > 1) {
              pageData.searchForm.pn = pageData.searchForm.pn - 1
              search()
            } else {
              pageData.ajaxpnLoading = false
              setAjaxLoading(false)
              setResultData(pageData.defaultResultData)
            }
          }
        }
      })
      .catch((err) => {
        if (_ajaxNum === pageData.ajaxNum && !isDestroy()) {
          setResultData(pageData.defaultResultData)
          pageData.ajaxpnLoading = false
          setAjaxLoading(false)
          Message.error(err.message || '异常');
        }
      });
  }

  const handleRemove = (record: ResultRowType, index: number) => {
    ajax.table.delOne({ id: record.id }).then((res) => {
      Message.success(res.message ?? "删除成功")
      search()
    }).catch((err) => {
      Message.error(err.message)
    });
  };

  const handleRemoveMore = () => {
    return new Promise((resolve, reject) => {
      ajax.table.delOne({ ids: selectedRowKeys.join(',') }).then((res) => {
        setMoreDelVisible(false);
        Message.success(res.message ?? "删除成功")
        resolve(null)
        search()
      }).catch((err) => {
        reject(null)
        Message.error(err.message)
      });
    })
  };

  const createColumns: ColumnProps<ResultRowType>[] = [
    {
      title: '序号',
      dataIndex: 'sortT',
      key: 'sortT',
      width: 65,
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <Tooltip light title={<span>{record.name}  <Link className='link' to={'/tabledetail?name=' + record.name}>关联应用</Link>  </span>}>
          {record.name}
        </Tooltip>
      }
    },
    {
      title: '应用标签',
      dataIndex: 'tag',
      key: 'tag',
      width: 220,
      render: (text, record, index) => {
        return index % 2 == 0 ?
          <Space size={6}>
            <Tag color="#FF5B4D" type="weaken">重点应用</Tag>
            <Tag color="#FF8D1A" type="weaken">授权应用</Tag>
          </Space> : <Space size={6}>
            <Tag color="#00CC66" type="weaken">一般应用</Tag>
            <Tag color="#4D87FF" type="weaken">常用应用</Tag>
          </Space>
      }
    },
    {
      title: '发布部门',
      dataIndex: 'account',
      key: 'account',
      render: (text, record, index) => {
        return 'PBG产品事业群'
      }
    },
    {
      title: '发布日期',
      dataIndex: 'collect_time',
      sorter: true,
      sortOrder: searchForm.sorterField == 'collect_time' ? searchForm.sorterOrder : undefined,
      key: 'collect_time',
    },
    {
      title: '启用',
      dataIndex: 'account1',
      key: 'account1',
      render: (text, record, index) => {
        return <Switch
          checked={index % 2 == 0}
          checkedChildren={'开启'}
          unCheckedChildren={'关闭'}
        />
      }
    },
    {
      title: "操作",
      key: "action",
      render: (text, record, index) => (
        <span className="more_judge">
          <Space size={6}>
            <Button type='table' size='mini'>配置权限</Button>
            <Button type='table' size='mini'>修改</Button>
            <PopConfirm
              title="确认要删除这条数据吗?"
              getPopupContainer={() => document.querySelector('.yisa-table') as HTMLElement}
              onConfirm={() => handleRemove(record, index)}
            >
              <Button type='danger' size='mini'>删除</Button>
            </PopConfirm>
          </Space>
        </span>
      ),
    },
  ]

  const headerChange = (data: any, tag: boolean | undefined) => {
    pageData.searchForm = {
      ...pageData.searchForm,
      ...data
    }
    if (tag) {
      search()
    } else {
      pageData.searchForm.pn = 1
      run()
    }
  }

  return (
    <div className="page-content page-has-bottom  table-list">
      <div className='page-top'>

        <Header ajaxLoading={ajaxLoading} onChange={headerChange} />

        <div className='tool'>
          <div className='left'>
            {
              ajaxLoading && !pageData.ajaxpnLoading ?
                '加载中...' :
                <> 共 <span>{resultData.totalRecords || 0}</span> 条结果</>
            }
          </div>
          <Space className='right' size={10}>
            <Button type='default' size='small' >批量上传</Button>
            <Button type='primary' size='small' >新增</Button>
          </Space>
        </div>


        <ResultBox loading={ajaxLoading} nodata={!resultData.totalRecords}>
          <Table
            stripe={true}
            border={{
              wrapper: true,
              bodyCell: true
            }}
            className='yisa-table'
            onChange={handleTableChange}
            columns={createColumns}
            data={resultData.data}
            rowKey='idT'
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys)
              }
            }}
          />
        </ResultBox>

      </div>
      <div className='page-bottom'>
        <div className='left'>
          已经选择<span>{selectedRowKeys.length}</span>项
          <Button disabled={!selectedRowKeys.length} onClick={() => setMoreDelVisible(true)} type='danger' size='small' >批量删除</Button>
        </div>
        <Pagination
          disabled={!resultData.totalRecords || ajaxLoading}
          showSizeChanger
          showQuickJumper
          showTotal={() => `共 ${resultData.totalRecords} 条`}
          total={resultData.totalRecords}
          current={searchForm.pn}
          pageSize={Number(searchForm.pageSize)}
          pageSizeOptions={character.pageSizeOptions}
          onChange={changePn}
        />

        <Modal
          title='提示'
          visible={moreDelVisible}
          onOk={handleRemoveMore}
          onCancel={() => setMoreDelVisible(false)}
        >
          您已选择{selectedRowKeys.length}项内容，确认要全部删除吗？删除之后不可恢复！
        </Modal>
      </div>
    </div>
  )
}

export default Page
