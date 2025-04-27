import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { Upload, Message, Loading, Popover, Space, } from '@yisa/webui'
import { ErrorImage } from '@yisa/webui_business'
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { Icon, LoadingOutlined, PlusOutlined } from '@yisa/webui/es/Icon'
import ImgUploadProps, { UploadButtonProps, RefImgUploadType, PicDataType, AutoUploadParams } from "./interface";
import { UploadItem } from '@yisa/webui/es/Upload/interface'
import { TargetType, TargetFeatureItem } from "@/config/CommonType";
import { useSelector, RootState, useDispatch } from "@/store";
import classNames from 'classnames'
import './index.scss'
import { delTargetFeatureList } from "@/store/slices/feature";
import ImgUploadModal from "./ImgUploadModal";
import ImgClusterModal from './ImgClusterModal'
import ajax, { ApiResponse } from "@/services";
import character from "@/config/character.config";
import cookie from "@/utils/cookie";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { PeerCard } from "@/pages/VehicleAnalysis/Peer/components";
import Card from "../Card";

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
              <div className="upload-text">上传图片</div>
            </>
      }
    </>
  )
}

// 识别项li数组
const disArr = [
  {
    value: 'face',
    text: '以脸搜脸',
    mode: '人脸'
  },
  {
    value: 'person',
    text: '以人搜人',
    mode: '人体 '
  },
  {
    value: 'bicycle',
    text: '搜二轮车',
    mode: '两轮'
  },
  {
    value: 'tricycle',
    text: '搜三轮车',
    mode: '三轮'
  },
  {
    value: 'feature',
    text: '特征搜图',
    mode: '特征'
  },
  {
    value: 'car',
    text: '搜汽车',
    mode: '汽车'
  }
]

