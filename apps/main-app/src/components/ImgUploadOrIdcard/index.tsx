import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react'
import { Button, Form, Input, Message, Radio } from '@yisa/webui'
import { ImgUpload } from '@/components'
import { UploadButton } from '@/pages/Search/Image'
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import cn from 'classnames'
import { isFunction, regular } from '@/utils'
import ajax from '@/services'
import { ImgUploadOrIdcardType } from './interface'
import dictionary from '@/config/character.config'
import './index.scss'
import { RadioChangeEvent } from '@yisa/webui/es/Radio'
import { TargetFeatureItem } from '@/config/CommonType'
import { ResultRowType } from '@/pages/Search/Target/interface'
import { AutoUploadParams, RefImgUploadType } from '../ImgUpload/interface';
function formatToArray(data: any) {
  const type = Object.prototype.toString.call(data)
  let result: any = []
  switch (type) {
    case '[object Object]':
      result.push(data)
      break;
    case '[object Array]':
      result = data
      break;
    default:
      break;
  }
  return result
}

export default forwardRef(function ImgUploadOrIdcard(props: ImgUploadOrIdcardType, ref: ForwardedRef<RefImgUploadType>) {
  const {
    className,
    formItemProps = { label: '身份信息' },
    onClusterChange,
    showTab = true,
    onIdCardSearch,
    loading,
  } = props
  const prefixCls = "img-upload-idcard"
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [infoValue, setInfoValue] = useState(props.infoValue ?? dictionary.cardInfoType[0].value)
  const [featureList, setfeatureList] = useState<TargetFeatureItem[]>([])
  const [innerClusterDataArr, setInnerClusterDataArr] = useMergedState<ResultRowType[]>([], {
    value: 'clusterData' in props ? formatToArray(props.clusterData) : undefined
  })
  //limit为0:上传组件消失
  const [limit, setLimit] = useState(1)
  const [idcard, setIdcard] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const imgUploadRef = useRef<RefImgUploadType>(null)

  const onRadioChange = (e: RadioChangeEvent) => {
    if (!('clusterData' in props)) {
      setInnerClusterDataArr([])
    }
    onClusterChange?.(null)
    setfeatureList([])
    setLimit(1)
    setInfoValue(e.target.value)
    setErrorMessage("")
    setIdcard("")
  }

  //特征数组改变事件
  const handleChangeFeatureList = (list: TargetFeatureItem[]) => {
    setfeatureList(list)
  }

  const handleSearch = () => {
    if (!regular.isIdcard.test(idcard)) {
      Message.warning("身份证输入不正确")
      return
    }

    if (onIdCardSearch && isFunction(onIdCardSearch)) {
      onIdCardSearch(idcard)
      return
    }

    setAjaxLoading(true)
    ajax.personAnalysis.getFaceCluster<{ idcard: string }, ResultRowType[]>({ idcard })
      .then((res) => {
        const data = res.data
        if (data?.length) {
          if (!('clusterData' in props)) {
            setInnerClusterDataArr(data.slice(0, 1))
            setLimit(0)
          }
          onClusterChange?.(data[0])
          setIdcard("")
          setErrorMessage("")
        } else {
          if (!('clusterData' in props)) {
            setInnerClusterDataArr([])
          }
          onClusterChange?.(null)
          setErrorMessage(res.message || "")
        }
        setAjaxLoading(false)
      })
      .catch((err) => {
        console.dir(err)
        setErrorMessage("未查询到该人员抓拍信息，请重新上传图片或身份证号")
        setAjaxLoading(false)
      })
  }

  const handleClusterSelected = (data: ResultRowType | null) => {
    if (!('clusterData' in props)) {
      if (data) {
        setInnerClusterDataArr([data])
      } else {
        setInnerClusterDataArr([])
        setfeatureList([])
        setLimit(1)
      }
      // data ? setClusterDataArr([data]) : setClusterDataArr([])
    }
    onClusterChange && onClusterChange?.(data)
    setErrorMessage("")
  }

  const handleClusterError = (message: string) => {
    setErrorMessage(message)
  }
  //fix:修复从父组件传递值时聚类卡片不显示问题
  useEffect(() => {
    if (innerClusterDataArr.length && infoValue === "idcard") {
      setLimit(0)
    } else {
      setLimit(1)
      setfeatureList([])
    }
  }, [JSON.stringify(innerClusterDataArr), infoValue])

  useImperativeHandle(ref,
    () => {
      return {
        handleAutoUpload: (params: AutoUploadParams) => {
          imgUploadRef?.current?.handleAutoUpload?.(params)
        },
        handleSearchCluster: (features: TargetFeatureItem[]) => {
          imgUploadRef?.current?.handleSearchCluster?.(features)
        }
      }
    })

  return (
    <Form.Item
      className={cn(prefixCls, className)}
      colon={false}
      {...formItemProps}
      errorMessage={errorMessage}
    >
      <div className={`${prefixCls}-container`}>
        {
          showTab && <Radio.Group optionType="button" disabled={"loading" in props ? loading : ajaxLoading} options={dictionary.cardInfoType} onChange={onRadioChange} value={infoValue} />
        }
        <div className={`${prefixCls}-container-content`}>
          {
            (infoValue === "image" || limit === 0) && <ImgUpload
              ref={imgUploadRef}
              limit={limit}
              multiple={false}
              innerSlot={<UploadButton />}
              featureList={featureList}
              onChange={handleChangeFeatureList}
              clusterData={innerClusterDataArr.length ? innerClusterDataArr[0] : null}
              onClusterSelected={handleClusterSelected}
              onClusterError={handleClusterError}
              showClusterData={true}
              searchCluster={true}
              showImgList={false}
              uploadHistoryType="face"
              formData={{
                analysisType: 'face',
              }}
            />
          }
          {
            (infoValue === "idcard" && limit !== 0) && <div className={`${prefixCls}-idcard`}>
              <Input allowClear value={idcard} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIdcard(e.target.value) }} />
              <Button type="primary" onClick={handleSearch} loading={"loading" in props ? loading : ajaxLoading}>确认查询</Button>
            </div>
          }
        </div>
      </div>
    </Form.Item>
  )
})

