import React, { useEffect } from "react";
import {
  Button,
  Message,
  Form,
  Space,
  Input,
  Select,
  Tooltip,
} from "@yisa/webui";
import {
  TimeRangePicker,
  LocationMapList,
  FormPlate,
  FormVehicleModel,
} from "@/components";
import { useGetState, useResetState } from "ahooks";
import dayjs from "dayjs";
import { useSelector, useDispatch, RootState } from "@/store";
import dictionary from "@/config/character.config";
import { formatTimeFormToComponent, isObject, validatePlate } from "@/utils";
import featureData from "@/config/feature.json";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { FrePassFormData, FrePassItem } from "./interface";
import { Icon } from "@yisa/webui/es/Icon";
import "./index.scss";
import { SysConfigItem } from "@/store/slices/user";
import useVehicleSearchParams from "../ActiveNight/useVechileSearchParams";
import { useSearchParams } from "react-router-dom";
import services from "@/services";

const pdmFallback = {
  timeRange: {
    default: "7",
    min: "1",
    max: "30",
  },
  passingNum: {
    default: "9",
    min: "1",
    max: "30",
  },
};
type FrePassFormProps = {
  onSearch: (formData: FrePassFormData) => void;
  loading: boolean;
};

const FrePassForm: React.FC<FrePassFormProps> = (props) => {
  const prefixCls = "frepass";
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig as any
  )[prefixCls];
  const pdmConfig = Object.assign(pdmFallback, pdmRaw);
  const vehicleSearchParams = useVehicleSearchParams();
  const [formData, setFormData, resetFormData] = useResetState<FrePassFormData>(
    Object.assign(
      {
        timeType: "time",
        beginDate: dayjs()
          .subtract(Number(pdmConfig.timeRange?.default) - 1, "days")
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        beginTime: "",
        endTime: "",
        locationIds: [],
        locationGroupIds: [],
        groupFilters: [],
        brandId: "",
        modelId: [],
        yearId: [],
        licensePlate: "",
        plateColorTypeId: -1,
        noplate: "",
        objectTypeId: -1,
        colorTypeId: -1,
        vehicleTypeId: [-1],
        vehicleFuncId: [-1],
        //排除车牌
        excludeLicensePlates: [
          {
            licensePlate: "",
            plateColorTypeId: -1,
          },
          {
            licensePlate: "",
            plateColorTypeId: -1,
          },
        ],
        // 频繁过车特有字段
        captureCount: -1,
        passingCount: Number(pdmConfig.passingNum.default),
        timeLimitation: 5,
        continuousCapture: 10,
      } as FrePassFormData,
      {
        ...vehicleSearchParams,
        vehicleTypeId: [vehicleSearchParams.vehicleTypeId],
      }
    )
  );

  // 获取token
  const [searchParams, _] = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    services.log
      .getLogData({ token })
      .then((res) => {
        if (!res.data || !isObject(res.data)) {
          throw Error("Token参数解析失败");
        }
        const { data } = res as any;
        // 时间格式恢复
        if (data.timeRange) {
          formatTimeFormToComponent(data.timeRange, data);
        }

        setFormData((form) => {
          return {
            ...form,
            ...data,
          };
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => { });
  }, []);

  //格式化请求参数
  const formFormat = (form: FrePassFormData) => {
    let newForm = { ...form };
    let timeRange = {};
    if (form.timeType === "time") {
      timeRange = { times: [form.beginDate, form.endDate] };
    } else {
      timeRange = {
        periods: {
          dates: [form.beginDate, form.endDate],
          times: [form.beginTime, form.endTime],
        },
      };
    }
    newForm["timeRange"] = timeRange;
    newForm["vehicleFuncId"] = form.vehicleFuncId?.filter((i) => i !== -1);
    newForm["vehicleTypeId"] = form.vehicleTypeId?.filter((i) => i !== -1);
    // 点位和任务ids
    // newForm["locationIds"] = [...form.locationIds, ...form.locationGroupIds];
    // 公共参数删减，不必要的删除
    const delKeys = [
      "timeType",
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
      // "locationGroupIds",
      "noplate",
    ];
    delKeys.forEach((key) => delete newForm[key]);
    return newForm;
  };

  //检索
  const handleSearch = () => {
    // 时间范围校验
    const diff =
      Math.abs(dayjs(formData.beginDate).diff(formData.endDate, "day")) + 1;
    console.log({ diff }, pdmConfig.timeRange.max);
    if (diff > Number(pdmConfig.timeRange.max)) {
      Message.warning(`时间范围不能超过${pdmConfig.timeRange.max}天`);
      return;
    }
    if (
      formData.locationIds.length <= 0 &&
      formData.locationGroupIds.length <= 0
    ) {
      Message.warning("请选择数据源");
      return;
    }
    if (formData.locationIds.length + formData.locationGroupIds.length > 200) {
      Message.warning("最多选择200个点位");
      return;
    }
    if (!validatePlate(formData.licensePlate)) {
      Message.warning("请输入正确的车牌号");
      return;
    }
    if (!validatePlate(formData.excludeLicensePlates[0].licensePlate)) {
      Message.warning("请输入正确排除车牌1");
      return;
    }
    if (!validatePlate(formData.excludeLicensePlates[1].licensePlate)) {
      Message.warning("请输入正确排除车牌2");
      return;
    }
    if (
      formData.excludeLicensePlates[0].licensePlate.trim() &&
      formData.excludeLicensePlates[0].plateColorTypeId ===
      formData.excludeLicensePlates[1].plateColorTypeId &&
      formData.excludeLicensePlates[0].licensePlate.trim() ===
      formData.excludeLicensePlates[1].licensePlate.trim()
    ) {
      Message.warning("排除车牌不能重复");
      return;
    }
    props.onSearch(formFormat(formData));
  };
  /* ========================表单onChange begin================================================= */
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
    });
  };

  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };

  const handlePlateChange = (
    { plateNumber, plateTypeId, noplate }: PlateValueProps,
    type: "licensePlate" | "excludeLicensePlate1" | "excludeLicensePlate2"
  ) => {
    switch (type) {
      case "licensePlate":
        setFormData({
          ...formData,
          licensePlate: plateNumber,
          plateColorTypeId: plateTypeId,
          noplate: noplate,
        });
        break;
      case "excludeLicensePlate1":
        setFormData({
          ...formData,
          excludeLicensePlates: [
            {
              licensePlate: plateNumber,
              plateColorTypeId: plateTypeId,
            },
            formData.excludeLicensePlates[1],
          ],
        });
        break;
      case "excludeLicensePlate2":
        setFormData({
          ...formData,
          excludeLicensePlates: [
            formData.excludeLicensePlates[0],
            {
              licensePlate: plateNumber,
              plateColorTypeId: plateTypeId,
            },
          ],
        });
        break;
      default:
        break;
    }
  };
  const handleChangeVehicleModel = (value: {
    brandValue: any;
    modelValue: any;
    yearValue: any;
    extra?: any;
  }) => {
    setFormData({
      ...formData,
      brandId: value.brandValue,
      modelId: value.modelValue,
      yearId: value.yearValue,
    });
  };

  const handleFormSelectChange = (
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
    setFormData({
      ...formData,
      [fieldName]: newValue,
    });
  };

  // 重置
  const handleReset = () => {
    resetFormData()
  }

  return (
    <Form layout="vertical" colon={false} className="frepass-form">
      <TimeRangePicker
        timeType={formData.timeType}
        formItemProps={{ label: "时间范围" }}
        beginDate={formData.beginDate}
        endDate={formData.endDate}
        beginTime={formData.beginTime}
        endTime={formData.endTime}
        onChange={handleDateChange}
        getPopupContainer={() => document.getElementsByClassName('frepass-form')[0] as HTMLElement}
      />
      <LocationMapList
        formItemProps={{ label: "数据源(不超过200个点位)", required: true }}
        title="选择点位"
        onlyLocationFlag={true}
        locationIds={formData.locationIds}
        locationGroupIds={formData.locationGroupIds}
        tagTypes={dictionary.tagTypes.slice(0, 2)}
        onChange={handleLocationChange}
      />
      <Form.Item className="passingCount" required label="过车次数">
        <Input.InputNumber
          addAfter="次以上"
          min={Number(pdmConfig.passingNum.min)}
          max={Number(pdmConfig.passingNum.max)}
          value={formData.passingCount}
          onChange={(v) => {
            if (!v) return;
            setFormData({ ...formData, passingCount: v });
          }}
        />
      </Form.Item>
      <Form.Item colon={false} label={"车牌号码"}>
        <FormPlate
          isShowKeyboard
          value={{
            plateNumber: formData.licensePlate,
            plateTypeId: formData.plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "licensePlate");
          }}
          getPopupContainer={() => document.getElementsByClassName('frepass-form')[0] as HTMLElement}
        />
      </Form.Item>
      <FormVehicleModel
        onChange={handleChangeVehicleModel}
        brandValue={formData.brandId}
        modelValue={formData.modelId}
        yearValue={formData.yearId}
      />
      <Form.Item label="车辆颜色" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          defaultValue={featureData["car"]["colorTypeId"]["value"][0]["value"]}
          options={featureData["car"]["colorTypeId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          onChange={(value) => handleFormSelectChange(value, "colorTypeId")}
          value={formData.colorTypeId}
          showSearch={true}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label="车辆类别" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          defaultValue={
            featureData["car"]["vehicleTypeId"]["value"][0]["value"]
          }
          options={featureData["car"]["vehicleTypeId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          onChange={(value) => handleFormSelectChange(value, "vehicleTypeId")}
          value={formData.vehicleTypeId}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item
        label="车辆使用性质"
        className="vehicle-form-item"
        colon={false}
      >
        <Select
          allowClear
          defaultValue={
            featureData["car"]["vehicleFuncId"]["value"][0]["value"]
          }
          options={featureData["car"]["vehicleFuncId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          onChange={(value) => handleFormSelectChange(value, "vehicleFuncId")}
          value={formData.vehicleFuncId}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label="抓拍角度" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          defaultValue={featureData["car"]["objectTypeId"]["value"][0]["value"]}
          options={featureData["car"]["objectTypeId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          onChange={(value) => handleFormSelectChange(value, "objectTypeId")}
          value={formData.objectTypeId}
          showSearch={true}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item colon={false} label={"排除车牌1"}>
        <FormPlate
          isShowKeyboard
          value={{
            plateNumber: formData.excludeLicensePlates[0].licensePlate,
            plateTypeId: formData.excludeLicensePlates[0].plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "excludeLicensePlate1");
          }}
          getPopupContainer={() => document.getElementsByClassName('frepass-form')[0] as HTMLElement}
        />
      </Form.Item>
      <Form.Item colon={false} label={"排除车牌2"}>
        <FormPlate
          isShowKeyboard
          value={{
            plateNumber: formData.excludeLicensePlates[1].licensePlate,
            plateTypeId: formData.excludeLicensePlates[1].plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "excludeLicensePlate2");
          }}
          getPopupContainer={() => document.getElementsByClassName('frepass-form')[0] as HTMLElement}
        />
      </Form.Item>
      <Form.Item
        className="filter-rule-wrapper"
        required
        label={
          <Tooltip
            className="label-tooltip"
            trigger="hover"
            title="
             由于车辆停放导致频繁抓拍，影响频繁过车功能结果的研判，通过此条件可对同点位频繁抓拍的停放车辆进行过滤。
            "
          >
            过滤配置规则
            <Icon type="bangzhu" />
          </Tooltip>
        }
      >
        <div className="filter-rule">
          <Input.InputNumber
            // addAfter="分钟内连续抓拍"
            min={1}
            value={formData.timeLimitation}
            onChange={(v) => {
              if (!v) return;
              setFormData({ ...formData, timeLimitation: v });
            }}
          />
          <span>分钟连续抓拍</span>
          {/* <Input.InputNumber
            // addAfter="次以上"
            min={1}
            max={100}
            value={formData.continuousCapture}
            onChange={(v) => {
              if (!v) return;
              setFormData({ ...formData, continuousCapture: v });
            }}
          />
          <span>次以上</span> */}
        </div>
      </Form.Item>
      <Form.Item colon={false} label={" "} style={{ marginLeft: "auto", marginRight: '14px' }}>
        <Space size={10}>
          <Button disabled={props.loading} onClick={handleReset} type='default' className="reset-btn">重置</Button>
          <Button loading={props.loading} onClick={handleSearch} type="primary">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FrePassForm;
