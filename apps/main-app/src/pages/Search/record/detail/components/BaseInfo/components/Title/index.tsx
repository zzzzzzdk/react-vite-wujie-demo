import './index.scss'
import { ImgUpload } from '@/components'
import { useState, useRef } from 'react'
import { TargetFeatureItem } from '@/config/CommonType'
import { ResultRowType } from '@/pages/Search/Target/interface'
import ajax, { ApiResponse } from "@/services";
interface TitleProps {
  uploadurl?: string,//上传图片地址
  title: string,//标题
  handleSave?: () => void//保存
  handleCancel?: () => void//取消
  handleEdit?: () => void//编辑
  handleAdd?: (data: any) => void//添加
  isEdit?: boolean
  type?: string
  hasEditBtn?: boolean //是否需要编辑按钮
  addType?: string//添加文件类型
  uploadForm?: {
    analysisType: string
  }
}

const Title = (props: TitleProps) => {
  const {
    uploadurl = ajax.common.imageUploadUrl,
    title = '',
    handleSave,
    handleCancel,
    handleEdit,
    handleAdd = () => { },
    isEdit = false,
    type = '',
    hasEditBtn = true,
    addType = '',
    uploadForm = {}
  } = props

  const prefixCls = 'similar-title'
  const imgUploadRef = useRef(null)

  // 上传图片相关参数 , 这两种类型不兼容，虽然可以放两种数据，但是传递到组件的只能一种数据
  const [featureList, setFeatureList] = useState<(TargetFeatureItem | ResultRowType)[]>([])

  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem | ResultRowType)[], type: string = '') => {
    if (type == 'cancel') {
      setFeatureList([])
      handleAdd(list)
      return
    }
    setFeatureList(list)
  }

  return <div className={`${prefixCls}`}>
    <div className="title-left">{title}</div>
    <div className="title-right">
      {
        hasEditBtn
          ? isEdit
            ? <>
              {
                type == 'add' ?
                  addType == 'file' ?
                    <ImgUpload
                      uploadUrl={uploadurl}
                      ref={imgUploadRef}
                      limit={1}
                      multiple={true}
                      showConfirmBtn={false}
                      showHistory={false}
                      innerSlot={<div className="btn save-btn" >添加</div>}
                      featureList={featureList as TargetFeatureItem[]}
                      onChange={handleChangeFeatureList}
                      className="record-imgupload"
                      uploadType={true}
                      modalTitle="请选择目标"
                      showRadio={false}
                      formData={{
                        permenant: true,
                        ...uploadForm
                      }}
                    />
                    :
                    <div className="btn save-btn" onClick={handleAdd}>添加</div>
                  : null
              }
              <div className="btn save-btn" onClick={handleSave}>保存</div>
              <div className="btn cancel-btn" onClick={handleCancel}>取消</div>
            </>
            : <div className="btn edit-btn" onClick={handleEdit}>编辑</div>
          : null
      }
    </div>
  </div>
}
export default Title