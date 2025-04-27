import React, { useEffect, useState } from "react";
import {
  Button,
  Message,
  Form,
  Space,
  Input,
  Select,
  Tooltip,
  TreeSelect
} from "@yisa/webui";
import {
  TimeRangePicker,
  LocationMapList,
  FormPlate,
  FormVehicleModel,
  FormInputGroup
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
import { LabelManageFormData, ResultLabelItem, SelectDataType, LabelManageFormProps } from "./interface";
import { Icon } from "@yisa/webui/es/Icon";
import "./index.scss";
import { SysConfigItem } from "@/store/slices/user";
import useVehicleSearchParams from "../../../VehicleAnalysis/ActiveNight/useVechileSearchParams";
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


const LabelManageForm: React.FC<LabelManageFormProps> = (props) => {
  const { selectData } = props
  const prefixCls = "Label-manage";
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig as any
  )[prefixCls];
  const pdmConfig = Object.assign(pdmFallback, pdmRaw);
  const [formData, setFormData, resetFormData] = useResetState<LabelManageFormData>(
    Object.assign(
      {
        timeType: "time",
        // beginDate: dayjs()
        //   .subtract(Number(pdmConfig.timeRange?.default) - 1, "days")
        //   .startOf("day")
        //   .format("YYYY-MM-DD HH:mm:ss"),
        // endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        beginDate: "",
        endDate: "",
        beginTime: "",
        endTime: "",
        labelSetIds: [],
        labelIds: [],
        remarks: '',
        creatorIds: [],
        creatorDepartIds: [],
        labelTypeIds: [],
        labelCount: [],
        updateTime: '',
      } as LabelManageFormData,
    )
  );

  // 获取token
  const [searchParams, _] = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      props.onSearch(formFormat(formData))
    } else {
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
          props.onSearch(formFormat({
            ...formData,
            ...data
          }))
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => { });
    }
  }, []);

  //格式化请求参数
  const formFormat = (form: LabelManageFormData) => {
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
    // console.log({ diff }, pdmConfig.timeRange.max);
    if (diff > Number(pdmConfig.timeRange.max)) {
      Message.warning(`时间范围不能超过${pdmConfig.timeRange.max}天`);
      return;
    }

    props.onSearch(formFormat(formData));
  };
  /* ========================表单onChange begin================================================= */

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

  const handleFormSelectChange = (
    value: SelectCommonProps["value"],
    fieldName: string
  ) => {
    let newValue = value;
    console.log(newValue)
    setFormData({
      ...formData,
      [fieldName]: newValue,
    });
  };

  const handleChangeInputGroup = (value: { min: string | number, max: string | number }, type: string) => {
    setFormData({
      ...formData,
      [type]: [(value.min || value.min == 0) ? value.min : '', (value.max || value.max == 0) ? value.max : '']
    })
  }

  // 重置
  const handleReset = () => {
    resetFormData()
  }

  return (
    <Form layout="vertical" colon={false}>
      <Form.Item label="标签集" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          options={selectData?.labelSet}
          onChange={(value) => handleFormSelectChange(value, "labelSetIds")}
          value={formData.labelSetIds}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label="标签名称" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          options={selectData?.labelName}
          onChange={(value) => handleFormSelectChange(value, "labelIds")}
          value={formData.labelIds}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item className="passingCount" label="备注">
        <Input
          value={formData.remarks}
          placeholder="请输入"
          onChange={(e) => {
            setFormData({ ...formData, remarks: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="创建人" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          options={selectData?.creator}
          onChange={(value) => handleFormSelectChange(value, "creatorIds")}
          value={formData.creatorIds}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label="所属部门" className="vehicle-form-item" colon={false}>
        {/* <Select
          allowClear
          options={selectData?.creatorDepart}
          onChange={(value) => handleFormSelectChange(value, "creatorDepartIds")}
          value={formData.creatorDepartIds}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        /> */}
        <TreeSelect
          multiple
          treeCheckable
          maxTagCount={1}
          placeholder="请选择"
          treeData={(selectData?.creatorDepart || []) as any}
          showSearch={true}
          fieldNames={{
            key: "value",
            title: 'label',
            children: 'children'
          }}
          treeCheckedStrategy={TreeSelect.SHOW_CHILD}
          onChange={(value) => handleFormSelectChange(value, 'creatorDepartIds')}
          value={formData.creatorDepartIds}
        />
      </Form.Item>
      <Form.Item label="标签类型" className="vehicle-form-item" colon={false}>
        <Select
          allowClear
          options={selectData?.labelType}
          onChange={(value) => handleFormSelectChange(value, "labelTypeIds")}
          value={[...formData.labelTypeIds]}
          showSearch={true}
          mode="multiple"
          maxTagCount={1}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      </Form.Item>
      <Form.Item label="目标数"
        className="person-age input-group"
        colon={false}
      >
        <div className="age-box">
          <FormInputGroup
            defaultMin={0}
            // disabled={formData.minor}
            defaultValueMin={formData.labelCount && (formData.labelCount[0] || formData.labelCount[0] == '0') ? formData.labelCount[0] : ''}
            defaultValueMax={formData.labelCount && (formData.labelCount[1] || formData.labelCount[1] == '0') ? formData.labelCount[1] : ''}
            type="number"
            splitText=" - "
            onChange={(value: { min: string | number, max: string | number }) => {
              handleChangeInputGroup(value, 'labelCount')
            }}
          />
        </div>
      </Form.Item>
      <TimeRangePicker
        timeType={formData.timeType}
        formItemProps={{ label: "更新时间" }}
        beginDate={formData.beginDate}
        endDate={formData.endDate}
        beginTime={formData.beginTime}
        endTime={formData.endTime}
        onChange={handleDateChange}
      />
      <Form.Item colon={false} label={" "} style={{ marginLeft: "auto", marginRight: '8px' }}>
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

export default LabelManageForm;
