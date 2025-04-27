import React, { useEffect } from "react";

import { Icon } from "@yisa/webui/es/Icon";
import { Slider, Tooltip, Select, Button, Form, Input, Space } from "@yisa/webui";

import { LocationMapList, TimeRangePicker } from "@/components";

import services from "@/services";

import { useResetState } from "ahooks";
import "./index.scss";
import {
  BkType,
  BkTypeTextSetting,
  Measure,
  MeasureTextSetting,
} from "../DeployDetail/interface";
import dayjs from "dayjs";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import useTitleList from "../DeployDetail/useTitleList";
import { useParams, useSearchParams } from "react-router-dom";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { isInteger, isObject } from "lodash";
import { formatTimeFormToComponent } from "@/utils";
import dictionary from '@/config/character.config'

export interface DeployWarningFormData {
  jobId: number[]; //单号标题
  // bkType: BkType[]; // 布控类型
  alarmTarget?: string; // 告警目标
  /* 具体时间 */
  timeType: string;
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  timeRange?: any;
  /* 数据源 */
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
  fileId?: (string | number)[];
  /* 采取措施 */
  measure: Measure[];
  /* 相似度 */
  similarity: number;
}

type DeployWaringFormProps = {
  loading: boolean;
  onSubmit: (form: DeployWarningFormData) => void;
};

const DeployWarningForm: React.FC<DeployWaringFormProps> = (props) => {
  const { loading, onSubmit } = props;
  /* 表单 */
  const { jobId } = useParams();
  const titleList = useTitleList("all");
  const [formData, setFormData, resetFormData] = useResetState<DeployWarningFormData>({
    jobId: isInteger(parseInt(jobId!)) ? [parseInt(jobId!)] : [],
    // bkType: [BkType.All],
    alarmTarget: "",
    timeType: "time",
    beginDate: dayjs()
      // .subtract(29, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    // beginDate: "",
    // endDate: "",
    beginTime: "",
    endTime: "",

    locationGroupIds: [],
    locationIds: [],
    offlineIds: [],

    measure: [Measure.Capature, Measure.Control, Measure.Concern],

    similarity: 85,
  });

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

  /* 对提交前的表单进行调整, 纯函数*/
  const beforeSubmit = (form: DeployWarningFormData) => {
    const newForm = { ...form };
    let timeRange = {};
    if (formData.timeType === "time") {
      timeRange = { times: [formData.beginDate, formData.endDate] };
    } else {
      timeRange = {
        periods: {
          dates: [formData.beginDate, formData.endDate],
          times: [formData.beginTime, formData.endTime],
        },
      };
    }
    // // 点位和任务ids
    // newForm["locationIds"] = [
    //   ...newForm.locationIds,
    //   ...newForm.locationGroupIds,
    // ];
    newForm["fileId"] = [...newForm.offlineIds];
    // 删减不必要的属性
    const delKeys = [
      "timeType",
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
      // "locationGroupIds",
      "offlineIds",
    ];
    delKeys.forEach((key) => delete newForm[key]);
    newForm["timeRange"] = timeRange;
    return newForm;
  };

  // 处理日期变化
  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType as any,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };
  // 数据源变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      offlineIds: data.offlineIds,
    });
  };
  const handleSubmit = (form: DeployWarningFormData) => {
    onSubmit(beforeSubmit(form));
  };
  /* 初始加载 */
  useEffect(() => {
    const token = searchParams.get("token");
    // 如果有token则不初始化请求
    if (token) return;
    handleSubmit(formData);
  }, []);
  return (
    <Form className="form" inline colon={false} layout="vertical">
      <Form.Item label="单号标题">
        <Select
          showSearch
          mode="multiple"
          maxTagCount={1}
          options={titleList.map((item) => ({
            label: `${item.jobId}-${item.title}`,
            value: item.jobId,
          }))}
          value={formData.jobId as number[]}
          onChange={(v) => {
            setFormData({
              ...formData,
              jobId: v as any,
            });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      {/* <Form.Item label="布控类型">
        <Select
          mode="multiple"
          maxTagCount={1}
          options={Object.entries(BkTypeTextSetting).map((item) => {
            const [name, textSetting] = item;
            return {
              label: textSetting.text,
              value: BkType[name],
            };
          })}
          value={formData.bkType}
          onChange={(v) => {
            const arr = v as BkType[];
            const newValue =
              arr[arr.length - 1] === BkType.All
                ? [-1]
                : arr.filter((item) => item !== BkType.All);
            setFormData({ ...formData, bkType: newValue });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item> */}
      <Form.Item
        label={
          <Tooltip
            className="label-tooltip"
            trigger="hover"
            title="模糊搜索：姓名、身份证号、车牌号、车辆类别、品牌-型号-年款任一值"
          >
            告警目标
            <Icon type="bangzhu" />
          </Tooltip>
        }
      >
        <Input
          placeholder="请输入"
          value={formData.alarmTarget}
          onChange={(e, v) => {
            setFormData({ ...formData, alarmTarget: v });
          }}
        />
      </Form.Item>
      <TimeRangePicker
        className="timer-picker"
        timeType={formData.timeType}
        beginDate={formData.beginDate}
        endDate={formData.endDate}
        beginTime={formData.beginTime}
        endTime={formData.endTime}
        onChange={handleDateChange}
        allowClear
      />
      <LocationMapList
        locationIds={formData.locationIds}
        locationGroupIds={formData.locationGroupIds}
        offlineIds={formData.offlineIds}
        onChange={handleLocationChange}
        tagTypes={dictionary.tagTypes.slice(0, 2)}
      />
      <Form.Item label="相似度范围">
        <Slider
          showInput
          value={formData.similarity}
          onChange={(v) => {
            setFormData({ ...formData, similarity: v as number });
          }}
        />
      </Form.Item>
      <Form.Item label="采取措施">
        <Select
          mode="multiple"
          maxTagCount={1}
          options={Object.entries(MeasureTextSetting).map((item) => {
            const [name, textSetting] = item;
            return {
              label: textSetting.text,
              value: Measure[name],
            };
          })}
          value={formData.measure}
          onChange={(v) => {
            setFormData({
              ...formData,
              measure: v as Measure[],
            });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label=" " className="search-btn">
        <Space size={10}>
          <Button disabled={loading} onClick={() => { resetFormData() }} type='default' className="reset-btn">重置</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              handleSubmit(formData);
            }}
          >
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DeployWarningForm;
