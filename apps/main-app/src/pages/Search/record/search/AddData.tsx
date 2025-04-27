import { Upload, Message, Table, Modal, Link, Progress, Button } from "@yisa/webui"
import ajax, { ApiResponse } from '@/services'
import './index.scss'
import { UploadItem } from "@yisa/webui/es/Upload/interface";
import { PlusOutlined, CheckOutlined, ExclamationOutlined, Icon } from '@yisa/webui/es/Icon'
import { useState, useRef, useEffect, useCallback } from "react";
import cookie from "@/utils/cookie";
export type ImportResultType = {
  success: number;
  successUrl: string;
  failed: number;
  failedUrl: string;
  errorText: string
};

const AddData = (props: any) => {
  const {
    type,//personExcel personZip carExcel
    width,
    title,
    accept
  } = props
  const prefixCls = 'record-search-add-data'

  // 下载模板
  const handleExcel = () => {
    window.open(type === "carExcel" ? ajax.common.vehicleTemplateUrl : ajax.common.personTemplateUrl)
    // ajax.record.getExportExcel<any, any>({ fileType: type == 'personZip' ? '2' : '1' }, type === "carExcel" ? ajax.common.vehicleTemplateUrl : "")
    //   .then(res => {
    //     if (res.data) {
    //       download(res.data)
    //     }
    //   })
  }
  // 下载文件
  const download = (url: string, fileName = '未知文件') => {
    if (!url) return
    // const a = document.createElement('a');
    // a.style.display = 'none';
    // a.setAttribute('target', '_blank');
    // fileName && a.setAttribute('download', fileName);
    // a.href = url;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    window.location.href = url
  }

  // 导入结果
  const [importResult, setImportResult] = useState<ImportResultType>({
    success: 0,
    successUrl: "",
    failed: 0,
    failedUrl: "",
    errorText: ''
  });
  const uploadRef = useRef<any>(null)
  // 是否正在导入
  const [isImport, setIsImport] = useState(false)
  // 导入结果展示
  const [importModalVisible, setImportModalVisible] = useState(false);
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
  const getProgress = (data: { taskId: string }) => {
    ajax.record.getRecordProgress<any, any>({ taskId: data.taskId, fileType: type == 'personZip' ? 2 : 1 }, type === "carExcel" ? ajax.common.vehicleProgressUrl : "")
      .then(res => {
        setProgressData(res)
        if (res.process == 100) {
          setIsImport(false)
          clearInterval(ajaxProgress.current)
          ajaxProgress.current = null
        }
      })
      .catch(err => {
        setIsImport(false)
        clearInterval(ajaxProgress.current)
        ajaxProgress.current = null
        onClose()
      })
  }

  const handleFileChange = (fileList: UploadItem[], file: UploadItem) => {
    const { status, response } = file;
    if (status === "init" || status === "uploading") {
      setImportModalVisible(true);
      setIsImport(true)
      return;
    }
    if (status === "done") {
      console.log(response);
      ajaxProgress.current = setInterval(() => {
        getProgress(response as { taskId: string })
      }, 1000)
      // const result: ImportResultType = (response as ImportResultType) || {
      //   success: 0,
      //   successUrl: "",
      //   failed: 0,
      //   failedUrl: "",
      // };
      // setImportResult(result);
      // setIsImport(false)
    }
    if (status === "error") {
      Message.error((response as any).message);
      setIsImport(false)
      onClose()
    }
  }

  const columns = [
    {
      title: '证件类型(必填)',
      dataIndex: 'idType',
      width: 130
    },
    {
      title: '证件号(必填)',
      dataIndex: 'idNumber',
      width: 180
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render() {
        return <div></div>
      },
      width: 60
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render() {
        return <div></div>
      },
      width: 60
    },
    {
      title: '出生日期',
      dataIndex: 'birth',
      width: 100
    },
    {
      title: '婚姻状况',
      dataIndex: 'marriage',
      width: 90
    },
    {
      title: '民族',
      dataIndex: 'nation',
      width: 90
    },
    {
      title: '文化程度',
      dataIndex: 'education',
      width: 90
    },
    {
      title: '宗教信仰',
      dataIndex: 'religious',
      width: 90
    },
    {
      title: '籍贯地区-省',
      dataIndex: 'province',
      width: 130
    },
    {
      title: '籍贯地区-市',
      dataIndex: 'city',
      width: 130
    },
    {
      title: '籍贯地区-区(县)',
      dataIndex: 'county',
      width: 150
    },
    {
      title: '标签',
      dataIndex: 'label',
      render() {
        return <div className="label-item">重点人员</div>
      },
      width: 90
    },
  ];
  const data = [
    {
      key: '1',
      name: '张三',
      else: '...',
      sex: '男',
      idType: '身份证',
      idNumber: '370126********1234',
      birth: '20000101',
      marriage: "已婚",
      nation: "汉族",
      education: "初中",
      religious: "无",
      province: "山东省",
      city: "青岛市",
      county: "黄岛区",
      licensePlate: "京A88888",
      plateColor: "黑",
      telStatus: "名下",
      telPhone: "13456566609",
      plateType: "领馆汽车号牌",
      vehicleModel: "小型汽车",
      vehicleType: "重型集装箱半挂车",
      vehicleColor: "白",
      // 34240199203287494
    },
    {
      key: '2',
      name: '李四',
      else: '...',
      sex: '女',
      idType: '护照',
      idNumber: 'B4773466',
      birth: '20000101',
      marriage: "未婚",
      nation: "回族",
      education: "高中",
      religious: "伊斯兰教",
      province: "山东省",
      city: "青岛市",
      county: "黄岛区",
      licensePlate: "京B88888",
      plateColor: "绿",
      telStatus: "使用",
      telPhone: "14456566609",
      plateType: "使馆汽车号牌",
      vehicleModel: "小型汽车",
      vehicleType: "重型集装箱半挂车",
      vehicleColor: "白"
      // B4773466
    },
  ];
  const columnsVehicle = [
    {
      title: '车牌颜色(必填)',
      dataIndex: 'plateColor',
      width: 130
    },
    {
      title: '车牌号码(必填)',
      dataIndex: 'licensePlate',
      width: 130
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      width: 100
    },
    {
      title: '证件号',
      dataIndex: 'idNumber',
      width: 150
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 60
    },
    {
      title: '联系方式-状态',
      dataIndex: 'telStatus',
      width: 130
    },
    {
      title: '联系方式-号码',
      dataIndex: 'telPhone',
      width: 130
    },
    {
      title: '标签',
      dataIndex: 'label',
      render() {
        return <div className="label-item">重点车辆</div>
      },
      width: 90
    },
    {
      title: '号牌种类',
      dataIndex: 'plateType',
      width: 110
    },
    {
      title: '车辆型号',
      dataIndex: 'vehicleModel',
      width: 100
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      width: 180
    },
    {
      title: '车身颜色',
      dataIndex: 'vehicleColor',
      width: 100
    },
    {
      title: '...',
      dataIndex: 'else',
      width:80
    },
  ];
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
  const onAgain = () => {
    onClose()
    $fileUpload.current?.click()
  }

  const handleBeforeUpload = useCallback((file: File, filesList: File[]) => {
    let acceptType = accept ? accept.split(',') : []
    const isFormat = acceptType.some((item: string) => file.name.endsWith(item))
    if (!isFormat) {
      Message.info('不接受的文件类型，请重新上传指定文件类型~');
    }
    return isFormat
  }, [accept])

  // 上传文件
  const handleAddFile = (files: any) => {
    if (!files?.length) return;
    // if (!/xlsx\/xls*/.test(files[0].type)) {
    // Message.warning("请上传正确的文件格式")
    //   setImportModalVisible(false)
    //   return
    // }
    const file = files[0]
    if (file) {
      //此处进行上传逻辑处理
      let formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", type == 'personZip' ? '2' : '1');
      ajax.record.importRecordExcel(formData, type === "carExcel" ? ajax.common.vehicleTemplateUrl : "")
        .then(res => {
          ajaxProgress.current = setInterval(() => {
            getProgress(res as { taskId: string })
          }, 1000)
        })
        .catch(err => {
          console.log(err);
          setIsImport(false)
          onClose()
        })
    }
  }
  // 文件上传
  const $fileUpload = useRef<HTMLInputElement>(null)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportModalVisible(true);
    setIsImport(true)
    handleAddFile(event.target.files)
    event.target.value = ''
  }

  // 拖拽文件上传
  const handleDropFile = useCallback((e: any) => {
    let uploadFile = e.dataTransfer.files[0]
    let acceptType = accept ? accept.split(',') : []
    if (acceptType.some((item: string) => uploadFile.name.endsWith(item))) {
      return
    } else {
      Message.info('不接受的文件类型，请重新上传指定文件类型~');
      return
    }
  }, [accept])

  return <div className={`item ${type}`} >
    <div className="item-header">
      <div className="header-left">{title}</div>
      <div className="header-right">
        {
          type == 'personZip' ? '' :
            <div onClick={handleExcel} className="download">模板下载</div>
        }
      </div>
    </div>
    <div className="item-content">
      <input
        type="file"
        style={{ display: "none" }}
        ref={$fileUpload}
        accept={accept}
        onChange={handleInputChange}
        onError={() => {
          setIsImport(false)
        }}
      />
      <Upload
        drag
        ref={uploadRef}
        showUploadList={false}
        accept={accept}
        headers={{ Authorization: `${cookie.getToken()}`, 'Frontend-Route': window.location.hash.split('?')[0] }}
        style={{ width: width, height: '132px' }}
        onDrop={handleDropFile}
        data={{
          fileType: type == 'personZip' ? 2 : 1
        }}
        onChange={handleFileChange}
        action={type === "carExcel" ? ajax.common.vehicleTemplateUrl : "/api/fusion/v1/personArchives/excel"}
        children={<div className="upload-file">
          <PlusOutlined />{type == 'personZip' ? '上传图片压缩包' : '上传文件'}
        </div>}
        beforeUpload={handleBeforeUpload}
      />
      <div className="upload-tip">
        {
          type !== 'personZip' ?
            type === "carExcel" ?
              <>
                <div>
                  上传文件说明：
                </div>
                <div>1、请按照模板填写数据，不可修改表格样式，车牌颜色和车牌号为必填，如内容为下拉列表选择，不可自行输入字段，否则导入失败。</div>
                <div>2、车辆库中已存在的信息不可通过上传方式修改。</div>
                <div>3、车主有多个联系方式、标签等信息时，需多行填写，若车牌颜色、车牌号一致，联系方式、标签等信息会导入到同一车辆信息中。</div>
                <div>例如：</div>
              </>
              :
              <>
                <div>
                  上传文件说明：
                </div>
                <div>1、请按照模板填写数据，不可修改表格样式，证件类型和证件号为必填，如内容为下拉列表选择，不可自行输入字段，否则导入失败。</div>
                <div>2、已入库人员的基本信息不可通过上传方式修改。</div>
                <div>3、同一人员有多个联系方式、车辆、地址信息、标签时，填写方式为: 证件类型与证件号一致，联系方式、车辆、地址信息、标签信息多行填写，其他栏目不要填写。</div>
                <div>例如：</div>
              </>
            : <>
              <div>上传文件说明：</div>
              <div>1、将人脸照片名称设置为：证件格式代码_证件号码。证件格式代码：身份证号代码111，护照414。      </div>
              <div style={{ paddingLeft: '30px' }}>示例：111_370202198803190559。</div>
              <div>2、支持jpg、jpeg、png、bmp等图片格式，请使用系统自带等标准zip压缩软件打包成zip格式压缩包上传。</div>
              <div>3、每张图像需仅包含一个人脸信息。</div>
            </>
        }
      </div>
      {
        type !== 'personZip' ?
          <div className={`upload-list upload-list-${type}`}>
            <Table
              hover={false}
              rowKey={"key"}
              scroll={{ x: true }}
              columns={type === "carExcel" ? columnsVehicle : columns} data={data}
            />
          </div>
          : null
      }
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
                <Button type="primary" onClick={onAgain}> 重新选择 </Button>
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
                <Button type="primary" onClick={onAgain}> 继续导入 </Button>
              </div>
            </>
      }
    </Modal>
  </div>
}
export default AddData
