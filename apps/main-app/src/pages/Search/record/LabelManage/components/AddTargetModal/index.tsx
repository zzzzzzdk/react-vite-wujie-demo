import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Form, Radio, Message, Input, Loading, Upload, Select, Tabs, Button, Progress, Link, Table } from '@yisa/webui'
import { Icon, LoadingOutlined, PlusOutlined, CheckOutlined, ExclamationOutlined } from '@yisa/webui/es/Icon'
import { UploadButtonProps } from "@/components/ImgUpload/interface";
import BaseModalProps from "./../LabelSetModal/interface";
import { isObject, isFunction } from "@/utils";
import { FormRadioGroup, ImgUpload, FormPlate, FormVehicleModel } from "@/components"
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import useReceivers from "@/pages/Deploy/hooks/useReceivers";
import "./index.scss"
import { ResultLabelItem } from '../../interface';
import services from "@/services";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import cookie from "@/utils/cookie";
import { TargetFeatureItem } from "@/config/CommonType";
import { regular } from "@/utils";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { UploadItem } from "@yisa/webui/es/Upload/interface";
import { PlateTypeId } from '@/components/FormPlate/interface'
import classNames from 'classnames'
import { PlateValueProps } from "@/components/FormPlate/interface";
import { ImportResultType } from './interface'

const switchData = [
  { key: 'single', name: '单一目标导入' },
  { key: 'batch', name: '批量导入' },
]

function UploadButton(props: UploadButtonProps) {
  const { load, innerSlot } = props
  return (
    <>
      {
        load ?
          <LoadingOutlined />
          :
          innerSlot ?
            typeof innerSlot == 'function' ? innerSlot() : innerSlot
            :
            <>
              <PlusOutlined />
              <div className="upload-text">上传人脸图像</div>
            </>
      }
    </>
  )
}

