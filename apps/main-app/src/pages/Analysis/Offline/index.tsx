import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input, Modal, Form, Button, Loading, Table, Space, Progress, Popover, Checkbox, PopConfirm, Message, Tooltip } from '@yisa/webui'
import { Icon, SearchOutlined } from '@yisa/webui/es/Icon'
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import { ResultBox } from '@yisa/webui_business'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import ajax, { ApiResponse } from '@/services'
import { lngLatType } from "@/components/Map/PositionSet/interface";
import OfflineProps, { ResultRowType, FormDataType, GetFileParamsType, ParsedNumberType, OfflineTreeItem, UploadStatus, UploadStatusType, fileChunkItem, UploadFileItem } from "./interface";
import OfflineTree from "./OfflineTree";
import character from "@/config/character.config";
import './index.scss'
import services from "@/services";
import { useResetState } from "ahooks";
import { isArray, isObject, toSizeText } from "@/utils";
import { OfflineContext } from "./context";
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { unstable_useBlocker as useBlocker, useNavigate, Link } from "react-router-dom";
import { getToken } from "@/utils/cookie";
import { logReport } from "@/utils/log";
/** --- 弹框 */
import FileEditModal from "./Modal/FileEditModal";
import TimeSetModal from "./Modal/TimeSetModal";
import VideoModal from './Modal/VideoModal'
import AddFileModal from './Modal/AddFileModal'
import { RootState, useSelector } from "@/store";
import { PositionSet, BigImg, SharePermissions } from "@/components";
import { Receiver } from "@/pages/Deploy/Deploy/interface";
/** ---  */