const ImgUpload = (props: ImgUploadProps, ref: React.ForwardedRef<RefImgUploadType>) => {
  const {
    className,
    limit = 5,
    disabled,
    uploadUrl = ajax.common.imageUploadUrl,
    formData = {
      analysisType: 'full',
    },
    featureList = [],
    onChange,
    uploadHistoryType = 'all',
    innerSlot,
    onFlushHistoryComplete,
    flushHistory = false,
    showHistory = true,
    saveHistory = true,
    showCutBtn = true,
    showConfirmBtn = true,
    hideFlag = false,
    multiple = false,
    uploadType = false,
    showImgList = true,
    searchCluster = false,
    showClusterData = false,
    onClusterSelected,
    onClusterError,
    onClusterDelete,
    modalTitle = "请选择要检索的目标",
    showRadio = true,
  } = props
  const userInfo = useSelector((state: RootState) => {
    return state.user.userInfo
  })

  const [loadingState, setLoadingState] = useState(false)

  const [stateFeatureList, setStateFeatureList] = useState(featureList)
  const selectedFeatures = featureList ? featureList : stateFeatureList

  const [picData, setPicData] = useState<PicDataType>({
    bigImage: '',
    data: []
  }) // 正在显示的图片数据，可能为人脸、人体等某一类
  const picDataAll = useRef(picData)// 全部的图片特征数据

  // 历史相关
  const [historyLoading, setHistoryLoading] = useState(false) // 历史loading
  const [historyArr, setHistoryArr] = useState<{
    param: TargetFeatureItem
  }[]>([]) // 历史上传数据
  const [popoverVisible, setPopoverVisible] = useState(false)

  const [showImgModal, setShowImgModal] = useState(false)

  const [showClusterModal, setShowClusterModal] = useState(false)
  const [clusterData, setClusterData] = useState<{ target: TargetFeatureItem, result: ResultRowType[] }>({
    target: {} as TargetFeatureItem,
    result: []
  })
  // const [curSelectedCluster, setCurClusterSelected] = useState<ResultRowType | null>(null)
  const [curSelectedCluster, setCurClusterSelected] = useMergedState<ResultRowType | null>(null, {
    value: 'clusterData' in props ? props.clusterData : undefined
  })

  const handleBeforeUpload = (file: File, filesList: File[]) => {

    const picFormat = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp']
    const isFormat = picFormat.indexOf(file.type) > -1

    if (!isFormat) {
      Message.warning('请上传jpg, jpeg, png, bmp的图片格式')
    }
    return isFormat
  }

  const handleChange = useCallback((fileList: UploadItem[], file: UploadItem) => {
    const { status, response } = file
    console.log(status)
    if (status === 'uploading') {
      setLoadingState(true)
      setPopoverVisible(false)
      return
    }
    if (status === 'done') {
      setLoadingState(false)
      const _response = (response as any)
      if (Array.isArray(_response.data)) {
        const data = _response.data
        // if (data.length < 1) {
        //   Message.warning('未识别目标特征')
        //   return
        // }
        // if (data.length === 1) {
        //   if (uploadType) {
        //     onChange && onChange([data[0]], 'cancel')
        //   } else {
        //     //fix:修复当只识别一个目标时，需要将之前的特征数组传递
        //     if (selectedFeatures.find(item => item.feature === data[0].feature)) {
        //       Message.warning("上传的目标特征相同")
        //       return
        //     }
        //     addFeature([...selectedFeatures, data[0]])
        //   }
        // } else {
        setPicData(_response)
        picDataAll.current = _response

        //打开弹框
        setShowImgModal(true)
        setPopoverVisible(false)

        // }
      }

    }
    if (status === 'error') {
      console.log(file)
      Message.error((response as any).message)
      setLoadingState(false)
    }
  }, [selectedFeatures])

  const onDrop = (e: React.DragEvent) => {
    console.log('Dropped files', e.dataTransfer.files, e.dataTransfer.items);
  }

  const handleDelTargetFeature = (id: string) => {

    const newFeatureList = selectedFeatures.filter(item => item.feature !== id)
    if (!('onChange' in props)) {
      setStateFeatureList(newFeatureList)
    }

    if (onChange) {
      onChange(newFeatureList)
    }
  }

  const addFeature = async (item: TargetFeatureItem[], getHistory = true) => {
    //聚类
    if (searchCluster) {
      try {
        setLoadingState(true)
        const res = await ajax.personAnalysis.getFaceCluster<Pick<TargetFeatureItem, "feature">, ResultRowType[]>({
          feature: item[0].feature
        })
        const _data = res.data || []
        if (_data.length === 0) {
          //没有数据，则没有必要上传历史
          setLoadingState(false)
          onClusterError?.(res.message || "", item)
        } else if (_data.length === 1) {
          if (!('clusterData' in props)) {
            setCurClusterSelected(_data[0])
          }
          onClusterSelected?.(_data[0])
          // 是否同步上传历史
          if (getHistory && saveHistory) {
            ajax.saveUploadHistory({
              uid: userInfo.id,
              param: item[0]
            }).then(res => getUploadHostory())
              .catch(err => Message.warning(err.message))
          }
        } else {
          setClusterData({
            target: item[0],
            result: _data
          })
          setShowClusterModal(true)
        }
        setLoadingState(false)
      } catch (error: any) {
        console.log(error)
        onClusterError?.(error?.response?.data?.message || "聚类检索错误", item)
        setLoadingState(false)
      }
      return
    }
    //多选还是单选
    if (multiple) {
      //这个就是选中的数组
      if (!('onChange' in props)) {
        // console.log(item)
        setStateFeatureList(item)
      }
      if (onChange) {
        onChange(item)
      }
      // 是否同步上传历史,取消选中不需要上传
      if (selectedFeatures.length < item.length && getHistory && saveHistory) {
        ajax.saveUploadHistory({
          uid: userInfo.id,
          param: item.find(item => !selectedFeatures.map(item => item.feature).includes(item.feature))
        }).then(res => getUploadHostory())
          .catch(err => Message.warning(err.message))
      }
    } else {
      // 判断特征值是否重复，虽然单选，但是重复上传同一张图片选择同一个特征，特征值可能重复
      let isExist = false
      selectedFeatures.forEach((elem) => {
        if (elem.feature == item[0].feature) {
          isExist = true
        }
      })
      if (isExist) {
        Message.warning("目标特征值已存在！")
        return false
      }

      const newFeatureList = [...selectedFeatures, item[0]]
      if (!('onChange' in props)) {
        setStateFeatureList(newFeatureList)
      }
      if (onChange) {
        onChange(newFeatureList)
      }
      // 是否同步上传历史
      if (getHistory && saveHistory) {
        ajax.saveUploadHistory({
          uid: userInfo.id,
          param: item
        }).then(res => getUploadHostory())
          .catch(err => Message.warning(err.message))
      }
    }
  }

  // 请求历史数据
  const getUploadHostory = async () => {
    setHistoryLoading(true)
    ajax.getUploadHistory({
      uid: userInfo.id,
      feature_type: uploadHistoryType
    }).then(res => {
      onFlushHistoryComplete?.()
      setHistoryLoading(false)
      setHistoryArr(res.data as any[])
    }).catch(err => {
      console.log(err)
    })
  }

  const handleAutoUpload = async (form: AutoUploadParams) => {
    if (selectedFeatures.length >= limit) {
      Message.warning(`最大上传${limit}个`)
      return false
    }
    setLoadingState(true)

    try {
      const res = await ajax.uploadImg({
        imageUrl: form.bigImage,
        analysisType: formData.analysisType
      })
      const _res = res as PicDataType
      setLoadingState(false)

      // 都让弹框显示出来。 如果没有识别出来的目标，也显示弹框，这样他还可以自己手动框选目标
      // if (_res?.data?.length < 1) {
      //   Message.warning('未识别目标特征')
      //   return
      // }
      // if (_res?.data?.length === 1) {
      //   addFeature(_res.data, true)
      // } else {
      setPicData(_res)
      picDataAll.current = _res

      //打开弹框
      setShowImgModal(true)
      setPopoverVisible(false)
      // }
    } catch (error) {
      setLoadingState(false)
    }

  }

  useImperativeHandle(ref, () => ({
    handleAutoUpload,
    handleSearchCluster: (list: TargetFeatureItem[]) => {
      addFeature(list)
    }
  })
  )

  const handleImgModalCancel = () => {
    //关闭之前上传图片保存在历史中
    // if (selectedFeatures.length) {
    //   //保存上传历史后重新请求历史数据
    //   ajax.saveUploadHistory({
    //     uid: userInfo.id,
    //     param: selectedFeatures
    //   })
    //     .then(res => getUploadHostory())
    //     .catch(err => {
    //       Message.warning(err.message)
    //     })
    // }
    if (uploadType) {
      onChange && onChange(selectedFeatures, 'cancel')
    }
    setShowImgModal(false)
  }

  const handleFormRadioButtonChange = (e: any) => {
    console.log(e)
    if (!picDataAll.current.data.length) return

    const _d = picDataAll.current.data
    if (!e.value) { return }
    const { label, value } = e

    if (value === 'all') {
      setPicData(picDataAll.current)
    } else {
      const feature = _d.filter((item) => item.targetType === value)
      if (feature.length <= 0) {
        Message.warning(`未识别${label}目标`)
      }
      setPicData({
        bigImage: picDataAll.current.bigImage,
        data: feature
      })
    }
  }

  const findFeatureText = (featureType: TargetType) => {
    let text = ``
    disArr.forEach((o) => {
      if (o.value == featureType) {
        text = o.mode
      }
    })
    return text
  }

  const changeUploadImg = (data: TargetFeatureItem) => {
    if (!data) return;
    if (selectedFeatures.length >= limit) {
      Message.warning(`最大上传${limit}个`)
      return false
    }
    if (selectedFeatures.find(item => item.feature === data.feature)) {
      Message.warning("不能上传相同特征")
      return
    }
    addFeature([...selectedFeatures, data], true)
    setPopoverVisible(false)
  }

  // 渲染历史列表
  const renderUploadHistory = () => {
    return <div className="upload-history-box">
      {
        historyLoading ?
          <div className="loading-box">
            <Loading size="large" spinning={true} />
          </div>
          :
          historyArr && historyArr.length ?
            <>
              <span>上传历史</span>
              <Space size={6}>
                {
                  historyArr.map((item, index) => {
                    return <div key={index} onClick={() => changeUploadImg(item.param)}><ErrorImage src={item.param?.targetImage} /></div>
                  })
                }
              </Space>
            </>
            :
            <div className="no-data">
              暂无上传记录
            </div>
      }
    </div>
  }

  const handleVisibleChange = (visible: boolean) => {
    // console.log(visible)
    if (showHistory) {
      if (selectedFeatures.length < limit) {
        setPopoverVisible(visible)
      }
    }
  };
  //取消聚类选择
  const handleClusterCancel = () => {
    setShowClusterModal(false)
    // setClusterData({
    //   target: {} as TargetFeatureItem,
    //   result: []
    // })
    if (!("clusterData" in props)) {
      setCurClusterSelected(null)
    }
    onClusterSelected?.(null)
    onChange?.([])
  }
  //确认之后需要上传历史
  const handleClusterConfirm = (data: ResultRowType) => {
    if (!('onChange' in props)) {
      setStateFeatureList([clusterData.target])
    }
    if (onChange) {
      onChange([clusterData.target])
    }
    // 是否同步上传历史
    if (saveHistory) {
      ajax.saveUploadHistory({
        uid: userInfo.id,
        param: clusterData.target
      }).then(res => getUploadHostory())
        .catch(err => Message.warning(err.message))
    }
    setClusterData({
      target: {} as TargetFeatureItem,
      result: []
    })
    setShowClusterModal(false)
    if (!("clusterData" in props)) {
      setCurClusterSelected(data)
    }
    onClusterSelected?.(data)

  }
  //删除聚类
  const handleDeleteCluster = (data: ResultRowType) => {
    if (!("clusterData" in props)) {
      setCurClusterSelected(null)
    }
    onClusterSelected?.(null)
    onChange?.([])
    onClusterDelete?.(data)
  }

  useEffect(() => {
    if (showHistory) {
      getUploadHostory()
    }
  }, [])
  //是否刷新上传历史
  useEffect(() => {
    flushHistory && getUploadHostory()
  }, [flushHistory])


  return (
    <div className={classNames(className, 'img-upload')}>
      {
        // showClusterData && curSelectedCluster && <PeerCard
        //   showDelete={true}
        //   onDelete={handleDeleteCluster}
        //   type="personTarget"
        //   cardData={curSelectedCluster}
        //   showChecked={false}
        //   size="small"
        // />
        // showClusterData && curSelectedCluster && <PeerCard
        //   showChecked={false}
        //   showDelete={true}
        //   onDelete={handleDeleteCluster}
        //   type="personTarget"
        //   cardData={curSelectedCluster}
        //   size="small"
        //   className="peer"
        // />
        showClusterData && curSelectedCluster && <Card.InfoTagCard
          showDelete={true}
          onDelete={handleDeleteCluster}
          cardData={curSelectedCluster}
          size="small"
          type="person"
        />
      }
      {
        !curSelectedCluster && <div className="img-upload-content">
          <div className={limit === 1 ? "feature-list-wraps one-search" : selectedFeatures.length >= limit ? "feature-list-wraps over-limit" : 'feature-list-wraps'}>
            <div className='feature-list'>
              <ul>
                <Space size={10} wrap className="retrieval-form">
                  {!uploadType && showImgList && selectedFeatures.map((item) => { //以图
                    const { feature, targetImage, targetType, isFeature } = item
                    // console.log("item", item)
                    return (
                      <li key={feature}>
                        {
                          targetType &&
                          <span className="feature-type-tip">
                            {item.identify ? "识别" : ''}{isFeature ? '局部' : character.featureTypeToText[targetType]}
                          </span>
                        }
                        {
                          !disabled ?
                            <span className='del-target' onClick={() => handleDelTargetFeature(feature)}>
                              <Icon type='lajitong' />
                            </span> :
                            <></>
                        }
                        <ErrorImage src={targetImage} />
                      </li>
                    )
                  })}
                  {
                    !uploadType && (limit === 1 && selectedFeatures.length > 0) ?
                      ''
                      :
                      (!uploadType && selectedFeatures.length >= limit) ?
                        ''
                        :
                        <li>
                          <Popover
                            className="upload-hisory-popver"
                            overlayClassName="upload-hisory-popver-overlay"
                            autoAdjustOverflow={false}
                            content={renderUploadHistory}
                            title={null}
                            placement="rightTop"
                            visible={popoverVisible}
                            onVisibleChange={handleVisibleChange}
                          // getPopupContainer={(() => document.querySelector('.upload-box') as HTMLElement)} // 别加，被overflow影响
                          >
                            <div className="upload-box">
                              <Upload
                                headers={{ Authorization: cookie.getToken(), 'Frontend-Route': window.location.hash.split('?')[0] }}
                                drag={false}
                                listType="picture-card"
                                action={uploadUrl}
                                beforeUpload={handleBeforeUpload}
                                showUploadList={false}
                                onChange={handleChange}
                                disabled={(!uploadType && selectedFeatures.length >= limit) || loadingState || disabled}
                                data={formData}
                                name="image"
                              >
                                <UploadButton load={loadingState} innerSlot={innerSlot} />
                              </Upload>
                            </div>
                          </Popover>
                        </li>
                  }
                </Space>
              </ul>
            </div>
          </div>
        </div>
      }
      <ImgUploadModal
        showConfirmBtn={showConfirmBtn}
        visible={showImgModal}
        handleCancel={handleImgModalCancel}
        picData={picData}
        addFeature={addFeature}
        handleFormRadioButtonChange={handleFormRadioButtonChange}
        showCutBtn={showCutBtn}
        featureList={selectedFeatures}
        multiple={multiple}
        handleDelTargetFeature={handleDelTargetFeature}
        limit={limit}
        modalTitle={modalTitle}
        showRadio={showRadio}
        analysisType={formData.analysisType}
      />
      <ImgClusterModal
        data={clusterData}
        visible={showClusterModal}
        handleClusterCancel={handleClusterCancel}
        handleClusterConfirm={handleClusterConfirm}
      />
    </div>
  )
}

export default forwardRef(ImgUpload)
