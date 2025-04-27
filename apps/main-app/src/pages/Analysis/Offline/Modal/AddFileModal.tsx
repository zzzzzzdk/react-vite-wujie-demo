import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, Checkbox, Table, Message, Button, Progress, PopConfirm, Loading } from '@yisa/webui'
import BaseModalProps from "./interface";
import { isObject, isFunction, toSizeText } from "@/utils";
import OfflineTreeSelect from "./OfflineTreeSelect";
import character from "@/config/character.config";
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import cookie from "@/utils/cookie";
import services from "@/services";
import { useResetState } from "ahooks";
import { UploadStatus, UploadStatusType, fileChunkItem, UploadFileItem } from '../interface'


const AddFileModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm
  } = props
  const [formData, setFormData, resetFormData] = useResetState({
    jobId: '',
    targetType: ['face', 'pedestrian', 'bicycle', 'tricycle', 'vehicle'],
    fileList: []
  })

  const [diskFree, setDiskFree] = useState(0)

  // 文件上传
  const $fileUpload = useRef<HTMLInputElement>(null)
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<UploadFileItem[]>([])


  // 上传的文件
  const [uploadFiles, setUploadFiles] = useState<UploadFileItem[]>([])
  // 上传总文件大小
  const uploadsTotalSizeAll = useRef(0)

  useEffect(() => {
    if (modalProps?.visible) {
      getDiskFree()
    }
  }, [modalProps?.visible])

  // 获取磁盘剩余存储空间
  const getDiskFree = () => {
    services.getDiskFree().then(res => {
      const { freeSpace, errorMessage } = res
      setDiskFree(freeSpace || '0GB')
    }).catch(err => {
      console.log(err)
    })
  }

  // 所属分组改变
  const handleChangeJobId = (value: string) => {
    setFormData({
      ...formData,
      jobId: value
    })
  }

  // 解析类型改变
  const handleCheckGroupChange = (values: any[]) => {
    setFormData({
      ...formData,
      targetType: values
    })
  }

  // 结果选中
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked) {
      setCheckedList(uploadFiles)
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

  const columns: ColumnProps<any>[] = [
    {
      title: '文件名称',
      dataIndex: 'name',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      render: (text) => toSizeText(text)
    },
    // {
    //   title: '状态',
    //   dataIndex: 'percentage',
    //   render: (text, record, index) => (
    //     <Loading
    //       spinning={record.status === Status.wait}
    //       indicator={<span>生成文件hash...</span>}
    //     >
    //       <Progress
    //         percent={text}
    //         strokeWidth={8}
    //         status={record.status}
    //         strokeColor={{
    //           '0%': '#108ee9',
    //           '50%': '#87d068',
    //         }}
    //       />
    //     </Loading>
    //   )
    // },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text, record, index) => (
        <PopConfirm
          title={`确认删除该文件？`}
          onConfirm={() => handleDeletFile([record.key])}
        >
          <Button type='danger' size="mini">删除</Button >
        </PopConfirm>
      )
    },
  ]

  const handleTableCheckedChange = (selectedRowKeys: (string | number)[], selectedRows: any[]) => {
    // console.log(selectedRowKeys, selectedRows)
    setCheckedList(selectedRows)
    setIndeterminate(!!selectedRows.length && selectedRows.length < uploadFiles.length);
    setCheckAll(selectedRows.length === uploadFiles.length);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
    addFiles(event.target.files);
    event.target.value = ''
  }

  // 上传区域点击
  const handleUploadClick = () => {
    $fileUpload.current?.click()
  }

  // 区域拖拽
  const handleUploadDragover = (event: React.DragEvent) => {
    event.preventDefault();
  }

  // 区域拖拽结束
  const handleUploadDrop = (event: React.DragEvent) => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  const setId = () => {
    let stamp = new Date().getTime();
    return (((1 + Math.random()) * stamp) | 0).toString(16);
  }

  // 添加上传文件
  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let flieArr = file.name.split('.')
      if (!file.size) {
        Message.warning(`${file.name}文件大小为0`);
        continue;
      }
      if (flieArr && flieArr.length > 1 &&
        (flieArr[1] == 'jpg' ||
          flieArr[1] == 'jpeg' ||
          flieArr[1] == 'png' ||
          flieArr[1] == 'bmp')) {
        Message.warning('jpg、jpeg、png、bmp等图片格式需要打包上传');
        continue;
      }
      // file['status'] = Status.wait
      // 整合大小
      uploadsTotalSizeAll.current = uploadsTotalSizeAll.current + file.size;
    }
    const newFiles = [...files].map(item => {
      return Object.assign(item, {
        status: UploadStatus.wait,
        key: item.name + item.size + setId()
      })
    })
    setUploadFiles([...uploadFiles, ...newFiles])
  }

  const handleDeletFile = (needDeleteKeys: string[] = []) => {
    if (needDeleteKeys.length) {
      const newUploadFiles = uploadFiles
      newUploadFiles.forEach((item, index) => {
        if (needDeleteKeys.includes(item.key)) {
          // 更改已上传文件的大小
          uploadsTotalSizeAll.current = uploadsTotalSizeAll.current - item.size;
          newUploadFiles.splice(index, 1)
        }
      })
      setUploadFiles(newUploadFiles)

      // 如果有选择的话取消选中
      const newCheckedList = checkedList.filter(item => !needDeleteKeys.includes(item.key))
      setCheckedList(newCheckedList)
      // 改变全选半选状态
      setIndeterminate(!!newCheckedList.length && newCheckedList.length < uploadFiles.length);
      setCheckAll(!!uploadFiles.length && (newCheckedList.length === uploadFiles.length))
    } else {
      Message.warning("请选择需要删除的任务");
    }
  }

  const handleOk = () => {
    if (!formData.jobId) {
      Message.warning("请选择所属分组")
      return
    }

    if (!formData.targetType.length) {
      Message.warning("请选择解析类型")
      return
    }
    if (onModalConfirm && isFunction(onModalConfirm)) {
      onModalConfirm({
        ...formData,
        fileList: uploadFiles
      })
    }

    // 确定之后重置数据
    resetFormData()
    resetChecked()
    setUploadFiles([])
    uploadsTotalSizeAll.current = 0

  }

  const handleCancel = () => {
    // uploadsDataRef.current = []
    resetFormData()
    resetChecked()
    setUploadFiles([])
    uploadsTotalSizeAll.current = 0
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
  }


  return (
    <Modal
      title="添加文件"
      {...(modalProps || {})}
      className="add-file-modal"
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        disabled: uploadFiles.length === 0
      }}
      unmountOnExit
    >
      <Form>
        <Form.Item label="所属分组" required>
          <OfflineTreeSelect
            value={formData.jobId}
            onChange={handleChangeJobId}
          />
        </Form.Item>
        <Form.Item label="解析类型" required>
          <Checkbox.Group
            options={character.hasGait ? character.analysisTypes.concat([{ label: '步态', value: 'gait' }]) : character.analysisTypes}
            value={formData.targetType}
            onChange={handleCheckGroupChange} />
        </Form.Item>
        <Form.Item label="上传文件" required className="upload-form-item">
          <div
            className="upload-area"
            onClick={handleUploadClick}
            onDragOver={handleUploadDragover}
            onDrop={handleUploadDrop}
          >
            <input
              type="file"
              multiple={true}
              style={{ display: "none" }}
              ref={$fileUpload}
              accept="video/*,application/x-zip-compressed,.mbf"
              onChange={handleFileChange}
            ></input>
            <div className="upload-btn">
              <span>添加视频文件或图片文件压缩包</span>
            </div>
            <div className="upload-tip">
              <p>*支持AVI、MP4、MPG、MOV、VOB、WMV、FLV、RMVB、MBF等视频封装格式；</p>
              <p>支持jpg、jpeg、png、bmp等图片格式，请使用winrar或系统自带等标准zip压缩软件打包程ZIP格式压缩包上传；</p>
            </div>
          </div>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <div className="upload-result">
            <Table
              // virtualized // key值有问题，不可用
              scroll={{
                y: 175,
              }}
              border
              columns={columns}
              data={uploadFiles}
              pagination={false}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: checkedList.map(item => item.key),
                onChange: handleTableCheckedChange,
              }}
              rowKey={(record: UploadFileItem) => record.key}
            />
            <div className="upload-result-bottom">
              <div className={"check-box"}>
                <Checkbox
                  className="card-checked"
                  checked={checkAll}
                  indeterminate={indeterminate}
                  onChange={handleCheckAllChange}
                  disabled={uploadFiles.length === 0}
                >
                  全选
                </Checkbox>
                已经选择<span className="num">{checkedList.length}</span>个

                <PopConfirm
                  title={`确认删除文件？`}
                  onConfirm={() => handleDeletFile(checkedList.map(item => item.key))}
                >
                  <Button
                    type='danger'
                    size="mini"
                    disabled={uploadFiles.length === 0 || !checkedList.length}
                  >删除</Button>
                </PopConfirm>
              </div>
              <div className="total">
                剩余存储：{diskFree}；本次任务：{toSizeText(uploadsTotalSizeAll.current)}
              </div>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddFileModal