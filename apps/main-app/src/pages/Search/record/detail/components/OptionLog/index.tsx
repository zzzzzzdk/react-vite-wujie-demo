import React, { useEffect, useState, useRef } from "react";
import './index.scss'
import { TimeRangePicker, } from "@/components";
import { Form, Space, Button, Input, Pagination, Table, Message } from '@yisa/webui'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import character from "@/config/character.config";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import ajax, { ApiResponse } from '@/services'
import { useResetState } from "ahooks";
import { LogFormData, OptionLogData } from '../../interface'
import { useSelector, RootState } from '@/store';
import dayjs from 'dayjs'
import { Props } from '../../interface'
const OptionLog = ({ data }: Props) => {
  const prefixCls = 'record-detail-optionlog';

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });
  let defaultFormData: LogFormData = {
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.logTimeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    account: '',
    organization: '',
    operation: '',
    pageNo: 1,
    pageSize: character.pageSizeOptions[0],
  }
  // 请求loading
  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)

  const [formData, setFormData, resetFormData] = useResetState<LogFormData>(defaultFormData)
  const formDataRef = useRef(formData)
  formDataRef.current = formData

  const [resultData, setResultData] = useState<ApiResponse<OptionLogData[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0,
  })

  // 改变时间范围
  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
    })
  }


  // 查询
  const handleSearchBtnClick = () => {
    let dateRangeMax = Number(pageConfig.logTimeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(formDataRef.current.endDate).diff(dayjs(formDataRef.current.beginDate), 'days') + 1
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    setAjaxLoading(true)
    ajax.record.getOptionLogData<LogFormData & { idNumber: string, groupId: string[], groupPlateId: string[] }, OptionLogData[]>({
      ...formDataRef.current,
      idNumber: data.idNumber,
      groupId: data.groupId,
      groupPlateId: data.groupPlateId
    })
      .then(res => {
        setAjaxLoading(false)
        if (res.data) {
          setResultData(res)
        }
      })
      .catch(err => {
        console.log(err)
        setAjaxLoading(false)
      })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render(_: any, __: any, index: number) {
        return (formData.pageNo - 1) * formData.pageSize + (index + 1)
      },
      width: 70,
    },
    {
      title: '账号',
      dataIndex: 'account',
      width: 100,
    },
    {
      title: '管辖单位',
      dataIndex: 'organizationName',
      width: 220,
    },
    {
      title: '操作内容',
      dataIndex: 'operation',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: 220,
    },
    {
      title: '时间',
      dataIndex: 'operationTime',
      width: 220,
    },
  ]

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    setFormData(Object.assign({}, formData, {
      [type]: e.target.value
    }))
  }

  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData: LogFormData;
    if (pageSize !== formData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...formData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    let tableCell = document.querySelectorAll(`.ysd-table-tr`)
    if (tableCell.length) {
      tableCell[0].scrollIntoView()
    }
    setFormData(newFormData)
    formDataRef.current = newFormData
    handleSearchBtnClick()
  }
  // 分页配置
  const paginationConfig: PaginationProps = {
    disabled: ajaxLoading || !resultData.totalRecords,
    current: formData.pageNo,
    pageSize: formData.pageSize,
    total: resultData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: () => `共 ${resultData.totalRecords} 条`,
    pageSizeOptions: character.pageSizeOptions,
    onChange: handlePageChange,
  };

  useEffect(() => {
    handleSearchBtnClick()
  }, [])

  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <Form layout="vertical">
        <Form.Item
          label="账号"
          className="target-type"
          colon={false}
        >
          <Input value={formData.account} onChange={(e) => handleChangeInput(e, 'account')} />
        </Form.Item>
        <Form.Item
          label="管辖单位"
          className="target-type"
          colon={false}
        >
          <Input value={formData.organization} onChange={(e) => handleChangeInput(e, 'organization')} />
        </Form.Item>
        <Form.Item
          label="操作内容"
          className="target-type"
          colon={false}
        >
          <Input value={formData.operation} onChange={(e) => handleChangeInput(e, 'operation')} />
        </Form.Item>
        <TimeRangePicker
          showTimeType={false}
          beginDate={formData.beginDate}
          endDate={formData.endDate}
          onChange={handleDateChange}
        />
        <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
          <Space size={16}>
            <Button
              loading={ajaxLoading}
              onClick={handleSearchBtnClick}
              type='primary'
            >
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="result-total">共<span>{ajaxLoading ? '···' : resultData.totalRecords}</span>条结果，用时<span>{ajaxLoading ? '···' : resultData.usedTime}</span>秒</div>
      <div className="result-data">
        <Table
          loading={ajaxLoading}
          className="table"
          columns={columns}
          data={resultData.data}
          stripe={true}
          noDataElement={
            <div className="table-no-data">
              {/* <img src={noData} alt="" /> */}
              <div className="no-data-img"></div>
              {/* <Icon type="zanwushujuqianse" /> */}
              <div> 暂无数据</div>
            </div>
          }
        />
      </div>
    </div>
    <div className={`${prefixCls}-pagination`}>
      <Pagination  {...paginationConfig} />
    </div>
  </div>
}
export default OptionLog