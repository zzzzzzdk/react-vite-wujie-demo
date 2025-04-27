import React, { useMemo, useState, useRef, useEffect } from 'react'
import { Form, Input, Button, Message, Image, Drawer, Select, Space, } from '@yisa/webui'
import {
  CityMassMarker, BoxDrawer, LocationMapList, TimeRangePicker,
  FormPlate, DoubleDrawer, BigImg, FormVehicleModel, MultipointVector, CopyToClipboard,
  Export as ExportBtn,
} from '@/components'
import {
  InfoCard,
  DetailCard
} from './component'
import { ResultBox } from '@yisa/webui_business'
import { DrawType, LocationListType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import { MultipointFormDataType, VehicleInfoType, DetailResultType, VectorData, ConditionCard, } from './interface'
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface"
import { PlateValueProps } from "@/components/FormPlate/interface"
import { ResultRowType } from '@/pages/Search/Target/interface'
import ajax, { ApiResponse } from '@/services'
import { useLocation } from "react-router-dom";
import { getMapProps, regular, isObject, validatePlate, getParams, formatTimeFormToComponent, isArray, jumpRecordVehicle } from '@/utils'
import { useDispatch, useSelector, RootState } from '@/store';
import { isEmptyObject } from '@/utils/is'
import { Icon, UndoOutlined, DeleteOutlined } from '@yisa/webui/es/Icon';
import { BaseMap, TileLayer } from '@yisa/yisa-map'
import { logReport, getLogData } from "@/utils/log";
import featureData from '@/config/feature.json'
import dictionary from '@/config/character.config'
import { LeafletEvent } from "leaflet"
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useResetState } from 'ahooks'
import './index.scss'