const Offline = (props: OfflineProps) => {
  const navigate = useNavigate();
  const prefixCls = "offline-task"
  const { skin } = useSelector((state: RootState) => state.comment)

  const [offlineTreeData, setOfflineTreeData] = useState<OfflineTreeItem[]>([])

  const [selectedData, setSelectedData] = useState<NodeInstance | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<any[]>([])

  const [formData, setFormData, resetFormData] = useResetState<FormDataType>({
    jobId: 0,
    fileName: '',
    // pageNo: 1,
    // pageSize: character.pageSizeOptions[0]
  })
  const [ajaxFormData, setAjaxFormData] = useState(formData)
  const ajaxFormDataRef = useRef(ajaxFormData)
  ajaxFormDataRef.current = ajaxFormData
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [resultData, setResultData, resetResultData] = useResetState<ApiResponse<ResultRowType[]>>({
    totalRecords: 0,
    usedTime: 0,
    data: [],
  })
  const [filterData, setFilterData] = useState<ResultRowType[]>([])

  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<ResultRowType[]>([])

  const editType = useRef<'single' | 'batch'>('single')
  const [updateLoading, setUpdateLoading] = useState(false)
  // 弹框
  const [currentData, setCurrentData] = useState<ResultRowType | undefined>(undefined)
  // 位置设置弹窗
  const [positionSetVisible, setPositionSetVisible] = useState(false)
  // 时间设置弹窗
  const [timeSetVisible, setTimeVisible] = useState(false)
  // 文件编辑弹窗
  const [fileEditVisible, setFileEditVisible] = useState(false)
  // 录像回放弹窗
  const [videoVisible, setVideoVisible] = useState(false)
  // 添加文件弹窗
  const [addFileVisible, setAddFileVisible] = useState(false)
  // 大图弹窗
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgData, setBigImgData] = useState<{ bigImage: string }[]>([])


  // 轮询定时器
  const ajaxTimer = useRef<NodeJS.Timeout | undefined>(undefined)

  // 列表请求控制器，用来切换分组列表时，取消上一个请求
  const fileListXhrController = useRef<AbortController>()

  const uploadConfig = useRef({
    chunkSize: 10 * 1024 * 1024,
    backenUrl: "http://localhost:3000/upload_url"
  })
  // 在表格上显示的文件信息
  const [uploadFilesShow, setUploadFilesShow] = useState<UploadFileItem[]>([])
  const uploadFilesShowRef = useRef(uploadFilesShow)
  uploadFilesShowRef.current = uploadFilesShow
  // 已经上传的文件数组
  const uploadsDataRef = useRef(uploadFilesShow);
  // 是否有文件正在上传
  const isUploading = useRef(false)

  // 正在执行的webworker
  const currentWebWorkers = useRef<{
    key: string;
    worker: Worker | null
  }[]>([])

  // 上传请求数组
  const requestList = useRef<{ key: string; xhr: AbortController }[]>([])

  // 需要停止遍历分片上传的文件id数组
  const shouldStopIds = useRef<string[]>([])

  // 路由拦截，上传过程中给出提示
  const blocker = useBlocker(!!isUploading.current);
  useEffect(() => {
    if (blocker.state === "blocked") {
      Modal.confirm({
        content: "存在文件上传未完成，确认关闭吗？",
        onOk: () => {
          stopUpload()
          blocker.proceed?.();
        },
        onCancel: () => {
          blocker.reset?.();
        },
      });
    }
  }, [blocker])

  const beforeunload = async (e: BeforeUnloadEvent) => {
    e.preventDefault()
    if (isUploading.current) {
      // let confirmationMessage = '数据上传未完成，确认关闭吗？';
      // (e || window.event).returnValue = confirmationMessage;
      // return confirmationMessage;
      (e || window.event).returnValue = "";
      return ""
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', beforeunload);

    return () => {
      stopUpload()
      stopPolling()
      window.removeEventListener("beforeunload", beforeunload)
    }
  }, [])

  const handleInputChange = (event: any) => {
    setFormData({
      ...formData,
      fileName: event.target.value
    })
  }

  const handleFilter = (filterText: string, data = filterData) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterText.split(pattern);

    const newFilterData = data.filter(item => keywords.every(key => item.fileName.includes(key)))
    return newFilterData
  }

  const handleSearchBtnClick = () => {
    setAjaxFormData(formData)
    if (formData.fileName) {
      const newFilterData = handleFilter(formData.fileName, resultData.data)
      setFilterData(newFilterData)
    } else {
      setFilterData(resultData.data || [])
    }

    resetChecked()
  }

  function countProperties(obj: ParsedNumberType) {
    let count = 0;
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        count += obj[prop];
      }
    }
    return count;
  }

  const uploadStatus = (record: ResultRowType) => (
    record.uploaded === 0 ?
      <span className="error-message">上传中断</span>
      :
      record.uploaded === 1 ?
        <Progress
          percent={100}
          strokeColor={{
            from: '#3377FF',
            to: '#B4CDFF',
          }}
          strokeWidth={8}
        />
        :
        record.uploaded === 2 ?
          <span className="error-message">{record.uploadError}</span>
          :
          <Loading
            spinning={record.uploadStatus === UploadStatus.wait}
            indicator={<span>生成文件hash...</span>}
          >
            <Progress
              percent={record.percentage}
              status={record.uploadStatus}
              strokeColor={{
                from: '#3377FF',
                to: '#B4CDFF',
              }}
              strokeWidth={8}
            />
          </Loading>
  )

  const columns: ColumnProps<ResultRowType>[] = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      ellipsis: true,
      width: 200,
      render: (text, record, index) => (
        <span
          className={record.uploaded === 1 ? "func" : ''}
          onClick={() => handlePlayVideo(record)}
          title={text}
        >{text || '--'}</span>
      )
    },
    {
      title: '大小',
      dataIndex: 'fileSize',
      width: 84,
      render: (text) => toSizeText(text)
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 167,
    },
    {
      title: '拍摄时间',
      dataIndex: 'userTime',
      width: 210,
      render: (text, record, index) => (
        record.uploaded === 3 ?
          "--"
          :
          <div className="shoot-time">
            <Space size={4}>
              <span className="identification-type">{record.isUserSet === 0 ? '自' : '手'}</span>
              <Tooltip title={record.isUserSet === 0 ? '自动识别' : '手动输入'}>
                <span>{text || '--'}</span>
              </Tooltip>
              <span className="func" onClick={() => handleTimeSet(record)}>修改</span>
            </Space>
          </div>
      )
    },
    {
      title: '上传进度',
      dataIndex: 'percentage',
      width: 182,
      render: (text, record, index) => uploadStatus(record)
    },
    {
      title: '解析进度',
      dataIndex: 'progress',
      width: 182,
      render: (text, record, index) => (
        record.status === 0 ?
          <Progress
            percent={Math.round(text * 100)}
            strokeColor={{
              from: '#FF8D1A',
              to: '#FFD1A2',
            }}
            strokeWidth={8}
          />
          :
          record.status === 1 ?
            <Progress
              percent={100}
              strokeColor={{
                from: '#FF8D1A',
                to: '#FFD1A2',
              }}
              strokeWidth={8}
            />
            :
            <span className="error-message">{record.parseError || '--'}</span>
      )
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
                <Link
                  to={`/target?offlineIds=["${record.fileId}"]`}
                  target="_blank"
                  className={'func'}
                >{countProperties(record.parsedNumber)}</Link>
              </Popover>
              :
              <span>{countProperties(record.parsedNumber)}</span>
        )
      }
    },
    {
      title: '经纬度',
      dataIndex: 'lnglat',
      width: 170,
      render: (text, record, index) => (
        record.uploaded === 3 ?
          "--"
          :
          record.longitude && record.latitude ?
            <>
              <span>{record.longitude}, {record.latitude} </span>
              <span className="func" onClick={() => handlePositionSet(record)}>修改</span>
            </>
            :
            <span className="func" onClick={() => handlePositionSet(record)}>点击设置经纬度</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 172,
      // fixed: 'right',
      render: (text, record, index) => (
        <Space size={8}>
          {
            record.status === 1 ?
              <>
                <Button size="mini" onClick={() => handleEditFile(record)}>修改</Button>
                <Button
                  size="mini"
                  onClick={() => handleDownloadFile(record)}
                // loading={downloadLoading}
                >下载</Button>
              </> : ''
          }
          <PopConfirm
            title={`确认删除该文件`}
            onConfirm={() => handleDelFile([record.fileId])}
          >
            <Button type='danger' size="mini">删除</Button>
          </PopConfirm>
        </Space>
      )
    }
  ]

  // 结果选中
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked) {
      setCheckedList(filterData || [])
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

  // 分页改变
  // const handleChangePn = (pn: number, pageSize: number) => {
  //   let newForm = ajaxFormData
  //   if (formData.pageSize === pageSize) {
  //     newForm = {
  //       ...ajaxFormData,
  //       pageNo: pn
  //     }
  //   } else {
  //     newForm = {
  //       ...ajaxFormData,
  //       pageNo: 1,
  //       pageSize
  //     }
  //   }
  //   setAjaxFormData(newForm)
  //   search(newForm)
  // }

  // 执行ajax请求
  const search = (newForm: FormDataType, fileList: any[] = []) => {
    const controller = new AbortController();
    services.offline.getFileList<GetFileParamsType, ResultRowType[]>(
      {
        jobId: newForm.jobId,
        fileName: newForm.fileName,
        status: -1,
        // pageSize: newForm.pageSize,
        // pageNo: newForm.pageNo
      },
      controller.signal
    ).then(res => {
      // 过滤旧定时器请求操作
      if (newForm.jobId !== ajaxFormDataRef.current.jobId) {
        return
      }
      // console.log(res)
      setAjaxLoading(false)

      // 如果有正在上传的fileList时，合并到结果数据
      // const result = [...fileList, ...(res.data || [])]
      const result = mergeAndUpdateArrays(fileList, (res.data || []))
      setResultData({
        ...res,
        data: result
      })

      let newFilterData = result
      if (newForm.fileName) {
        newFilterData = handleFilter(newForm.fileName, newFilterData)
      }
      // console.log(newFilterData)
      setFilterData(newFilterData)

      // 判断任务全部解析完成， 停止轮询
      if (ajaxTimer.current) {
        let allDone = true
        newFilterData.forEach(task => {
          if (task.status === 0) {
            allDone = false
          }
        })
        if (allDone) {
          stopPolling()
        }
      } else if (!ajaxTimer.current) {
        startPolling()
      }
    }).catch(err => {
      setAjaxLoading(false)
      console.log(err)
    })
    fileListXhrController.current = controller
  }

  // 执行轮询，实时请求解析进度
  const startPolling = () => {
    ajaxTimer.current = setInterval(() => {
      search(ajaxFormDataRef.current, uploadFilesShowRef.current)
    }, 3000)
  }

  // 结束轮询
  const stopPolling = () => {
    if (ajaxTimer.current) {
      clearInterval(ajaxTimer.current)
      ajaxTimer.current = undefined
    }
  }

  const handleSelected = (selectedNodes: any[], fileList: ResultRowType[] = []) => {
    setSelectedNodes(selectedNodes)
    stopPolling()
    stopUpload()
    // 切换文件列表之前，如果有之前的文件列表请求未完成，需取消
    if (fileListXhrController.current) {
      fileListXhrController.current.abort()
    }

    if (selectedNodes.length) {
      // console.log(selectedNodes[0])
      const currentData = Object.assign({}, {
        jobId: selectedNodes[0].key ? selectedNodes[0].key : selectedNodes[0].props.dataRef?.jobId,
        fileName: '',
        // pageSize: formData.pageSize,
        // pageNo: formData.pageNo
      })
      setFormData(currentData)
      setAjaxFormData(currentData)
      setAjaxLoading(true)
      resetChecked()
      search(currentData, fileList)
    } else {
      resetResultData()
      setFilterData([])
      resetFormData()
    }
  }

  const handleTableCheckedChange = (selectedRowKeys: (string | number)[], selectedRows: ResultRowType[]) => {
    // console.log(selectedRowKeys, selectedRows)
    setCheckedList(selectedRows)
    setIndeterminate(!!selectedRows.length && selectedRows.length < (filterData ?? []).length);
    setCheckAll(selectedRows.length === (filterData ?? []).length);
  }

  const handleDelFile = (fileIds: string[]) => {

    services.offline.delFile({ filesId: fileIds }).then(res => {
      Message.success("删除成功")
      // 改变表格数据
      const newResult = (resultData.data || []).filter(item => !fileIds.includes(item.fileId))
      setResultData({
        ...resultData,
        data: [...newResult]
      })

      shouldStopIds.current = [...shouldStopIds.current, ...fileIds]
      uploadFilesShowRef.current.forEach((item) => {
        // 将正在上传的文件删除时，需要停止任务
        if (fileIds.includes(item.fileId as string) && item['uploaded'] && item['uploaded'] === 3) {
          // 结束相关的worker
          const thisWorker = currentWebWorkers.current.find(o => o.key === item.fileId)
          thisWorker?.worker?.postMessage('close');
          // 中断相关的ajax请求
          requestList.current.forEach((elem, xhrIndex) => {
            if (elem.key === item.fileId && elem.xhr) {
              elem.xhr.abort()
              const newRequestList = requestList.current
              newRequestList.splice(xhrIndex, 1)
              requestList.current = [...newRequestList]
            }
          });
        }
      })
      // 从正在上传的数组中剔除
      const newUploadFilesShow = uploadFilesShowRef.current.filter(item => !fileIds.includes(item.fileId as string))
      uploadFilesShowRef.current = newUploadFilesShow
      console.log('newUploadFilesShow', newUploadFilesShow)
      setUploadFilesShow([...newUploadFilesShow])


      const newFilterData = filterData.filter(item => !fileIds.includes(item.fileId))
      setFilterData([...newFilterData])
    }).catch(error => {
      console.log(error)
    })

    resetChecked()
  }

  const OfflineContextValue = {
    offlineTreeData: offlineTreeData,
    onOfflineTreeDataChange: (data: OfflineTreeItem[]) => setOfflineTreeData(data),
  }

  // 弹窗
  // 打开选择经纬度
  const handlePositionSet = (record?: ResultRowType) => {
    if (record) {
      editType.current = 'single'
      setCurrentData(record)
    } else {
      editType.current = 'batch'
    }
    setPositionSetVisible(true)
  }

  // 关闭选择经纬度
  const handlePositionCancel = () => {
    setCurrentData(undefined)
    setPositionSetVisible(false)
  }

  // 确认经纬度编辑
  const handlePositionConfirm = (data: lngLatType) => {
    setPositionSetVisible(false)
    // console.log(data)
    let _formData = {}
    if (editType.current === 'single') {
      _formData = {
        fileId: [currentData?.fileId],
        longitude: data.lng,
        latitude: data.lat
      }
    } else {
      _formData = {
        fileId: checkedList.map(item => item.fileId),
        longitude: data.lng,
        latitude: data.lat
      }
    }
    updateFileInfo(_formData)
  }

  // 时间设置，点击表格某一项的编辑会传入record
  const handleTimeSet = (record?: ResultRowType) => {
    if (record) {
      editType.current = 'single'
      setCurrentData(record)
    } else {
      editType.current = 'batch'
    }
    setTimeVisible(true)
  }

  // 时间设置确认
  const handleTimeConfirm = (date: string) => {
    console.log(date)
    setTimeVisible(false)
    // console.log(data)
    let _formData = {}
    if (editType.current === 'single') {
      _formData = {
        fileId: [currentData?.fileId],
        userTime: date
      }
    } else {
      _formData = {
        fileId: checkedList.map(item => item.fileId),
        userTime: date
      }
    }
    updateFileInfo(_formData)
  }

  // 编辑文件
  const handleEditFile = (record: ResultRowType) => {
    setCurrentData({
      ...record,
      jobId: formData.jobId
    })
    setFileEditVisible(true)
  }

  // 文件编辑确认
  const handleFileConfirm = (data: ResultRowType) => {
    setFileEditVisible(false)
    updateFileInfo(data, true)
  }

  // 更新文件信息
  const updateFileInfo = (_formData: any, updateList = false) => {
    setUpdateLoading(true)
    services.offline.updateFile(_formData).then(res => {
      setUpdateLoading(false)
      Message.success('更新成功')
      if (updateList) {
        search(ajaxFormDataRef.current, uploadFilesShowRef.current)
        return
      } else {
        const { fileId } = _formData
        // 改变表格数据
        const newResult = (resultData.data || [])
        newResult.forEach((item, index) => {
          if (fileId.includes(item.fileId)) {
            newResult.splice(index, 1, {
              ...item,
              ..._formData,
              fileId: item.fileId
            })
          }
        })
        setResultData({
          ...resultData,
          data: newResult
        })

        const newFilterData = filterData
        newFilterData.forEach((item, index) => {
          if (fileId.includes(item.fileId)) {
            newFilterData.splice(index, 1, {
              ...item,
              ..._formData,
              fileId: item.fileId
            })
          }
        })
        setFilterData(newFilterData)
      }


    }).catch(err => {
      setUpdateLoading(false)
      console.log(err)
    })
  }

  // const [downloadLoading, setDownloadLoading] = useState(false)
  // 下载文件
  const handleDownloadFile = (record: ResultRowType) => {
    window.open(`${window.YISACONF.api_host}/v1/offline/file/download?fileId=${record.fileId}`)
    // setDownloadLoading(true)

    // services.offline.getDownloadFile({
    //   fileId: record.fileId
    // }).then(res => {
    //   setDownloadLoading(false)
    //   // Message.success('')
    //   fetch(res.fileUrl).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
    //     const a = document.createElement('a')
    //     a.href = URL.createObjectURL(blob)
    //     //测试链接console.log(a.href)
    //     a.download = record.fileName  // 下载文件的名字
    //     document.body.appendChild(a)
    //     a.click()
    //   })
    // }).catch(err => {
    //   setDownloadLoading(false)
    //   console.log(err)
    // })
  }

  // 视频播放
  const handlePlayVideo = (record: ResultRowType) => {
    if (record.uploaded !== 1) {
      return
    }
    if (record.fileType && record.fileType === 1) {
      setVideoVisible(true)
      setCurrentData(record)
    } else {
      // 获取离线文件中图片
      services.offline.getOfflineImages<any, string[]>({ fileId: record.fileId }).then(res => {
        const imgData = res.data && isArray(res.data) ? res.data.map(item => ({
          bigImage: item,
          targetImage: item
        })) : []
        setBigImgVisible(true)
        setBigImgData(imgData)
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // 添加文件
  const handleOpenFileAdd = () => {
    setAddFileVisible(true)
  }

  // 添加文件确认
  const handleFileAddConfirm = (data: {
    jobId: string,
    targetType: string[],
    fileList: any[]
  }) => {
    setAddFileVisible(false)
    // setSelectedNodes([{ key: data.job_id }])
    console.log(data)
    // 同步上传文件数组到表格
    const fileList = [...data.fileList].map(item => Object.assign(item, {
      fileId: item.key, // 上传文件的fileId前端自造，用于根据id同步更新进度
      fileName: item.name,
      fileSize: item.size,
      // uploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      uploadTime: '--',
      targetType: data.targetType ? data.targetType.join(',') : '',
      jobId: data.jobId,
      percentage: 0,
      uploaded: 3,
      uploadStatus: UploadStatus.wait
    }))

    // 如果已经有展开的分组，且不是在当前分组展示页，是否切换过去，切换会丢失之前分组未上传完成数据
    if (selectedNodes.length > 0 && selectedNodes[0].key !== data.jobId) {
      if (isUploading.current) {
        Modal.confirm({
          content: "数据上传未完成，现在切换分组会丢失之前未上传完成的数据，确认切换分组吗？",
          onOk: () => {
            stopUpload()
            handleSelected([{ key: data.jobId }], fileList)
            handleUploadFiles(fileList)
          },
          onCancel: () => {
          },
        });
      } else {
        setUploadFilesShow([])
        uploadFilesShowRef.current = []
        handleSelected([{ key: data.jobId }], fileList)
        handleUploadFiles(fileList)
      }
    }
    // 如果已经有展开的分组，且是在当前分组展示页
    if (selectedNodes.length > 0 && selectedNodes[0].key === data.jobId) {
      handleUploadFiles(fileList)
    }
    // 如果没有展开的分组，直接展开
    if (selectedNodes.length === 0) {
      setUploadFilesShow([])
      uploadFilesShowRef.current = []
      handleSelected([{ key: data.jobId }], fileList)
      handleUploadFiles(fileList)
    }
  }

  function mergeAndUpdateArrays(arr1: any[], arr2: any[], keyName: string = 'fileId') {
    if (arr1.length && !arr2.length) {
      return arr1
    }
    if (!arr1.length && arr2.length) {
      return arr2
    }
    // 合并两个数组
    const mergedArray = [...arr1, ...arr2];

    // 使用Map来存储唯一键对应的元素
    const map = new Map();
    mergedArray.forEach(item => {
      const key = item[keyName]; // 使用指定的键名
      if (map.has(key)) {
        // 如果Map已经有了这个键，更新对应的元素
        const existingItem = map.get(key);
        Object.assign(existingItem, item); // 更新现有元素的属性
      } else {
        // 如果Map中没有这个键，将元素添加到Map中
        map.set(key, item);
      }
    });

    // 将Map的值转换回数组形式
    const updatedArray = Array.from(map.values());

    return updatedArray;
  }

  useEffect(() => {
    // console.log('uploadFilesShow changed: ', uploadFilesShow)
    // 改变表格数据
    setResultData({
      ...resultData,
      data: mergeAndUpdateArrays(uploadFilesShow, (resultData.data || []))
    })
    // console.log('uploadFilesShow changed then filter changed: ', mergeAndUpdateArrays(uploadFilesShow, filterData))
    setFilterData(mergeAndUpdateArrays(uploadFilesShow, filterData))
  }, [uploadFilesShow])

  // useEffect(() => {
  //   console.log('filterData changed: ', filterData)
  // }, [filterData])

  const handleUploadFiles = (fileList: UploadFileItem[]) => {
    setUploadFilesShow([...fileList, ...uploadFilesShowRef.current])
    uploadFilesShowRef.current = [...fileList, ...uploadFilesShowRef.current]
    handleBatchUp()
    resetChecked()
  }

  // 多个文件每五个分批，
  const handleBatchUp = () => {
    // 获取正在上传或者上传完成的文件hash们
    const uploadedHashs = uploadsDataRef.current.map(o => o.hash)
    // console.log(`uploadedHashs`, uploadedHashs)
    // 获取没有进行上传的剩余数组
    let remainFiles = [...uploadFilesShowRef.current].filter(v => !uploadedHashs.includes(v.hash))
    // console.log('remainFiles', remainFiles)

    if (!remainFiles.length) {
      return
    }

    if (remainFiles.length <= 5) {
      handleUpload(remainFiles)
    } else {

      const newFiles = remainFiles.splice(0, 5) || []
      if (newFiles && newFiles.length > 0) {
        handleUpload(newFiles)
      }
    }
  }

  // 处理await，返回错误
  function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
    return promise
      .then<[null, T]>((data: T) => [null, data])
      .catch<[U, null]>(err => [err, null])
  }

  // 执行上传
  const handleUpload = (files: File[]) => {
    isUploading.current = true
    console.log("执行上传的文件数组", files)
    CustomForeach(files, async (item, index) => {
      const fileName = item.name
      const fileChunkList = createFileChunk(item);
      // console.log('fileChunkList', fileChunkList)
      // 同步进行
      // const [err, hash] = await awaitWrap(calculateHash(fileChunkList, fileName, item.key))

      // if (err) {
      //   console.log(`${fileName}计算hash失败: `, err)
      //   files.splice(index, 1)
      // }


      // 异步并行
      calculateHash(fileChunkList, fileName, item.key).then(async (hash) => {
        if (hash) {
          console.log(`${fileName}计算完成hash: `, hash)
          try {
            // 添加到已上传文件数组
            let arr = [...uploadsDataRef.current];
            arr.push(item);
            uploadsDataRef.current = arr
            // 验证文件是否存在
            const { exist, chunks, fileUrl } = await verifyUpload(
              fileName,
              hash
            );

            if (exist) {
              // Message.success(
              //   "skip upload：file upload success, check /target directory"
              // );
              Message.success(`${fileName}跳过上传：文件已成功上传，检查服务器目录`)
              item.status = UploadStatus.success;


              const formData = {
                jobId: item.jobId,
                targetType: item.targetType ? item.targetType.join(',') : '',
                file: {
                  fileName: item.name,
                  fileType: item.name.endsWith('.zip') ? 2 : 1,
                  fileMd5: hash,
                  fileSize: item.size,
                  fileUrl: fileUrl,
                  latitude: '',
                  longitude: '',
                  uploaded: 1, // 1 表示已完成
                }
              }
              submitNewFile(formData, item.fileId)
              // 从正在上传的数组中剔除
              // const newUploadFilesShow = uploadFilesShowRef.current.filter(item => item.fileId !== item.fileId)
              // uploadFilesShowRef.current = newUploadFilesShow
              // setUploadFilesShow([...newUploadFilesShow])
            } else {


              const newFileChunkList = fileChunkList.map(({ file }, index) => ({
                file: item,
                fileName: fileName,
                fileHash: hash as string,
                index,
                hash: hash + "-" + index,
                chunkIndex: index,
                chunk: file,
                size: file.size,
                percentage: chunks.includes(hash + "-" + index) ? 100 : 0
              }))

              setUploadFilesShow(prevData => prevData.map(
                prev =>
                  prev.hash === hash
                    ?
                    Object.assign(prev, {
                      fileChunkList: newFileChunkList
                    })
                    :
                    prev
              ))

              await uploadChunks(chunks, newFileChunkList, item);
            }

          } catch (error) {
            console.log(error)
          }
        }
        if (index === files.length - 1) {
          // 等待数组中元素全部请求完毕，执行下一批次
          console.log('````````````````````````当前上传组已完成`````````````````````````')
          isUploading.current = false
          handleBatchUp()
        }
      }).catch(err => {
        console.log(`${fileName}计算hash失败: `, err)
        files.splice(index, 1)
      })
    })

  }

  // useEffect(() => {
  //   console.log('isUploading.current = ', isUploading.current)
  // }, [isUploading.current])

  // 加上async/await，支持遍历过程中执行同步代码
  const CustomForeach = async (arr: any[], callback: (item: any, index: number) => void, count = 1) => {
    const length = arr.length;
    let index = 0;
    while (index < length) {
      // console.log('doing foreach...');
      const item = arr[index];
      await callback(item, index);
      index = index + count;
    }
  };

  // 生成文件切片
  // create file chunk
  const createFileChunk = (file: File, size = uploadConfig.current.chunkSize) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  }

  // 生成文件 hash（web-worker）
  // use web-worker to calculate hash
  const calculateHash = (fileChunkList: fileChunkItem[], fileName: string, fileKey: string) => {
    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker(window.location.pathname + "static/worker/hash.worker.js");
        worker.onerror = (e) => {
          console.log(e)
          currentWebWorkers.current = currentWebWorkers.current.filter(item => item.key !== fileKey)
        }
        worker.onmessage = e => {
          if (e.data === 'close') {
            reject({ message: "解析中断" })
            worker.terminate()
            currentWebWorkers.current = currentWebWorkers.current.filter(item => item.key !== fileKey)
            return
          }
          const { percentage, hash }: { percentage: number, hash: string } = e.data;
          console.log(`${fileName}生成hash进度：`, percentage)
          // 更新进度显示
          // setUploadFilesShow(
          //   prevData =>
          //     prevData.map(
          //       prev =>
          //         prev.name === fileName
          //           ?
          //           Object.assign(prev, { hashPercentage: percentage })
          //           :
          //           prev
          //     ))
          if (hash) {
            resolve(hash);
            // console.log(`${fileName}计算完成hash: `, hash)
            worker.terminate()
            currentWebWorkers.current = currentWebWorkers.current.filter(item => item.key !== fileKey)
            setUploadFilesShow(
              prevData =>
                prevData.map(prev =>
                  prev.key === fileKey
                    ?
                    Object.assign(prev, {
                      hash: hash,
                      hashPercentage: 100,
                      uploadStatus: UploadStatus.uploading
                    })
                    :
                    prev
                ))
          }
        };
        worker.postMessage({ fileChunkList, fileName });

        currentWebWorkers.current.push({
          key: fileKey,
          worker: worker
        })
      } catch (err) {
        console.log('calculateHash error: ', err)
      }
    });
  }

  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  const verifyUpload = async (fileName: string, fileHash: unknown) => {
    const res = await services.verifyUpload({
      fileName,
      md5Sum: fileHash
    })
    // console.log(res)
    return res as { exist: boolean, chunks: string[], fileUrl: string }
  }

  // generator处理异步并行
  function* generator(arr: Promise<any>[]) {
    yield* arr
  }

  // 一次性上传的分片数量
  const onceUploadChunksNum = 5
  // 根据 hash 验证文件是否曾经已经被上传过
  // 没有才进行上传
  // verify that the file has been uploaded based on the hash
  // skip if uploaded
  const uploadChunks = async (uploadedList: string[] = [], fileChunkList: fileChunkItem[] = [], fileItem: UploadFileItem) => {
    // CustomForeach(uploadFilesShow, async (item, index) => {
    const requestListNew = fileChunkList
      .filter(({ hash }) => !uploadedList.includes((hash ?? '')))
      .map(({ chunk, hash, index, fileHash, fileName, chunkIndex }) => {
        // console.log({ chunk, hash, index, fileHash, fileName })
        const formData = new FormData();
        formData.append("file", chunk || '');
        // formData.append("md5Sum", hash || '');
        formData.append("chunkId", `${chunkIndex}`);
        // formData.append("fileName", fileName || '');
        formData.append("md5Sum", fileHash || '');
        return { formData, index };
      })
      .map(({ formData, index }) => {
        return { formData, index }
      }

      );
    // console.log('requestListNew', requestListNew)
    let uploadedChunks = 0;  // 已上传的分片数量  

    // 将总分片个数分组上传

    async function recursiveLoop() {
      // 如果再上传分片过程中，删除正在上传的文件，会将fileId放到shouldStopIds数组中，此时应该跳出循环
      if (shouldStopIds.current.includes(fileItem.fileId as string)) {
        return
      }
      const promiseDataArr = requestListNew.slice(uploadedChunks, uploadedChunks + onceUploadChunksNum)
      uploadedChunks = uploadedChunks + onceUploadChunksNum;

      const promiseArr = promiseDataArr.map(data => {
        const { formData, index } = data
        return new Promise((resolve, reject) => {
          const controller = new AbortController();
          services.uploadFileChunk({
            data: formData,
            // onUploadProgress: (e) => createProgressHandler(e, fileChunkList[(index ?? 0)]),
            // signal: controller.signal
          }).then(res => {
            resolve(res)
            const percentage = ((index || 0) / fileChunkList.length) * 100
            console.log('percentage', percentage)
            setUploadFilesShow(
              prevData =>
                prevData.map(prev =>
                  prev.hash === fileChunkList[(index ?? 0)].fileHash
                    ?
                    Object.assign(prev, {
                      percentage: Math.floor(percentage),
                      uploadStatus: UploadStatus.uploading
                    })
                    :
                    prev
                ))
            // 将请求成功的 xhr 从列表中删除
            // remove xhr which status is success
            if (requestList.current) {
              const xhrIndex = requestList.current.findIndex(item => item.key === fileItem.key);
              requestList.current.splice(xhrIndex, 1);
            }
          }).catch(err => {
            console.log(err)
            let response = err.response || {}
            const msg = response.data ? response.data.message : response.statusText
            // 分片上传失败，本次任务总大小减去
            // uploadsTotalSizeAll.current = uploadsTotalSizeAll.current - fileItem.size;
            setUploadFilesShow(
              prevData =>
                prevData.map(prev =>
                  prev.fileId === fileItem.fileId
                    ?
                    Object.assign(prev, {
                      uploaded: 2,
                      uploadError: msg || '上传失败'
                    })
                    :
                    prev
                ))
            reject(err)
          })
          // 暴露当前 xhr 给外部
          // export xhr
          const newRequestList = requestList.current
          newRequestList.push({
            key: fileItem.key,
            xhr: controller
          })
          requestList.current = [...newRequestList]
        })
      })

      await Promise.all(promiseArr).then(async (values) => {
        console.log(values, '完成一组分片上传')
        if (uploadedChunks >= requestListNew.length) {
          console.log("执行合并")
          await mergeRequest(fileItem);
        } else {
          recursiveLoop()
        }
      })
    }

    recursiveLoop();
  }

  // xhr
  const request = ({
    key,
    url,
    method = "post",
    data,
    headers = {
      Authorization: getToken() ?? ""
    },
    onProgress = e => e,
    onError = e => e
  }: {
    key: string;
    url: string,
    method?: string,
    data?: any,
    headers?: { [key: string]: string },
    onProgress?: (e: ProgressEvent) => void,
    onError?: (error: ProgressEvent) => void
  }): Promise<any> => {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = onProgress;
      xhr.open(method, url);

      Object.keys(headers).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      );
      xhr.send(data);
      xhr.onload = (ev: ProgressEvent) => {
        // 将请求成功的 xhr 从列表中删除
        // remove xhr which status is success
        // if (requestList.current) {
        //   const xhrIndex = requestList.current.findIndex(item => item.xhr === xhr);
        //   requestList.current.splice(xhrIndex, 1);
        // }
        resolve({
          data: (ev.target as XMLHttpRequest).response
        });
      };
      xhr.onerror = (ev: ProgressEvent) => {
        onError?.(ev)
      }

    });
  }

  // 更新每个 chunk 的进度数据
  // use closures to save progress data for each chunk
  const createProgressHandler = (e: ProgressEvent, item: fileChunkItem) => {
    const percentage = parseInt(String((e.loaded / e.total) * 100))
    console.log('percentage', percentage)
    setUploadFilesShow(
      prevData =>
        prevData.map(prev =>
          prev.hash === item.fileHash
            ?
            Object.assign(prev, {
              percentage: percentage,
              uploadStatus: UploadStatus.uploading
            })
            :
            prev
        ))
    item.percentage = percentage;
  }

  // 通知服务端合并切片
  // notify server to merge chunks
  const mergeRequest = async (fileItem: UploadFileItem) => {
    services.mergeUpload({
      size: uploadConfig.current.chunkSize,
      md5Sum: fileItem.hash,
      fileName: fileItem.name
    }).then(res => {
      const { fileUrl } = res
      Message.success(`${fileItem.name}上传成功`);
      // setUploadFilesShow(prevData => prevData.map(prev =>
      //   prev.fileId === fileItem.fileId ?
      //     Object.assign(prev, {
      //       uploadStatus: UploadStatus.success,
      //       uploaded: 1
      //     })
      //     :
      //     prev
      // ))

      // const formData = new FormData();
      // formData.append("jobId", fileItem.jobId || '');
      // formData.append("targetType", fileItem.targetType ? fileItem.targetType.join(',') : '');
      // formData.append("file", fileItem);

      const formData = {
        jobId: fileItem.jobId,
        targetType: fileItem.targetType ? fileItem.targetType.join(',') : '',
        file: {
          fileName: fileItem.name,
          fileType: fileItem.name.endsWith('.zip') ? 2 : 1,
          fileMd5: fileItem.hash,
          fileSize: fileItem.size,
          fileUrl: fileUrl,
          latitude: '',
          longitude: '',
          uploaded: 1, // 1 表示已完成
        }
      }
      // 上传成功之后，请求服务端增加文件接口
      submitNewFile(formData, fileItem.fileId || '')
    }).catch(err => {
      console.log(err)
      // Message.success(`${fileItem.name}上传失败`);
      setUploadFilesShow(prevData => prevData.map(prev =>
        prev.fileId === fileItem.fileId ?
          Object.assign(prev, {
            uploaded: 2,
            uploadError: '上传失败'
          })
          :
          prev
      ))
    })

  }

  const submitNewFile = (formData: any, oldFileId: string) => {
    services.offline.addFile<any, { fileId: string, message: string }>(formData).then(res => {
      const fileId = res.data?.fileId
      Message.success(res.data?.message || "增加文件成功！")

      // 从正在上传的数组中，删除该条数据
      const newUploadFilesShow = uploadFilesShowRef.current.filter(item => item.fileId !== oldFileId)
      setUploadFilesShow([...newUploadFilesShow])
      search(ajaxFormDataRef.current, newUploadFilesShow)
    }).catch(err => {
      console.log(err)
    })
  }

  // 删除文件
  const handleDeletUpload = (needDeleteKeys: string[] = []) => {
    let newTotalSize = 0,
      newUploadFilesShow = [],
      newUploadFiles = []

    // if (needDeleteKeys.length) {
    //   for (let i = 0; i < needDeleteKeys.length; i++) {
    //     const thisKey = needDeleteKeys[i]

    //     // 结束相关的worker
    //     if (currentWebWorkers.current.key === thisKey && currentWebWorkers.current.worker) {
    //       currentWebWorkers.current.worker.postMessage('close');
    //     }

    //     // 中断相关的ajax请求
    //     requestList.current.forEach((item, xhrIndex) => {
    //       if (item.key === thisKey && item.xhr) {
    //         item.xhr.abort()
    //         const newRequestList = requestList.current
    //         newRequestList.splice(xhrIndex, 1)
    //         requestList.current = [...newRequestList]
    //       }
    //     });

    //     // 从已上传列表中删除
    //     let newUploadsData = [...uploadsDataRef.current];
    //     newUploadsData.forEach((item, uploadedIndex) => {
    //       if (item.key === thisKey) {
    //         newUploadsData.splice(uploadedIndex, 1)
    //       }
    //     });
    //     uploadsDataRef.current = newUploadsData

    //   }

    //   for (let i = 0; i < uploadFilesShow.length; i++) {
    //     const item = uploadFilesShow[i]
    //     if (!needDeleteKeys.includes(item.key)) {
    //       newUploadFilesShow.push(item)
    //       newTotalSize += item.size
    //     }
    //   }

    //   // 如果有选择的话取消选中
    //   const newCheckedList = checkedList.filter(item => !needDeleteKeys.includes(item.key))
    //   setCheckedList(newCheckedList)
    //   // 改变全选半选状态
    //   setIndeterminate(!!newCheckedList.length && newCheckedList.length < newUploadFilesShow.length);
    //   setCheckAll(!!newUploadFilesShow.length && (newCheckedList.length === newUploadFilesShow.length))


    //   // 重新设置 uploadsFilesShow
    //   setUploadFilesShow([...newUploadFilesShow])
    // } else {
    //   Message.error("请选择需要删除的任务");
    // }

  }

  // 停止上传各任务
  const stopUpload = () => {
    const newShouldStopIds: string[] = []
    uploadFilesShowRef.current.forEach((item) => {
      // 结束相关的worker
      const thisWorker = currentWebWorkers.current.find(o => o.key === item.fileId)
      thisWorker?.worker?.postMessage('close');
      if (item.fileId) {
        newShouldStopIds.push(item.fileId)
      }
    })
    shouldStopIds.current = newShouldStopIds

    // 中断相关的ajax请求
    requestList.current.forEach((elem, xhrIndex) => {
      elem.xhr.abort()
    });
    requestList.current = []
    setUploadFilesShow([])
    uploadFilesShowRef.current = []
    uploadsDataRef.current = []
  }

  // 重置自动识别时间
  const handleResetTime = (fileIds: string[]) => {
    const formData = {
      fileId: fileIds,
      resetUserTime: 1
    }
    updateFileInfo(formData, true)
  }

  // 跳转
  const [jumpData, setJumpData] = useState({
    to: '',
    // state: {}
  })
  const handleJump = (link: string) => {
    const fileIds = checkedList.map(item => item.fileId + '')
    // window.open(`${link}?fileIds=${JSON.stringify(fileIds)}`)

    let logText = `${selectedNodes.length ? selectedNodes[0].props.dataRef.name : ``}(`
    checkedList.forEach((item, index) => {
      logText = logText + (index < checkedList.length - 1 ? `${item.fileName};` : `${item.fileName})`)
    })
    logText = logText + ` - 跳转：${link.indexOf('image') > -1 ? '以图检索' : "属性检索"}`

    // 日志提交
    logReport({
      type: 'none',
      data: {
        desc: logText,
      }
    })
    setJumpData({
      to: `${link}?offlineIds=${JSON.stringify(fileIds)} `,
      // state: { // 新页面携带不了
      //   offlineIds: fileIds
      // }
    })
  }

  return (
    <OfflineContext.Provider
      value={OfflineContextValue}
    >
      <div className={`${prefixCls} page-content`}>
        <OfflineTree
          prefixCls={prefixCls}
          onSelect={handleSelected}
          selectedNodes={selectedNodes}
        />
        <div className={`${prefixCls}-task-details`}>
          <Form layout="vertical" className="">
            <Form.Item
              colon={false}
              label="文件名称"
            >
              <Input
                placeholder="模糊检索"
                allowClear
                value={formData.fileName}
                onChange={handleInputChange}
                disabled={selectedNodes.length === 0}
              />
            </Form.Item>
            <Form.Item colon={false} label={" "}>
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
              <div>共 <span>{filterData.length}</span> 条结果</div>
              <Button onClick={handleOpenFileAdd}>添加文件</Button>
            </div>
            <div className="result-con">
              <ResultBox
                loading={ajaxLoading}
                nodata={!filterData || (filterData && !filterData.length)}
                nodataTip={selectedNodes.length === 0 ? "请尝试检索一下" : "搜索结果为空"}
                nodataClass={false ? `first-coming-${skin}` : ""}
              >
                <Table
                  loading={updateLoading}
                  data={filterData}
                  rowKey={"fileId"}
                  columns={columns}
                  // scroll={{
                  //   x: 1600,
                  // }}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: checkedList.map(item => item.fileId),
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
            filterData.length ?
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
                  {/* <Button
                    disabled={!checkedList.length}
                    size='small'
                  > */}
                  <Link
                    {...jumpData}
                    target="_blank"
                    onClick={(e) => handleJump('/target')}
                    className={!checkedList.length ? 'disabled btn-link ysd-btn-default' : 'btn-link ysd-btn-default'}
                  >属性检索</Link>
                  {/* </Button> */}
                  <span>
                    {/* <Button
                        disabled={!checkedList.length || checkedList.length > 5}
                        size='small'
                        onClick={() => handleJump('/image')}
                      ></Button> */}
                    <Link
                      {...jumpData}
                      target="_blank"
                      onClick={(e) => handleJump('/image')}
                      className={!checkedList.length ? 'disabled btn-link ysd-btn-default' : 'btn-link ysd-btn-default'}
                    >以图检索</Link>
                  </span>
                  <Button disabled={!checkedList.length} size='small' onClick={() => handleTimeSet()}>设置拍摄时间</Button>
                  <Button disabled={!checkedList.length} size='small' onClick={() => handlePositionSet()}>设置经纬度</Button>
                  <PopConfirm
                    title={`确认恢复选中文件的自动识别时间？`}
                    onConfirm={() => handleResetTime(checkedList.map(item => item.fileId))}
                  >
                    <Button disabled={!checkedList.length} size='small'>自动识别拍摄时间</Button>
                  </PopConfirm>
                  <PopConfirm
                    title={`确认删除文件？`}
                    onConfirm={() => handleDelFile(checkedList.map(item => item.fileId))}
                  >
                    <Button disabled={!checkedList.length} size='small' type="danger">删除</Button>
                  </PopConfirm>
                </div>
                {/* <Pagination
                disabled={!resultData.totalRecords || ajaxLoading}
                showSizeChanger
                showQuickJumper
                showTotal={() => `共 ${ resultData.totalRecords } 条`}
                total={resultData.totalRecords}
                current={ajaxFormData.pageNo}
                pageSize={Number(ajaxFormData.pageSize)}
                pageSizeOptions={character.pageSizeOptions}
                onChange={handleChangePn}
              /> */}
              </div>
              : ''
          }
        </div>
        <AddFileModal
          modalProps={{
            visible: addFileVisible,
            onCancel: () => setAddFileVisible(false)
          }}
          onModalConfirm={handleFileAddConfirm}
        />
        <FileEditModal
          data={currentData}
          modalProps={{
            visible: fileEditVisible,
            onCancel: () => setFileEditVisible(false)
          }}
          onModalConfirm={handleFileConfirm}
        />
        <TimeSetModal
          modalProps={{
            visible: timeSetVisible,
            onCancel: () => setTimeVisible(false)
          }}
          onModalConfirm={handleTimeConfirm}
          data={currentData}
        />
        <PositionSet
          modalProps={{
            visible: positionSetVisible,
            onCancel: handlePositionCancel
          }}
          onModalConfirm={handlePositionConfirm}
          data={{
            lng: currentData?.longitude || 0,
            lat: currentData?.latitude || 0
          }}
        />
        <VideoModal
          modalProps={{
            visible: videoVisible,
            onCancel: () => setVideoVisible(false)
          }}
          data={currentData}
        />
        <BigImg
          modalProps={{
            visible: bigImgVisible,
            onCancel: () => setBigImgVisible(false)
          }}
          data={bigImgData}
          showRightInfo={false}
        />

      </div>
    </OfflineContext.Provider>
  )
}

export default Offline