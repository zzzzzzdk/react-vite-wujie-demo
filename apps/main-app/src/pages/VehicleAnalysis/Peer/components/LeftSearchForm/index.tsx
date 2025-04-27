import React, { useRef, useImperativeHandle, forwardRef, ForwardedRef } from 'react'
import { Form, Input, Loading } from '@yisa/webui'
import { ErrorImage } from '@yisa/webui_business';
import { LocationMapList, TimeRangePicker, FormPlate, MoreFilter, ImgUploadOrIdcard } from '@/components'
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import dayjs from 'dayjs'
import dictionary from '@/config/character.config'
import pick from '@/utils/pick';
import { isFunction } from '@/utils'
import type { VehicleLeftSearchFormType, PersonLeftSearchFormType, VehicleFormDataType, PersonFormDataType } from './interface'
import type { DatesParamsType } from "@/components/TimeRangePicker/interface";
import type { DrawType, LocationMapListCallBack } from '@/components/LocationMapList/interface'
import type { PlateValueProps } from "@/components/FormPlate/interface"
import type { MoreFilterFormDataType } from '@/components/MoreFilter/interface'
import type { ResultRowType } from '@/pages/Search/Target/interface';
import type { AutoUploadParams, RefImgUploadType } from '@/components/ImgUpload/interface';
import { defaultMoreFilterFormData } from '@/components/MoreFilter'
import './index.scss'


