import React, { useEffect } from "react";
import {
  TimePicker,
  Button,
  Message,
  Form,
  Space,
  Slider,
  Select,
  Tooltip,
} from "@yisa/webui";
import { Icon, UndoOutlined } from "@yisa/webui/es/Icon";
import {
  TimeRangePicker,
  LocationMapList,
  FormPlate,
  FormVehicleModel,
} from "@/components";
import { useResetState } from "ahooks";
import dayjs from "dayjs";
import { useSelector, RootState } from "@/store";
import dictionary from "@/config/character.config";
import { validatePlate } from "@/utils";
import featureData from "@/config/feature.json";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { ActiveFormData } from "./interface";
import "./index.scss";
//一次二次识别车牌
import { SysConfigItem } from "@/store/slices/user";
import useVehicleSearchParams from "./useVechileSearchParams";
import { useSearchParams } from "react-router-dom";
import services from "@/services";
import { isObject } from "lodash";
type ActiveNightFormProps = {
  loading: boolean;
  onSubmit: (form: any) => void;
};

const ActiveNightForm: React.FC<ActiveNightFormProps> = (props) => {
  const { loading, onSubmit } = props;

  const vehicleSearchParams = useVehicleSearchParams();
  //表单数据参数
  // 获取pdm中的配置，以及fallback
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig
  )["active-night"];
  const pdmConfig = {
    // @ts-ignore
    timeRange: {
      default: "7",
      min: "1",
      max: "30",
    },
    // @ts-ignore
    percentage: {
      default: "30",
      min: "0",
      max: "100",
    },
    // @ts-ignore
    nighttime: {
      default: ["09:00:00", "21:00:00"],
    },
    ...pdmRaw,
  };
  // console.log('pdmConfig: ', pdmConfig, pdmRaw)

  const [formData, setFormData, resetFormData] = useResetState<ActiveFormData>(
    Object.assign(
      {},
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
        // pageNo: 1,
        // pageSize: dictionary.pageSizeOptions[0],
        brandId: "",
        modelId: [],
        yearId: [],
        licensePlate: "",
        plateColorTypeId: 5,
        noplate: "",
        objectTypeId: -1,
        colorTypeId: -1,
        vehicleTypeId: [-1],
        vehicleFuncId: [-1],
        //排除车牌
        excludeLicensePlates: [
          {
            licensePlate: "",
            plateColorTypeId: 5,
          },
          {
            licensePlate: "",
            plateColorTypeId: 5,
          },
        ],
        // extra filter
        percentage: Number(pdmConfig.percentage?.default) / 100,
        days: -1,
        daytimeOccurrences: -1,
        nighttimeOccurrences: -1,
        daytime: {
          start: pdmConfig.nighttime?.default
            ? pdmConfig.nighttime.default[0]
            : null,
          end: pdmConfig.nighttime?.default
            ? pdmConfig.nighttime.default[1]
            : null,
        },
        nighttime: {
          start: "21:00:00",
          end: "09:00:00",
        },
        dateRange: {
          start: "",
          end: "",
        },
      } as ActiveFormData,
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
        // 特殊的时间格式（-:
        const { data } = res as any;
        setFormData((form) => {
          return {
            ...form,
            ...data,
            beginDate: data?.dateRange?.start,
            endDate: data?.dateRange?.end,
          };
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => { });
  }, []);

  const formFormat = (form: ActiveFormData) => {
    let newForm = { ...form };
    newForm.nighttime = {
      start: newForm.daytime.end,
      end: newForm.daytime.start,
    };
    newForm["dateRange"].start = dayjs(form.beginDate).format("YYYY-MM-DD");
    newForm["dateRange"].end = dayjs(form.endDate).format("YYYY-MM-DD");
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

  //检索
  const handleSearch = () => {
    // 时间范围校验
    const diff =
      Math.abs(dayjs(formData.beginDate).diff(formData.endDate, "day")) + 1;
    // console.log({ diff }, pdmConfig.timeRange.max);
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
    /* 点击搜索时重置页号 */
    const newFormData = { ...formData };
    setFormData(newFormData);
    onSubmit(formFormat(newFormData));
  };

  // 重置
  const handleReset = () => {
    resetFormData()
  }

  return (
    <Form layout="vertical" className="active-night-form">
      <TimeRangePicker
        showTime={false}
        showMonth={false}
        showTimeType={false}
        formItemProps={{ label: "时间范围" }}
        beginDate={formData.beginDate}
        endDate={formData.endDate}
        beginTime={formData.beginTime}
        endTime={formData.endTime}
        onChange={handleDateChange}
        getPopupContainer={() => document.getElementsByClassName('active-night-form')[0] as HTMLElement}
      />
      <LocationMapList
        formItemProps={{ label: "数据源", required: true }}
        title="选择点位"
        onlyLocationFlag={true}
        locationIds={formData.locationIds}
        locationGroupIds={formData.locationGroupIds}
        tagTypes={dictionary.tagTypes.slice(0, 2)}
        onChange={handleLocationChange}
      />
      <Form.Item className="backtrack-time" colon={false} label="隐匿时间">
        <TimePicker.RangePicker
          order={false}
          value={[
            dayjs(formData.daytime?.start, "HH:mm:ss"),
            dayjs(formData.daytime?.end, "HH:mm:ss"),
          ]}
          format="HH:mm:ss"
          onChange={(_, span) => {
            // console.log(span);
            if (!dayjs(span[0], "HH:mm:ss").isValid()) {
              span[0] = pdmConfig.nighttime.default[0];
              span[1] = pdmConfig.nighttime.default[1];
            }
            setFormData({
              ...formData,
              daytime: {
                start: span[0],
                end: span[1],
              },
              nighttime: {
                start: span[1],
                end: span[0],
              },
            });
          }}
          getPopupContainer={() => document.getElementsByClassName('active-night-form')[0] as HTMLElement}
        />
      </Form.Item>
      <Form.Item
        className="backtrack-time"
        colon={false}
        label={
          <Tooltip
            className="label-tooltip"
            trigger="hover"
            title="在设置的时间范围内，隐匿时间抓拍占比=隐匿时间抓拍数/全部抓拍数。
          ">隐匿抓拍占比 <Icon type="bangzhu" />
          </Tooltip>}
      >
        <Slider
          min={0}
          max={100}
          value={formData.percentage * 100}
          showInput
          onChange={(v) => {
            setFormData({
              ...formData,
              percentage: (v as number) / 100,
            });
          }}
        />
      </Form.Item>
      <Form.Item colon={false} label={"车牌号码"}>
        <FormPlate
          isShowKeyboard
          isShowNoLimit={false}
          value={{
            plateNumber: formData.licensePlate,
            plateTypeId: formData.plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "licensePlate");
          }}
          getPopupContainer={() => document.getElementsByClassName('active-night-form')[0] as HTMLElement}
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
          isShowNoLimit={false}
          value={{
            plateNumber: formData.excludeLicensePlates[0].licensePlate,
            plateTypeId: formData.excludeLicensePlates[0].plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "excludeLicensePlate1");
          }}
          getPopupContainer={() => document.getElementsByClassName('active-night-form')[0] as HTMLElement}
        />
      </Form.Item>
      <Form.Item colon={false} label={"排除车牌2"}>
        <FormPlate
          isShowKeyboard
          isShowNoLimit={false}
          value={{
            plateNumber: formData.excludeLicensePlates[1].licensePlate,
            plateTypeId: formData.excludeLicensePlates[1].plateColorTypeId,
            noplate: formData.noplate as "noplate" | "",
          }}
          onChange={(value) => {
            handlePlateChange(value, "excludeLicensePlate2");
          }}
          getPopupContainer={() => document.getElementsByClassName('active-night-form')[0] as HTMLElement}
        />
      </Form.Item>
      <Form.Item colon={false} label={" "} style={{ marginLeft: "auto" }}>
        <Space size={10}>
          <Button disabled={loading} onClick={handleReset} type='default' className="reset-btn">重置</Button>
          <Button loading={loading} onClick={handleSearch} type="primary">
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default ActiveNightForm;
