import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { formatTimeComponentToForm, formatTimeFormToComponent, getParams, isNumber, isObject } from "@/utils";
import { isEmptyObject } from "@/utils/is";
import { Message, VirtualList, Image, Button, Tooltip, Form, Select, Space } from '@yisa/webui'
import { CloseOutlined, Icon, LeftOutlined, RightOutlined, UndoOutlined } from "@yisa/webui/es/Icon"
import { ResultBox } from '@yisa/webui_business'
import { BoxDrawer, TrackMap, Card, BigImg, TimeRangePicker, Panel, ImgUploadOrIdcard, Export as ExportBtn } from '@/components'
import { RefTrackMap } from "@/components/Map/TrackMap/interface";
import characterConfig from "@/config/character.config";
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { getMapProps, isArray, isFunction } from '@/utils'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import { TrackDataItem } from '@/pages/CreateTrack/interface'
import { useSelector, useDispatch, RootState } from '@/store'
import { FormDataType } from './interface'
import services from "@/services";
import classNames from 'classnames'
import dayjs from 'dayjs'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { SelectCommonProps } from '@yisa/webui/es/Select/interface'
import { ResultRowType as TargetResultRowType } from '@/pages/Search/Target/interface';
import { PeerCard } from "@/pages/VehicleAnalysis/Peer/components";
import { AutoUploadParams, RefImgUploadType } from '@/components/ImgUpload/interface';
import './index.scss'
import { getLogData } from "@/utils/log";
import { TargetFeatureItem } from "@/config/CommonType";
import { useResetState } from "ahooks";
const _trackObj = {}

