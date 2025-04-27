import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Tabs, Message, Loading } from '@yisa/webui'
import { RightOutlined, LeftOutlined } from '@yisa/webui/es/Icon'
import { ErrorImage } from '@yisa/webui_business'
import VehicleBasicInfo from './VehicleBasicInfo'
import OwnerBasicInfo from './OwnerBasicInfo'
import DriverPassengerCluster from './DriverPassengerCluster'
import TrackAnalysis from './TrackAnalysis'
import LabelOperation from './components/LabelOperation'
import { useLocation } from 'react-router-dom'
import ajax, { ApiResponse } from "@/services";
import pick from '@/utils/pick'
import type { VehicleDetailFormDataType, VehicleInfoDataType, VehicleBasicInfoType, OwnerBasicInfoType, DriverPassengerClusterType, LabelDataType } from './interface'
import './index.scss'


export function formatSearchParams(search: string): { [key: string]: string } {
  try {
    return JSON.parse(decodeURIComponent((search.startsWith("?") ? search.slice(1) : search)))
  } catch (error) {
    return {}
  }
}

export default function VehicleDetails() {
  //#region 数据
  const prefixCls = "record-detail-vehicle"
  const location = useLocation()
  const searchParams = formatSearchParams(location.search)
  // 右侧信息展示tab key
  const [activeTabKey, setActiveTabKey] = useState('VehicleBasicInfo')
  const [saveLabelLoading, setSaveLabelLoading] = useState(false)
  const [leftLoading, setLeftLoading] = useState(true)
  const [rightLoading, setRightLoading] = useState(true)
  // 车辆标签
  const [labelData, setLabelData] = useState<LabelDataType[]>([])
  // 是否编辑标签信息
  const [isEdit, setIsEdit] = useState(false)
  // 车辆左侧数据
  const defaultVehicleInfoData: VehicleInfoDataType = {
    licensePlate: searchParams.licensePlate,
    plateColorTypeId: searchParams.plateColorTypeId,
    vehicleImages: [],
    labels: [], //展示用
    labelsId: [], //和树选中绑定
  }
  const vehicleInfoDataRef = useRef(defaultVehicleInfoData)
  const [vehicleInfoData, setVehicleInfoData] = useState(defaultVehicleInfoData)
  //车辆基本信息
  const [vehicleBasicInfo, setVehicleBasicInfo] = useState<VehicleBasicInfoType>()
  const [ownerBasicInfo, setOwnerBasicInfo] = useState<OwnerBasicInfoType>()
  const [driverPassengerCluster, setDriverPassengerCluster] = useState<DriverPassengerClusterType>()
  //当前展示的图片索引
  const [curImageIndex, setCurImageIndex] = useState(0)
  //计算属性
  // tab栏
  const vehicleTabData = [
    { key: 'VehicleBasicInfo', name: '车辆基本信息', disabled: rightLoading },
    { key: 'OwnerBasicInfo', name: '车主基本信息', disabled: rightLoading },
    { key: 'DriverPassengerCluster', name: '驾乘人员聚类', disabled: rightLoading },
    { key: 'TrackAnalysis', name: '车辆行迹分析', disabled: rightLoading },
  ]

  const mainFormData = pick(vehicleInfoData, ["licensePlate", "plateColorTypeId"])

  const contentData = {
    'VehicleBasicInfo': <VehicleBasicInfo data={vehicleBasicInfo} />,
    'OwnerBasicInfo': <OwnerBasicInfo data={ownerBasicInfo} />,
    'DriverPassengerCluster': <DriverPassengerCluster data={driverPassengerCluster} />,
    'TrackAnalysis': <TrackAnalysis mainFormData={mainFormData} />,
  }

  const flatLabelData = useMemo(() => {
    return labelData.map((item) => item.labels).flat(2)
  }, [labelData])
  //#endregion

  //#region 事件
  // 保存编辑车辆标签
  const handleSave = () => {
    setSaveLabelLoading(true)
    ajax.recordVehicle.updateVehicleLabels<VehicleInfoDataType, ApiResponse<null>>(vehicleInfoData)
      .then(res => {
        setIsEdit(false)
        setSaveLabelLoading(false)
        Message.success(res?.message || '')
        vehicleInfoDataRef.current = vehicleInfoData
      }).catch(err => {
        setIsEdit(false)
        setSaveLabelLoading(false)
        setVehicleInfoData(vehicleInfoDataRef.current)
      })
  }
  // 修改标签
  const handleChangeSelect = (value: string[], option: any) => {
    setVehicleInfoData({
      ...vehicleInfoData,
      labelsId: value,
      labels: flatLabelData.filter(item => value.includes(item.id))
    })
  }
  const handleChangeIndex = (type: string) => {
    if (type === "prev") {
      curImageIndex === 0 ? setCurImageIndex((vehicleInfoData?.vehicleImages?.length || 0) - 1) : setCurImageIndex(curImageIndex - 1)
    } else if (type === "next") {
      curImageIndex === (vehicleInfoData?.vehicleImages?.length || 0) - 1 ? setCurImageIndex(0) : setCurImageIndex(curImageIndex + 1)
    }
  }

  const handleCancel = () => {
    setIsEdit(false)
    setVehicleInfoData(vehicleInfoDataRef.current)
  }

  const handleChangeTabKey = (key: string) => {
    setActiveTabKey(key)
  }
  //#endregion

  useEffect(() => {
    //日志上报
    // logReport({
    //   type: 'none',
    //   data: {
    //     desc: `【档案检索】：车牌号：${searchParams.licensePlate}，车牌颜色：${plateTypeOption.find(item => item.value.toString() === searchParams.plateColorTypeId.toString())?.label}`,
    //     // data: null
    //   }
    // })
    // 获取车辆左侧信息
    ajax.recordVehicle.getVehicleIdentifyInfo<VehicleDetailFormDataType, VehicleInfoDataType>(mainFormData)
      .then(res => {
        if (res.data) {
          const _data = {
            ...res.data,
            labelsId: res.data.labels.map(item => String(item.id))
          }
          setVehicleInfoData(_data)
          setCurImageIndex(0)
          vehicleInfoDataRef.current = _data
        }
        setLeftLoading(false)
      })
      .catch(err => {
        setLeftLoading(false)
      })
    //获取标签
    ajax.getLabels<{ labelTypeId: "personnel" | 'vehicle' }, LabelDataType[]>({ labelTypeId: 'vehicle' })
      .then(res => {
        res.data && setLabelData(res.data)
      })

  }, [])

  useEffect(() => {
    setRightLoading(true)
    switch (activeTabKey) {
      case "VehicleBasicInfo":
        //车辆基本信息
        ajax.recordVehicle.getVehicleBasicInfo<VehicleDetailFormDataType, VehicleBasicInfoType>(mainFormData)
          .then(res => {
            res.data && setVehicleBasicInfo(res.data)
            setRightLoading(false)
          })
          .catch(err => {
            setRightLoading(false)
          })
        // Promise.all([
        //   ajax.recordVehicle.getVehicleBasicInfo<VehicleDetailFormDataType, VehicleBasicInfoType>(mainFormData),
        //   ajax.recordVehicle.getOwnerBasicInfo<VehicleDetailFormDataType, OwnerBasicInfoType>(mainFormData)
        // ])
        //   .then(res => {
        //     const [vehicleBasicInfo, ownerBasicInfo] = res
        //     vehicleBasicInfo.data && setVehicleBasicInfo(vehicleBasicInfo.data)
        //     ownerBasicInfo.data && setOwnerBasicInfo(ownerBasicInfo.data)
        //     setRightLoading(false)
        //   })
        //   .catch(err => {
        //     setRightLoading(false)
        //   })
        break;
      case "OwnerBasicInfo":
        //车主基本信息
        ajax.recordVehicle.getOwnerBasicInfo<VehicleDetailFormDataType, OwnerBasicInfoType>(mainFormData)
          .then(res => {
            setRightLoading(false)
            res.data && setOwnerBasicInfo(res.data)
          })
          .catch(err => {
            setRightLoading(false)
          })
        break;

      case "DriverPassengerCluster":
        //驾乘人员聚类
        ajax.recordVehicle.getClusterDriverPassenger<VehicleDetailFormDataType, DriverPassengerClusterType>(mainFormData)
          .then(res => {
            setRightLoading(false)
            res.data && setDriverPassengerCluster(res.data)
          })
          .catch(err => {
            setRightLoading(false)
          })
        break;
      default:
        setRightLoading(false)
        break;
    }
  }, [activeTabKey])



  return (
    <div className={`${prefixCls}`}>
      <div className={`${prefixCls}-vehicle-info`}>
        <div className="info-header">
          <span>车辆信息</span>
          <div className="title-right">
            {
              isEdit
                ? <>
                  <Button className="btn save-btn" onClick={handleSave} loading={saveLabelLoading}>保存</Button>
                  <Button className="btn cancel-btn" onClick={handleCancel} loading={saveLabelLoading}>取消</Button>
                </>
                : <Button className="btn edit-btn" onClick={() => setIsEdit(true)}>编辑</Button>
            }
          </div>
        </div>
        {
          leftLoading
            ? <Loading spinning={leftLoading} />
            :
            <div className="info-content">
              {
                vehicleInfoData?.vehicleImages?.length ?
                  <div className="info-content-img">
                    {
                      vehicleInfoData.vehicleImages.length > 1 && <span className="left" onClick={() => { handleChangeIndex("prev") }}><LeftOutlined /></span>
                    }
                    <ErrorImage src={vehicleInfoData?.vehicleImages[curImageIndex]} />
                    {
                      vehicleInfoData.vehicleImages.length > 1 && <span className="right" onClick={() => { handleChangeIndex("next") }}><RightOutlined /></span>
                    }
                  </div>
                  :
                  <div className="no-image-data">
                    <ErrorImage src="" />
                  </div>
              }
              <div className="plate-text">
                <span className={`plate-bg plate-color-${vehicleInfoData.plateColorTypeId}`}>{vehicleInfoData.licensePlate}</span>
              </div>
              <div className="vehicle-label">
                <LabelOperation
                  isEdit={isEdit}
                  tagNum={10}
                  labelData={labelData}
                  value={vehicleInfoData.labelsId}
                  labels={vehicleInfoData.labels}
                  handleChangeSelect={handleChangeSelect}
                />
              </div>
            </div>
        }
      </div>
      <div className={`${prefixCls}-vehicle-content`}>
        <Tabs
          type='line'
          activeKey={activeTabKey}
          onChange={handleChangeTabKey}
          className={`${prefixCls}-tab`}
          data={vehicleTabData}
        />
        <div className="active-data">
          {
            rightLoading
              ? <Loading spinning={rightLoading} tip="正在加载中......" />
              : contentData[activeTabKey]
          }
        </div>
      </div>
    </div>)
}

