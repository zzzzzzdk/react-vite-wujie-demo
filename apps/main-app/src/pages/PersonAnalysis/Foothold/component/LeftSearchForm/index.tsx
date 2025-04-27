import {
  FormPlate,
  FormVehicleModel,
  ImgUploadOrIdcard,
  LocationMapList,
  TimeRangePicker,
} from "@/components";
import { Button, Form, Input, Select } from "@yisa/webui";
import dayjs from "dayjs";
import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import useMergedState from "rc-util/lib/hooks/useMergedState";
import { isFunction } from "@/utils";
import {
  PersonFootholdFormDataType,
  PersonFootholdSearchType,
  VehicleFootholdFormDataType,
  VehicleFootholdSearchType,
} from "./interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import dictionary from "@/config/character.config";
import featureData from "@/config/feature.json";
import "./index.scss";
import {
  DrawType,
  LocationMapListCallBack,
} from "@/components/LocationMapList/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import {
  AutoUploadParams,
  RefImgUploadType,
} from "@/components/ImgUpload/interface";
const { InputNumber } = Input;

const FootholdPersonSearch = forwardRef(
  (props: PersonFootholdSearchType, ref: ForwardedRef<RefImgUploadType>) => {
    const {
      onChange,
      // showJump = false
    } = props;
    const defaultFormData: PersonFootholdFormDataType = {
      //选择的是时间还是时段
      timeType: "time",
      // 起止日期
      beginDate: dayjs()
        .subtract(6, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      beginTime: "",
      endTime: "",
      parkingHour: "", //落脚时长
      parkingCount: "", //落脚次数
      displaySort: dictionary.foothodsortList[0].value, //次数排序方式,
      displayTimeSort: dictionary.staysortList[0].value, //停留时段排序方式,
      clusterData: null,
      group: "",
    };

    const [innerFormData, setInnerFormData] =
      useMergedState<PersonFootholdFormDataType>(defaultFormData, {
        value: "formData" in props ? props.formData : undefined,
      });

    const formatValue = (data: PersonFootholdFormDataType) => {
      if (!("formData" in props)) {
        //初始值不为父传过来的，更新innerFormData
        setInnerFormData(data);
      }
      onChange && isFunction(onChange) && onChange(data);
    };
    // console.log(innerFormData);
    const imgUploadOrIdcardRef = useRef<RefImgUploadType>(null);
    const handleClusterChange = (data: ResultRowType | null) => {
      formatValue({
        ...innerFormData,
        clusterData: data,
        group: data?.group || "",
      });
    };

    const handleDateChange = (dates: DatesParamsType) => {
      formatValue({
        ...innerFormData,
        timeType: dates.timeType,
        beginDate: dates.beginDate,
        endDate: dates.endDate,
        beginTime: dates.beginTime,
        endTime: dates.endTime,
      });
    };

    const handleInputChange = (type: string, e: number) => {
      if (e < 1) {
        formatValue({
          ...innerFormData,
          [type]: 1,
        });
      } else {
        // console.log(e.target.value.replace(/[^0-9]/g, ''));
        formatValue({
          ...innerFormData,
          [type]: e,
        });
      }
    };
    useImperativeHandle(ref, () => ({
      handleAutoUpload: (params: AutoUploadParams) => {
        imgUploadOrIdcardRef?.current?.handleAutoUpload?.(params);
      },
      handleSearchCluster(features) {
        imgUploadOrIdcardRef?.current?.handleSearchCluster?.(features)
      },
    }));
    return (
      <div className="foothold-search-wrapper">
        <Form colon={false} labelAlign="left">
          <ImgUploadOrIdcard
            ref={imgUploadOrIdcardRef}
            onClusterChange={handleClusterChange}
            clusterData={innerFormData.clusterData}
            formItemProps={{
              label: (
                <span className="custom-label label-required">身份信息</span>
              ),
            }}
          />
        </Form>
        <Form colon={false} layout="vertical">
          <TimeRangePicker
            formItemProps={{
              label: <span className="custom-label">时间范围</span>,
            }}
            beginDate={innerFormData.beginDate}
            endDate={innerFormData.endDate}
            beginTime={innerFormData.beginTime}
            endTime={innerFormData.endTime}
            timeType={innerFormData.timeType}
            onChange={handleDateChange}
            timeLayout="vertical"
            popupStyle={{ zIndex: 2000 }}
          />
        </Form>
        <Form colon={false} labelAlign="left">
          <Form.Item
            colon={false}
            label={<span className="custom-label">落脚时长</span>}
            required
          >
            <InputNumber
              value={innerFormData.parkingHour}
              formatter={(value) => {
                return String(value)
                  .replace(/[^0-9]/g, "")
                  .replace(/^0/, "1");
              }}
              onChange={(e) => {
                handleInputChange("parkingHour", e as number);
              }}
              addAfter="小时以上"
            />
          </Form.Item>
          <Form.Item
            colon={false}
            label={<span className="custom-label">落脚次数</span>}
            required
          >
            <InputNumber
              value={innerFormData.parkingCount}
              onChange={(e) => {
                handleInputChange("parkingCount", e as number);
              }}
              addAfter="次以上"
              formatter={(value) => {
                return String(value)
                  .replace(/[^0-9]/g, "")
                  .replace(/^0/, "1");
              }}
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
);
const FootholdVehicleSearch = (props: VehicleFootholdSearchType) => {
  const { onChange, onChangeDrawType } = props;
  const defaultFormData: VehicleFootholdFormDataType = {
    //选择的是时间还是时段
    timeType: "time",
    // 起止日期
    beginDate: dayjs()
      .subtract(6, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    beginTime: "",
    endTime: "",
    //点位
    locationIds: [],
    locationGroupIds: [],
    //品牌型号
    brandId: "",
    modelId: [],
    yearId: [],

    licensePlate: "", //车牌号码
    plateColorTypeId: 5, //车牌颜色
    noplate: "",
    vehicleTypeId: [-1], //车辆类别
    parkingHour: "", //落脚时长
    colorTypeId: -1, //车辆颜色
    directionId: -1, //行驶方向
    displaySort: dictionary.foothodsortList[0].value, //次数排序方式,
    displayTimeSort: dictionary.staysortList[0].value, //停留时段排序方式
  };

  const [innerFormData, setInnerFormData] =
    useMergedState<VehicleFootholdFormDataType>(defaultFormData, {
      value: "formData" in props ? props.formData : undefined,
    });
  const [innerDrawType, setInnerDrawType] = useMergedState<DrawType>(
    "default",
    {
      value: "drawType" in props ? props.drawType : "default",
    }
  );

  const formatValue = (data: VehicleFootholdFormDataType) => {
    if (!("formData" in props)) {
      //初始值不为父传过来的，更新innerFormData
      setInnerFormData(data);
    }
    onChange && isFunction(onChange) && onChange(data);
  };
  const handleLocationChange = (data: LocationMapListCallBack) => {
    formatValue({
      ...innerFormData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
    });
  };

  const handleDateChange = (dates: DatesParamsType) => {
    formatValue({
      ...innerFormData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };

  const handlePlateChange = ({
    plateNumber,
    plateTypeId,
    noplate,
  }: PlateValueProps) => {
    formatValue({
      ...innerFormData,
      licensePlate: plateNumber,
      plateColorTypeId: plateTypeId,
      noplate: noplate,
    });
  };

  const handleSelectChange = (
    value: SelectCommonProps["value"],
    fieldName: string
  ) => {
    let newValue = value;
    if (fieldName === "vehicleTypeId") {
      const arr = value as number[];
      // 不限判断
      newValue =
        arr[arr.length - 1] === -1 ? [-1] : arr.filter((item) => item !== -1);
    }
    formatValue({
      ...innerFormData,
      [fieldName]: newValue,
    });
  };

  const handleChangeVehicleModel = (value: {
    brandValue: string;
    modelValue: string[];
    yearValue: string[];
  }) => {
    formatValue({
      ...innerFormData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue,
    });
  };

  const onChangeDrawTools = (drawType: DrawType) => {
    if (!("drawType" in props)) {
      setInnerDrawType(drawType);
    }
    onChangeDrawType &&
      isFunction(onChangeDrawType) &&
      onChangeDrawType(drawType);
  };
  const handleInputChange = (type: string, e: number) => {
    if (e < 1) {
      formatValue({
        ...innerFormData,
        [type]: 1,
        // [type]: 1
      });
    } else {
      formatValue({
        ...innerFormData,
        [type]: e,
        // [type]: e.target.value.replace(/[^0-9]/g, '')
      });
    }
  };
  return (
    <div className="foothold-search-wrapper">
      <Form colon={false} labelAlign="left">
        <Form.Item
          colon={false}
          label={<span className="custom-label">车牌号码</span>}
          required
        >
          <FormPlate
            accurate
            isShowKeyboard
            isShowNoLimit={false}
            value={{
              plateNumber: innerFormData.licensePlate,
              plateTypeId: innerFormData.plateColorTypeId,
              noplate: innerFormData.noplate as "noplate" | "",
            }}
            onChange={(value) => {
              handlePlateChange(value);
            }}
            remind={<div>提示：请输入准确车牌号码（如：鲁A12345）</div>}
          />
        </Form.Item>
        <FormVehicleModel
          formItemProps={{
            label: <span className="custom-label">品牌型号</span>,
          }}
          onChange={handleChangeVehicleModel}
          brandValue={innerFormData.brandId}
          modelValue={innerFormData.modelId}
          yearValue={innerFormData.yearId}
        />
        <Form.Item
          colon={false}
          label={<span className="custom-label">车辆类别</span>}
        >
          <Select
            defaultValue={
              featureData["car"]["vehicleTypeId"]["value"][0]["value"]
            }
            options={featureData["car"]["vehicleTypeId"]["value"].map(
              (item) => ({ label: item.text, value: item.value })
            )}
            onChange={(value) => handleSelectChange(value, "vehicleTypeId")}
            value={innerFormData.vehicleTypeId}
            showSearch={true}
            mode="multiple"
            maxTagCount={1}
            getTriggerContainer={() => document.querySelector('.foothold-search') || document.body}
          />
        </Form.Item>
        <Form.Item
          colon={false}
          label={<span className="custom-label">车辆颜色</span>}
        >
          <Select
            defaultValue={
              featureData["car"]["colorTypeId"]["value"][0]["value"]
            }
            options={featureData["car"]["colorTypeId"]["value"].map((item) => ({
              label: item.text,
              value: item.value,
            }))}
            onChange={(value) => handleSelectChange(value, "colorTypeId")}
            value={innerFormData.colorTypeId}
            showSearch={true}
            getTriggerContainer={() => document.querySelector('.foothold-search') || document.body}
          />
        </Form.Item>
        <Form.Item
          colon={false}
          label={<span className="custom-label">行驶方向</span>}
        >
          <Select
            defaultValue={
              featureData["car"]["directionId"]["value"][0]["value"]
            }
            options={featureData["car"]["directionId"]["value"].map((item) => ({
              label: item.text,
              value: item.value,
            }))}
            onChange={(value) => handleSelectChange(value, "directionId")}
            value={innerFormData.directionId}
            showSearch={true}
            getTriggerContainer={() => document.querySelector('.foothold-search') || document.body}
          />
        </Form.Item>
      </Form>
      <Form colon={false} layout="vertical">
        <TimeRangePicker
          formItemProps={{
            label: <span className="custom-label">时间范围</span>,
          }}
          beginDate={innerFormData.beginDate}
          endDate={innerFormData.endDate}
          beginTime={innerFormData.beginTime}
          endTime={innerFormData.endTime}
          onChange={handleDateChange}
          timeType={innerFormData.timeType}
          timeLayout="vertical"
          popupStyle={{ zIndex: 2000 }}
        />
      </Form>
      <Form colon={false} labelAlign="left">
        <LocationMapList
          formItemProps={{
            label: <span className="custom-label">数据源</span>,
          }}
          locationIds={innerFormData.locationIds}
          locationGroupIds={innerFormData.locationGroupIds}
          onChange={handleLocationChange}
          title="选择点位"
          tagTypes={dictionary.tagTypes.slice(0, 2)}
          onlyLocationFlag={true}
          showDrawTools={false}
          onChangeDrawTools={onChangeDrawTools}
          defaultDrawType={innerDrawType}
        />
        <Form.Item
          colon={false}
          label={<span className="custom-label">落脚时长</span>}
          required
        >
          <InputNumber
            value={innerFormData.parkingHour}
            onChange={(e) => {
              handleInputChange("parkingHour", e as number);
            }}
            addAfter="小时以上"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

const LeftSearchForm = (props: PersonFootholdSearchType) => {
  return <FootholdPersonSearch {...props} />;
};
LeftSearchForm.Person = FootholdPersonSearch;
LeftSearchForm.Vehicle = FootholdVehicleSearch;
export default LeftSearchForm;
