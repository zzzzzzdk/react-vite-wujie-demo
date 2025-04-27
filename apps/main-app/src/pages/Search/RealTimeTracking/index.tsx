import React, { useEffect, useRef, useState } from "react";
import { Drawer, Button, Form, Slider, Select, Message, Space, VirtualList, Image, Tooltip, Switch, Modal, } from '@yisa/webui'
import { Icon, LeftOutlined, RightOutlined, CloseOutlined, UndoOutlined } from '@yisa/webui/es/Icon'
import { ResultBox } from '@yisa/webui_business'
// import CrossMap from "./CrossMap";
import { BoxDrawer, FormRadioGroup, ImgUpload, LocationMapList, FormPlate, Card, BigImg, BottomRight, Export, TrackMultiMap } from '@/components'
import ImgUploadProps, { RefImgUploadType, UploadButtonProps } from "@/components/ImgUpload/interface";
import { TargetFeatureItem } from "@/config/CommonType";
import { LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import dayjs from 'dayjs'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { RefTrackMap } from "@/components/Map/TrackMap/interface";
import { TrackDataItem } from '@/components/Map/TrackMulti/interface'
import { FormDataType, ResultRowType, DataItemType, ResultProps, ResultItem, RefCardResultType } from "./interface";
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { useLocation } from "react-router-dom";
import { formatTimeFormToComponent, getParams, isArray, isObject, validatePlate, jumpRecordVehicle } from "@/utils";
import { isEmptyObject, isUndefined, isNumber } from '@/utils/is'
import { useSelector, useDispatch, RootState } from '@/store'
import character from "@/config/character.config";
import services, { ApiResponse } from "@/services";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import classNames from 'classnames'
import FilterateModal from "./../Cross/FilterateModal";
import { getLogData } from "@/utils/log";
import { PlateValueProps, PlateTypeId } from "@/components/FormPlate/interface";
import { useRequest, useDeepCompareEffect, useDebounce } from "ahooks";
import Result from "./components/Result";
import CardResult from "./components/CardResult";
import ExtendTargetModal from "./components/ExtendTargetModal";
import './index.scss'
import characterConfig from "@/config/character.config";
import trackingMp4 from '@/assets/video/tracking.mp4'
import { useResetState } from "ahooks";

const { Option } = Select

const colorArr = ['rgba(83, 140, 255, 0.05)', 'rgba(255, 154, 52, 0.05)']
const indexColor = ['rgba(83, 140, 255, 0.5)', 'rgba(255, 154, 52, 0.5)']
const letterArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const RealTimeTracking = () => {
  const prefixCls = "real-time-tracking"
  const boxRef = useRef<HTMLDivElement>(null)
  const imgUploadRef = useRef<RefImgUploadType>(null)

  const location = useLocation()
  const { userInfo } = useSelector((state: RootState) => {
    return state.user
  })
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig.cross || {}
  });
  const setId = (index: number) => {
    if (process.env.NODE_ENV === "development") {
      return index === 1 ? 'xxxx' : '2222'
    }
    let stamp = new Date().getTime();
    return (((1 + Math.random()) * stamp) | 0).toString(16);
  }

  const [flushHistory, setFlushHistory] = useState(false)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [tracking, setTracking] = useState(false)
  const [uploadDisabled, setUploadDisabled] = useState(false)
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const [cardResultVisible, setCardResultVisible] = useState(false)
  const cardResultRef = useRef<RefCardResultType>(null)

  const formDataTemplate: FormDataType = {
    featureList: [],
    plateColorTypeId: 5,
    licensePlate: '',
    similarity: Number(pageConfig.threshold.default || 80),
    qualityFilter: false,
    trackId: setId(1),
    bgColor: colorArr[0],
    indexColor: indexColor[0],
    enableTrackPredict: true
  }
  const [formDataList, setFormDataList, resetFormData] = useResetState<FormDataType[]>([formDataTemplate])
  const formDataListRef = useRef(formDataList)
  formDataListRef.current = formDataList
  const [currentTrackId, setCurrentTrackId] = useState('')
  const currentFormData = formDataList.find(item => item.trackId === currentTrackId)

  const [beforAjax, setBeforAjax] = useState(true)

  const pollingRef = useRef(false)
  const timer = useRef<NodeJS.Timeout>()

  // const { data, loading, run, cancel } = useRequest(async () => getData(), {
  //   debounceWait: 200,
  //   pollingInterval: 10000,
  //   manual: true,
  //   pollingErrorRetryCount: 3,
  //   // pollingWhenHidden: false,
  // });

  const [statePlates, setStatePlates, resetStatePlates] = useResetState<{
    plateColorTypeId: PlateTypeId;
    licensePlate: string;
  }[]>([
    {
      plateColorTypeId: 5,
      licensePlate: '',
    }
  ])

  const trackMapRef = useRef<RefTrackMap>(null)
  // 轨迹数据
  const [trackData, setTrackData] = useState<TrackDataItem[][]>([])
  const [selectedIndexArr, setSelectedIndexArr] = useState<(number | null)[]>([null, null])

  const [resultData, setResultData] = useState<ResultItem[]>([])
  const resultDataRef = useRef(resultData)
  resultDataRef.current = resultData
  const [cardResultData, setCardResultData] = useState<TargetResultItemType[]>([])

  const defalutResultItem = {
    trackId: '',
    trackData: [],
    extendData: [],
    personInfoData: {
      personBasicInfo: {
      },
      locationNames: '',
      personTags: [],
      lngLat: {
        lng: 0,
        lat: 0
      },
    },
    vehicleInfoData: [],
    predictPath: []
  } as unknown as ResultItem
  const [currentData, setCurrentData] = useState(defalutResultItem)

  // 拓展目标弹窗
  const [extendTargetVisible, setExtendTargetVisible] = useState(false)
  // 拓展目标弹窗是否默认收起
  const [putItAway, setPutItAway] = useState(false)

  // 大图
  const [bigImgData, setBigImgData] = useState<TargetResultItemType[]>([])
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)

  // 过滤名单
  const taskIdRef = useRef<string>('')

  useEffect(() => {
    // console.log('resultData', resultData, currentTrackId)
    if (resultData.length) {
      if (currentTrackId) {
        let newBigImgData: TargetResultItemType[] = []
        const newCurrentData: ResultItem = resultData.find(elem => elem.trackId === currentTrackId) || defalutResultItem
        newCurrentData.trackData = newCurrentData.trackData?.map((item, index) => {
          if (item.infos && item.infos.length) {
            newBigImgData = [...newBigImgData, ...item.infos]
          }
          return {
            ...item,
            index: newCurrentData.trackData?.length - index,
            filterId: item.locationId + item.minCaptureTime,
            indexArr: [0, (newCurrentData.trackData?.length - 1) - index],
            infos: (item.infos ?? []).map(o => ({ ...o, filterId: item.locationId + item.minCaptureTime, }))
          }
        })

        if (ajaxLoading && (newCurrentData.trackData?.length || newCurrentData.personInfoData)) {
          setAjaxLoading(false)
        }
        // console.log('newCurrentData', newCurrentData)
        setCurrentData(newCurrentData)
        const newTrackData = [...newCurrentData.trackData ?? []].reverse()
        setTrackData([newTrackData])

        // 大图数据
        setBigImgData(newBigImgData)


        // 更新currentData时如果存在拓展目标数据，且默认收起不打开，打开弹窗
        if (!putItAway && newCurrentData.showExtend) {
          setExtendTargetVisible(true)
        }
      } else {
        if (cardResultVisible) {
          setCardResultVisible(false)
          setResultShowType('map')
        }
        let newTrackData: TrackDataItem[][] = []
        const nowTrackIds = formDataListRef.current.map(item => item.trackId)
        resultData.forEach((elem, parentIndex) => {
          if (nowTrackIds.includes(elem.trackId)) {
            const _track = elem.trackData.map((item, index) => ({
              ...item,
              index: elem.trackData.length - index,
              filterId: item.locationId + item.minCaptureTime,
              indexArr: [0, (elem.trackData.length - 1) - index],
              infos: (item.infos ?? []).map(o => ({ ...o, filterId: item.locationId + item.minCaptureTime, })),
              trackColor: characterConfig.trackColor[parentIndex]
            })).reverse()
            newTrackData.push(_track)
          }
        })
        setTrackData(newTrackData)
      }
    }
  }, [currentTrackId, resultData])


  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  // 过滤名单
  const [filterateVisible, setFilterateVisible] = useState(false)


  const handleTrackContentCb = (data: TrackDataItem, indexArr: (number | null)[], childIndex: number) => {
    console.log(data, indexArr)
    const currentData: TargetResultItemType = data && data.infos && isArray(data.infos) ? data.infos[childIndex] : {} as TargetResultItemType
    // console.log(currentData)
    let infoLength = data.infos?.length || 0

    return (
      <div className="track-popver-content">
        <div className="track-popver-content-header">
        </div>
        <div className="track-popver-content-card">
          <div className="img-box" onClick={(e) => handleOpenBigImg(e, currentData, childIndex, indexArr, data.infos)}>
            <Image src={currentData.targetImage} />
          </div>
          <div className="info-box">
            {
              // 二三轮车车牌
              currentData.licensePlate &&
              <div className="card-info plate-wrap">
                {
                  currentData.licensePlateUrl && currentData.licensePlateUrl != "" && currentData.licensePlate != '无牌' ?
                    <a target="_blank" href={currentData.licensePlateUrl} className={currentData.licensePlate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>
                      {currentData.licensePlate}
                    </a>
                    :
                    <span className={currentData.licensePlate == '无牌' ? 'plate-text plate-error' : 'plate-text'}>{currentData.licensePlate == '无牌' ? '未知' : currentData.licensePlate}</span>
                }
              </div>
            }
            {
              currentData.licensePlate1 &&
              <div className="card-info plate-wrap">
                {
                  currentData.licensePlate1Url && currentData.licensePlate1Url != "" && validatePlate(currentData.licensePlate1) ?
                    <a target="_blank" href={currentData.licensePlate1Url} className={'plate-text'}>
                      {currentData.licensePlate1}
                    </a>
                    :
                    <span className={'plate-text plate-error'}>{currentData.licensePlate1}</span>
                }
                {
                  currentData.licensePlate2 &&
                  <Tooltip placement="bottom" title="二次识别">
                    {
                      currentData.licensePlate2 === '未识别' ?
                        <span className={`plate2-text plate-color-8`}></span> :
                        (
                          <a
                            target="_blank"
                            href={jumpRecordVehicle(currentData.licensePlate2, currentData.plateColorTypeId2)}
                            className={`plate2-text plate-bg plate-color-${currentData.plateColorTypeId2}`}
                          >
                            {currentData.licensePlate2}
                          </a>
                        )
                    }
                  </Tooltip>
                }
              </div>
            }
            <div className="card-info"><Icon type="shijian" />{currentData.captureTime || '--'}</div>
            <div className="card-info" title={currentData.locationName}><Icon type="didian" />{currentData.locationName || '--'}</div>
          </div>

          <span
            onClick={(e) => { handlePrev(e) }}
            className={classNames("btn-change btn-prev", {
              disabled: childIndex === 0
            })}
          >
            <LeftOutlined />
          </span>
          <span
            onClick={(e) => { handleNext(e, infoLength) }}
            className={classNames("btn-change btn-next", {
              disabled: childIndex === infoLength - 1
            })}
          >
            <RightOutlined />
          </span>
        </div>
      </div>
    )
  }

  const handleNext = (e: React.MouseEvent, length: number) => {
    console.log('handleNext', length)
    e.stopPropagation()
    trackMapRef.current?.trackRef?.nextAlarm(length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    trackMapRef.current?.trackRef?.prevAlarm()
  }

  // 地图选中轨迹点位
  const handleTrackSelectedChange = (indexArr: (number | null)[]) => {
    console.log(indexArr)
    setSelectedIndexArr(indexArr)
  }
  const handleCardClick = (event: React.MouseEvent, data: DataItemType, index: number) => {
    console.log(index)
    setSelectedIndexArr(data.indexArr || [null, null])
  }

  //拖拽
  const handleImgDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setUploadDisabled(true)
  }

  // 图片拖拽结束事件
  const handleImgDrop = (event: React.DragEvent, trackid: string) => {
    event.preventDefault();
    event.stopPropagation()
    console.log(trackid)
    setUploadDisabled(false)

    const _data = event.dataTransfer.getData("Text")
    if (!_data) {
      console.log('拖拽的空数据')
      return false
    }
    const data: TargetResultItemType = JSON.parse(_data)

    const newFormDataList = [...formDataList]
    newFormDataList.forEach((item) => {
      if (item.trackId === trackid) {
        // //判断当前图片数量
        if (item.featureList.length >= 5) {
          Message.warning("最多支持上传五张!")
          return
        }
        //判断是否有相同特征
        if (item.featureList.find(i => i.feature == data.feature)) {
          Message.warning("已添加该特征")
          return
        }
        // // console.log(data)
        const { feature, targetImage, targetType, detection = { x: 0, y: 0, w: 0, h: 0 } } = data
        const newFeatureList = [...item.featureList, {
          feature,
          targetImage,
          targetType,
          ...detection,
          identify: true
        }]
        // console.log(newFeatureList)
        item.featureList = newFeatureList

        //拖拽上传需要保存上传历史，保存之后需要请求新的历史
        saveUploadHistory(data)
      }
    })
    setFormDataList(newFormDataList)

  }

  const handleImgDragLeave = () => {
    setUploadDisabled(false)
  }



  //特征数组改变事件
  const handleChangeFeatureList = (list: (TargetFeatureItem)[], index: number) => {
    // 如果有识别车牌，将识别出来的车牌放入车牌号码表单项
    const plateArr = list.filter(item => item.targetType === 'vehicle')
    console.log(list)
    if (plateArr.length) {
      const newPlateData = plateArr[plateArr.length - 1]
      if (!newPlateData.licensePlate2) {
        Message.warning('未识别到车牌，请上传可识别车牌的车辆图像')
        return
      }
      if (formDataList[index].licensePlate && formDataList[index].licensePlate !== newPlateData.licensePlate2) {
        Modal.confirm({
          title: '确认替换',
          content: '已有车牌信息，是否需要替换？',
          onOk: () => {
            const newFormDataList = [...formDataList]
            newFormDataList[index].licensePlate = newPlateData.licensePlate2 || ''
            newFormDataList[index].plateColorTypeId = newPlateData.plateColorTypeId2 || 5
            setFormDataList(newFormDataList)
            handlePlateChange({
              plateNumber: newPlateData.licensePlate2 || '',
              plateTypeId: newPlateData.plateColorTypeId2 || 5,
              noplate: ''
            }, index)
            Message.success('自动识别车牌已填入车牌号码中')
          },
        });
      } else {
        const newFormDataList = [...formDataList]
        newFormDataList[index].licensePlate = newPlateData.licensePlate2
        newFormDataList[index].plateColorTypeId = newPlateData.plateColorTypeId2 || 5
        setFormDataList(newFormDataList)
        handlePlateChange({
          plateNumber: newPlateData.licensePlate2 || '',
          plateTypeId: newPlateData.plateColorTypeId2 || 5,
          noplate: ''
        }, index)
        Message.success('自动识别车牌已填入车牌号码中')
      }
    } else {
      const newFormDataList = [...formDataList]
      newFormDataList[index].featureList = [...list]
      setFormDataList(newFormDataList)
    }
  }

  // function debounce(func: any, wait: number) {
  //   let timeout: NodeJS.Timeout;
  //   return function () {
  //     // @ts-ignore
  //     const context = this;
  //     const args = arguments;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(function () {
  //       func.apply(context, args);
  //     }, wait);
  //   };
  // }


  // const handlePlateChange = debounce((value: PlateValueProps, index: number) => {
  //   const newFormDataList = [...formDataList]
  //   newFormDataList[index].licensePlate = value.plateNumber
  //   newFormDataList[index].plateColorTypeId = value.plateTypeId
  //   setFormDataList(newFormDataList)
  // }, 250)

  const handlePlateChange = (value: PlateValueProps, index: number) => {
    // const newFormDataList = [...formDataList]
    // newFormDataList[index].licensePlate = value.plateNumber
    // newFormDataList[index].plateColorTypeId = value.plateTypeId
    // setFormDataList(newFormDataList)

    const newStatePlates = [...statePlates]
    newStatePlates[index].licensePlate = value.plateNumber
    newStatePlates[index].plateColorTypeId = value.plateTypeId

    setStatePlates([...newStatePlates])
  }

  const handlesimilarityChange = (similarity: number | number[], index: number) => {
    const newFormDataList = [...formDataList]
    newFormDataList[index].similarity = similarity as number
    setFormDataList(newFormDataList)
  }

  const handleQualityFilterChange = (checked: boolean, index: number) => {
    const newFormDataList = [...formDataList]
    newFormDataList[index].qualityFilter = checked
    setFormDataList(newFormDataList)
  }

  // 添加多个formDataList
  const handleAddFormData = () => {
    const newFormDataList = [...formDataList, {
      ...formDataTemplate,
      trackId: setId(2),
      bgColor: colorArr[1],
      indexColor: indexColor[1]
    }]
    setFormDataList(newFormDataList)

    const newStatePlates: any = [...statePlates, {
      plateColorTypeId: 5,
      licensePlate: '',
    }]

    setStatePlates(newStatePlates)
  }

  const handleCheck = (e: React.MouseEvent, trackid: string) => {
    e.stopPropagation()
    // console.log("触发区域点击", e.target['className'])
    const thisClassName = e.target['className']
    if (thisClassName === 'ysd-form-item-content-label' || thisClassName === 'form-label' || thisClassName === 'ysd-form-item-content-value-input' || thisClassName === 'img-upload-content' || thisClassName === 'formdata-item' || thisClassName === 'formdata-item-title') {

      if (trackid === currentTrackId) {
        setCurrentTrackId('')

        return
      }
      setCurrentTrackId(trackid)
    }
  }

  // 删除当前formData项
  const handleDelFormData = (e: React.MouseEvent, index: number, itemTrackId: string) => {
    // console.log(index)
    e.stopPropagation()
    const newFormDataList = [...formDataList]
    newFormDataList.splice(index, 1);
    newFormDataList.forEach((item, index) => {
      item.bgColor = colorArr[index]
      item.indexColor = indexColor[index]
    })
    if (itemTrackId === currentTrackId) {
      setCurrentTrackId(newFormDataList[0].trackId)
    }
    setFormDataList(newFormDataList)

    const newStatePlates = [...statePlates]
    newStatePlates.splice(index, 1);
    setStatePlates(newStatePlates)
  }

  const handleBtnClick = async () => {
    if (ajaxLoading) {
      setAjaxLoading(false)
    }
    if (tracking) {
      pollingRef.current = false
      setTracking(false)
      return
    }
    console.log('formDataList', formDataList)
    const newFormDataList = [...formDataListRef.current]
    newFormDataList.forEach((item, index) => {
      item.licensePlate = statePlates[index].licensePlate
      item.plateColorTypeId = statePlates[index].plateColorTypeId
    })
    // 参数验证
    let tipCon = {
      flag: true,
      text: ''
    }
    for (let i = 0; i < newFormDataList.length; i++) {
      const formItem = newFormDataList[i]
      const index = i
      if (formItem.licensePlate || formItem.featureList.length) {
        if (formItem.licensePlate && !validatePlate(formItem.licensePlate)) {
          tipCon = {
            flag: false,
            text: `目标${index === 0 ? '一' : '二'}车牌号码格式不正确`
          }
          break
        }
      } else {
        tipCon = {
          flag: false,
          text: `目标${index === 0 ? '一' : '二'}应存在目标图像或者车牌号码`
        }
        break
      }
    }

    if (!tipCon.flag) {
      Message.warning(tipCon.text)
      return
    }
    setTrackData([])
    setCardResultData([])
    setResultData([])

    // 清理数据缓存
    services.cross.clearCache({ taskId: taskIdRef.current }).catch(err => console.log(err))
    // 如果有task就不请求了，除非页面刷新，
    if (!taskIdRef.current) {
      const { data = '' } = await services.cross.getCrossTaskId<string, string>()
      console.log(data)
      taskIdRef.current = data
    }
    setTracking(true)
    setAjaxLoading(true)


    if (timer.current) {
      clearTimeout(timer.current)
    }
    getData()
    pollingRef.current = true

    setCurrentTrackId(newFormDataList[0].trackId)
    if (!rightDrawerVisible) {
      setRightDrawerVisible(true)
    }
  }

  type ResultFormDataType = {
    taskId: string,
    featureLists: FormDataType[]
  }

  const getData = () => {

    if (beforAjax) {
      setBeforAjax(false)
    }

    services.cross.getRealTimeTracking<ResultFormDataType, ResultItem[]>({
      taskId: taskIdRef.current,
      featureLists: formDataListRef.current,
    }).then(res => {
      console.log(res)
      const result = (res.data || []).map((item, index) => {
        return {
          ...item,
          trackData: item.trackData?.map(elem => ({
            ...elem,
            trackColor: characterConfig.trackColor[index]
          })),
          predictPath: (item.predictPath || [])?.map((elem, i) => ({
            ...elem,
            startLngLat: item.trackData[0]?.lngLat || {},
            trackColor: characterConfig.trackColor[index],
            text: letterArr[i]
          })),
          showExtend: item.extendData && !!item.extendData.length,
          predictMessage: item.predictMessage
        }
      })
      const oldData = [...resultDataRef.current]
      result.forEach((newR, newIndex) => {
        oldData.forEach((oldR, oldIndex) => {
          if (oldR.trackId === newR.trackId) {
            // 轨迹数据删除一条拼接追加
            if (newR.trackData && newR.trackData.length) {
              oldR.trackData = newR.trackData.concat(oldR.trackData.slice(1, oldR.trackData.length))
            }
            // 拓展目标数据直接追加
            oldR.extendData = (newR.extendData ?? []).concat(oldR.extendData ?? [])
            if (newR.extendData.length) {
              oldR.showExtend = true
            } else {
              oldR.showExtend = false
            }
            // 人员档案信息直接替换, 添加infoId的判断
            if (newR.personInfoData) {
              oldR.personInfoData = newR.personInfoData
            }
            // 轨迹预测数据直接替换
            oldR.predictPath = newR.predictPath.map((item, i) => ({
              ...item,
              startLngLat: oldR.trackData[0]?.lngLat,
              trackColor: characterConfig.trackColor[oldIndex],
              text: letterArr[i]
            }))
            // 车辆型号数据直接替换
            oldR.vehicleInfoData = newR.vehicleInfoData
            oldR.predictMessage = newR.predictMessage
          }
        })
      })
      const newData = oldData.length ? oldData : result
      setResultData([...newData] || [])

      if (pollingRef.current) {
        timer.current = setTimeout(getData, 10000);
      }
    }).catch(err => {
      console.log(err)
      if (pollingRef.current) {
        timer.current = setTimeout(getData, 10000);
      }
    })
  }

  const handleShowExtendTarget = () => {
    setExtendTargetVisible(true)
  }

  const [resultShowType, setResultShowType] = useState('map')
  const switchData = [
    {
      label: <span><Icon type="tuwen" /> 图文</span>,
      value: "image",
    },
    {
      label: <span><Icon type="jichuditu" /> 地图</span>,
      value: "map",
    },
  ]

  // 地图列表切换单选组
  const ResulType = () => (
    <>
      {
        resultData.length ?
          <Button
            className="expand-target"
            onClick={handleShowExtendTarget}
            // @ts-ignore
            style={{ right: rightDrawerVisible ? '612px' : '194px' }}
          // style={{ right: rightDrawerVisible && currentTrackId ? '438px' : '20px' }}
          >拓展目标选择</Button>
          : ''
      }
      <FormRadioGroup
        className="result-show-type"
        defaultValue={resultShowType}
        yisaData={switchData}
        onChange={handleResultShowTypeChange}
        style={{ right: rightDrawerVisible ? '438px' : '20px' }}
      />
    </>
  )

  // 过滤名单按钮
  // const FilterBtn = () => (
  //   <Button type="primary" size="small" onClick={() => setFilterateVisible(true)}>过滤名单</Button>
  // )

  // 图文/地图改变
  const handleResultShowTypeChange = (value: string) => {
    setResultShowType(value)

    if (value === 'image') {
      setRightDrawerVisible(false)
      setCardResultVisible(true)

      // const data = handleCardResultData(handleSetFilter(ajaxFormDataRef.current.targetType, resultDataRef.current))
      // console.log(data)
      // setCardResultData(data)
    }

    if (value === 'map') {
      setRightDrawerVisible(true)
      setCardResultVisible(false)
    }
  }

  useEffect(() => {
    // if (tracking) {
    //   if (cardResultVisible) {
    //     cancel()
    //   } else {
    //     run()
    //   }
    // }
  }, [cardResultVisible])

  // 打开大图
  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, index?: number, parentIndex?: ((number | null)[]), infos?: TargetResultItemType[]) => {
    // const curdata = parentIndex && isArray(parentIndex) ? resultData[parentIndex[0]].trackData[parentIndex[1]]?.infos : currentData.trackData[(parentIndex as number) || 0]?.infos
    // const curindex = parentIndex && isArray(parentIndex) ? parentIndex[1] : parentIndex
    // console.log(index, parentIndex, curdata, currentTrackId)
    // const newBigImgData = infos && infos.length ? infos : (curdata || [])
    // setBigImgData(newBigImgData)
    setBigImgIndex(findChildIndex(parentIndex || [], index || 0))
    setBigImgVisible(true)
  }

  // 大图寻找下方小图的index
  const findChildIndex = (indexArr: (number | null)[], childIndex: number) => {
    let currentIndex = 0, counter = 0

    const trackListData = currentData.trackData
    for (let i = 0; i < trackListData.length; i++) {
      const item = trackListData[i]
      if (indexArr.every((val, i) => val === item.indexArr[i])) {
        currentIndex = currentIndex + childIndex
        break
      } else {
        currentIndex = currentIndex + (item.infos?.length || 0)
      }
    }

    console.log('currentIndex', currentIndex)
    return currentIndex
  }

  // 图文页打开大图
  const handleOpenBigImgFromCardResult = (event: React.MouseEvent, item: TargetResultItemType, index: number) => {
    setBigImgData(cardResultData)
    setBigImgIndex(index)
    setBigImgVisible(true)
  }

  // 添加数据到过滤名单
  const handleAddFilterate = (data: TargetResultItemType) => {
    // 从featureList上传列表的识别数据中，删除该项
    // 原始特征数组
    let newFormDataList = [...formDataListRef.current]
    newFormDataList.forEach((item) => {
      if (item.trackId === currentTrackId) {
        item.featureList = item.featureList.filter(o => o.feature !== data.feature)
      }
    })
    setFormDataList(newFormDataList)

    // //
    services.cross.addFilterate({
      taskId: taskIdRef.current,
      trackId: currentData.trackId,
      item: data
    }).then(res => {
      console.log(res)
      Message.success("添加成功")
      // 从resultData/filterData/cardResultData中删除加入过滤名单的数据
      let newResultData = resultDataRef.current.map((item, index) => {
        if (item.trackData && item.trackData.length) {
          item.trackData.forEach((elem) => {
            if (elem.infos?.length) {
              elem.infos = elem.infos.filter(item => item.infoId !== data.infoId)
            }
          })
          // item.trackData = item.trackData.filter((item: DataItemType) => (item.infos?.length || 0) > 0)
        }
        item.trackData = item.trackData.map((elem, index) => ({ ...elem, index: item.trackData.length - index }))
        return item
      })
      setResultData([...newResultData])
      // handleConnectTrack(newFilterData)

      // 显示的列表数据过滤掉没有infos信息的
      // setTrackData([...newFilterData])


    }).catch(err => console.log(err))
  }

  const handleFilterateDelChange = (data: TargetResultItemType[]) => {
    // 从resultData/filterData/cardResultData中加入过滤名单中删除的数据，不过需要filterId对应
    let newResultData = resultDataRef.current.map(dataItem => {
      // 处理数据找到相同filterId，将从过滤名单来的数据加入resultData
      if (dataItem.trackData && dataItem.trackData.length) {
        dataItem.trackData.forEach((dataChild) => {
          data.forEach((filItem) => {
            if (filItem.filterId == dataChild.filterId) {
              let infos = [...(dataChild.infos ?? []), { ...filItem, retrieval: false }]
              dataChild.infos = infos.sort((a, b) => Number(b.similarity || 0) - Number(a.similarity || 0));
            }
          })
        })
        // dataItem.trackData = dataItem.trackData.filter((item: DataItemType) => (item.infos?.length || 0) > 0)
      }
      dataItem.trackData = dataItem.trackData.map((elem, index) => ({ ...elem, index: dataItem.trackData.length - index }))

      return dataItem
    })

    setResultData([...newResultData])

    // setTrackData([...newFilterData])
    cardResultRef.current?.filterateDel(data)
  }

  // 判断当前path是否有链接到下一个点的经纬度，没有的话，添加下一个点的经纬度
  const handleConnectTrack = (newFilterData: DataItemType[]) => {
    // for (let i = 0; i < newFilterData.length; i++) {
    //   const item = newFilterData[i]
    //   // 判断当前path是否有链接到下一个点的经纬度，没有的话，添加下一个点的经纬度
    //   // 根据时间排序判断是连接的上一个点还是下一个点
    //   console.log(ajaxFormDataRef.current.sort.order)
    //   if (ajaxFormDataRef.current.sort.order === 'asc') {
    //     if (newFilterData[i - 1]) {
    //       const prevLnglat = newFilterData[i - 1].lngLat
    //       const lngLatStr = `${prevLnglat.lng},${prevLnglat.lat}`
    //       let ifConnect = false
    //       if (item.path && item.path.length) {
    //         item.path.forEach((str: string) => {
    //           if (str.indexOf(lngLatStr) > -1) {
    //             ifConnect = true
    //           }
    //         });
    //       }
    //       console.log(ifConnect)
    //       !ifConnect && item.path.push(lngLatStr)
    //     }
    //   } else {
    //     if (newFilterData[i + 1]) {
    //       const nextLnglat = newFilterData[i + 1].lngLat
    //       const lngLatStr = `${nextLnglat.lng},${nextLnglat.lat}`
    //       let ifConnect = false
    //       if (item.path && item.path.length) {
    //         item.path.forEach((str: string) => {
    //           if (str.indexOf(lngLatStr) > -1) {
    //             ifConnect = true
    //           }
    //         });
    //       }
    //       console.log(ifConnect)
    //       !ifConnect && item.path.push(lngLatStr)
    //     }
    //   }
    // }
    // return newFilterData
  }

  const handleExtendTargetConfirm = (data: {
    targetType: string;
    putItAway: true;
    checkedValue: TargetResultItemType[];
  }) => {
    // 请求接口记录日志
    services.cross.realTimeTrackingAddTarget({
      taskId: taskIdRef.current,
      trackId: currentData.trackId,
      items: data.checkedValue
    }).then((res) => {
      // console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // console.log("拓展目标选择的目标")
    // 更新当前表单特征数组
    const newFormDataList = [...formDataList]
    const newStatePlates = [...statePlates]

    const vehicleCheckedData = data.checkedValue.filter(item => item.targetType === 'vehicle')
    const faceCheckedData = data.checkedValue.filter(item => item.targetType === 'face')
    // const newStatePlates = [...statePlates]
    newFormDataList.forEach((item, index) => {
      if (item.trackId === currentTrackId) {
        // 人脸数据拓展到特征列表
        const newFeatureList = faceCheckedData.map(o => ({
          targetType: data.targetType && data.targetType === 'all' ? o.targetType : data.targetType,
          feature: o.feature,
          targetImage: o.targetImage,
          detection: o.detection,
          gaitFeature: o.gaitFeature,
          isChecked: o.isChecked,
          infoId: o.infoId,
          licensePlate2: o.licensePlate2,
          plateColorTypeId2: o.plateColorTypeId2,
          ...o.detection
        })) as TargetFeatureItem[]
        item.featureList = [...item.featureList, ...newFeatureList]

        // 车辆目标选中数据填入车牌输入框
        if (vehicleCheckedData.length) {
          const curVehicleChecked = vehicleCheckedData[vehicleCheckedData.length - 1]
          item.licensePlate = curVehicleChecked.licensePlate2 || curVehicleChecked.licensePlate1 || curVehicleChecked.licensePlate
          item.plateColorTypeId = curVehicleChecked.plateColorTypeId2 || curVehicleChecked.plateColorTypeId1
          newStatePlates[index] = {
            licensePlate: curVehicleChecked.licensePlate2 || curVehicleChecked.licensePlate1 || curVehicleChecked.licensePlate,
            plateColorTypeId: curVehicleChecked.plateColorTypeId2 || curVehicleChecked.plateColorTypeId1,
          }
        }
      }
    })
    setStatePlates(newStatePlates)
    setFormDataList(newFormDataList)

    setExtendTargetVisible(false)

    // 更新拓展目标默认收起状态
    setPutItAway(data.putItAway)
  }

  const handleTrackPredict = (trackId: string, value: boolean) => {
    const newFormDataList = [...formDataList]
    newFormDataList.forEach((item) => {
      if (item.trackId === trackId) {
        item.enableTrackPredict = value
      }
    })
    setFormDataList(newFormDataList)
  }

  // 重置
  const handleReset = () => {
    resetFormData()
    resetStatePlates()
  }

  // 上传历史保存
  const saveUploadHistory = (data: any) => {
    services.saveUploadHistory({
      uid: userInfo.id,
      param: data
    }).then(res => setFlushHistory(true))
      .catch(err => Message.error(err.message))
  }

  // 页面跳转传参处理
  const handleParamsData = async () => {
    //所有跳转到以图的参数先进行编码
    const searchData = getParams(location.search)
    // console.log(searchData)
    if (!isEmptyObject(searchData)) {
      let paramsFormData = [...formDataListRef.current]
      //特征数组 ,由于特征数组包含的字段太多，可能会有特殊字符，&等
      if (searchData.licensePlate && searchData.plateColorTypeId) {
        setStatePlates([{
          licensePlate: searchData.licensePlate,
          plateColorTypeId: Number(searchData.plateColorTypeId) as PlateTypeId
        }])
      } else if (searchData.featureList) {
        try {
          const featureList: TargetFeatureItem[] = JSON.parse(decodeURIComponent(searchData.featureList))
          const vehicleFeatures = featureList.filter(item => item.targetType === 'vehicle')
          const faceFeatures = featureList.filter(item => item.targetType === 'face')
          paramsFormData[0].featureList = faceFeatures

          // 将跳转带来的车牌信息填入表单
          if (vehicleFeatures.length) {
            const newPlateData = vehicleFeatures[vehicleFeatures.length - 1]
            if (!newPlateData.licensePlate2) {
              Message.warning('未识别到车牌，请上传可识别车牌的车辆图像')
              return
            }

            const newFormDataList = [...formDataList]
            paramsFormData[0].licensePlate = newPlateData.licensePlate2
            paramsFormData[0].plateColorTypeId = newPlateData.plateColorTypeId2 || 5
            setFormDataList(newFormDataList)
            handlePlateChange({
              plateNumber: newPlateData.licensePlate2 || '',
              plateTypeId: newPlateData.plateColorTypeId2 || 5,
              noplate: ''
            }, 0)
            Message.success('自动识别车牌已填入车牌号码中')
          }

          faceFeatures.forEach((feature => {
            saveUploadHistory(feature)
          }))
        } catch (error) {
          console.log(error)
        }
      } else if (searchData.token) {
        await getLogData({ token: searchData.token }).then(res => {
          const { data } = res as any
          if (data && isObject(data)) {
            try {
              paramsFormData = data.featureLists || [formDataTemplate]

              const newStatePlates = paramsFormData.map(item => ({
                plateColorTypeId: item.plateColorTypeId,
                licensePlate: item.licensePlate,
              }))
              setStatePlates([...newStatePlates])
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
        })
      }
      setFormDataList([...paramsFormData])
    }
  }

  useEffect(() => {
    handleParamsData()

    // calcListCount()
    // window.addEventListener('resize', calcListCount)


    return () => {
      pollingRef.current = false
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [])

  return (
    <div className={`${prefixCls} page-content`}>
      <div className={`${prefixCls}-content`} ref={boxRef}>
        <TrackMultiMap
          ref={trackMapRef}
          trackData={[...trackData]}
          trackContentCb={handleTrackContentCb}
          selectedIndexArr={selectedIndexArr}
          onSelectedChange={handleTrackSelectedChange}
          predictPath={currentTrackId ? currentData.predictPath : []}
          adapt={false}
          showTracking={tracking}
        />

        {
          ajaxLoading ?
            <div className="tracking-loading">
              <Icon type="kuajingzhuizong" />
              正在进行跨镜追踪...
            </div>
            : ''
        }

        <BoxDrawer
          title="实时跨镜追踪"
          placement="left"
          onOpen={() => setLeftDrawerVisible(true)}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="retrieval-form">
            {
              formDataList.map((item, index) => {
                const hasFace = item.featureList.filter(o => o.targetType === 'face' || o.targetType === 'pedestrian').length

                return (
                  <div
                    key={index + item.licensePlate}
                    className={classNames("formdata-item", {
                      "checked": currentTrackId === item.trackId
                    })}
                    style={{ backgroundColor: colorArr[index] }}
                    onClick={(e) => handleCheck(e, item.trackId)}
                  >
                    {
                      currentTrackId === item.trackId && formDataList.length > 1 ?
                        <div onClick={(e) => handleDelFormData(e, index, item.trackId)} className="del-btn"><CloseOutlined /></div>
                        :
                        ''
                    }
                    <div className="formdata-item-title">目标{index === 0 ? '一' : '二'}</div>
                    <div className="formdata-item-con">
                      <Form colon={false} layout="vertical">
                        <div onDragOver={handleImgDragOver} onDrop={(event) => handleImgDrop(event, item.trackId)} onDragLeave={handleImgDragLeave}>
                          <Form.Item label="输入车牌号码或上传人脸图像">
                            <FormPlate
                              value={{
                                plateNumber: statePlates[index].licensePlate,
                                plateTypeId: statePlates[index].plateColorTypeId,
                                noplate: ''
                              }}
                              onChange={(value) => handlePlateChange(value, index)}
                              remind={`提示：请输入准确车牌号码（如：鲁A12345）。`}
                              isShowKeyboard
                              isShowNoLimit={false}
                              // placement="bottom"
                              accurate
                            />
                          </Form.Item>
                          <Form.Item
                          // className="upload-area"
                          // label="目标图像（最多可上传5个目标）"
                          >
                            <>
                              <ImgUpload
                                // ref={imgUploadRef}
                                limit={5}
                                multiple={true}
                                showConfirmBtn={false}
                                // innerSlot={<UploadButton />}
                                flushHistory={flushHistory}
                                onFlushHistoryComplete={() => { setFlushHistory(false) }}
                                featureList={item.featureList}
                                onChange={(list) => handleChangeFeatureList(list, index)}
                                disabled={uploadDisabled}
                                formData={{
                                  analysisType: 'face'
                                }}
                                uploadHistoryType={"face"}
                              />
                              {/* <span className="or">或</span> */}
                            </>
                          </Form.Item>
                        </div>

                        {
                          hasFace ?
                            <Form.Item
                            // label="相似度阈值"
                            >
                              <>
                                <span className="form-label">人脸相似度</span>
                                <Slider
                                  min={Number(pageConfig.threshold.min === "" ? 70 : pageConfig.threshold.min)}
                                  value={item.similarity}
                                  showInput={true}
                                  onChange={(similar) => handlesimilarityChange(similar, index)}
                                />
                              </>
                            </Form.Item>
                            : ''
                        }
                        <Form.Item>
                          <>
                            <span className="form-label">过滤低质量人脸</span>
                            <Switch
                              checked={!!item.qualityFilter}
                              onChange={(checked, event) => handleQualityFilterChange(checked, index)}
                              checkedChildren={'启用'}
                              unCheckedChildren={'关闭'}
                            />
                          </>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                )
              })
            }
            {
              formDataList.length < 2 ?
                <Button onClick={handleAddFormData} disabled={tracking}>添加目标</Button>
                : ''
            }
          </div>
          <Space size={10} className="btns-wrap">
            <Button
              disabled={tracking}
              onClick={handleReset}
              type='default'
              className="reset-btn"
              icon={<UndoOutlined />}
            >重置</Button>
            <div
              className="retrieval-btn"
              onClick={handleBtnClick}
            >
              {
                tracking ?
                  <video
                    src={trackingMp4}
                    className="tracking-bg"
                    autoPlay
                    muted
                    loop
                  ></video>
                  : ''
              }
              <Button
                type="primary"
              // loading={ajaxLoading}
              >{tracking ? "结束追踪" : '开始追踪'}</Button>
            </div>
          </Space>
          <div className="retrieval-tip">注：跟踪期间修改的参数仅对后续跟踪生效</div>
        </BoxDrawer>
        <BoxDrawer
          placement="right"
          title={null}
          onOpen={() => setRightDrawerVisible(true)}
          onClose={() => setRightDrawerVisible(false)}
          visible={!!currentTrackId ? rightDrawerVisible : false}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="result-con">
            <Result
              // currentTrackId={"xxxx"}
              currentTrackId={currentTrackId}
              bgColor={currentFormData?.bgColor || ''}
              indexColor={currentFormData?.indexColor || ''}
              ajaxLoading={ajaxLoading}
              currentData={currentData}
              resultData={resultData}
              cardResultVisible={cardResultVisible}
              selectedIndexArr={selectedIndexArr}
              handleCardClick={handleCardClick}
              handleOpenBigImg={handleOpenBigImg}
              // FilterBtn={FilterBtn}
              handleAddFilterate={handleAddFilterate}
            />
          </div>
        </BoxDrawer>

        {/* {beforAjax ? "" : <ResulType />} */}
        {
          currentTrackId ?
            <ResulType />
            : ''
        }


        <CardResult
          ajaxLoading={ajaxLoading}
          ref={cardResultRef}
          cardResultVisible={cardResultVisible}
          beforAjax={beforAjax}
          ResulType={ResulType}
          // FilterBtn={FilterBtn}
          currentTrackId={currentTrackId}
          taskId={taskIdRef.current}
          bgColor={currentFormData?.bgColor || ''}
          handleAddFilterate={handleAddFilterate}
          tracking={tracking}
        />

        {
          currentTrackId ?
            <div className="predict-path" style={{ right: rightDrawerVisible && currentTrackId ? '438px' : '20px' }}>
              <div className="predict-path-title">
                <span>预计前往地点</span>
                <Switch
                  checked={currentFormData?.enableTrackPredict}
                  onChange={(val) => handleTrackPredict(currentData.trackId, val)}
                />
              </div>
              <div className="predict-path-con">
                {
                  currentFormData?.enableTrackPredict && currentData.predictPath && currentData.predictPath.length && currentTrackId ?
                    currentData.predictPath.map((item, index) => {
                      return (
                        <div className="predict-path-item" key={index + item.locationId}>
                          <div className="predict-path-item-title">{letterArr[index]} 概率 {item.prob}%</div>
                          <div className="predict-path-item-desc"><span className="label">{item.seconds}秒后</span> <span>{item.locationName}</span></div>
                        </div>
                      )
                    })
                    :
                    currentData.predictMessage ? currentData.predictMessage
                      : '暂无预测点位信息'
                }
              </div>
            </div>
            : ''
        }
      </div>
      <BigImg
        modalProps={{
          visible: bigImgVisible,
          onCancel: () => setBigImgVisible(false)
        }}
        currentIndex={bigImgIndex}
        data={bigImgData}
        onIndexChange={(index) => {
          setBigImgIndex(index)
        }}
      />
      <FilterateModal
        taskId={taskIdRef.current}
        trackId={currentData.trackId}
        modalProps={{
          visible: filterateVisible,
          onCancel: () => setFilterateVisible(false)
        }}
        onDelChange={handleFilterateDelChange}
      />
      <ExtendTargetModal
        modalProps={{
          visible: extendTargetVisible,
          onCancel: () => setExtendTargetVisible(false)
        }}
        onModalConfirm={handleExtendTargetConfirm}
        data={currentData.extendData ?? []}
        featureList={(formDataList.find(item => item.trackId === currentTrackId) ?? {}).featureList || []}
        onPutItAwayChange={(putitaway) => setPutItAway(putitaway)}
      />
    </div>
  )
}

export default RealTimeTracking