const AddTargetModal = (props: BaseModalProps) => {
  const {
    modalProps,
    onModalConfirm,
    modalType = 'view',
    data = {} as unknown as ResultLabelItem,
  } = props

  /* 获取接收人 */
  // const receiverList = useReceivers();

  const [importType, setImportType] = useState('single')

  const [modalData, setModalData] = useState<{
    idNumber: string;
    documentType: string;
    featureList: TargetFeatureItem[];
    personName: string;
    hasImg: boolean;
    licensePlate: string;
    // 车牌颜色id
    plateColorTypeId: PlateTypeId;
    // 是否无牌
    noplate?: '' | 'noplate' | number;
  }>({
    idNumber: '',
    documentType: '111',
    featureList: [],
    personName: '',
    hasImg: false,
    licensePlate: "", //车牌号码
    plateColorTypeId: 5, //车牌颜色
    noplate: "",
  })

  const imgUploadRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState("")

  //刷新上传历史
  const [flushHistory, setFlushHistory] = useState(false)

  const [isImport, setIsImport] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const isUploading = useRef(importLoading);
  isUploading.current = importLoading;
  // 上传进度
  const [progressData, setProgressData]: any = useState({
    "data": {
      "success": 0,
      "failed": 0,
      "failedReason": "",
      "failedUrl": ""
    },
    "process": 0,
  })


  const [hoverImport, setHoverImport] = useState(false);
  // 导入结果
  const defaultImportResult = {
    "success": 0,
    "failed": 0,
    "failedReason": "",
    "failedUrl": ""
  }
  const [importResult, setImportResult] = useState<ImportResultType>(defaultImportResult);
  const hasImport = importResult.success > 0;

  useEffect(() => {
    if (data && modalProps?.visible) {


    }
  }, [props.data, modalProps?.visible])


  const handleOk = () => {
    if (importType === 'single' && data.labelTypeId === 'personnel') {
      if (!modalData.personName) {
        Message.warning('姓名不能设置为空')
        return
      }
      if (!modalData.idNumber) {
        Message.warning('证件号不能设置为空')
        return
      }
      if (modalData.documentType === '111' && !regular.isIdcard.test(modalData.idNumber || "")) {
        Message.warning("请输入正确证件号码");
        return;
      }
      if (modalData.documentType === '414' && !regular.isPassport.test(modalData.idNumber || "")) {
        Message.warning("请输入正确护照");
        return;
      }
    }
    if (importType === 'single' && data.labelTypeId === 'vehicle') {
      if (!modalData.licensePlate) {
        Message.warning('车牌号码不能设置为空')
        return
      }
    }
    if (importType === 'batch') {
      if (!importResult.success) {
        Message.warning(`${data.labelTypeId === 'personnel' ? '身份' : '车辆'}信息不能设置为空`)
        return
      }
    }
    const form = {
      ...data,
      ...modalData,
      ...importResult
    }
    // 添加目标
    services.labelManage.addTarget(form).then(res => {
      if (onModalConfirm && isFunction(onModalConfirm)) {
        onModalConfirm({
          ...form,
          importType
        })
        resetModalData()
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
    resetModalData()
  }

  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, []);

  const resetModalData = () => {
    setErrorMessage("")
    setModalData({
      idNumber: '',
      documentType: '111',
      featureList: [],
      personName: '',
      hasImg: false,
      licensePlate: "", //车牌号码
      plateColorTypeId: 5, //车牌颜色
      noplate: "",
    })
    setImportLoading(false);
    setImportResult(defaultImportResult);
    setImportModalVisible(false);
  }

  const handleFormSelectChange = (value: SelectCommonProps['value']) => {
    setModalData({
      ...modalData,
      documentType: (value || '111') as string
    })
  }

  // 上传文件
  const handleBeforeUpload = (file: File, filesList: File[]) => {
    const isXlsx =
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isXlsx) {
      Message.warning(
        "You can only upload application/vnd.openxmlformats-officedocument.spreadsheetml.sheet file!"
      );
    }
    return isXlsx;
  }

  // 获取导入模板
  const handleExcel = () => {
    // window.open(
    //   `${services.common.labelTemplateUrl}?labelType=${data.labelTypeId}`
    // );
    window.location.href = `${services.common.labelTemplateUrl}?labelTypeId=${data.labelTypeId}`
    // services.record.getExportExcel<any, any>({
    //   labelType: data.labelTypeId,
    // })
    //   .then(res => {
    //     if (res.data) {
    //       download(res.data)
    //     }
    //   })
  }

  const download = (url: string, fileName = '未知文件') => {
    if (!url) return
    const a = document.createElement('a');
    a.style.display = 'none';
    a.setAttribute('target', '_blank');
    fileName && a.setAttribute('download', fileName);
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  //特征数组改变事件
  const handleChangeFeatureList = (list: TargetFeatureItem[]) => {
    console.log("特征数组改变")
    setModalData({
      ...modalData,
      featureList: list,
      hasImg: false
    })
    if (list.length) {
      const feature = list[0].feature
      console.log(feature)

      services.labelManage
        .getPersonDetails<
          {
            feature?: string;
          },
          {
            idNumber: string;
            personName: string;
            documentType?: string;
            featureList: {
              targetImage: string;
              feature: string;
            }[];
          }
        >({
          feature: feature || "",
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            setErrorMessage("")
            if (data.featureList.length) {
              if (!modalData.idNumber) {
                setModalData({
                  ...modalData,
                  featureList: [res.data.featureList[0] as TargetFeatureItem],
                  personName: res.data.personName || '',
                  idNumber: res.data.idNumber || '',
                  hasImg: true
                })
              }
            }

          } else {
            Message.warning(res.message || "查无此人");
            setErrorMessage("目前档案库中无该人员，点击确认后将自动新增档案信息")
            throw new Error("res.data格式有误");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // 对输入的证件号进行检索，查找人员档案
  const handleIdNumberSearch = () => {
    if (modalData.documentType === '111' && !regular.isIdcard.test(modalData.idNumber || "")) {
      Message.warning("请输入正确证件号码");
      return;
    }

    if (modalData.documentType === '414' && !regular.isPassport.test(modalData.idNumber || "")) {
      Message.warning("请输入正确护照");
      return;
    }

    services.labelManage
      .getPersonDetails<
        {
          idNumber?: string;
          documentType?: string;
          feature?: string;
        },
        {
          idNumber: string;
          personName: string;
          documentType?: string;
          featureList: {
            targetImage: string;
            feature: string;
          }[];
        }
      >({
        idNumber: modalData.idNumber || "",
        documentType: modalData.documentType || "111",
      })
      .then((res) => {
        const data = res.data;
        if (data && data.featureList.length) {
          setErrorMessage("")
          if (!modalData.featureList.length) {
            setModalData({
              ...modalData,
              featureList: [data.featureList[0] as TargetFeatureItem],
              personName: data.personName || '',
              hasImg: true
            })
          }

        } else {
          Message.warning(res.message || "查无此人");
          setErrorMessage("目前档案库中无该人员，点击确认后将自动新增档案信息")
          throw new Error("res.data格式有误");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handleImgClusterChange = (data: ResultRowType | null) => {
    console.log(data)
    if (data) {
      // const 
      setModalData({
        ...modalData,
        featureList: [data] as unknown as TargetFeatureItem[],
        idNumber: data.personBasicInfo?.idcard || '',
        documentType: '111'
      })
      setErrorMessage('')
    } else {
      setModalData({
        ...modalData,
        featureList: [],
        idNumber: '',
        documentType: '111'
      })
      setErrorMessage('目前档案库中无该人员，点击确认后将自动新增档案信息')
    }
  }

  // 人脸聚类改变
  const handleImgClusterError = (error: string, data: TargetFeatureItem[]) => {
    setModalData({
      ...modalData,
      featureList: data,
      idNumber: '',
      documentType: '111'
    })
    setErrorMessage('目前档案库中无该人员，点击确认后将自动新增档案信息')
  }

  const ajaxProgress = useRef<any>(null)
  useEffect(() => {
    if (ajaxProgress.current) {
      clearInterval(ajaxProgress.current)
      ajaxProgress.current = null
    }
    return () => {
      console.log('111111111');
      if (ajaxProgress.current) {
        clearInterval(ajaxProgress.current)
        ajaxProgress.current = null
      }
    }
  }, [])

  const handleUploadChange = (fileList: UploadItem[], file: UploadItem) => {
    const { status, response } = file;
    console.log(status)
    if (status === "init" || status === "uploading") {
      setImportLoading(true);
      setImportModalVisible(true);
      setIsImport(true)
      return;
    }
    if (status === "done") {
      const responseData = response as { data?: { taskId: string; labelTypeId: string } };
      if (responseData.data && responseData.data.taskId && responseData.data.labelTypeId) {
        setImportLoading(false);
        ajaxProgress.current = setInterval(() => {
          getProgress(responseData.data || {
            taskId: "",
            labelTypeId: ""
          });
        }, 1000);
      } else {
        Message.error("上传响应数据格式不正确");
        setImportLoading(false);
        setIsImport(false);
        onClose();
      }

      // const result: ImportResultType = (response as ImportResultType) || {
      //   successNum: 0,
      //   successUrl: "",
      //   failNum: 0,
      //   failUrl: "",
      // };
      // setImportResult(result);
      // setImportModalVisible(true);
    }
    if (status === "error") {
      Message.error((response as any).message);
      setImportLoading(false);
      setIsImport(false)
      onClose()
    }
  }

  const getProgress = (data: { taskId: string, labelTypeId: string }) => {
    services.labelManage.getProcessData<{}, ImportResultType>({
      taskId: data.taskId,
      labelTypeId: data.labelTypeId
    })
      .then(res => {
        setProgressData(res)
        if (res.process == 100) {
          setIsImport(false)
          clearInterval(ajaxProgress.current)
          ajaxProgress.current = null
          setImportResult(res.data || defaultImportResult);
        }
      })
      .catch(err => {
        setIsImport(false)
        clearInterval(ajaxProgress.current)
        ajaxProgress.current = null
        onClose()
      })
  }

  const onClose = () => {

    setProgressData({
      "data": {
        "success": 0,
        "failed": 0,
        "failedReason": "",
        "failedUrl": ""
      },
      "process": 0,
    })
    setImportModalVisible(false)
  }

  const handlePlateChange = ({
    plateNumber,
    plateTypeId,
    noplate,
  }: PlateValueProps) =>
    setModalData({
      ...modalData,
      licensePlate: plateNumber,
      plateColorTypeId: plateTypeId,
      noplate: noplate,
    });

  return (
    <Modal
      title={`添加目标`}
      {...(modalProps || {})}
      className="add-target-modal"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Tabs
        // type='line'
        defaultActiveKey={importType}
        data={switchData}
        onChange={(key) => setImportType(key)}
      />
      <div className="add-target-form-wrapper">
        {
          (importType === 'single' && data.labelTypeId === 'personnel') &&
          <ImgUpload
            ref={imgUploadRef}
            limit={1}
            multiple={true}
            showConfirmBtn={false}
            innerSlot={<UploadButton />}
            flushHistory={flushHistory}
            onFlushHistoryComplete={() => { setFlushHistory(false) }}
            featureList={modalData.featureList as TargetFeatureItem[]}
            onChange={handleChangeFeatureList}
            formData={{
              analysisType: 'face',
            }}
            uploadHistoryType="face"
            searchCluster={false}
            showClusterData={false}
            onClusterSelected={handleImgClusterChange}
            onClusterError={handleImgClusterError}
          />

        }
        <div className={`add-target-form ${importType}`}>
          <Form labelAlign="left">
            <Form.Item label="目标类型"><span>{data.labelType || '--'}</span></Form.Item>
            <Form.Item label="标签名称"><span>{data.labelName || '--'}</span></Form.Item>
            {
              importType === 'single' &&
              (
                data.labelTypeId === 'personnel' ?
                  <>
                    <Form.Item
                      label="姓名"
                      required
                    >
                      <Input
                        allowClear
                        value={modalData.personName}
                        placeholder="请输入姓名"
                        onChange={(e) => {
                          setModalData({
                            ...modalData,
                            personName: e.target.value
                          })
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="证件类型" required>
                      <Select
                        // allowClear
                        options={[{ value: '111', label: '身份证', }, { value: '414', label: '护照' },
                          // { value: '123', label: '警官证' }
                        ]}
                        onChange={(value) => handleFormSelectChange(value)}
                        value={modalData.documentType}
                        // showSearch={true}
                        // @ts-ignore
                        getTriggerContainer={(triggerNode) =>
                          triggerNode.parentNode as HTMLElement
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="证件号"
                      required
                      errorMessage={errorMessage}
                    >
                      <>
                        <Input
                          allowClear
                          value={modalData.idNumber}
                          placeholder="请输入证件号"
                          onChange={(e) => {
                            setModalData({
                              ...modalData,
                              idNumber: e.target.value
                            })
                          }}
                        />
                        <Button
                          className="id-number-btn"
                          type="primary"
                          onClick={handleIdNumberSearch}
                        >
                          查询
                        </Button>
                      </>
                    </Form.Item>
                  </>
                  :
                  <Form.Item
                    label="车牌号码"
                    required
                    errorMessage={errorMessage}
                  >
                    <FormPlate
                      allowClear
                      isShowKeyboard
                      isShowNoLimit={false}
                      value={{
                        plateNumber: modalData.licensePlate,
                        plateTypeId: modalData.plateColorTypeId,
                        noplate: (modalData.noplate as 'noplate' | '')
                      }}
                      onChange={(value) => { handlePlateChange(value) }}
                    />
                  </Form.Item>
              )
            }
          </Form>
          {
            importType === 'batch' &&
            <Form layout="vertical" className="identity-form">
              <Form.Item label={data.labelTypeId === 'vehicle' ? '车辆信息' : '身份信息'} >
                <>
                  <Upload
                    action={`${window.YISACONF.api_host}/v1/label-manage/excel`}
                    showUploadList={false}
                    multiple
                    // multiLine
                    drag
                    accept=".xlsx"
                    onChange={handleUploadChange}
                    disabled={false}
                    beforeUpload={handleBeforeUpload}
                    headers={{ 'Authorization': `${cookie.getToken()}`, 'Frontend-Route': window.location.hash.split('?')[0] }}
                    data={{
                      labelTypeId: data.labelTypeId,
                      labelId: data.labelId,
                      labelName: data.labelName
                    }}
                  >
                    <div
                      className={classNames("plate-batch-import-inner", {
                        "has-import": hasImport,
                      })}
                      onMouseEnter={() => setHoverImport(true)}
                      onMouseLeave={() => setHoverImport(false)}
                    >
                      {hasImport ? (
                        hoverImport ? (
                          <span className="afresh">重新导入</span>
                        ) : (
                          <span>
                            已导入
                            <span>
                              {importResult.success}
                            </span>{" "}
                            条数据
                          </span>
                        )
                      ) : (
                        <Loading spinning={importLoading}><PlusOutlined />上传文件</Loading>
                      )}
                    </div>
                  </Upload>
                  <div onClick={handleExcel} className="download">下载附件</div>
                </>
              </Form.Item>
            </Form>
          }
        </div>
      </div>
      <Modal
        visible={importModalVisible}
        onCancel={() => {
          // if (!isImport) {
          //   setImportModalVisible(false)
          // }
        }}
        className="import-result-modal"
        // mask={false}
        // title={
        //   <>
        //     <ExclamationCircleFilled />
        //     证件号码导入提示
        //   </>
        // }
        footer={null}
        closable={false}
      >
        {
          isImport ? <div className="progress">
            <div className="tip">正在导入中...</div>
            <Progress
              percent={progressData.process}
              strokeWidth={10}
              strokeColor={{
                '0%': 'rgba(0,204,102,0.3)',
                '50%': 'rgba(0,204,102,1)',
              }}
            />
            <div className="info"><Icon type="jinggao" />导入进行中，请不要刷新或关闭此页面</div>
          </div>
            : progressData.data.failed ?
              <div>
                <div className={`result error`}>
                  <div className="icon-wrap"><ExclamationOutlined /></div>
                  <p className="text">导入失败</p>
                  <div className="success-text">导入成功 <span className="total">{progressData.data.success}</span> 条，</div>
                  <div className="error-text">导入失败 <span className="total">{progressData.data.failed}</span> 条，<Link href={progressData.data.failedUrl}>下载失败原因</Link></div>
                  {/* <div>失败原因是{progressData.data.failedReason}，请点击此处 <Link href={progressData.data.failedUrl}>下载失败原因</Link></div> */}
                </div>
                <div className="footer">
                  <Button onClick={onClose}>关闭</Button>
                  {/* <Button type="primary" onClick={onAgain}> 重新选择 </Button> */}
                </div>
              </div>
              :
              <>
                <div className={`result success`}>
                  <div className="icon-wrap"><CheckOutlined /></div>
                  <p className="text">导入成功</p>
                  <div className="success-text">导入成功 <span className="total">{progressData.data.success}</span> 条</div>
                </div>
                <div className="footer">
                  <Button onClick={onClose}>关闭</Button>
                  {/* <Button type="primary" onClick={onAgain}> 继续导入 </Button> */}
                </div>
              </>
        }
      </Modal>
    </Modal>
  )
}

export default AddTargetModal