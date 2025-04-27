
import './index.scss'
import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { SearchInput } from '@/components'
import { RightOutlined } from '@yisa/webui/es/Icon'
import { Modal, Tabs } from "@yisa/webui"
import { FormDataProps, } from '../list/interface'
import { useNavigate } from 'react-router'
import ajax, { ApiResponse } from '@/services'
import services from '@/services';
import AddData from './AddData'
import RecordNum from '../RecordNum/index'
import { PlateTypeId } from '@/components/SearchInput/interface'

export interface addDataType {
  type: "personExcel" | "personZip" | "carExcel"
  label: string
  title: string
  width: string
  accept: string
}

const addData: addDataType[] = [
  {
    type: "personExcel",
    label: "人员基本信息",
    title: "上传人员基本信息",
    width: "916px",
    accept: ".xlsx,.xls"
  },
  {
    type: "carExcel",
    label: "车辆基本信息",
    title: "上传车辆基本信息",
    width: "916px",
    accept: ".xlsx,.xls"
  },
  {
    type: "personZip",
    label: "人员照片",
    title: "上传人脸图片压缩包",
    width: "916px",
    accept: ".zip"
  }
]
export interface CaptureData {
  // timeType: "time" | "range";
  // beginDate: string;
  // endDate: string;
  // beginTime: string;
  // endTime: string;
  // /* 数据源 */
  // locationIds: string[];
  // locationGroupIds: string[];
  // offlineIds: (string | number)[];
  noplate: string;
  personName: string;
  idType: string
  idNumber: string
  plateColor:PlateTypeId
  licensePlate: string
  vehicleLabels: string[]
}
export type RecrodSearchTypeRef = {
  handleImportData?: (type: string) => void
  handleAuthApprove?: () => void
}

const RecrodSearch = () => {
  const prefixCls = 'record-search'

  const navigate = useNavigate()

  // 权限审批消息数量
  const [authCount, setAuthCount] = useState<number>(0)

  // 获取消息数量
  const getMsgCount = () => {
    ajax.record.getMsgCount<any, { count: number }>()
      .then(res => {
        if (res.data) {
          setAuthCount(res.data.count)
        }
      })
  }
  const renderFormat = useCallback((valueShow: string[]) => {
    return valueShow.join('-')
  }, [])

  useEffect(() => {
    getMsgCount()
  }, [])

  // 获取检索条件信息展示
  const getConditionsData = (form: { data?: FormDataProps, searchType?: string }) => {
    services.record.getConditionsData<(FormDataProps | CaptureData) & { searchType: string }, ApiResponse<string>>({
      ...(form?.data || {} as FormDataProps),
      searchType: form.searchType || ''
    })
      .then(res => {
        let resultData;
        if (res.data) {
          resultData = { ...form, text: res.data || '' }
        }
        navigate(`/record-list?${encodeURIComponent(JSON.stringify(resultData))}`)
      })
  }

  // 检索
  const handleSearch = useCallback((resultData: any) => {
    console.log(resultData)
    if (resultData.searchType) {
      // 添加历史记录并获取拼接字段信息
      getConditionsData(resultData)
    } else {
      navigate(`/record-list?${encodeURIComponent(JSON.stringify(resultData))}`)
    }
  }, [])

  // 权限审批
  const handleAuthApprove = () => {
    window.open('#/auth-approve')
  }

  /* **********导入数据*********** */
  const [addVisible, setAddVisibel] = useState<boolean>(false)

  // 导入类型
  const [addType, setAddType] = useState<string>(addData[0].type)
  // 打开导入数据弹窗
  const handleImportData = (type: string) => {
    setAddVisibel(true)
    setAddType(addData[0].type)
  }
  const curDataType = addData.find(item => item.type === addType)

  /* **********end*********** */
  // 档案统计
  const [isRecordNum, setIsRecordNum] = useState<boolean>(false)

  // 返回
  const handleGoBack = () => {
    setIsRecordNum(false)
  }

  // 打开档案统计
  const handleOpenRecordNum = useCallback(() => {
    setIsRecordNum(true)
  }, [])

  if (isRecordNum) {
    return <RecordNum handleGoBack={handleGoBack} />
  } else {
    return <div style={{ height: '100%' }} className={`${prefixCls}`}>
      <div className="search-title"></div>
      <SearchInput
        onOpenRecordNum={handleOpenRecordNum}
        onSearch={handleSearch}
        onImportData={handleImportData}
        onAuthApprove={handleAuthApprove}
      // className="record-search-input-small"
      />
      <RecordNum />
      {/* <div className="import-options">
        <div className="import">
          <div className="import-car import-item" onClick={() => handleImportData('car')}>
            <div className="import-icon car-icon"></div>
            <div className="content">
              <div className="title">
                <div>导入车辆数据</div>
                <div className="record-icon"><RightOutlined /></div>
              </div>
              <div className="info">
                支持批量导入车辆档案信息数据
              </div>
            </div>
          </div>
        </div>
        <div className="import">
          <div className="import-person import-item" onClick={() => handleImportData('person')}>
            <div className="import-icon person-icon"></div>
            <div className="content">
              <div className="title">
                <div>导入人员数据</div>
                <div className="record-icon"><RightOutlined /></div>
              </div>
              <div className="info">
                支持批量导入人员档案信息数据
              </div>
            </div>
          </div>
        </div>
        <div className="import">
          <div className="auth-approve import-item" onClick={handleAuthApprove}>
            <div className="import-icon auth-approve-icon"></div>
            <div className="content">
              <div className="title">
                <div className="name">权限审批{
                  authCount ? <div className="count">{authCount}</div> : null}</div>
                <div className="record-icon"><RightOutlined /></div>
              </div>
              <div className="info">
                同级及下级部门人员审批
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <Modal
        visible={addVisible}
        onCancel={() => setAddVisibel(false)}
        onOk={() => setAddVisibel(false)}
        // title={`导入${addType == 'person' ? '人员' : '车辆'}数据`}
        title={`导入数据`}
        width={1021}
        className={`${prefixCls}-add-modal`}
      >
        <div className={`person-body`}>
          <div className="header">
            <Tabs
              className={`${prefixCls}-tabs`}
              activeKey={addType}
              onChange={(key) => { setAddType(key) }}
              data={addData.map(item => ({ key: item.type, name: item.label }))}
            />
          </div>
          <div className="content">
            {/* {
              addType == 'person' ?
                <>
                  <AddData
                    type='personExcel'
                    width={'426px'}
                    accept={'.xlsx,.xls'}
                    title="上传人员信息"
                  />
                  <AddData
                    type='personZip'
                    width={'416px'}
                    title="上传人像图像"
                    accept={'.zip'}
                  />
                </>
                : <AddData
                  type='carExcel'
                  width={"100%"}
                  accept={'.xlsx,.xls'}
                  title="上传车辆信息"
                />
            } */}
            <AddData
              type={curDataType?.type}
              width={curDataType?.width}
              accept={curDataType?.accept}
              title={curDataType?.title}
            />
          </div>
        </div>
      </Modal>
    </div >
  }
}
export default RecrodSearch
