import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { formatTimeComponentToForm, formatTimeFormToComponent, getParams, isNumber, isObject } from "@/utils";
import { isEmptyObject } from "@/utils/is";
import { Message, VirtualList, Image, Button, Tooltip, Form, Select, Space } from '@yisa/webui'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined, CheckCircleOutlined, UndoOutlined } from "@yisa/webui/es/Icon"
import { ResultBox, } from '@yisa/webui_business'
import { BoxDrawer, TimeRangePicker, Card, BigImg, TrackMultiMap, FormPlateMulti, Panel, Export as ExportBtn } from '@/components'
import { RefTrackMap } from "@/components/Map/TrackMap/interface";
import { TrackDataItem } from '@/components/Map/TrackMulti/interface'
import { ImgInfoCard } from "../Peer/components";
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, jumpRecordVehicle, validatePlate } from '@/utils'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { FormDataType, ResultDataType, ResultItem } from './interface'
import characterConfig from "@/config/character.config";
import services from "@/services";
import classNames from 'classnames'
import { useSelector, useDispatch, RootState } from '@/store'
import dayjs from 'dayjs'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { PlateNumberItemType } from '@/components/FormPlateMulti/interface'
import { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import './index.scss'
import { getLogData } from "@/utils/log";
import { useResetState } from "ahooks";


const VehicleTrack = () => {
  const location = useLocation()
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["vehicle-track"] || {}
  });
  const defaultFormData: FormDataType = {
    licensePlates: [{ plateColorTypeId: 5, licensePlate: '' }],
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    sort: {
      field: 'captureTime',
      order: 'desc'
    }
  }
  const [formData, setFormData, resetFormData] = useResetState(defaultFormData)
  const [ajaxFormData, setAjaxFormData] = useState<any>(formData)

  // 结果数据（汇总）
  const [resultData, setResultData] = useState<ResultItem[]>([])
  // 车牌-轨迹颜色对应关系
  const colorMap = useRef<Map<string, string>>()

  // 选中数组（选中显示在地图与列表）
  const [checkedValues, setCheckedValue] = useState<ResultItem[]>([])

  // 右侧列表显示数据(可能为单条，也可能为两条合一块)
  const [resultList, setResultList] = useState<TrackDataItem[]>([])
  // 大图右侧轨迹列表
  const trackListData = formData.sort.order === 'desc' ? resultList : [...resultList].reverse()

  // 轨迹数据
  const [trackData, setTrackData] = useState<TrackDataItem[][]>([])
  const [selectedIndexArr, setSelectedIndexArr] = useState<(number | null)[]>([null, null])

  // const [selectedListIndexArr]

  // 大图
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgData, setBigImgData] = useState<{
    // 轨迹索引
    parentIndexArr: (number | null)[];
    // 小图索引
    childIndex: number;
    data: TargetResultItemType[];
  }>({
    parentIndexArr: [0, 0],
    childIndex: 0,
    data: []
  })

  // 大图轨迹虚拟列表高度
  const virtualTrackBoxRef = useRef<HTMLDivElement>(null)
  const [virtualTrackBoxHeight, setVirtualTrackBoxHeight] = useState(virtualTrackBoxRef.current?.offsetHeight || 0)

  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  const trackMapRef = useRef<RefTrackMap>(null)


  const calcVirtualHeight = (boxRef: HTMLDivElement | null, setHeight: any) => {
    // console.log(virtualBoxRef.current?.offsetHeight)
    const height = boxRef?.offsetHeight || 0
    setHeight(height)
  }

  const handleParamsData = async () => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData)) {
      console.log(searchData)
      try {
        // 处理接收页面跳转参数
        let newFormData = {}
        if (searchData.licensePlates) {
          const newLicensePlates = JSON.parse(searchData.licensePlates)
          newFormData['licensePlates'] = newLicensePlates.slice(0, 2)
        }
        if (searchData.licensePlate) {
          const newLicensePlate = {
            licensePlate: searchData.licensePlate,
            plateColorTypeId: Number(searchData.plateColorTypeId || 5)
          }
          newFormData['licensePlates'] = [newLicensePlate]
        }
        if (searchData.beginDate && searchData.endDate) {
          newFormData['timeType'] = 'time'
          newFormData['beginDate'] = searchData.beginDate
          newFormData['endDate'] = searchData.endDate
        }
        if (searchData.token) {
          await getLogData({ token: searchData.token }).then(res => {
            const { data } = res as any
            if (data && isObject(data)) {
              try {
                newFormData = data
                // 时间格式恢复
                if (data.timeRange) {
                  formatTimeFormToComponent(data.timeRange, newFormData)
                }
              } catch (error) {
                Message.error(`数据解析失败`)
              }
            }
          })
        }
        const newAjaxFormData = {
          ...formData,
          ...newFormData
        }
        setFormData(newAjaxFormData)

        const plates = newAjaxFormData.licensePlates.filter(item => !!item.licensePlate)

        if (plates.length > 0) {
          // 执行检索
          if (!('timeRange' in newAjaxFormData)) {
            newAjaxFormData['timeRange'] = formatTimeComponentToForm(newAjaxFormData)
          }
          setAjaxFormData(newAjaxFormData)
          getTrackData(newAjaxFormData)
        }
      } catch (error) {
        console.log(error)
      }
    } else { }
  }

  useEffect(() => {
    handleParamsData()


    // 虚拟列表高度改变
    const resizeObserver = new ResizeObserver((entries) => {
      calcVirtualHeight(virtualBoxRef.current, setVirtualBoxHeight)
    });
    virtualBoxRef.current && resizeObserver.observe(virtualBoxRef.current);

    // 虚拟列表高度改变
    const resizeObserverTrack = new ResizeObserver((entries) => {
      calcVirtualHeight(virtualTrackBoxRef.current, setVirtualTrackBoxHeight)
    });
    virtualTrackBoxRef.current && resizeObserverTrack.observe(virtualTrackBoxRef.current);
  }, [])



  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, childIndex: number, indexArr: (number | null)[], infos?: TargetResultItemType[]) => {
    setBigImgData({
      ...bigImgData,
      childIndex: findChildIndex(indexArr, childIndex),
      parentIndexArr: indexArr
    })
    setBigImgVisible(true)
  }

  const handleCardClick = (event: React.MouseEvent, data: TrackDataItem, index: number) => {
    setSelectedIndexArr(data.indexArr || [null, null])
  }

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

  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }

  const handlePlateChange = (value: PlateNumberItemType[]) => {
    setFormData({
      ...formData,
      licensePlates: value
    })
  }

  const handleBtnClick = () => {
    // console.log(formData)
    const { licensePlates, beginDate, endDate } = formData

    const dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(beginDate).diff(dayjs(endDate), 'days')
      if (Math.abs(timeDiff) > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }
    // 传参验证，有至少一个车牌以上，且车牌格式都正确
    let verify = true // 验证通过
    const plates = licensePlates.filter(item => !!item.licensePlate)
    if (plates.length === 0) {
      Message.warning("请输入至少一个车牌号")
      return
    }
    plates.forEach(item => {
      if (item.licensePlate && !validatePlate(item.licensePlate, true)) {
        Message.warning(`“${item.licensePlate}”精确车牌格式不正确`)
        verify = false
      }
    })
    if (!verify) return;

    let newForm = {
      licensePlates: formData.licensePlates,
    }

    // 格式化日期参数
    let timeRange = {}
    if (formData.timeType === 'time') {
      timeRange = {
        times: [formData.beginDate, formData.endDate]
      }
    } else {
      timeRange = {
        periods: {
          dates: [formData.beginDate, formData.endDate],
          times: [formData.beginTime, formData.endTime]
        }
      }
    }
    newForm['timeRange'] = timeRange
    setAjaxFormData(newForm)
    getTrackData(newForm)
  }

  const getTrackData = (formData: any) => {
    setAjaxLoading(true)
    services.vehicleTrack.getVehicleTracks<FormDataType, ResultItem[]>(formData).then(res => {
      setAjaxLoading(false)
      console.log(res)
      setLeftDrawerVisible(false)
      setRightDrawerVisible(true)

      // 车牌-轨迹颜色对应关系
      colorMap.current = new Map();
      const newResultData = res.data || []
      // 大图数据
      let newBigImgData: TargetResultItemType[] = []
      // 给数据添加显示的index
      newResultData.forEach((item, index) => {
        const { data = [] } = item
        colorMap.current?.set(item.licensePlate, characterConfig.trackColor[index])
        if (data && data.length) {
          data.forEach((elem, i) => {
            elem.index = data.length - i
            elem.trackColor = characterConfig.trackColor[index]
            // 索引数组, 与轨迹选中对应
            elem.indexArr = [index, (data.length - 1) - i]

            if (elem.infos && elem.infos.length && index === 0) {
              newBigImgData = [...newBigImgData, ...elem.infos]
            }
            // // 给没有path的数据，添加当前点位，便于轨迹tick事件寻找当前点
            // if (!elem.path || !elem.path.length) {
            //   elem.path = [{
            //     time: new Date(elem.minCaptureTime).getTime(),
            //     lng: Number(elem.lngLat?.lng || 0),
            //     lat: Number(elem.lngLat?.lat || 0)
            //   }]
            // }
          })
        }
      })
      console.log(newResultData, newBigImgData)
      setResultData(newResultData)
      setBigImgData({
        childIndex: 0,
        parentIndexArr: [0, 0],
        data: newBigImgData
      })

      if (newResultData.length) {
        // 默认选中第一条车辆的轨迹数据
        const newResultList = newResultData[0].data
        // console.log(newResultList)
        setResultList(newResultList)

        setCheckedValue([newResultData[0]])

        // 倒序
        const newTrackData = [[...newResultList].reverse()]
        setTrackData(newTrackData)
      }

    }).catch(err => { setAjaxLoading(false); console.log(err) })
  }

  // 排序方式改变
  const handleChangeSort = (v: SelectCommonProps['value']) => {
    const sortField = (v as string).split('-')
    console.log(sortField)
    setFormData({
      ...formData,
      sort: {
        field: sortField[0],
        order: sortField[1] as FormDataType['sort']['order']
      }
    })
    let newFilterData = sortArrayByTime(resultList, sortField[1] as FormDataType['sort']['order'])
    setResultList([...newFilterData])
  }

  // 数据通过时间排序，字段默认取minCaptureTime
  function sortArrayByTime<T extends Array<TrackDataItem>>(array: T, sortOrder: 'asc' | 'desc', field = 'minCaptureTime'): T {
    array.sort((a, b) => {
      var timeA = new Date(a[field]).getTime();
      var timeB = new Date(b[field]).getTime();

      if (sortOrder === 'asc') {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    });

    return array;
  }

  // 数组元素切换
  const toggleArrayElement = (arr: ResultItem[], element: ResultItem) => {
    let newArr = [...arr]
    const length = newArr.filter(item => item.licensePlate === element.licensePlate).length;

    if (length > 0) {
      // 元素存在，删除它
      newArr = newArr.filter(item => item.licensePlate !== element.licensePlate)
    } else {
      // 元素不存在，添加它
      newArr.push(element);
    }
    return newArr
  }

  // 查询信息选中变化
  const handleCheckedValue = (resultItem: ResultItem, index: number) => {
    const newCheckedValue = toggleArrayElement([...checkedValues], resultItem)
    let newResultList: TrackDataItem[] = []
    let newTrackData: TrackDataItem[][] = []
    let newBigImgData: TargetResultItemType[] = []
    newCheckedValue.forEach((item) => {
      if (item.data.length) {
        newResultList = [...newResultList, ...item.data]
        newTrackData.push([...item.data].reverse())

        //
        item.data.forEach(dataItem => {
          if (dataItem.infos && dataItem.infos.length) {
            newBigImgData = newBigImgData.concat(dataItem.infos)
          }
        })
      }
    })
    // 按照抓拍时间排序
    newResultList = sortArrayByTime([...newResultList], formData.sort.order)
    // console.log('newBigImgData', newBigImgData)
    setResultList(newResultList)

    // 轨迹数据
    setTrackData(newTrackData)
    console.log(newBigImgData)
    // 大图数据顺序页按照轨迹数据，时间排序从新->旧，按降序排列
    setBigImgData({
      childIndex: 0,
      parentIndexArr: [0, 0],
      data: newBigImgData
    })

    setCheckedValue(newCheckedValue)

    // 重置选中点位索引数组
    setSelectedIndexArr([null, null])
  }

  // 地图选中轨迹点位
  const handleTrackSelectedChange = (indexArr: (number | null)[]) => {
    console.log(indexArr)
    setSelectedIndexArr(indexArr)
  }

  // 大图右侧信息渲染
  const BigImgInfoRender = (data: TargetResultItemType, currentIndex: number) => {

    return (
      <div className="track-img-right-info">
        <Panel title="目标信息">
          <ImgInfoCard
            data={data || {}}
          />
        </Panel>
        <Panel title="轨迹列表" className="track-panel">
          <div className="track-container" ref={virtualTrackBoxRef}>
            <VirtualList
              data={trackListData}
              itemKey={(item) => item.minCaptureTime + item.index}
              height={virtualTrackBoxHeight}
              itemHeight={102}
            >
              {
                item => {
                  const isActive = bigImgData.parentIndexArr.every((val, i) => val === item.indexArr[i])

                  return (
                    <Card.TrackInfo
                      key={item.minCaptureTime + item.index}
                      data={item}
                      trackIndex={item.index}
                      active={isActive}
                      onTrackCardClick={() => { handleTrackCardClick(item.indexArr) }}
                    />
                  )
                }
              }
            </VirtualList>
          </div>
        </Panel>
      </div>
    )
  }

  // 大图轨迹列表点击回调
  const handleTrackCardClick = (indexArr: (number | null)[]) => {
    console.log(indexArr)
    setBigImgData({
      ...bigImgData,
      parentIndexArr: indexArr,
      childIndex: findChildIndex(indexArr, 0)
    })
  }

  // 大图寻找下方小图的index
  const findChildIndex = (indexArr: (number | null)[], childIndex: number) => {
    let currentIndex = 0, counter = 0

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

  // 大图根据小图index，寻找父级indexArr
  const findParentIndexArr = (index: number): (number | null)[] => {
    let currentIndexArr = [0, 0], counter = 0


    for (let i = 0; i < trackListData.length; i++) {
      const item = trackListData[i]
      const increase = (item.infos?.length || 0)
      counter = counter + increase

      // 如果counter >= index，说明index在此item.infos区间
      if (counter >= (index + 1)) {
        currentIndexArr = item.indexArr
        break
      } else {
      }
    }

    // console.log('currentIndexArr', currentIndexArr)
    return currentIndexArr
  }

  const handleReset =() => {
    resetFormData()
  }

  return (
    <div className="vehicle-track">
      <div className="vehicle-track-content" ref={boxRef}>
        <TrackMultiMap
          ref={trackMapRef}
          trackData={[...trackData]}
          trackContentCb={handleTrackContentCb}
          selectedIndexArr={selectedIndexArr}
          onSelectedChange={handleTrackSelectedChange}
        />

        <BoxDrawer
          title="轨迹重现"
          placement="left"
          onOpen={() => setLeftDrawerVisible(true)}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="retrieval-form">
            <Form colon={false}>
              <FormPlateMulti
                value={formData.licensePlates}
                onChange={handlePlateChange}
                remind={`提示：请输入准确车牌号码（如：鲁A12345）。`}
              />
            </Form>
            <Form colon={false} layout="vertical">
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                onChange={handleDateChange}
                timeLayout="vertical"
              />
            </Form>
          </div>
          <div className="retrieval-btn">
            <Space size={10}>
              <Button
                disabled={ajaxLoading}
                onClick={handleReset}
                type='default'
                className="reset-btn"
                icon={<UndoOutlined />}
              >重置</Button>
              <Button type="primary" onClick={handleBtnClick} loading={ajaxLoading}>查询</Button>
            </Space>
          </div>
        </BoxDrawer>
        <BoxDrawer
          placement="right"
          title="轨迹重现信息"
          onOpen={() => setRightDrawerVisible(true)}
          onClose={() => setRightDrawerVisible(false)}
          visible={rightDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="result-con">
            <ResultBox
              loading={ajaxLoading}
              nodata={!resultData || (resultData && !resultData.length)}
            >
              <div className="result-tabs">
                {
                  resultData.map((item, index) => {
                    const isChecked = !!checkedValues.filter(o => o.licensePlate === item.licensePlate).length
                    return (
                      <div
                        className={classNames("result-tabs-item", {
                          'checked': isChecked
                        })}
                        key={index}
                        onClick={() => handleCheckedValue(item, index)}
                      >
                        <div className="result-tabs-item-info">
                          <label>车牌信息：</label>
                          {
                            !validatePlate(item.licensePlate) ?
                              <span className={`plate2-text plate-color-8`}></span> :
                              (
                                item.licensePlateUrl && item.licensePlateUrl != "" ?
                                  <a target="_blank" href={item.licensePlateUrl} className={`plate2-text plate-bg plate-color-${item.plateColorTypeId}`}>
                                    {item.licensePlate}
                                  </a>
                                  :
                                  <span className={`plate2-text plate-bg plate-color-${item.plateColorTypeId}`}>{item.licensePlate}</span>
                              )
                          }
                        </div>
                        <div className="result-tabs-item-info">
                          <label>轨迹颜色：</label>
                          <div
                            className="track-color-line"
                            style={{
                              backgroundColor: colorMap.current?.get(item.licensePlate)
                            }}
                          ></div>
                        </div>
                        {
                          isChecked ?
                            <CheckCircleOutlined />
                            : ''
                        }
                      </div>
                    )
                  })
                }
              </div>
              <div className="result-total">
                <div className="total-left">
                  共<span>{resultList.length}</span>条轨迹信息
                  {
                    !!resultList.length ?
                      <ExportBtn
                        total={resultList.length}
                        url={'/v1/trajectory/vehicle/export'}
                        hasAll={false}
                        formData={{
                          ...ajaxFormData,
                          pageNo: 1,
                          pageSize: resultList.length,
                          licensePlates: checkedValues.map(o => ({
                            licensePlate: o.licensePlate,
                            plateColorTypeId: o.plateColorTypeId
                          }))
                        }}
                      />
                      : ''
                  }
                </div>
                <div className="total-right">
                  <Select
                    disabled={ajaxLoading || !resultData.length}
                    options={characterConfig.captureSortList}
                    value={`${formData.sort.field}-${formData.sort.order}`}
                    onChange={handleChangeSort}
                  />
                </div>
              </div>
              <div className="result-content" ref={virtualBoxRef}>

                {/* {
                  resultList.length ?
                    <VirtualList
                      data={resultList}
                      itemKey={(item) => item.minCaptureTime + item.index}
                      height={virtualBoxHeight}
                      itemHeight={162}
                    >
                      {
                        (item, index) => {

                          return (
                            <Card.Track
                              key={item.minCaptureTime + item.index}
                              cardData={item}
                              onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, item.indexArr)}
                              checked={selectedIndexArr[0] === (item.indexArr?.[0]) && selectedIndexArr[1] === item.indexArr?.[1]}
                              onCardClick={(e, data,) => handleCardClick(e, data, index)}
                              locationCanClick={false}
                              indexColor={`${item.trackColor}80`}
                            />
                          )
                        }
                      }
                    </VirtualList>
                    :
                    <div className="nodata"></div>
                } */}
                {
                  resultList.length ?
                    resultList.map((item, index) => {

                      return (
                        <Card.Track
                          key={index}
                          cardData={item}
                          onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, item.indexArr)}
                          checked={selectedIndexArr[0] === (item.indexArr?.[0]) && selectedIndexArr[1] === item.indexArr?.[1]}
                          onCardClick={(e, data,) => handleCardClick(e, data, index)}
                          locationCanClick={false}
                          indexColor={`${item.trackColor}80`}
                        />
                      )
                    })
                    :
                    <div className="nodata"></div>
                }
              </div>
            </ResultBox>
          </div>
        </BoxDrawer>
      </div>
      <BigImg
        modalProps={{
          visible: bigImgVisible,
          onCancel: () => setBigImgVisible(false)
        }}
        currentIndex={bigImgData.childIndex}
        data={bigImgData.data}
        imgInfoRender={BigImgInfoRender}
        onIndexChange={(index) => {
          setBigImgData({
            ...bigImgData,
            childIndex: index,
            parentIndexArr: findParentIndexArr(index)
          })
        }}
      />
    </div>
  )
}

export default VehicleTrack