const VehicleLeftSearchForm = (props: VehicleLeftSearchFormType) => {
  const {
    onChange,
    onChangeDrawType,
  } = props

  const prefixCls = "left-search-wrapper"
  const defaultFormData: VehicleFormDataType = {
    timeType: 'time',
    beginDate: dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    brandId: '',
    modelId: [],
    yearId: [],
    licensePlate: '',
    plateColorTypeId: 5,
    noplate: '',
    objectTypeId: -1,
    vehicleTypeId: [-1],
    vehicleFuncId: [-1],
    //排除车牌
    excludeLicensePlate: {
      licensePlate: "",
      plateColorTypeId: 5
    },
    interval: "", //跟车时长
    minCount: "", //同行点位数
    peerSpot: "", //同行次数
    // displaySort: dictionary.sortList[0].value,
    // displayTimeSort: dictionary.captureSortList[0].value,
  }
  const [innerFormData, setInnerFormData] = useMergedState<VehicleFormDataType>(defaultFormData, {
    value: 'formData' in props ? props.formData : undefined
  })
  const [innerMoreFilterFormData, setInnerMoreFilterFormData] = useMergedState<any>(defaultMoreFilterFormData, {
    value: 'formData' in props ? pick(props.formData || {}, ["brandId", "modelId", "yearId", "vehicleTypeId", "vehicleFuncId", "colorTypeId", "objectTypeId", "excludeLicensePlate"]) : undefined
  })
  const [innerDrawType, setInnerDrawType] = useMergedState<DrawType>("default", {
    value: 'drawType' in props ? props.drawType : "default"
  })

  //工具函数
  const formatValue = (data: VehicleFormDataType) => {
    if (!('formData' in props)) {
      setInnerFormData(data)
    }
    onChange && isFunction(onChange) && onChange(data)
  }

  const handleLocationChange = (data: LocationMapListCallBack) => {
    formatValue({
      ...innerFormData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds
    })

  }

  const handleDateChange = (dates: DatesParamsType) => {
    formatValue({
      ...innerFormData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }

  const handlePlateChange = ({ plateNumber, plateTypeId, noplate }: PlateValueProps, type: 'licensePlate' | "excludeLicensePlate") => {
    switch (type) {
      case "licensePlate":
        formatValue({
          ...innerFormData,
          licensePlate: plateNumber,
          plateColorTypeId: plateTypeId,
          noplate: noplate,
        })
        break;
      case "excludeLicensePlate":
        formatValue({
          ...innerFormData,
          excludeLicensePlate: {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    formatValue({
      ...innerFormData,
      [type]: e.target.value
    })
  }

  const onChangeDrawTools = (drawType: DrawType) => {
    if (!("drawType" in props)) {
      setInnerDrawType(drawType)
    }
    onChangeDrawType && isFunction(onChangeDrawType) && onChangeDrawType(drawType)
  }


  //针对更多筛选条件
  const handleMoreFilter = (data: MoreFilterFormDataType) => {
    if (!('formData' in props)) {
      setInnerMoreFilterFormData(data)
    }
    formatValue({
      ...innerFormData,
      ...data,
      plateColorTypeId: innerFormData.plateColorTypeId,
      licensePlate: innerFormData.licensePlate
    })
  }


  return (
    <div className={`${prefixCls}`}>
      <Form colon={false} labelAlign="left">
        <Form.Item colon={false} label={<span className="custom-label label-required">车牌号码</span>}>
          <FormPlate
            // horizontalDis={-155}
            // getPopupContainer={() => document.body}
            accurate
            allowClear
            isShowKeyboard={true}
            isShowNoLimit={false}
            value={{
              plateNumber: innerFormData.licensePlate,
              plateTypeId: innerFormData.plateColorTypeId,
              noplate: (innerFormData.noplate as 'noplate' | '')
            }}
            onChange={(value) => { handlePlateChange(value, "licensePlate") }}
            remind={<div>提示：请输入准确车牌号码（如：鲁A12345）</div>}
          />
        </Form.Item>
      </Form>
      <Form colon={false} layout="vertical">
        <TimeRangePicker
          formItemProps={{ label: ' ' }}
          timeCustomLabel={<span className="custom-label">时间范围</span>}
          beginDate={innerFormData.beginDate}
          endDate={innerFormData.endDate}
          beginTime={innerFormData.beginTime}
          endTime={innerFormData.endTime}
          onChange={handleDateChange}
          timeLayout="vertical"
          showTimeType={false}
        />
      </Form>
      <Form colon={false} labelAlign="left">
        <LocationMapList
          formItemProps={{ label: <span className="custom-label">数据源</span> }}
          locationIds={innerFormData.locationIds}
          locationGroupIds={innerFormData.locationGroupIds}
          onChange={handleLocationChange}
          title="选择点位"
          tagTypes={dictionary.tagTypes.slice(0, 2)}
          onlyLocationFlag={true}
          // showDrawTools={true}
          onChangeDrawTools={onChangeDrawTools}
          defaultDrawType={innerDrawType}
        />
        <Form.Item colon={false} label={<span className="custom-label label-required">跟车时间</span>}>
          <Input
            allowClear
            value={innerFormData.interval}
            onChange={(e) => { handleInputChange(e, "interval") }}
            suffix="秒以内"
          />
        </Form.Item>
        <Form.Item colon={false} label={<span className="custom-label label-required">同行次数</span>}>
          <Input
            allowClear
            value={innerFormData.peerSpot}
            onChange={(e) => { handleInputChange(e, "peerSpot") }}
            suffix="次以上"
          />
        </Form.Item>
        <Form.Item colon={false} label={<span className="custom-label label-required">同行点位</span>}>
          <Input
            allowClear
            value={innerFormData.minCount}
            onChange={(e) => { handleInputChange(e, "minCount") }}
            suffix="个及以上"
          />
        </Form.Item>
      </Form>
      <MoreFilter formData={innerMoreFilterFormData} onChange={handleMoreFilter} labelLeftGap={10} />
    </div>
  )
}

const PersonLeftSearchForm = forwardRef((props: PersonLeftSearchFormType, ref: ForwardedRef<RefImgUploadType>) => {
  const {
    onChange,
    onChangeDrawType,
    showJump = false,
    jumpLoading = false
  } = props
  const prefixCls = "left-search-wrapper"
  const defaultFormData: PersonFormDataType = {
    clusterData: null,
    timeType: 'time',
    beginDate: dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    beginTime: '',
    endTime: '',
    locationIds: [],
    locationGroupIds: [],
    interval: "", //跟随间隔
    peerSpot: "",//同行次数
  }
  const [innerFormData, setInnerFormData] = useMergedState<PersonFormDataType>(defaultFormData, {
    value: 'formData' in props ? props.formData : undefined
  })
  const [innerDrawType, setInnerDrawType] = useMergedState<DrawType>("default", {
    value: 'drawType' in props ? props.drawType : "default"
  })
  const imgUploadOrIdcardRef = useRef<RefImgUploadType>(null)

  //工具函数
  const formatValue = (data: PersonFormDataType) => {
    if (!('formData' in props)) {
      setInnerFormData(data)
    }
    onChange && isFunction(onChange) && onChange(data)
  }

  const handleClusterChange = (data: ResultRowType | null) => {
    formatValue({
      ...innerFormData,
      clusterData: data ? [data] : []
    })
  }

  const handleLocationChange = (data: LocationMapListCallBack) => {
    formatValue({
      ...innerFormData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds
    })

  }

  const handleDateChange = (dates: DatesParamsType) => {
    formatValue({
      ...innerFormData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    formatValue({
      ...innerFormData,
      [type]: e.target.value
    })
  }

  const onChangeDrawTools = (drawType: DrawType) => {
    if (!("drawType" in props)) {
      setInnerDrawType(drawType)
    }
    onChangeDrawType && isFunction(onChangeDrawType) && onChangeDrawType(drawType)
  }

  useImperativeHandle(ref, () => ({
    handleAutoUpload: (params: AutoUploadParams) => {
      imgUploadOrIdcardRef?.current?.handleAutoUpload?.(params)
    },
    handleSearchCluster(features) {
      imgUploadOrIdcardRef?.current?.handleSearchCluster?.(features)
    },
  }))

  return (
    <div className={`${prefixCls}`}>
      <Form colon={false} labelAlign="left">
        {
          showJump ?
            <Form.Item colon={false}>
              {
                jumpLoading ? <Loading spinning={jumpLoading} />
                  :
                  <div className="jump-list">
                    {
                      innerFormData.clusterData?.slice(0, 2)?.map(item => <div
                        key={item.infoId}
                        className="jump-list-item"
                      >
                        <ErrorImage src={item.targetImage} />
                      </div>)
                    }
                    <div className="flex-auto">
                      {(innerFormData.clusterData?.length || 0) > 2 && `等`}共{innerFormData.clusterData?.length || 0}张
                    </div>
                  </div>
              }
            </Form.Item>
            :
            <ImgUploadOrIdcard
              ref={imgUploadOrIdcardRef}
              onClusterChange={handleClusterChange}
              clusterData={innerFormData.clusterData}
              formItemProps={{ label: <span className="custom-label label-required">身份信息</span> }}
            />
        }
      </Form>
      <Form colon={false} layout="vertical">
        <TimeRangePicker
          disabled={showJump}
          formItemProps={{ label: <span className="custom-label">时间范围</span> }}
          beginDate={innerFormData.beginDate}
          endDate={innerFormData.endDate}
          beginTime={innerFormData.beginTime}
          endTime={innerFormData.endTime}
          onChange={handleDateChange}
          timeLayout="vertical"
          timeSelectTypeStyle={{ width: 66, marginInlineStart: 10 }}
          timeType={innerFormData.timeType}
        />
      </Form>
      <Form colon={false} labelAlign="left">
        <LocationMapList
          disabled={showJump}
          formItemProps={{ label: <span className="custom-label">数据源</span> }}
          locationIds={innerFormData.locationIds}
          locationGroupIds={innerFormData.locationGroupIds}
          onChange={handleLocationChange}
          title="选择点位"
          tagTypes={dictionary.tagTypes.slice(0, 2)}
          onlyLocationFlag={true}
          // showDrawTools={true}
          onChangeDrawTools={onChangeDrawTools}
          defaultDrawType={innerDrawType}
        />
        <Form.Item colon={false} label={<span className="custom-label label-required">跟随间隔</span>}>
          <Input
            allowClear
            value={innerFormData.interval}
            onChange={(e) => { handleInputChange(e, "interval") }}
            suffix="秒以内"
          />
        </Form.Item>
        <Form.Item colon={false} label={<span className="custom-label label-required">同行次数</span>}>
          <Input
            allowClear
            value={innerFormData.peerSpot}
            onChange={(e) => { handleInputChange(e, "peerSpot") }}
            suffix="次以上"
          />
        </Form.Item>
      </Form>
    </div>
  )
})

const LeftSearchForm = (props: VehicleLeftSearchFormType) => {
  return <VehicleLeftSearchForm {...props} />
}
LeftSearchForm.Vehicle = VehicleLeftSearchForm
LeftSearchForm.Person = PersonLeftSearchForm

export default LeftSearchForm
