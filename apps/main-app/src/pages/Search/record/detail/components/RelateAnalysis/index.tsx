
import './index.scss';
import { useEffect, useRef, useState } from 'react'
import { Radio, Pagination } from '@yisa/webui'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { CheckboxValueType } from '@yisa/webui/es/Checkbox/Group'
import ajax, { ApiResponse } from '@/services'
import { Props } from '../../interface'
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import { CaseData } from '../BaseInfo/components/interface'
import Header from './Header'
import Result from './Result'
enum RelateType {
  person = 1,
  vehicle,
  area,
  thing
}
export interface RelateValueType {
  checked: boolean
  value: CheckboxValueType[]
  indeterminate: boolean
}

interface AreaDataType {
  resultType: string,
  clusterType: '1' | '2',
  isGroup: boolean,
  locationId: string
}
interface FormDataType {
  static: number[],//静态关系
  active: number[],//动态关系
  label: number[],//人地关联标签
  pageNo: number,
  pageSize: number,
}
const RelateAnalysis = (props: Props) => {

  const { data } = props

  const prefixCls = 'relate-analysis'
  // 关系类型
  const relateType = [
    { value: 1, label: '人人关系', name: '人人关系' },
    { value: 2, label: '人车关系', name: '人车关系' },
    { value: 3, label: '人地关系', name: '人地关系' },
    { value: 4, label: '人事关系', name: '人事关系' },
  ]

  // 关系类型
  const [relateTypeValue, setRelateTypeValue] = useState<number>(RelateType.person)

  // 修改关系类型
  const handleChangeRelate = (e: RadioChangeEvent) => {
    setRelateTypeValue(e.target.value)
    areaFormDataRef.current = {
      resultType: 'face',
      clusterType: '1',
      isGroup: false,
      locationId: ''
    }
  }

  const defaultFormData: FormDataType = {
    static: [],//静态关系
    active: [],//动态关系
    label: [],//人地关联标签
    pageNo: 1,
    pageSize: 42,
  }
  // 请求参数
  const [formData, setFormData] = useState<FormDataType>(defaultFormData)

  // 结果loading
  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)
  // 结果数据
  const [resultData, setResultData] = useState<ApiResponse<any[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0
  })

  // 人地关系-额外参数
  const areaFormDataRef = useRef<AreaDataType>({
    resultType: 'face',
    clusterType: '1',
    isGroup: false,
    locationId: ''
  })

  // 点击查询按钮
  const handleSearchBtnClick = (data?: FormDataType | AreaDataType, type?: string) => {
    let obj = formData
    if (data) {
      if (!type) {
        // 修改顶部请求参数
        obj = Object.assign({}, formData, {
          ...data,
          pageSize: 42,
          pageNo: 1
        })
        setFormData(obj)
      } else {
        // 修改人地关系-结果页参数
        areaFormDataRef.current = data as AreaDataType
      }
    }
    getResultData(obj)
  }

  // 获取结果数据
  const getResultData = (ajaxData = formData, type = relateTypeValue) => {
    setAjaxLoading(true)
    let ajaxFormData: FormDataType & { relateType: number } = {
      ...ajaxData,
      relateType: type
    }
    if (type == 3) {
      ajaxFormData = {
        ...ajaxFormData,
        ...areaFormDataRef.current,
      }
    }
    if (type == 4) {
      getCaseData(ajaxFormData)
      return
    }
    ajax.record.getRelateData<FormDataType & { relateType: number }, any>({ ...data, ...ajaxFormData })
      .then(res => {
        console.log(res);
        setAjaxLoading(false)
        setResultData(res)
      })
      .catch(err => {
        setAjaxLoading(false)
        setResultData({
          data: [],
          totalRecords: 0,
          usedTime: 0
        })
      })
  }

  // 获取人事关系
  const getCaseData = (formData: FormDataType & { relateType: number }) => {
    ajax.record.getCaseLists<{ idNumber: string, groupId: string[] }, CaseData[]>({ ...data, ...formData })
      .then(res => {
        console.log(res);
        setAjaxLoading(false)
        setResultData(res)
      })
      .catch(err => {
        setAjaxLoading(false)
        setResultData({
          data: [],
          totalRecords: 0,
          usedTime: 0
        })
      })
  }

  // 修改分页
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    let newFormData;
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
    getResultData(newFormData)
  }

  // 分页配置
  const paginationConfig: PaginationProps = {
    showTotal: total => '共' + total + '条',
    disabled: ajaxLoading || !resultData.totalRecords,
    current: formData.pageNo,
    pageSize: formData.pageSize,
    total: resultData.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [42, 98, 210],
    onChange: handlePageChange,
  };

  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-top`}>
      <div className={`${prefixCls}-header`}>
        <div className="relate-type">
          <Radio.Group optionType="button" options={relateType} onChange={handleChangeRelate} value={relateTypeValue} />
        </div>
        <Header
          key={relateTypeValue}
          relateTypeValue={relateTypeValue}
          handleSearchBtnClick={(data: FormDataType) => handleSearchBtnClick(data)}
        />
      </div>
      <div className={`${prefixCls}-content`}>
        <Result
          key={relateTypeValue}
          relateTypeValue={relateTypeValue}
          resultData={resultData}
          handleSearchBtnClick={(data: AreaDataType) => handleSearchBtnClick(data, 'result')}
          ajaxLoading={ajaxLoading}
          formData={formData}
        />
      </div>
    </div>
    <div className={`${prefixCls}-pagination`}>
      <div className="tips">注：按照亲密度排序，最多展示200名人员信息</div>
      <Pagination  {...paginationConfig} />
    </div>
  </div>
}

export default RelateAnalysis