const PersonTrack = () => {
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['person-track'] || _trackObj
  });
  const location = useLocation()
  const imgUploadOrIdcardRef = useRef<RefImgUploadType>(null)
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const [ajaxLoading, setAjaxLoading] = useState(false)

  const defaultFormData: FormDataType = {
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    sort: {
      field: 'captureTime',
      order: 'desc'
    },
    clusterData: null
  }
  const [formData, setFormData, resetFormData] = useResetState(defaultFormData)
  const [ajaxFormData, setAjaxFormData] = useState<any>(formData)
  const [resultPersonInfo, setResultPersonInfo] = useState<TargetResultItemType | null>(null)
  const [resultList, setResultList] = useState<TrackDataItem[]>([])

  // 轨迹数据
  const [trackData, setTrackData] = useState<TrackDataItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // 大图
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgData, setBigImgData] = useState<{
    // 轨迹索引
    parentIndex: number;
    // 小图索引
    childIndex: number;
    data: TargetResultItemType[];
  }>({
    parentIndex: 0,
    childIndex: 0,
    data: []
  })

  // 大图右侧轨迹列表
  const trackListData = [...trackData].reverse()

  // 虚拟列表盒子高度
  const virtualBoxRef = useRef<HTMLDivElement>(null)
  const [virtualBoxHeight, setVirtualBoxHeight] = useState(virtualBoxRef.current?.offsetHeight || 0)

  const trackMapRef = useRef<RefTrackMap>(null)

  const calcVirtualHeight = () => {
    // console.log(virtualBoxRef.current?.offsetHeight)
    const height = virtualBoxRef.current?.offsetHeight || 0
    setVirtualBoxHeight(height)
  }

  const handleParamsData = async () => {
    const searchData = getParams(location.search)

    if (!isEmptyObject(searchData)) {
      try {
        // 处理接收页面跳转参数
        let newFormData = {}
        if (searchData.clusterData) {
          const newClusterData = JSON.parse(searchData.clusterData)
          newFormData['clusterData'] = newClusterData
        }
        if (searchData.beginDate && searchData.endDate) {
          newFormData['timeType'] = 'time'
          newFormData['beginDate'] = searchData.beginDate
          newFormData['endDate'] = searchData.endDate
        }
        if (searchData.bigImage) {
          imgUploadOrIdcardRef.current?.handleAutoUpload?.({
            bigImage: searchData.bigImage
          })
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
        if (searchData.featureList) {
          try {
            const featureList: TargetFeatureItem[] = JSON.parse(decodeURIComponent(searchData.featureList))
            imgUploadOrIdcardRef.current?.handleSearchCluster?.(featureList)
          } catch (error) {
            console.log(error)
          }
          //离线点位
        }

        const newAjaxFormData = {
          ...formData,
          ...newFormData
        }
        setFormData(newAjaxFormData)
        if (newAjaxFormData.clusterData) {
          // 执行检索
          if (!('timeRange' in newAjaxFormData)) {
            newAjaxFormData['timeRange'] = formatTimeComponentToForm(newAjaxFormData)
          }
          setResultPersonInfo(newAjaxFormData.clusterData)
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
      calcVirtualHeight()
    });
    virtualBoxRef.current && resizeObserver.observe(virtualBoxRef.current);
  }, [])

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

  const handleBtnClick = () => {
    // console.log(formData)

    // 传参验证
    let verify = true // 验证通过

    if (!formData.clusterData) {
      Message.warning("请上传或输入人员身份信息！")
      return;
    }

    const dateRangeMax = Number(pageConfig.timeRange?.max || 0)
    if (dateRangeMax) {
      let timeDiff = dayjs(formData.beginDate).diff(dayjs(formData.endDate), 'days')
      if (Math.abs(timeDiff) > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`)
        return
      }
    }

    let newForm = {
      clusterData: formData.clusterData,
    }

    // 格式化日期参数
    newForm['timeRange'] = formatTimeComponentToForm(formData)

    setResultPersonInfo(formData.clusterData)
    setAjaxFormData(newForm)
    getTrackData(newForm)
  }

  const getTrackData = (formData: any) => {
    setAjaxLoading(true)
    services.personTrack.getPersonTracks<FormDataType, TrackDataItem[]>(formData).then(res => {
      setAjaxLoading(false)
      console.log(res)
      let newBigImgData: TargetResultItemType[] = []
      let result = (res.data || [])
      // 添加序号，数据时间倒序排列
      result = result.map((item, index) => {
        if (item.infos && item.infos.length) {
          newBigImgData = [...newBigImgData, ...item.infos]
        }
        let newPath = item.path.map(pathItem => `${pathItem['lng']},${pathItem['lat']}`).join(';')
        return {
          ...item,
          index: result.length - index,
          path: [newPath]
        }
      })
      console.log(`newBigImgData`, newBigImgData)
      setBigImgData({
        parentIndex: 0,
        childIndex: 0,
        data: newBigImgData
      })

      setLeftDrawerVisible(false)
      setRightDrawerVisible(true)
      setTrackData([...result].reverse())
      setResultList(result)
    }).catch(err => { setAjaxLoading(false); console.log(err) })
  }

  // 数据排序，字段默认取minCaptureTime
  function sortArrayByTime<T extends Array<TrackDataItem>>(array: T, sortOrder: 'asc' | 'desc', field = 'minCaptureTime'): T {
    let fieldLowerCase = field.toLowerCase()

    array.sort((a, b) => {
      let valueA, valueB
      if (fieldLowerCase.indexOf('time') > -1) {
        valueA = new Date(a[field]).getTime();
        valueB = new Date(b[field]).getTime();
      } else {
        // 如果是数组，判断数组长度，如果是其他，需要保证字段是number类型
        valueA = isArray(a[field]) ? a[field].length : a[field];
        valueB = isArray(b[field]) ? b[field].length : b[field];
      }

      if (sortOrder === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    return array;
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
    let newFilterData = sortArrayByTime(
      resultList,
      sortField[1] as FormDataType['sort']['order'],
      sortField[0] === "captureTime" ? "minCaptureTime" : "infos"
    )
    setResultList([...newFilterData])
  }

  const handleCardClick = (event: React.MouseEvent, data: TrackDataItem, index: number) => {
    console.log(index)
    setSelectedIndex(index)
  }

  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, index: number, parentIndex: number, infos?: TargetResultItemType[]) => {
    console.log(index, parentIndex)
    setBigImgData({
      ...bigImgData,
      parentIndex: parentIndex,
      childIndex: findChildIndex(parentIndex, index)
    })
    setBigImgVisible(true)
  }

  const handleTrackContentCb = (data: TrackDataItem, index: number, childIndex: number) => {
    const currentData: TargetResultItemType = data && data.infos && isArray(data.infos) ? data.infos[childIndex] : {} as TargetResultItemType
    // console.log(currentData)
    let infoLength = data.infos?.length || 0

    return (
      <div className="track-popver-content">
        <div className="track-popver-content-header">
        </div>
        <div className="track-popver-content-card">
          <div className="img-box" onClick={(e) => handleOpenBigImg(e, currentData, childIndex, data['htmlIndex'], data.infos)}>
            <Image src={currentData.targetImage} />
          </div>
          <div className="info-box">
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

  // 大图右侧信息渲染
  const BigImgInfoRender = (data: TargetResultItemType, currentIndex: number) => {

    return (
      <div className="track-img-right-info">
        <Panel title="查询人信息">
          {
            resultPersonInfo ?
              <PeerCard
                // showDelete={true}
                // onDelete={handleDeleteCluster}
                type="personTarget"
                cardData={resultPersonInfo}
                showChecked={false}
                size="small"
              />
              : <span className="no-person">暂无人员信息</span>
          }
        </Panel>
        <Panel title="轨迹列表" className="track-panel">
          <div className="track-container">
            {
              trackListData.map((item, index) => {
                const isActive = bigImgData.parentIndex === item.index
                return (
                  <Card.TrackInfo
                    key={item.minCaptureTime + item.index}
                    data={item}
                    trackIndex={item.index}
                    active={isActive}
                    onTrackCardClick={() => { handleTrackCardClick(item.index) }}
                  />
                )
              })
            }
          </div>
        </Panel>
      </div>
    )
  }

  // 大图轨迹列表点击回调
  const handleTrackCardClick = (index: number) => {
    setBigImgData({
      ...bigImgData,
      parentIndex: index,
      childIndex: findChildIndex(index, 0)
    })
  }

  // 大图寻找下方小图的index
  const findChildIndex = (parentIndex: number, childIndex: number) => {
    let currentIndex = 0, counter = 0

    for (let i = 0; i < trackListData.length; i++) {
      const item = trackListData[i]
      if (item.index === parentIndex) {
        currentIndex = currentIndex + childIndex
        break
      } else {
        currentIndex = currentIndex + (item.infos?.length || 0)
      }
    }

    // console.log('currentIndex', currentIndex)
    return currentIndex
  }

  // 大图根据小图index，寻找父级index
  const findParentIndexArr = (index: number) => {
    let currentIndex = 0, counter = 0

    for (let i = 0; i < trackListData.length; i++) {
      const item = trackListData[i]
      const increase = (item.infos?.length || 0)
      counter = counter + increase

      // 如果counter >= index，说明index在此item.infos区间, 加1是为了与轨迹显示的索引对应
      if (counter >= (index + 1)) {
        console.log(counter)
        currentIndex = item.index
        break
      } else {
      }
    }

    // console.log('currentIndex', currentIndex)
    return currentIndex
  }

  const handleClusterChange = (data: TargetResultRowType | null) => {
    console.log(data)
    setFormData({
      ...formData,
      clusterData: data
    })
  }

  const handleDeleteCluster = () => {
    setFormData({
      ...formData,
      clusterData: null
    })
  }

  const handleReset = () => {
    resetFormData()
  }

  return (
    <div className="person-track">

      <div className="person-track-content" ref={boxRef}>
        <TrackMap
          ref={trackMapRef}
          trackData={trackData}
          selectedIndex={selectedIndex}
          onSelectedChange={(index) => {
            setSelectedIndex(index)
          }}
          trackContentCb={handleTrackContentCb}
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
            <Form colon={false} labelAlign="left">
              <ImgUploadOrIdcard
                ref={imgUploadOrIdcardRef}
                onClusterChange={handleClusterChange}
                clusterData={formData.clusterData}
                formItemProps={{ label: "身份信息", required: true }}
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
          title="人员轨迹信息"
          onOpen={() => setRightDrawerVisible(true)}
          onClose={() => setRightDrawerVisible(false)}
          visible={rightDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          <div className="result-con" ref={virtualBoxRef}>
            <ResultBox
              loading={ajaxLoading}
              nodata={!resultList || (resultList && !resultList.length)}
            >
              <div className="result-person-info">
                <div className="result-person-info-content">
                  {
                    resultPersonInfo ?
                      <PeerCard
                        // showDelete={true}
                        // onDelete={handleDeleteCluster}
                        type="personTarget"
                        cardData={resultPersonInfo}
                        showChecked={false}
                        size="small"
                        onImgClick={() => {
                          const { personBasicInfo: { idcard = "", idType = "", groupId = "", groupPlateId = '' } = {}, feature = '' } = resultPersonInfo || {}
                          window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
                            idNumber: idcard === '未知' ? '' : idcard,
                            groupId: groupId ? groupId : [],
                            groupPlateId: groupPlateId ? groupPlateId : [],
                            idType: idType || '111',
                            feature: feature || ''
                          }))}`)
                        }}
                      />
                      : <span className="no-person">暂无人员信息</span>
                  }
                </div>
              </div>
              <div className="result-total">
                <div className="total-left">
                  共<span>{resultList.length}</span>条轨迹信息
                  {
                    !!resultList.length ?
                      <ExportBtn
                        hasAll={false}
                        total={resultList.length}
                        url={'/v1/trajectory/face/export'}
                        formData={{
                          ...ajaxFormData,
                          pageNo: 1,
                          pageSize: resultList.length
                        }}
                      />
                      :
                      ''
                  }
                </div>
                <div className="total-right">
                  <Select
                    disabled={ajaxLoading || !resultList.length}
                    options={[...characterConfig.captureSortList, ...characterConfig.captureCountsSortList]}
                    value={`${formData.sort.field}-${formData.sort.order}`}
                    onChange={handleChangeSort}
                  />
                </div>
              </div>
              <div className="result-content">
                {
                  resultList.length ?
                    resultList.map((item, index) => {
                      return (
                        <Card.Track
                          key={`${index}-${item.index}-${item.minCaptureTime}`}
                          cardData={item}
                          onImgClick={(e, data, i) => handleOpenBigImg(e, data, i, item.index)}
                          checked={selectedIndex === item.index}
                          onCardClick={(e, data,) => handleCardClick(e, data, item.index)}
                          locationCanClick={false}
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
            parentIndex: findParentIndexArr(index)
          })
        }}
      />
    </div>
  )
}

export default PersonTrack
