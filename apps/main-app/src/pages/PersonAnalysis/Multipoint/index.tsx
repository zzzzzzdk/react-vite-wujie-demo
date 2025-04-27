import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Message, Image, Drawer, Select, Space, Modal } from '@yisa/webui'
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import {
  CityMassMarker, BoxDrawer, LocationMapList, TimeRangePicker,
  FormPlate, DoubleDrawer, BigImg, FormVehicleModel, MultipointVector,
  Export as ExportBtn,
} from '@/components'
import {
  InfoCard,
  DetailCard
} from './component'
import { ResultBox } from '@yisa/webui_business'
import { DrawType, LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { ResultRowType } from '@/pages/Search/Target/interface'
import { PersonMultipointType, VectorData, ConditionCard, VehicleInfoType, DetailResultType, OptionsType, ResOptionsType } from './interface'
import { getMapProps, getParams, isObject, formatTimeFormToComponent } from '@/utils'
import { useLocation, Link } from "react-router-dom";
import { isEmptyObject } from "@/utils/is";
import classNames from 'classnames'
import { PlusCircleOutlined, Icon, UndoOutlined, DeleteOutlined } from '@yisa/webui/es/Icon';
import dictionary from '@/config/character.config'
import { useDispatch, useSelector, RootState } from '@/store';
import { logReport, getLogData } from "@/utils/log";
import ajax, { ApiResponse } from '@/services'
import dayjs from 'dayjs'
import { LeafletEvent } from "leaflet"
import { useResetState } from 'ahooks'
import './index.scss'


export default function Multipoint() {
  const prefixCls = "person-multipoint"
  const colorArr = ["#3377ff", "#ff8d1a", "#00cc66", "#00a9cc", "#b6bc04", "#ff5b4d"];
  const sexOptions = [{
    value: -1,
    label: '不限'
  }, {
    value: 1,
    label: '男性'
  }, {
    value: 2,
    label: '女性'
  }]
  const ageOptions = [{
    value: -1,
    label: '不限'
  }, {
    value: 1,
    label: '儿童'
  }, {
    value: 2,
    label: '中青年'
  }, {
    value: 3,
    label: '老年'
  }]
  const location = useLocation()
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['person-multipoint'] || {}
  });
  const [labelOptions, setLabelOptions] = useState<OptionsType>([])
  const { scaleZoom, zoom } = window.YISACONF.map
  //区县与海量点切换
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: true,
    showMassMarker: false,
  })
  //缩放比例
  const [mapZoom, setMapZoom] = useState(zoom || 13)
  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps('VehicleAnalisisMap')
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => {
        },
        onZoomEnd: (e: LeafletEvent) => {
          const afterZoom = e.target.getZoom()
          if (afterZoom < scaleZoom) {
            setCityMassMarker({ showCityMarker: true, showMassMarker: false })
          } else {
            setCityMassMarker({ showCityMarker: false, showMassMarker: true })
          }
          setMapZoom(afterZoom)
        }
      },
      tileLayerProps
    }
  }, [])

  const defaultData: PersonMultipointType = {
    type: 'condition',
    // beginDate: dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    locationChildIdLength: 0,
    newLocationIds: [],
    newLocationGroupIds: [],
    sort: dictionary.sortList[0].value,
    timeSort: dictionary.captureSortList[0].value,
    timeType: 'time',
  }

  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<PersonMultipointType>(defaultData)
  const [currentIndex, setCurrentIndex] = useState<any>(0); //当前formData的index
  const [searchType, setSearchType] = useState("add");  // 搜索框类型
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null)
  //抽屉
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [doubleDrawerVisible, setDoubleDrawerVisible] = useState<[boolean, boolean]>([true, true])

  // 圈点图形
  const [drawType, setDrawType] = useState<DrawType>("default") //绘制类型
  const [locationIds, setLocationIds] = useState<string[]>([]);
  const [hasVector, setHasVector] = useState(false); //用于判断选择区域通过列表选择
  const [vectorArr, setVectorArr] = useState<VectorData[]>([]);    // 当前图形数据
  const [vectorHistory, setVectorHistory] = useState<VectorData[]>([]); //条件地图数据
  const [rightShow, setRightShow] = useState(false);

  const [searchLoad, setSearchLoad] = useState(false);
  const [conditionData, setConditionData, resetConditionData] = useResetState<PersonMultipointType[]>([]); //条件数组
  const [firstLoading, setFirstLoading] = useState(true)
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)

  // 获取token loading
  const [tokenLoading, setTokenLoading] = useState(false)

  // 人员信息数据
  const [vehicleInfoData, setVehicleInfoData] = useState<ApiResponse<VehicleInfoType>>({})
  const [filterVehicleInfoData, setFilterVehicleInfoData] = useState<ApiResponse<VehicleInfoType>>([])
  // 人员信息详情数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType>>({})

  //当前右侧选中数据
  const [curInfoDataIndex, setCurInfoDataIndex] = useState(0)
  //当前左侧选中数据
  const [curDetailDataIndex, setCurDetailDataIndex] = useState(-1)
  const [curBigImgData, setCurBigImgData] = useState<ResultRowType[]>([])

  // 查看大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  const [conditionNum, setConditionNum] = useState(0)

  const [filterConfigVisible, setFilterConfigVisible] = useState(false)
  const defaultFilterFormData = {
    sex: -1,
    age: -1,
    label: []
  }
  const [filterFormData, setFilterFormData] = useState(defaultFilterFormData)
  const [resetFilterFormData, setResetFilterFormData] = useState(filterFormData)



  // 框取点位图形变化
  const changeVectorArr = (data: { type: string, radius: number, }) => {
    setHasVector(true);
    let arr: any = [];
    arr.push(
      Object.assign({}, data, {
        innerHtml: `<div class="vector-content">
            <div class="vector-title">
              ${currentIndexRef.current == "exclude"
            ? "排除条件"
            : `条件${currentIndexRef.current + 1}`
          }
            </div>
            <p></p>
          </div>`,
        color:
          currentIndexRef.current == "exclude"
            ? colorArr[5]
            : colorArr[currentIndexRef.current],
      })
    );
    setVectorArr(arr);
  };

  // 处理检索按钮点击
  const handleSearchBtnClick = () => {
    if (conditionData.length < 2) {
      Message.warning("最少选择两个符合条件");
      return false;
    }
    if (!firstLoading) {
      setDoubleDrawerVisible([true, true])
    }
    setFirstLoading(false)
    let _formData = {
      compliance: conditionData.map(item => formFormat(item)),
      vectorHistory: vectorHistory
    }
    setConditionNum(conditionData.length)
    setFilterFormData(defaultFilterFormData)
    setResetFilterFormData(defaultFilterFormData)
    getData(_formData)
  }

  //格式化请求参数
  const formFormat = (form: PersonMultipointType) => {
    // debugger
    let newForm = { ...form }
    // 格式化日期参数
    let timeRange = {}
    if (form.timeType === 'time') {
      timeRange = { times: [form.beginDate, form.endDate] }
    } else {
      timeRange = {
        periods: {
          dates: [form.beginDate, form.endDate],
          times: [form.beginTime, form.endTime]
        }
      }
    }
    newForm['timeRange'] = timeRange
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "sort", "timeSort", "type"]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  //添加符合条件
  const addCondition = () => {
    setHasVector(false);
    if (conditionData.length == 5) {
      Message.warning("最多添加5个条件");
      return false;
    }
    setCurrentIndex(vectorHistory.length);
    setSearchType("add");
    setLocationIds([]);
    setVectorArr([]);
    defaultData.type = "condition";
    setFormData(defaultData);
  };

  // 处理时间变化
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

  // 处理点位变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    console.time("locationChange")
    const ids = new Set((data.parentIds ?? []))
    const newLocationIds = data.locationIds.filter(id => !ids.has(id))
    const newLocationGroupIds = data.locationGroupIds.filter(id => !ids.has(id))
    console.timeEnd("locationChange")

    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      locationChildIdLength: newLocationIds.length + newLocationGroupIds.length,
      newLocationIds: newLocationIds,
      newLocationGroupIds: newLocationGroupIds
    })
    setLocationIds(data.locationIds);
  }

  //编辑
  const editCondition = (index: number) => {
    let obj = conditionData[index];
    console.log(obj)
    setFormData({
      ...obj,
      locationIds: obj.newLocationIds,
      locationGroupIds: obj.newLocationGroupIds
    });
    setLocationIds(obj.newLocationIds);
    setVectorArr([vectorHistory[index]]);
    setCurrentIndex(index);
    setSearchType("edit");
    if (Object.keys(vectorHistory[index]).length === 0) {
      setHasVector(false);
    } else {
      setHasVector(true);
    }
  };

  //删除
  const deleteCondition = (index: number) => {
    if (conditionData.length <= 2) {
      Message.warning("至少保留两个条件！");
      return false;
    }

    let arr = conditionData;
    let vectors = vectorHistory;
    vectors.splice(index, 1);
    if (index != arr.length - 1) {
      vectors.forEach((item, i) => {
        if (item) {
          item.innerHtml = `
              <div class="vector-content">
              <div class="vector-title">
              条件${i + 1}
              </div>
              <p></p>
              </div>
              `;
          item.color = colorArr[i];
        }
      });
    }
    setVectorHistory([...vectors]);
    arr.splice(index, 1);
    setConditionData([...arr]);

    if (index == currentIndex) {
      if (index) {
        setCurrentIndex(currentIndex - 1);
        setVectorArr([vectors[currentIndex - 1]]);
      } else {
        setVectorArr([vectors[0]]);
      }
    }
  };

  // 点击卡片
  const handleConditionClick = (index: number | string) => {
    setCurrentIndex(index);
    setVectorArr([vectorHistory[index]]);
  };

  //取消
  const handleCancelClick = () => {
    if (conditionData.length > 0) {
      defaultData.type = "condition";
      setFormData(defaultData);
      if (searchType === 'add') {
        setVectorArr([]);
        setLocationIds([]);
      }
      // 如果是编辑，取消之后，需要恢复原始状态
      if (searchType === 'edit') {
        setVectorArr([vectorHistory[currentIndex]]);
      }
      setSearchType("show");
      if (conditionData[currentIndex] && conditionData[currentIndex].locationIds) {
        setLocationIds(conditionData[currentIndex].locationIds);
      }
    }
  };

  //确认
  const handleAddCondition = () => {
    if (!formData.locationIds.length) {
      Message.warning("请选择点位");
      return false;
    }
    if (dayjs(formData.endDate).diff(dayjs(formData.beginDate), "day") + 1 > Number(pageConfig.timeRange.max)) {
      Message.warning(`时间范围不可以超过${pageConfig.timeRange.max || 0}天！`);
      return
    }
    if (searchType == "edit") {
      let arr = conditionData;
      arr[currentIndex] = formData;
      setConditionData([...arr]);
      setLocationIds(arr[currentIndex]?.locationIds);
      setSearchType("show");
      let vectors = vectorHistory;
      vectors[currentIndex] = hasVector ? vectorArr[0] : {};
      setVectorHistory([...vectors]);
      return;
    }
    let arr = conditionData;
    arr.push(formData);
    setVectorHistory([...vectorHistory, ...(hasVector ? vectorArr : [{}])]);
    setConditionData([...arr]);
    setLocationIds(arr[currentIndex]?.locationIds);
    setSearchType("show");
  };

  // 处理左侧轨迹详情点击
  const handleLeftImgClick = (data: [], index: number) => {
    setCurDetailDataIndex(index || 0)
    setCurBigImgData(data)
    setBigImgModal({
      visible: true,
      currentIndex: index || 0
    })
  }

  // 检索结果点击收起
  const handleDrawerChange = () => {
    const visible = doubleDrawerVisible.every(Boolean), hidden = doubleDrawerVisible.every(item => item === false), leftVisible = doubleDrawerVisible[0] && !visible[1]
    if (visible) {
      setDoubleDrawerVisible([false, true])
    } else if (hidden) {
      setRightShow(true)
      setDoubleDrawerVisible([true, true])
      setLeftDrawerVisible(false)
    } else if (!leftVisible) {
      setRightShow(false)
      setDoubleDrawerVisible([false, false])
    }
  }

  // 右侧车辆信息卡片点击
  const handleInfoCardClick = (index: number, item: { elementId: string }) => {
    if (curInfoDataIndex === index) return
    setCurInfoDataIndex(index)
    setCurDetailDataIndex(-1)
    setCurBigImgData([])
    let _formData = {
      cacheId: vehicleInfoData.cacheId,
      elementId: item.elementId
    }
    setLeftLoading(true)
    getLefteData(_formData)

  }

  // 检索
  const getData = async (data: {
    compliance: PersonMultipointType[],
    exclusion?: {}
  }) => {
    setSearchLoad(true);
    setRightLoading(true)
    setLeftLoading(true)
    let res: any = []
    try {
      res = await ajax.multipoint.getPersonInfoList<{}, VehicleInfoType>(data)
      setVehicleInfoData(res);
      setRightShow(true);
      setSearchLoad(false);
      setRightLoading(false)
      setLeftDrawerVisible(false)
      if (res.data && res.data.length > 0) {
        let _formData = {
          cacheId: res.cacheId,
          elementId: res.data[0].elementId
        }
        getLefteData(_formData)
      } else {
        setDetailData({})
        setLeftLoading(false)
      }
    } catch (error) {
      setRightLoading(false)
      setLeftLoading(false)
      setSearchLoad(false)
      setVehicleInfoData({})
      setDetailData({})
    }
  }

  // 单独获取左侧数据
  const getLefteData = async (data: {
    cacheId: string,
    elementId: string
  }) => {
    setLeftLoading(true)
    try {
      const res2 = await ajax.multipoint.getPersonDetailList<{}, DetailResultType>(data)
      setDetailData(res2)
      setLeftLoading(false)
    } catch (error) {
      setLeftLoading(false)
      setDetailData({})
    }
  }

  // 获取标签列表
  const getLableOption = async () => {
    // let _options: OptionsType = [{
    //   value: -1,
    //   label: '不限'
    // }]
    let _options: OptionsType = []
    try {
      const res = await ajax.multipoint.getLableList<{}, ResOptionsType>({
        labelType: 1
      })
      console.log(res.data)
      if (res.data && res?.data.length > 0) {
        res.data.forEach((item: any, index) => {
          _options.push({
            value: item.id,
            label: item.name
          })
        })
        setLabelOptions(_options)
      }
    } catch (error) {
      console.log(error)
      setLabelOptions([])
    }
  }

  // 点击筛选配置确定按钮
  const onOkFilterModal = () => {
    console.log('点击确定')
    setResetFilterFormData(filterFormData)
    handleFilterData()
    setFilterConfigVisible(false)
  }

  // 处理筛选
  const handleFilterData = () => {
    if (vehicleInfoData?.data && vehicleInfoData.data.length > 0) {
      let _filerInfo = [...vehicleInfoData.data]
      // 筛选 年龄 性别 标签
      if (filterFormData.age != -1) {
        let ageText = ''
        ageOptions.forEach(item => {
          if (item.value === filterFormData.age) {
            ageText = item.label
          }
        })
        _filerInfo = _filerInfo.filter(item => {
          return item.ageIdType === ageText
        })
      }

      if (filterFormData.sex != -1) {
        let sexText = ''
        sexOptions.forEach(item => {
          if (item.value === filterFormData.sex) {
            sexText = item.label
          }
        })
        _filerInfo = _filerInfo.filter(item => {
          return item.gender === sexText
        })
      }

      if (filterFormData?.label.length) {
        _filerInfo = _filerInfo.filter(item => {
          let state = false
          if (item.labels && item.labels.length > 0) {
            item.labels.map(labelItem => {
              if (filterFormData?.label.includes(labelItem)) {
                state = true
              }
            })
          }
          return state
        })
      }

      setFilterVehicleInfoData(_filerInfo)
      setCurInfoDataIndex(0)
      if (_filerInfo && _filerInfo.length > 0 && _filerInfo[0].elementId) {
        let _formData = {
          cacheId: vehicleInfoData.cacheId,
          elementId: _filerInfo[0].elementId
        }
        getLefteData(_formData)
      } else {
        setDetailData({})
      }
    } else {
      setFilterVehicleInfoData([])
      setCurInfoDataIndex(0)
      setDetailData({})
    }

  }

  //#region 事件处理
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: bigImgModal.currentIndex
    })
  }

  // 查看大图右侧自定义dom
  const handleImgInfoRender = (currentData: any) => {
    if (!currentData) {
      return <></>
    }
    let showInfoMap = true
    return (
      <div className="multi-point-img-info-render">
        <div className="img-info-item">
          <div className="item-label">碰撞信息</div>
          <div className="item-con card-info">
            <div className="show-conditional">
              <div className="conditional-num">
                该图片符合条件：{currentData?.flags && currentData?.flags.length || 0}个
              </div>
              {
                colorArr.map((item, index) => {
                  if (conditionNum <= index) {
                    return
                  }
                  return (
                    <div className="conditional-item" key={index}>
                      <div className="conditional-index" style={{ backgroundColor: colorArr[index] }}>{index + 1}</div>
                      <div>{`条件${index + 1}: `}</div>
                      <div className="satisfy">{currentData?.flags && currentData?.flags.includes(index + 1) ? '满足' : '不满足'}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="img-info-item">
          <div className="item-label">轨迹列表</div>
          <div className="item-con card-info">
            <div className='track-list'>
              {curBigImgData && curBigImgData.length > 0 &&
                curBigImgData.map((item, index) => {
                  return <div
                    className={classNames("track-item", {
                      "active": index === bigImgModal.currentIndex
                    })}
                    key={index}
                    onClick={() => {
                      setBigImgModal({
                        visible: true,
                        currentIndex: index
                      })
                    }}
                  >
                    <span className="index">{curBigImgData.length - index}</span>
                    <div className="track-info">
                      <div className="track-time info-item">
                        <Icon type="shijian" />
                        <div className="content" title={item.captureTime}>{item.captureTime || '-'}</div>
                      </div>
                      <div className="track-location info-item">
                        <Icon type="didian" />
                        <div className="item-location-content" title={item.locationName}>{item.locationName || '-'}</div>
                      </div>
                    </div>
                  </div>
                })}
            </div>
          </div>
        </div>
      </div>)
  }



  // 左侧检索项
  const leftSearchForm = () => {
    return (
      <div className="left-search">
        {searchType !== "show" ?
          (<div className="left-search-wrapper">
            <div className="search-title search-item">
              <div className="left"></div>
              {searchType == "exclude" || searchType == "exludeEdit" ? (
                <div className="title-content">
                  {searchType == "exludeEdit" ? "编辑排除条件" : "添加排除条件"}
                </div>
              ) : (
                <>
                  <div className="icon-border">
                    <div
                      className="icon-color"
                      style={{
                        background:
                          searchType == "edit"
                            ? colorArr[currentIndex]
                            : colorArr[conditionData.length],
                      }}
                    >
                      {currentIndex + 1}
                    </div>
                  </div>
                  <div className="title-content">
                    {searchType == "edit" ? "编辑" : "添加"}条件
                    {searchType == "edit"
                      ? currentIndex + 1
                      : conditionData.length + 1}
                  </div>
                </>
              )}
              <div className="right"></div>
            </div>
            <Form colon={false} layout="vertical">
              <TimeRangePicker
                formItemProps={{ label: '时间范围' }}
                beginDate={formData.beginDate}
                endDate={formData.endDate}
                beginTime={formData.beginTime}
                endTime={formData.endTime}
                onChange={handleDateChange}
                timeLayout="vertical"
                timeType={formData.timeType}
              />
            </Form>
            <Form colon={false} labelAlign="left">
              <LocationMapList
                formItemProps={{
                  label: '数据源',
                  required: true,
                }}
                locationIds={formData.locationIds}
                locationGroupIds={formData.locationGroupIds}
                onChange={handleLocationChange}
                title="选择点位"
                tagTypes={dictionary.tagTypes.slice(0, 2)}
                onlyLocationFlag={true}
                showDrawTools={true}
                showMap={false}
                onChangeDrawTools={(type) => {
                  setDrawType(type)
                  setFormData({ ...formData, locationIds: [] })
                  setLocationIds([])
                }}
                defaultDrawType={drawType}
              />
            </Form>
          </div>)
          :
          (
            <div className="search-list">
              {conditionData &&
                conditionData.map((item, index) => {
                  return (
                    <ConditionCard
                      dataIndex={index}
                      data={item}
                      key={index}
                      isActive={currentIndex == index}
                      editCondition={() => editCondition(index)}
                      deleteCondition={() => deleteCondition(index)}
                      onCardClick={() => {
                        handleConditionClick(index);
                      }}
                    />
                  );
                })}
              <p style={{ margin: "10px" }}>
                <div
                  style={{
                    color: "var(--button-primary-background-color)",
                    cursor: "pointer",
                  }}
                  onClick={() => addCondition()}
                  className="condition-btn"
                >
                  <Icon className="add-icon-btn" type={"xinzeng1"} />
                  添加符合条件
                </div>
              </p>
            </div>
          )}
        <div className="left-search-btn">
          {searchType != "show" ? (
            <div className="footer-btn">
              <Space size={10}>
                <Button
                  onClick={handleReset}
                  type='default'
                  className="reset-btn"
                  icon={<UndoOutlined />}
                >重置</Button>
                <Button
                  className="yisa-btn-cancel"
                  disabled={conditionData.length > 0 ? false : true}
                  onClick={() => handleCancelClick()}
                >
                  取消
                </Button>
                <Button onClick={() => handleAddCondition()} className="yisa-btn" type="primary">
                  确定
                </Button>
              </Space>
            </div>
          ) : (
            <div className="footer-btn-search">
              <Space size={10}>
                <Button
                  disabled={searchLoad}
                  onClick={handleClear}
                  type='default'
                  className="reset-btn"
                  icon={<Icon type="qingkong1" />}
                >清空</Button>
                <Button type="primary" onClick={() => handleSearchBtnClick()} loading={searchLoad}>
                  查询
                </Button>
              </Space>
            </div>
          )}
        </div>
      </div >

    )
  }

  //条件卡片
  const ConditionCard = (props: ConditionCard) => {
    const {
      data,
      dataIndex = 0,
      editCondition = () => { },
      deleteCondition = () => { },
      isActive = false,
      onCardClick = () => { },
    } = props;

    const infoList = [
      {
        title: "时间范围",
        key: "beginDate",
        render: (data: { beginDate: Date, endDate: Date, timeType: string, beginTime: string, endTime: string, }) => {
          if (data.timeType == 'range') {
            return (
              <>
                <p>{dayjs(data.beginDate).format('YYYY-MM-DD')} ~ {dayjs(data.endDate).format('YYYY-MM-DD')}</p>
                {data.beginTime && data.endTime && <p>{data.beginTime} ~ {data.endTime}</p>}
              </>
            );
          } else {
            return (
              <>
                <p>{dayjs(data.beginDate).format('YYYY-MM-DD HH:mm:ss')} 至</p>
                <p>{dayjs(data.endDate).format('YYYY-MM-DD HH:mm:ss')}</p>
              </>
            );
          }
        },
      },
      {
        title: "选择区域",
        key: "locationIds",
        render: (data: { locationChildIdLength: number }) => {
          return (
            <span>
              已选择
              <em style={{ color: "#f56c6c" }}> {data.locationChildIdLength} </em>
              个点位
            </span>
          );
        },
      },
    ];

    return (
      <div
        className={isActive ? "condition-item active" : "condition-item"}
        onClick={() => {
          onCardClick();
        }}
      >
        <div className="item-title">
          <div className="left"></div>
          {dataIndex != "exclude" ? (
            <>
              <div className="icon-border">
                <div
                  className="icon-color"
                  style={{ backgroundColor: colorArr[dataIndex] }}
                >{typeof dataIndex == "string" ? parseInt(dataIndex) + 1 : dataIndex + 1}</div>
              </div>
              <div className="title-content">条件{typeof dataIndex === 'number' && dataIndex + 1}</div>
            </>
          ) : (
            <>
              <div className="icon-border">
                <div
                  className="icon-color"
                  style={{ backgroundColor: colorArr[5] }}
                ></div>
              </div>
              <div className="title-content">排除条件</div>
            </>
          )}
          <div className="right"></div>
          <div className="title-btn">
            <span
              style={{ color: "var(--button-primary-background-color)" }}
              className="iconfont iconbianji1"
              onClick={(e) => {
                e.stopPropagation();
                editCondition();
              }}
            >编辑</span>
            <span
              style={{ color: "#f56c6c" }}
              className="iconfont iconshanchu"
              onClick={(e) => {
                e.stopPropagation();
                deleteCondition();
              }}
            >删除</span>
          </div>
        </div>
        <div className="item-content">
          {infoList.map((item, index) => {
            return (
              <div className={`content-item ${item.key == 'beginDate' ? 'date-range' : ''}`} key={index}>
                <span className="label">{item.title}:</span>
                <span>{item.render(data)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 检索结果左侧
  const leftContent = () => {
    return (
      <div className="left-content">
        <div className="common-record">
          <span>共<em>{detailData.totalRecords || 0}</em>条轨迹信息</span>
          {/* <ExportBtn
            total={detailData.totalRecords || 0}
            url={`/v1/judgement/collision/face/detail/export`}
            formData={{
              cacheId: vehicleInfoData?.cacheId,
              elementId: filterVehicleInfoData[curInfoDataIndex]?.elementId,
              pageNo: 1,
              pageSize: detailData?.totalRecords || 0
            }}
          /> */}
        </div>
        <div className="common-list">
          <ResultBox
            loading={leftLoading}
            nodata={!detailData?.data?.length}
          >
            {
              detailData?.data?.map((item, index) => {
                return (<div className="common-list-item" key={index}>
                  <DetailCard
                    index={index}
                    cardData={item}
                    onCardClick={() => { }}
                    onImgClick={handleLeftImgClick}
                  />
                </div>)
              })
            }
          </ResultBox>
        </div>
      </div>
    )
  }

  // 检索结果右侧
  const rightContent = () => {
    return (<div className="right-content">
      <div className="common-record">
        <span>共<em>{filterVehicleInfoData.length || 0}</em>条人员信息</span>
        <ExportBtn
          disable={!filterVehicleInfoData?.length}
          hasAll={false}
          total={filterVehicleInfoData?.length || 0}
          url={`/v1/judgement/collision/face/export`}
          formData={{
            compliance: conditionData.map(item => formFormat(item)),
            cacheId: vehicleInfoData?.cacheId || '',
            pageNo: 1,
            // pageSize: vehicleInfoData.totalRecords || 0,
            pageSize: filterVehicleInfoData?.length || 0,
            ...filterFormData
          }}
        />
        <Button
          onClick={() => {
            setFilterConfigVisible(true)

          }}
          type='default' className="filter-config-btn">筛选配置</Button>
      </div>
      <div className="common-list">
        <ResultBox
          loading={rightLoading}
          nodata={!filterVehicleInfoData?.length}
        >
          {
            filterVehicleInfoData?.map((item: any, index: number) => (<div className="common-list-item" key={item.elementId}>
              <InfoCard
                index={(filterVehicleInfoData.length || 0) - index}
                cardData={item}
                conditionNum={conditionNum}
                active={index === curInfoDataIndex}
                showImgZoom={true}
                onCardClick={() => { handleInfoCardClick(index, item) }}
              />
            </div>))
          }
        </ResultBox>
      </div>
    </div>
    )
  }

  const handleParamsData = async () => {
    const searchData = getParams(location.search)
    if (!isEmptyObject(searchData)) {
      let paramsFormData = {}

      if (searchData.token) {
        setTokenLoading(true)
        await getLogData({ token: searchData.token }).then(res => {
          setTokenLoading(false)
          const { data } = res as any
          let compliance = data?.compliance || []
          let exclusion = data?.exclusion || {}
          let _vectorHistory = data?.vectorHistory || []
          if (compliance && compliance.length > 0) {
            let arr = compliance.map((item: any, index: number) => {
              let _complianceData: any = {}
              if (item && isObject(item)) {
                _complianceData = item
                try {
                  // 时间格式恢复
                  if (item.timeRange) {
                    formatTimeFormToComponent(item.timeRange, _complianceData)
                    return _complianceData
                  }
                } catch (error) {
                  console.log(error)
                  Message.error(`数据解析失败2`)
                }
              }
            })
            setSearchType("show");
            setConditionData(arr)
          }
          if (_vectorHistory && _vectorHistory.length > 0) {
            setVectorHistory(_vectorHistory)
          }
        })
      }
      // setConditionData({})
    }
  }

  const handleReset = () => {
    resetFormData()
    setVectorArr([])
    setLocationIds([])
  }
  // 清空
  const handleClear = () => {
    setSearchType("add")
    resetFormData()
    resetConditionData()
    setVectorArr([])
    setVectorHistory([])
    setLocationIds([])
    setHasVector(false)
    setCurrentIndex(0)
  }

  useEffect(() => {
    getLableOption()
    handleParamsData()
  }, [])

  useEffect(() => {
    handleFilterData()
  }, [vehicleInfoData])


  return (
    <div className={`${prefixCls} page-content`}>
      <div className={`${prefixCls}-content`} ref={boxRef}>
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <CityMassMarker
            showCityMarker={cityMassMarker.showCityMarker}
            showMassMarker={cityMassMarker.showMassMarker}
            mapZoom={mapZoom}
            drawType={drawType}
            onChangeDrawType={setDrawType}
            locationIds={locationIds}
            onChangeLocationIds={(ids: string[]) => {
              setFormData({
                ...formData,
                locationIds: ids,
                locationChildIdLength: ids.length,
                newLocationIds: ids,
              })
              setLocationIds(ids)
            }}
            getVectorData={(e) => {
              changeVectorArr(e)
            }}
          />
          <MultipointVector
            vectorData={rightShow == true ? [...vectorHistory] : vectorArr}
            activeIndex={currentIndex}
          // fitBounds={false}
          />
        </BaseMap>
        <BoxDrawer
          title={<><div>多点碰撞</div></>}
          placement="left"
          onOpen={() => {
            setLeftDrawerVisible(true)
            setDoubleDrawerVisible([false, false])
            setRightShow(false)
          }}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          {leftSearchForm()}
        </BoxDrawer>
        {
          !firstLoading && <DoubleDrawer
            placement="right"
            titles={["碰撞人员轨迹", "碰撞人员信息"]}
            widths={[378, 388]}
            visibles={doubleDrawerVisible}
            contents={[leftContent(), rightContent()]}
            onChange={handleDrawerChange}
            getContainer={() => document.querySelector(`.${prefixCls}-content`) || document.body}
          >
          </DoubleDrawer>
        }
        <Modal
          title={"筛选配置"}
          className='filter-config-modal'
          visible={filterConfigVisible}
          onCancel={() => {
            setFilterConfigVisible(false)
            setFilterFormData(resetFilterFormData)
          }}
          onOk={onOkFilterModal}
          unmountOnExit={true}
        >
          <Form colon={false} labelAlign="left">
            <Form.Item
              label={<span style={{}}>性 &nbsp; &nbsp; &nbsp; 别:</span>}
              className="filter-form-item"
              colon={false}
            >
              <Select
                defaultValue={-1}
                options={sexOptions}
                onChange={(value) => { setFilterFormData(Object.assign({}, filterFormData, { sex: value })) }}
                value={filterFormData.sex}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{}}>年 &nbsp; &nbsp; &nbsp; 龄:</span>}
              className="filter-form-item"
              colon={false}
            >
              <Select
                defaultValue={-1}
                options={ageOptions}
                onChange={(value) => { setFilterFormData(Object.assign({}, filterFormData, { age: value })) }}
                value={filterFormData.age}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{}}>人员标签:</span>}
              className="filter-form-item"
              colon={false}
            >
              <Select
                defaultValue={[]}
                options={labelOptions}
                onChange={(value) => {
                  let newValue = value
                  const arr = value as number[]
                  // 不限判断
                  // newValue = arr.length > 0 ? arr[arr.length - 1] === -1 ? [-1] : arr.filter(item => item !== -1) : [-1]
                  setFilterFormData(Object.assign({}, filterFormData, { label: newValue }))

                }}
                value={filterFormData.label}
                mode="multiple"
                maxTagCount={1}
              />
            </Form.Item>
          </Form>
        </Modal>
        <BigImg
          modalProps={{
            visible: bigImgModal.visible,
            onCancel: handleCloseBigImg
          }}
          currentIndex={bigImgModal.currentIndex}
          onIndexChange={(index) => {
            setBigImgModal({
              visible: true,
              currentIndex: index
            })
          }}
          imgInfoRender={handleImgInfoRender}
          data={curBigImgData}
        />
      </div>
    </div>

  )
}
