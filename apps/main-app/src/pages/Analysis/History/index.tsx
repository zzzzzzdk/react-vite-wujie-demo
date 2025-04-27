import React, { useState, useRef, useEffect } from "react";
import { unstable_useBlocker as useBlocker, useNavigate, Link } from "react-router-dom";
import { Input, Modal, Form, Button, Loading, Table, Space, Progress, Popover, Checkbox, PopConfirm, Message, Tooltip, Select } from '@yisa/webui'
import { Icon, SearchOutlined } from '@yisa/webui/es/Icon'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import HistoryProps, { HistoryTreeItem, FormDataType, ResultRowType, GetFileParamsType, ParsedNumberType, AddLocation } from "./interface";
import { DrawType, LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import {
  Export as ExportBtn
} from '@/components'
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import AddLocationModal from './Modal/AddLocationModal'
import { ResultBox } from '@yisa/webui_business'
import { isArray, isObject, toSizeText, getParams } from "@/utils";
import { useLocation } from "react-router-dom";
import dictionary from '@/config/character.config'
import ajax, { ApiResponse } from '@/services'
import { HistoryContext } from "./context";
import HistoryTree from './HistoryTree'
import { useResetState } from "ahooks";
import services from "@/services";
import { RootState, useSelector } from "@/store";
import { logReport } from "@/utils/log";
import character from "@/config/character.config";
import dayjs from 'dayjs'
import './index.scss'


const History = (props: HistoryProps) => {

  const analysisProgress = [{
    value: -1,
    label: '全部'
  }, {
    value: 0,
    label: '排队中'
  }, {
    value: 1,
    label: '分析中'
  }, {
    value: 2,
    label: '已完成'
  }, {
    value: 4,
    label: '已停止'
  }]
  const prefixCls = "history-task"
  const { skin } = useSelector((state: RootState) => state.comment)


  const [historyTreeData, setHistoryTreeData] = useState<HistoryTreeItem[]>([])
  const [selectedNodes, setSelectedNodes] = useState<any[]>([])
  const [formData, setFormData, resetFormData] = useResetState<FormDataType>({
    jobId: 0,
    // pageNo: 1,
    // pageSize: character.pageSizeOptions[0],
    status: -1,
    fuzzySearch: ''
  })
  const [addLocationData, setAddLocationData, resetAddLocationData] = useResetState<AddLocation>({
    locationIds: [],
    locationGroupIds: [],
  })
  const [addVisible, setAddVisible] = useState(false)
  const [ajaxFormData, setAjaxFormData] = useState(formData)
  const ajaxFormDataRef = useRef(ajaxFormData)
  ajaxFormDataRef.current = ajaxFormData
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [resultData, setResultData, resetResultData] = useResetState<ApiResponse<ResultRowType[]>>({
    totalRecords: 0,
    usedTime: 0,
    data: [],
  })
  const [drawType, setDrawType] = useState<DrawType>("default") //绘制类型
  const HistoryContextValue = {
    HistoryTreeData: historyTreeData,
    onHistoryTreeDataChange: (data: HistoryTreeItem[]) => setHistoryTreeData(data),
  }
  const [updateLoading, setUpdateLoading] = useState(false)

  // 轮询定时器
  const ajaxTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])

  // 跳转
  const [jumpData, setJumpData] = useState({
    to: '',
    // state: {}
  })

  const columns: ColumnProps<ResultRowType>[] = [
    {
      title: '点位名称',
      dataIndex: 'locationName',
    },
    {
      title: '解析开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '解析结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '分析进度',
      dataIndex: 'status',
      align: "center",
      width: 182,
      render: (text, record, index) => {
        let tem = null
        switch (text) {
          case 0:
            tem = <div className="status-item queue-up">
              <Icon type="duibizhong1" />
              排队中
            </div>
            break;
          case 1:
            tem = <div className="status-item analytical">
              <Icon type="jiexizhong" />
              分析中</div>
            break;
          case 2:
            tem = <div className="status-item completed">
              <Icon type="yichenggong" />
              已完成</div>
            break;
          case 4:
            tem = <Popover content={record.parseError}>
              <div className="status-item error">
                <Icon type="yishibai" />
                已停止</div>
            </Popover>
            break;
        }
        return tem
      }
    },
    {
      title: '目标数',
      dataIndex: 'count',
      width: 72,
      render: (text, record, index) => {
        let targetType = record.targetType || 'face,pedestrian,bicycle,tricycle,vehicle,gait'
        if (!character.hasGait) {
          targetType = targetType.split(',gait')[0]
        }
        return (
          record.uploaded === 3 ?
            "--"
            :
            countProperties(record.parsedNumber) > 0 ?
              <Popover
                title={null}
                placement="bottom"
                overlayClassName="target-info-popover"
                content={(
                  <ul>
                    {character?.targetInfo.filter(item => targetType.includes(item.field)).map(item => (
                      <li key={item.field} style={{ color: item.color }}>
                        <Icon type={item.icon} className={item.icon} />
                        <span>{item.text}: {isObject(record.parsedNumber) ? record.parsedNumber[item.field] : 0}</span>
                      </li>
                    ))}
                  </ul>
                )}
              >
                <span
                  // to={`/target?offlineIds=["${record.videoId}"]`}
                  className={'func'}
                  onClick={() => {
                    const logText = `${record.locationName} - 跳转：属性检索`;
                    const params = { locationIds: [record.locationId], beginDate: record.startTime || dayjs().format('YYYY-MM-DD HH:mm:ss'), endDate: record.endTime || dayjs().format('YYYY-MM-DD HH:mm:ss') }
                    handleJumpTo(logText, params, '/target')
                  }}
                >{countProperties(record.parsedNumber)}</span>
              </Popover>
              :
              <span>{countProperties(record.parsedNumber)}</span>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ]

  function countProperties(obj: ParsedNumberType) {
    let count = 0;
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        count += obj[prop];
      }
    }
    return count;
  }

  const handleSelected = (selectedNodes: any[]) => {
    console.log(selectedNodes)
    setSelectedNodes(selectedNodes)
    stopPolling()

    if (selectedNodes.length) {
      // console.log(selectedNodes[0])
      const currentData = Object.assign({}, {
        jobId: selectedNodes[0].key ? selectedNodes[0].key : selectedNodes[0].props.dataRef?.jobId,
        // pageNo: 1,
        // pageSize: character.pageSizeOptions[0],
        status: -1,
        fuzzySearch: '',
      })
      setFormData(currentData)
      setAjaxFormData(currentData)
      ajaxFormDataRef.current = currentData
      setAjaxLoading(true)
      search(currentData)
    } else {
      resetResultData()
      resetFormData()
    }
  }

  const handleInputChange = (event: any) => {
    setFormData({
      ...formData,
      fuzzySearch: event.target.value
    })
  }

  const handleSearchBtnClick = () => {
    setAjaxFormData(formData)
    setAjaxLoading(true)
    search(formData)
  }

  // 添加文件
  const handleOpenFileAdd = () => {
    setAddVisible(true)
  }

  const handleTableCheckedChange = (selectedRowKeys: (string | number)[], selectedRows: ResultRowType[]) => {
    // console.log(selectedRowKeys, selectedRows)
    setCheckedList(selectedRows)
    setIndeterminate(!!selectedRows.length && selectedRows.length < (resultData.data ?? []).length);
    setCheckAll(selectedRows.length === (resultData.data ?? []).length);
  }

  // 结果选中
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked) {
      setCheckedList(resultData.data || [])
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      resetChecked()
    }
  }

  // 重置选中数据
  const resetChecked = () => {
    setCheckedList([])
    setIndeterminate(false)
    setCheckAll(false)
  }

  function getMinAndMaxTime(timeArray: string[]) {
    // 将时间字符串转换为 Date 对象  
    const dateArray = timeArray.map(timeStr => new Date(timeStr));

    // 使用 Math.max 和 Math.min 获取最大和最小日期  
    // @ts-ignore
    const minDate = new Date(Math.min(...dateArray));
    // @ts-ignore
    const maxDate = new Date(Math.max(...dateArray));

    // 返回最小和最大时间字符串  
    return {
      minTime: dayjs(minDate).format('YYYY-MM-DD HH:mm:ss'), // 截取时间部分，格式为 HH:mm:ss  
      maxTime: dayjs(maxDate).format('YYYY-MM-DD HH:mm:ss')
    };
  }

  // 处理跳转
  const handleJump = (link: string) => {
    const fileIds = checkedList.map(item => item.locationId + '')

    const startTimes = checkedList.map(item => item.startTime ? item.startTime : dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const endTimes: string[] = checkedList.map(item => item.endTime ? item.endTime : dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const startTime = getMinAndMaxTime(startTimes).minTime
    const endTime = getMinAndMaxTime(endTimes).maxTime
    // window.open(`${link}?fileIds=${JSON.stringify(fileIds)}`)
    const params = { locationIds: fileIds, beginDate: startTime, endDate: endTime }
    let logText = `${selectedNodes.length ? selectedNodes[0].props.dataRef.name : ``}(`
    checkedList.forEach((item, index) => {
      logText = logText + (index < checkedList.length - 1 ? `${item.locationName};` : `${item.locationName})`)
    })
    logText = logText + ` - 跳转：${link.indexOf('image') > -1 ? '以图检索' : "属性检索"}`
    handleJumpTo(logText, params, link)
  }

  const handleJumpTo = (logText: string, params: any, link: string) => {
    // 日志提交
    logReport({
      type: 'none',
      data: {
        desc: logText,
      }
    })

    ajax.uploadTokenParams<{}, ApiResponse<string>>({
      params
    }).then(res => {
      if (res.data) {
        window.open(`#${link}/?token=${res.data}`)
      } else {
        Message.warning(res.message || "")
      }
    }).catch(err => {
      Message.warning(err.message)
    })
  }

  // 处理删除任务
  const handleDelFile = (fileIds: string[]) => {
    services.history.deleteVideoLocation(
      {
        videoIds: fileIds
      }
    ).then(res => {
      resetChecked()
      setAjaxLoading(true)
      search(ajaxFormDataRef.current)
    }).catch(err => {
      console.log(err)
    })
  }
  // 判断能否跳转
  const isJump = () => {
    // 判断是否含有已完成和分析中的项
    let jumpStatus = checkedList.filter(item => item.status === 1 || item.status === 2)
    return jumpStatus.length > 0
  }

  // 处理点位变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    console.log(data)
    setAddLocationData({
      ...addLocationData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
    })
  }

  // 执行轮询，实时请求解析进度
  const startPolling = () => {
    ajaxTimer.current = setInterval(() => {
      search(ajaxFormDataRef.current)
    }, 30000)
  }

  // 结束轮询
  const stopPolling = () => {
    if (ajaxTimer.current) {
      clearInterval(ajaxTimer.current)
      ajaxTimer.current = undefined
    }
  }

  // 执行ajax请求
  const search = (newForm: FormDataType) => {
    services.history.getFileList<GetFileParamsType, ResultRowType[]>(
      {
        ...newForm,
        status: newForm.status || newForm.status === 0 ? newForm.status : -1,
      },
    ).then(res => {
      // 过滤旧定时器请求操作
      if (newForm.jobId !== ajaxFormDataRef.current.jobId) {
        return
      }
      // console.log(res)
      setAjaxLoading(false)
      setResultData(res)
      if (!ajaxTimer.current) {
        startPolling()
      }
    }).catch(err => {
      setAjaxLoading(false)
      console.log(err)
    })
  }

  return (
    <HistoryContext.Provider
      value={HistoryContextValue}
    >
      <div className={`${prefixCls} page-content`}>
        <HistoryTree
          prefixCls={prefixCls}
          onSelect={handleSelected}
          selectedNodes={selectedNodes}
        />
        <div className={`${prefixCls}-task-details`}>
          <Form layout="vertical" className="">
            <Form.Item
              colon={false}
              label="点位名称"
            >
              <Input
                placeholder="模糊检索"
                allowClear
                value={formData.fuzzySearch}
                onChange={handleInputChange}
                disabled={selectedNodes.length === 0}
              />
            </Form.Item>
            <Form.Item
              label="分析进度"
              className="analysis-progress-form-item"
              colon={false}
            >
              <Select
                options={analysisProgress}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    status: value as number
                  })
                }}
                value={formData.status}
                showSearch={true}
                disabled={selectedNodes.length === 0}
              />
            </Form.Item>
            <Form.Item className="search-btn" colon={false} label={" "}>
              <Button
                loading={ajaxLoading}
                onClick={handleSearchBtnClick}
                type='primary'
                disabled={selectedNodes.length === 0}
              >
                查询
              </Button>
            </Form.Item>
          </Form>
          <div className={`result page-top`}>
            <div className="result-header">
              <div>共 <span>{resultData.totalRecords || 0}</span> 条结果，用时 <span>{resultData.time || 0}</span> 秒</div>
              <div className="top-btn">
                <Button disabled={selectedNodes.length === 0} onClick={handleOpenFileAdd}>添加点位</Button>
                {selectedNodes.length > 0 && <ExportBtn
                  total={resultData.totalRecords || 0}
                  url={`/v1/history/video/export`}
                  hasImage={false}
                  formData={{
                    pageNo: 1,
                    pageSize: resultData.totalRecords || 0,
                    ...ajaxFormDataRef.current,
                  }}
                />}
              </div>
            </div>
            <div className="result-con">
              <ResultBox
                loading={ajaxLoading}
                nodata={!resultData.data || (resultData.data && !resultData.data.length)}
                nodataTip={selectedNodes.length === 0 ? "请尝试检索一下" : "搜索结果为空"}
                nodataClass={selectedNodes.length === 0 ? `first-coming-${skin}` : ""}
              >
                <Table
                  loading={updateLoading}
                  data={resultData.data}
                  rowKey={"videoId"}
                  columns={columns}
                  // scroll={{
                  //   x: 1600,
                  // }}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: checkedList.map(item => item.videoId),
                    onChange: handleTableCheckedChange,
                    onSelect: (selected, record, selectedRows) => {
                      // console.log("onSelect:", selected, record, selectedRows)
                    },
                  }}
                  stripe={true}
                />
              </ResultBox>
            </div>

          </div>
          {
            resultData && resultData.data && resultData.data.length ?
              <div className="page-bottom">
                <div className='left'>
                  <div className={"check-box"}>
                    <Checkbox
                      className="card-checked"
                      checked={checkAll}
                      indeterminate={indeterminate}
                      onChange={handleCheckAllChange}
                    >
                      全选
                    </Checkbox>
                    已经选择<span className="num">{checkedList.length}</span>项
                  </div>
                  <Button disabled={!isJump()} size='small' onClick={(e) => handleJump('/target')}>属性检索</Button>
                  <Button disabled={!isJump()} size='small' onClick={(e) => handleJump('/image')}>以图检索</Button>
                  <PopConfirm
                    title={`确认删除文件？`}
                    onConfirm={() => handleDelFile(checkedList.map(item => item.videoId))}
                  >
                    <Button disabled={!checkedList.length} size='small' type="danger">删除</Button>
                  </PopConfirm>
                </div>
              </div>
              : ''
          }
        </div>
        <AddLocationModal
          jobId={formData.jobId}
          open={addVisible}
          locationIds={addLocationData.locationIds}
          locationGroupIds={addLocationData.locationGroupIds}
          onChange={handleLocationChange}
          title="添加点位"
          tagTypes={dictionary.tagTypes.slice(0, 2)}
          onlyLocationFlag={true}
          showDrawTools={true}
          onChangeDrawTools={(type) => {
            setDrawType(type)
            setAddLocationData({ ...addLocationData, locationIds: [] })
          }}
          defaultDrawType={drawType}
          onCancel={() => {
            setAddVisible(false)
            resetAddLocationData()
          }}
          onOk={() => {
            setAddVisible(false)
            setAjaxLoading(true)
            search(ajaxFormDataRef.current)
            resetAddLocationData()
          }}
        />
      </div>
    </HistoryContext.Provider>
  )
}

export default History