export default function Multipoint() {
  const prefixCls = "vehicle-multipoint"
  const colorArr = ["#3377ff", "#ff8d1a", "#00cc66", "#00a9cc", "#b6bc04", "#ff5b4d"];
  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['vehicle-multipoint'] || {}
  });
  const { scaleZoom, zoom } = window.YISACONF.map
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

  const location = useLocation()
  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null)
  //抽屉
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true)
  const [doubleDrawerVisible, setDoubleDrawerVisible] = useState<[boolean, boolean]>([true, true])

  //区县与海量点切换
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: true,
    showMassMarker: false,
  })

  const defaultData: MultipointFormDataType = {
    type: 'condition',
    timeType: 'time',
    beginDate: dayjs().subtract(Number(pageConfig.timeRange?.default || 6) - 1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    locationChildIdLength: 0,
    brandId: '',
    modelId: [],
    yearId: [],
    extra: {},
    licensePlate: '',
    plateColorTypeId: 5,
    noplate: '',
    objectTypeId: -1,
    colorTypeId: -1,
    directionId: -1,
    vehicleTypeId: [-1],
    vehicleFuncId: [-1],
    //排除车牌
    excludelicensePlate: {
      licensePlate: "",
      plateColorTypeId: 5,
    },
    sort: dictionary.sortList[0].value,
    associatePlate: "",
    timeSort: dictionary.captureSortList[0].value
  }

  //表单数据参数
  const [formData, setFormData, resetFormData] = useResetState<MultipointFormDataType>(defaultData)

  const [conditionData, setConditionData, resetConditionData] = useResetState<MultipointFormDataType[]>([]); //条件数组
  const [conditionNum, setConditionNum] = useState(0)
  const [excludeData, setExcludeData, resetExcludeData] = useResetState({}); //排除条件
  const [searchType, setSearchType] = useState("add");  // 搜索框类型
  const [currentIndex, setCurrentIndex] = useState<any>(0); //当前formData的index
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  // 圈点图形
  const [drawType, setDrawType] = useState<DrawType>("default") //绘制类型
  const [vectorArr, setVectorArr] = useState<VectorData[]>([]);    // 当前图形数据
  const [hasVector, setHasVector] = useState(false); //用于判断选择区域通过列表选择
  const [excludeVector, setExcludeVector] = useState<VectorData[]>([]); //排除条件地图数据
  const [vectorHistory, setVectorHistory] = useState<VectorData[]>([]); //条件地图数据
  const [locationIds, setLocationIds] = useState<string[]>([]);

  const [rightShow, setRightShow] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);

  const [firstLoading, setFirstLoading] = useState(true)
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)

  //当前右侧选中数据
  const [curInfoDataIndex, setCurInfoDataIndex] = useState(0)
  //当前左侧选中数据
  const [curDetailDataIndex, setCurDetailDataIndex] = useState(-1)
  const [curBigImgData, setCurBigImgData] = useState<ResultRowType[]>([])
  // 车辆信息数据
  const [vehicleInfoData, setVehicleInfoData] = useState<ApiResponse<VehicleInfoType>>({})
  // 车辆信息详情数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailResultType>>({})

  // 查看大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  // 处理车牌变化
  const handlePlateChange = ({ plateNumber, plateTypeId, noplate }: PlateValueProps, type: 'licensePlate' | "excludeLicensePlate") => {
    switch (type) {
      case "licensePlate":
        setFormData({
          ...formData,
          licensePlate: plateNumber,
          plateColorTypeId: plateTypeId,
          noplate: noplate,
        })
        break;
      case "excludeLicensePlate":
        setFormData({
          ...formData,
          excludelicensePlate: {
            licensePlate: plateNumber,
            plateColorTypeId: plateTypeId,
            noplate
          },
        })
        break;
      default:
        break;
    }
  }

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
    const newLocationIds = data.locationIds.filter(id => !(data.parentIds ?? []).includes(id))
    const newLocationGroupIds = data.locationGroupIds.filter(id => !(data.parentIds ?? []).includes(id))
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      locationChildIdLength: newLocationIds.length + newLocationGroupIds.length
    })
    setLocationIds(data.locationIds)
  }

  // 处理车辆类型
  const handleChangeVehicleModel = (value: { brandValue: any, modelValue: any, yearValue: any, extra?: any }) => {
    setFormData({
      ...formData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue,
      extra: value.extra
    })
  }
  const handleSelectChange = (value: SelectCommonProps['value'], fieldName: string) => {
    let newValue = value
    if (fieldName === 'vehicleTypeId' || fieldName === 'vehicleFuncId') {
      const arr = value as number[]
      // 不限判断
      newValue = arr[arr.length - 1] === -1 ? [-1] : arr.filter(item => item !== -1)
    }
    setFormData({
      ...formData,
      [fieldName]: newValue
    })
  }

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
      exclusion: excludeData && Object.keys(excludeData).length > 0 ? formFormat(excludeData as MultipointFormDataType) : undefined,
      vectorHistory: vectorHistory
    }
    setConditionNum(conditionData.length)
    getData(_formData)
  }

  //格式化请求参数
  const formFormat = (form: MultipointFormDataType) => {
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
    // // 点位和任务ids
    // newForm['locationIds'] = [...form.locationIds, ...form.locationGroupIds]
    // 公共参数删减，不必要的删除
    const delKeys = ["timeType", "beginDate", "endDate", "beginTime", "endTime", "noplate", "displaySort", "displayTimeSort",
      "associatePlate", "excludelicensePlate", "sort", "timeSort", "vehicleFuncId", "objectTypeId",]
    delKeys.forEach(key => delete newForm[key])
    return newForm
  }

  // 检索
  const getData = async (data: {
    compliance: MultipointFormDataType[],
    exclusion?: {}
  }) => {
    setSearchLoad(true);
    setRightLoading(true)
    setLeftLoading(true)
    let res: any = []
    try {
      res = await ajax.multipoint.getVehicleInfoList<{}, VehicleInfoType>(data)
      setVehicleInfoData(res);
      setRightShow(true);
      setSearchLoad(false);
      setRightLoading(false)
      setLeftDrawerVisible(false)
      if (res.data && res.data.length > 0) {
        let _formData = {
          cacheId: res.cacheId,
          elementId: res.data[0]?.elementId
        }
        getLefteData(_formData)
      } else {
        setLeftLoading(false)
        setDetailData({})
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
      const res2 = await ajax.multipoint.getVehicleDetailList<{}, DetailResultType>(data)
      setDetailData(res2)
      setLeftLoading(false)
    } catch (error) {
      setLeftLoading(false)
      setDetailData({})
    }
  }

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

  //确认
  const handleAddCondition = () => {
    let _licensePlate = formData?.licensePlate.split('') || [], sub_symbol = 0
    _licensePlate.forEach(item => {
      if (item.indexOf("*") !== -1 || item.indexOf("?") !== -1) {
        sub_symbol++
      }
    })

    if (sub_symbol > 3) {
      Message.warning("车牌号代替符不能超3个！");
      return false;
    }

    if (!validatePlate(formData.licensePlate || "", false)) {
      Message.warning("请输入正确的车牌号");
      return false;
    }

    if (!formData.locationIds.length && !formData.locationGroupIds.length) {
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
    if (searchType == "exclude" || searchType == "exludeEdit") {
      setExcludeData(formData);
      setExcludeVector([...vectorArr]);
      setSearchType("show");
      setLocationIds(formData?.locationIds);
      return;
    }
    let arr = conditionData;
    arr.push(formData);
    setVectorHistory([...vectorHistory, ...(hasVector ? vectorArr : [{}])]);
    setConditionData([...arr]);
    setLocationIds(arr[currentIndex]?.locationIds);
    setSearchType("show");
  };

  //编辑
  const editCondition = (index: number, type: string) => {
    if (type == "condition") {
      let obj = conditionData[index];
      setFormData(obj);
      setLocationIds(obj.locationIds);
      setVectorArr([vectorHistory[index]]);
      setCurrentIndex(index);
      setSearchType("edit");
      if (Object.keys(vectorHistory[index]).length === 0) {
        setHasVector(false);
      } else {
        setHasVector(true);
      }
    } else {
      let _excludeData: any = { ...excludeData }
      setLocationIds(_excludeData?.locationIds);
      setVectorArr([...excludeVector]);
      setCurrentIndex("exclude");
      setFormData(_excludeData);
      setSearchType("exludeEdit");
    }
  };
  //删除
  const deleteCondition = (index: number, type: string) => {
    if (type == "condition") {
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
    } else {
      setExcludeVector([]);
      setExcludeData({});
      setCurrentIndex(vectorHistory.length - 1);
      setVectorArr([vectorHistory[vectorHistory.length - 1]]);
    }
  };

  // 点击卡片
  const handleConditionClick = (index: number | string) => {
    if (index == "exclude") {
      setCurrentIndex("exclude");
      setVectorArr(excludeVector);
    } else {
      setCurrentIndex(index);
      setVectorArr([vectorHistory[index]]);
      setLocationIds(conditionData[index].locationIds)
    }
  };

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

  //添加排除条件
  const addExcludeCondition = () => {
    setHasVector(false);
    if (Object.keys(excludeData).length) {
      Message.warning("最多添加一个排除条件");
      return false;
    }
    setVectorArr([]);
    setLocationIds([]);
    setCurrentIndex("exclude");
    defaultData.type = "exclude";
    setFormData(defaultData);
    setSearchType("exclude");
  };

  //取消
  const handleCancelClick = () => {
    if (conditionData.length > 0) {
      defaultData.type = "condition";
      setFormData(defaultData);
      setSearchType("show");
      setVectorArr([]);
      setLocationIds([]);
      if (conditionData[currentIndex] && conditionData[currentIndex].locationIds) {
        setLocationIds(conditionData[currentIndex].locationIds);
      }
    }
  };

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
      elementId: item?.elementId
    }
    setLeftLoading(true)
    getLefteData(_formData)

  }

  //#region 事件处理
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: bigImgModal.currentIndex
    })
  }

  // 处理左侧轨迹详情点击
  const handleLeftImgClick = (data: [], index: number) => {
    setCurDetailDataIndex(index || 0)
    setCurBigImgData(data)
    setBigImgModal({
      visible: true,
      currentIndex: index || 0
    })
  }

  // -----------------------------------  dom组件  --------------------------------------------

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
    resetExcludeData()
    setVectorArr([])
    setExcludeVector([])
    setVectorHistory([])
    setLocationIds([])
    setHasVector(false)
    setCurrentIndex(0)
  }

  // 左侧检索项
  const leftSearchForm = () => {
    return (
      <div className="left-search">
        {searchType !== "show" ? (<div className="left-search-wrapper">
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
          <Form colon={false} labelAlign="left">
            <Form.Item colon={false} label={'车牌号码'}>
              <FormPlate
                isShowKeyboard
                isShowNoLimit={false}
                value={{
                  plateNumber: formData.licensePlate,
                  plateTypeId: formData.plateColorTypeId,
                  noplate: (formData.noplate as 'noplate' | '')
                }}
                onChange={(value) => { handlePlateChange(value, "licensePlate") }}
              />
            </Form.Item>
            <FormVehicleModel
              formItemProps={{ label: '品牌型号' }}
              onChange={handleChangeVehicleModel}
              brandValue={formData.brandId}
              modelValue={formData.modelId}
              yearValue={formData.yearId}
            />
            <Form.Item
              label="车辆类别"
              className="vehicle-form-item"
              colon={false}
            >
              <Select
                defaultValue={featureData['car']['vehicleTypeId']['value'][0]['value']}
                options={featureData['car']['vehicleTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                onChange={(value) => handleSelectChange(value, 'vehicleTypeId')}
                value={formData.vehicleTypeId}
                showSearch={true}
                mode="multiple"
                maxTagCount={1}
              />
            </Form.Item>
            <Form.Item
              label="车辆颜色"
              className="vehicle-form-item"
              colon={false}
            >
              <Select
                defaultValue={featureData['car']['colorTypeId']['value'][0]['value']}
                options={featureData['car']['colorTypeId']['value'].map(item => ({ label: item.text, value: item.value }))}
                onChange={(value) => handleSelectChange(value, 'colorTypeId')}
                value={formData.colorTypeId}
                showSearch={true}
              />
            </Form.Item>
            <Form.Item
              label="行驶方向"
              className="vehicle-form-item"
              colon={false}
            >
              <Select
                defaultValue={featureData['car']['directionId']['value'][0]['value']}
                options={featureData['car']['directionId']['value'].map(item => ({ label: item.text, value: item.value }))}
                onChange={(value) => handleSelectChange(value, 'directionId')}
                value={formData.directionId}
                showSearch={true}
              />
            </Form.Item>
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

        </div>) : (
          <div className="search-list">
            {conditionData &&
              conditionData.map((item, index) => {
                return (
                  <ConditionCard
                    dataIndex={index}
                    data={item}
                    key={index}
                    isActive={currentIndex == index}
                    editCondition={() => editCondition(index, "condition")}
                    deleteCondition={() => deleteCondition(index, "condition")}
                    onCardClick={() => {
                      handleConditionClick(index);
                    }}
                  />
                );
              })}
            {Object.keys(excludeData).length > 0 && (
              <ConditionCard
                key="exclude"
                dataIndex={"exclude"}
                isActive={typeof currentIndex === 'string' ? currentIndex == "exclude" ? true : false : false}
                data={excludeData}
                onCardClick={() => {
                  handleConditionClick("exclude");
                }}
                editCondition={() => editCondition(-1, "exclude")}
                deleteCondition={() => deleteCondition(-1, "exclude")}
              />
            )}
            <p style={{ margin: "10px" }}>
              <div
                style={{
                  color: "var(--button-primary-background-color)",
                  cursor: "pointer",
                }}
                onClick={() => addCondition()}
                className="condition-btn "
              >
                <Icon className="add-icon-btn" type={"xinzeng1"} />
                添加符合条件
              </div>
              <div
                onClick={() => addExcludeCondition()}
                style={{ color: "#f56c6c", cursor: "pointer" }}
                className="condition-btn"
              >
                <Icon className="add-icon-btn" type={"xinzeng1"} />
                添加排除条件
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
              {/* <Button onClick={() => { }}>
                重置搜索条件
              </Button> */}
            </div>
          )}
        </div>
      </div >

    )
  }

  // 处理品牌信息文本
  const handleCarBrandText = (data: {}) => {
    let temp = ``;
    if (data && Object.values(data).length > 0) {
      // console.log(data)
      Object.values(data).forEach((item: any, index) => {
        if (item) {
          if (index > 0) {
            if (item.length > 1) {
              if (index == 1) {
                temp += `/已选择${item.length}个车型`;
              }
              if (index == 2) {
                temp += `/已选择${item.length}个年款`;
              }
            } else if (item.length == 1) {
              temp += `/${item[0].v}`;
            }
          } else {
            temp += `${item.v}`;
          }
        }
      });
    }
    return temp ? temp : '不限';
  };

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
        title: "车牌号码",
        key: "licensePlate",
        noData: "无",
        render: (data: { licensePlate: string | number, plateColorTypeId: number }) => {
          return (
            <div className={`plate-bg plate-color-${data.plateColorTypeId}`}>
              {data.licensePlate ? data.licensePlate : "不限"}
            </div>
          );
        },
      },
      {
        title: "品牌型号",
        key: "brandId",
        noData: "不限",
        render: (data: { extra: {} }) => {
          return <span>{handleCarBrandText(data?.extra)}</span>;
        },
      },
      {
        title: "车辆类别",
        key: "vehicleTypeId",
        noData: "不限",
        render: (data: { vehicleTypeId: number[] }) => {
          const typeTextArr = featureData['car']['vehicleTypeId']['value'].filter(item => data.vehicleTypeId.indexOf(item.value) >= 0).map(item => item.text);
          return (
            <span>
              {data.vehicleTypeId.length
                ? typeTextArr.join('、')
                : "不限"}
            </span>
          );
        },
      },
      {
        title: "车辆颜色",
        key: "colorTypeId",
        noData: "不限",
        render: (data: { colorTypeId: number }) => {
          return (
            <span>
              {
                featureData['car']['colorTypeId']['value'].map((item, index) => {
                  if (item.value === data.colorTypeId) return item.text;
                })
              }
            </span >
          );
        },
      },
      {
        title: "行驶方向",
        key: "directionId",
        render: (data: { directionId: number }) => {
          return (
            <span>
              {featureData['car']['directionId']['value'].map((item, index) => {
                if (item.value === data.directionId) return item.text;
              })}
            </span>
          );
        },
      },
      {
        title: "时间范围",
        key: "beginDate",
        render: (data: { beginDate: Date, endDate: Date, timeType: string, beginTime: string, endTime: string, }) => {
          // console.log(data)
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
              style={{ color: "var(--button-primary-background-color)", }}
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
                <span className="label">{item.title}：</span>
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
            url={`/v1/judgement/collision/vehicle/detail/export`}
            formData={{
              cacheId: vehicleInfoData.cacheId,
              elementId: vehicleInfoData?.data ? vehicleInfoData?.data[curInfoDataIndex].elementId : '',
              pageNo: 1,
              pageSize: detailData.totalRecords || 0
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
        <span>共<em>{vehicleInfoData.totalRecords || 0}</em>条车辆信息</span>
        <ExportBtn
          hasAll={false}
          total={vehicleInfoData.totalRecords || 0}
          url={`/v1/judgement/collision/vehicle/export`}
          formData={{
            compliance: conditionData.map(item => formFormat(item)),
            exclusion: excludeData && Object.keys(excludeData).length > 0 ? formFormat(excludeData as MultipointFormDataType) : undefined,
            cacheId: vehicleInfoData?.cacheId || '',
            pageNo: 1,
            pageSize: vehicleInfoData?.totalRecords || 0,
          }}
        />
      </div>
      <div className="common-list">
        <ResultBox
          loading={rightLoading}
          nodata={!vehicleInfoData?.data?.length}
        >
          {
            vehicleInfoData?.data?.map((item: any, index: number) => (<div className="common-list-item" key={item.elementId}>
              <InfoCard
                index={(vehicleInfoData.data?.length || 0) - index}
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

  // 查看大图右侧自定义dom
  const handleImgInfoRender = (currentData: any) => {
    if (!currentData) {
      return <></>
    }

    let showInfoMap = true
    return (
      <div className="multi-point-img-info-render">
        <div className="img-info-item">
          <div className="item-label">抓拍信息</div>
          <div className="item-con target-info">
            <div className="target-info-content">
              {
                currentData && currentData?.targetType && currentData.targetType === "vehicle" ?
                  <Space size={5} direction="vertical">
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">前端识别</div>:
                        {
                          !validatePlate(currentData.licensePlate1) ?
                            <div className="con">{currentData.licensePlate1}</div>
                            :
                            <a target="_blank"
                              href={jumpRecordVehicle(currentData.licensePlate1, currentData.plateColorTypeId1)}
                              className="con">
                              {currentData.licensePlate1}
                            </a>
                        }
                      </div>
                      <div className="target-info-item">
                        <div className="label">二次识别</div>:
                        <div className={`plate-bg plate-color-${currentData.licensePlate2 === '未识别' ? 8 : currentData.plateColorTypeId2}`}>{currentData.licensePlate2}</div>
                        <CopyToClipboard text={currentData.licensePlate2} />
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">方向</div>:
                        <div className={`con`}>{currentData.direction || "未知"}</div>
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">车型</div>:
                        <div className="con" title={currentData.carInfo}>{currentData.carInfo}</div>
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className="target-info-item">
                        <div className="label">时间</div>:
                        <div className="con">{currentData.captureTime || "未知"}</div>
                      </div>
                    </Space>
                    <Space size={5} direction="horizontal" className="gap-flex">
                      <div className={classNames("target-info-item", { "can-click": !showInfoMap || (currentData.conditionData && currentData.gaitFeature) })}>
                        <div className="label">地点</div>:
                        <div
                          className="con"
                          title={currentData.locationName}
                        >{currentData.locationName || '未知'}</div>
                      </div>
                    </Space>
                  </Space>
                  :
                  <Space size={5} direction="vertical">
                    {
                      currentData.licensePlate &&
                      <div className="target-info-item">
                        <div className="label">车牌号码</div>:
                        <div className="con bitricycle">{currentData.licensePlate}</div>
                      </div>
                    }
                    <div className="target-info-item">
                      <div className="label">时间</div>:
                      <div className="con">{currentData.captureTime || "未知"}</div>
                    </div>
                    <div className={classNames("target-info-item", { "can-click": !showInfoMap || (currentData.matches && currentData.gaitFeature) })}>
                      <div className="label">地点</div>:
                      <div
                        className="con"
                        title={currentData.locationName}
                      >{currentData.locationName || '未知'}</div>
                    </div>
                  </Space>
              }
            </div>
          </div>
        </div>
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

  // -----------------------------------  dom组件 end  --------------------------------------------

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  // 页面跳转传参处理
  const handleParamsData = async () => {
    //所有跳转到以图的参数先进行编码
    const searchData = getParams(location.search)

    if (!isEmptyObject(searchData)) {
      let paramsFormData: any = {}
      let intType = ['plateColorTypeId'],  //需要转换成int 类型的字段
        stringArrType = ['modelId', 'yearId'],  // 需要转换成字符串数组类型的字段
        intArrType = ['vehicleTypeId'];     // 需要转换成int 类型数组的字段
      Object.keys(searchData).forEach((item) => {
        if (searchData[item] && searchData[item] !== "undefined" && searchData[item] !== "null") {
          if (intType.includes(item)) {
            paramsFormData[item] = parseInt(searchData[item])
          } else if (stringArrType.includes(item)) {
            paramsFormData[item] = searchData[item].split(",")
          } else if (intArrType.includes(item)) {
            paramsFormData[item] = searchData[item].split(",").map(item => Number(item))
          } else {
            paramsFormData[item] = searchData[item]
          }
        }
      })
      if (searchData.token) {
        await getLogData({ token: searchData.token }).then(res => {
          const { data } = res as any
          let compliance = data?.compliance || []
          let exclusion = data?.exclusion || {}
          let _vectorHistory = data?.vectorHistory || []
          let _exclusionData: any = {}
          if (exclusion && isObject(exclusion)) {
            _exclusionData = exclusion
            try {
              // 时间格式恢复
              if (exclusion.timeRange) {
                formatTimeFormToComponent(exclusion.timeRange, _exclusionData)
                setExcludeData(_exclusionData)
              }
            } catch (error) {
              Message.error(`数据解析失败`)
            }
          }
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
                  Message.error(`数据解析失败`)
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
      console.log(paramsFormData)
      setFormData({
        ...formData,
        ...paramsFormData
      })
    }
  }

  useEffect(() => {
    handleParamsData()
  }, [])

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
              setFormData({ ...formData, locationIds: ids, locationChildIdLength: ids.length })
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
            titles={["碰撞车辆轨迹", "碰撞车辆信息"]}
            widths={[378, 388]}
            visibles={doubleDrawerVisible}
            contents={[leftContent(), rightContent()]}
            onChange={handleDrawerChange}
            getContainer={() => document.querySelector(`.${prefixCls}-content`) || document.body}
          >
          </DoubleDrawer>
        }

      </div>
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
  )
}
