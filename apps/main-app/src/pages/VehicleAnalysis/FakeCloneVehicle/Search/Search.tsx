import React, { useState, useEffect } from "react";
import { Button, Message, Form, Space, Select } from "@yisa/webui";
import {
  TimeRangePicker,
  LocationMapList,
  FormPlate,
  FormVehicleModel,
} from "@/components";
import dayjs from "dayjs";
import dictionary from "@/config/character.config";
import {
  validatePlate,
  getParams,
  isObject,
  formatTimeFormToComponent,
} from "@/utils";
import { isEmptyObject } from "@/utils/is";
import featureData from "@/config/feature.json";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { SearchProps, formDataType } from "../interface";
import { useSelector, RootState } from "@/store";
import { getLogData } from "@/utils/log";
import { useLocation } from "react-router-dom";
import { useResetState } from "ahooks";

export default function Search(props: SearchProps) {
  const location = useLocation();

  const { onChange, ajaxLoading, module } = props;

  const pageConfig = useSelector((state: RootState) => {
    return (
      state.user.sysConfig[module === 1 ? "vehicle-fake" : "vehicle-clone"] ||
      {}
    );
  });

  const [form, setForm, resetForm] = useResetState<formDataType>({
    timeType: "time",
    beginDate: dayjs()
      .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    beginTime: "",
    endTime: "",
    locationIds: [],
    locationGroupIds: [],
    licensePlate: "",
    plateColorTypeId: -1,
    vehicleTypeId: [-1],
    noplate: "",
    brandId: "",
    modelId: [],
    yearId: [],
  });

  // 获取token loading
  const [tokenLoading, setTokenLoading] = useState(false);

  const handleDateChange = (dates: DatesParamsType) => {
    setForm({
      ...form,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };

  const handleLocationChange = (data: LocationMapListCallBack) => {
    setForm({
      ...form,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
    });
  };

  const handlePlateChange = ({
    plateNumber,
    plateTypeId,
    noplate,
  }: PlateValueProps) =>
    setForm({
      ...form,
      licensePlate: plateNumber,
      plateColorTypeId: plateTypeId,
      noplate: noplate,
    });

  const handleSelectChange = (
    value: SelectCommonProps["value"],
    fieldName: string
  ) => {
    let newValue = value;
    if (fieldName === "vehicleTypeId" || fieldName === "vehicleFuncId") {
      const arr = value as number[];
      // 不限判断
      newValue =
        arr[arr.length - 1] === -1 ? [-1] : arr.filter((item) => item !== -1);
    }
    setForm({
      ...form,
      [fieldName]: newValue,
    });
  };

  const handleChangeVehicleModel = (value: {
    brandValue: any;
    modelValue: any;
    yearValue: any;
    extra?: any;
  }) => {
    setForm({
      ...form,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue,
    });
  };

  const handleSearchBtn = () => {
    // if (
    //   !(form.locationIds && form.locationIds.length) &&
    //   !(form.locationGroupIds && form.locationGroupIds.length)
    // ) {
    //   Message.warning("请选择数据源");
    //   return;
    // }
    // if (!form.licensePlate) {
    //   Message.warning("请输入车牌号");
    //   return;
    // }
    if (form.licensePlate && !validatePlate(form.licensePlate)) {
      Message.warning("请输入正确的车牌号");
      return;
    }
    const dateRangeMax = Number(pageConfig.timeRange?.max || 0);
    if (dateRangeMax) {
      let timeDiff =
        dayjs(form.endDate).diff(dayjs(form.beginDate), "days") + 1;
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`);
        return;
      }
    }
    onChange(form);
  };

  // 页面跳转传参处理
  const handleParamsData = async () => {
    const searchData = getParams(location.search);
    if (!isEmptyObject(searchData)) {
      let paramsFormData: any = {};
      if (searchData.token) {
        setTokenLoading(true);
        await getLogData({ token: searchData.token }).then((res) => {
          setTokenLoading(false);
          const { data } = res as any;
          if (data && isObject(data)) {
            try {
              paramsFormData = data;
              if (data.timeRange) {
                formatTimeFormToComponent(data.timeRange, paramsFormData);
              }
              if (data.brandId === -1) {
                paramsFormData.brandId = "";
              }
              const _form = {
                ...form,
                ...paramsFormData,
              };
              setForm(_form);
              onChange(_form, true);
            } catch (error) {
              Message.error(`数据解析失败`);
              onChange(
                {
                  ...form,
                  beginDate: dayjs()
                    .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                },
                true
              );
            }
          } else {
            onChange(
              {
                ...form,
                beginDate: dayjs()
                  .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
                  .startOf("day")
                  .format("YYYY-MM-DD HH:mm:ss"),
              },
              true
            );
          }
        });
      } else {
        onChange(
          {
            ...form,
            beginDate: dayjs()
              .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
          },
          true
        );
      }
    } else {
      onChange(
        {
          ...form,
          beginDate: dayjs()
            .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        true
      );
    }
  };

  // 重置
  const handleReset = () => {
    resetForm()
  }

  useEffect(() => {
    handleParamsData();
  }, []);

  return (
    <Form layout="vertical" className="fake-clone-vehicle-form">
      <TimeRangePicker
        timeType={form.timeType}
        formItemProps={{ label: "时间范围" }}
        beginDate={form.beginDate}
        endDate={form.endDate}
        beginTime={form.beginTime}
        endTime={form.endTime}
        onChange={handleDateChange}
        getPopupContainer={() => document.getElementsByClassName('fake-clone-vehicle-form')[0] as HTMLElement}
      />
      <LocationMapList
        formItemProps={{ label: "数据源", required: false }}
        title="选择点位"
        onlyLocationFlag={true}
        locationIds={form.locationIds}
        locationGroupIds={form.locationGroupIds}
        tagTypes={dictionary.tagTypes.slice(0, 2)}
        onChange={handleLocationChange}
      />
      <Form.Item colon={false} label={"车牌号码"}>
        <FormPlate
          isShowKeyboard
          value={{
            plateNumber: form.licensePlate,
            plateTypeId: form.plateColorTypeId,
            noplate: form.noplate as "noplate" | "",
          }}
          onChange={(value) => handlePlateChange(value)}
          getPopupContainer={() => document.getElementsByClassName('fake-clone-vehicle-form')[0] as HTMLElement}
        />
      </Form.Item>
      <FormVehicleModel
        onChange={handleChangeVehicleModel}
        brandValue={form.brandId}
        modelValue={form.modelId}
        yearValue={form.yearId}
      />
      <Form.Item label="车辆类别" className="vehicle-form-item" colon={false}>
        <Select
          defaultValue={
            featureData["car"]["vehicleTypeId"]["value"][0]["value"]
          }
          options={featureData["car"]["vehicleTypeId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          onChange={(value) => handleSelectChange(value, "vehicleTypeId")}
          value={form.vehicleTypeId}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item colon={false} label={" "} style={{ marginLeft: "auto" }}>
        <Space size={10}>
          <Button disabled={ajaxLoading} onClick={handleReset} type='default' className="reset-btn">重置</Button>
          <Button
            loading={ajaxLoading}
            onClick={handleSearchBtn}
            type="primary"
          >
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
