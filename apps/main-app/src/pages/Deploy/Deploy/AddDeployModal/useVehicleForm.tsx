import React, { useState, useEffect } from "react";
import { validatePlate } from "@/utils";
import { BaseFormData, UseGenericForm } from ".";
import {
  Divider,
  Modal,
  Tabs,
  Message,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Table,
} from "@yisa/webui";
import {
  FormPlate,
  FormPlateNumber,
  FormVehicleModel,
  FormLabelSelect,
} from "@/components";
import { FormItemConfig } from "../../components/FormWrapper/interface";
import "./index.scss";
import {
  DeployTargetType,
  AlarmTypeTextSetting,
  AlarmType,
  ThresholdType,
  ThresholdTypeTextSetting,
} from "../../DeployDetail/interface";

import { useResetState } from "ahooks";
import featureData from "@/config/feature.json";
import { PlateTypeId } from "@/components/FormPlate/interface";
import { DeployBy } from "../interface";
import { useInitialContext } from "../InitialProvider";
import Deploy from "..";
export interface VehicleFormData extends BaseFormData {
  plateColorTypeId?: PlateTypeId; // 车牌颜色
  licensePlate?: string; // 单车牌
  licensePlateFileUrl?: string; // 批量
  batchCount?: number; // 批量个数
  vehicleTypeId?: number; // 车型: 轿车 SUV
  brandId?: string; // 品牌: 长安 比亚迪
  modelId?: string[]; // 型号: X1 X2
  yearId?: string[]; // 年份: 2023
  carInfo?: string;
  licenses?: {
    licensePlate: string;
    plateColorTypeId?: PlateTypeId;
  }[];
}
export const isVehicleForm = (
  form: BaseFormData | undefined
): form is VehicleFormData => {
  if (!form) return false;
  return form.type === DeployTargetType.Vehicle;
};
/**
 * @description 车辆布控
 * @param activeTab
 * @returns
 */
const useVehicleForm: UseGenericForm<VehicleFormData> = (
  // activeTab,
  defaultForm
) => {
  const initial = useInitialContext().value;
  const updateInitial = useInitialContext().updateInitial;

  const [form, setForm, reset] = useResetState<VehicleFormData>({
    type: DeployTargetType.Vehicle,
    deployBy: initial.labelType === "2" ? DeployBy.Label : DeployBy.Property,
    licensePlate: initial.licensePlate,
    plateColorTypeId: initial.plateColorTypeId as any,
    licensePlateFileUrl: "",
    batchCount: 0,
    vehicleTypeId: initial.vehicleTypeId, // 默认不限制
    brandId: initial.brandId,
    modelId: initial.modelId,
    yearId: initial.yearId,
    alarmTypes: [AlarmType.System],
    labelId: initial.labelType === "2" ? initial.labelList : [],
    remark: "",
    carInfo: "",
  });
  //由于跳转过来清空不了状态，需要修改context的来做到
  const clearState = () => {
    updateInitial?.({
      bigImage: "",
      featureList: [],
      labelList: [],
      labelType: undefined,
      activeModal: undefined,
      plateColorTypeId: 1,
      licensePlate: "",
      brandId: "",
      modelId: [],
      yearId: [],
      vehicleTypeId: -1,
    })
  }
  const activeTab = form.deployBy;
  // console.log(form)
  /* 同步 */
  useEffect(() => {
    if (isVehicleForm(defaultForm)) {
      setForm({ ...defaultForm });
    }
    console.log(defaultForm)
  }, [defaultForm]);

  /* 校验属性布控必选项 */
  const validatePropertyRequired = (form: VehicleFormData) => {
    const plate = form.licensePlate;
    const brandId = form.brandId;
    const vehicleTypeId = form.vehicleTypeId;
    const fields = [
      !plate || plate.length <= 0,
      !brandId || brandId.length <= 0,
      vehicleTypeId == -1,
    ];

    if (fields.every((field) => field)) {
      return "车牌号、车辆类别、品牌型号至少选择一项";
    }
    return "";
  };

  const formItems: FormItemConfig<VehicleFormData>[] = [
    {
      /* 单车牌号 */
      key: 1,
      show: activeTab === DeployBy.Property,
      name: "licensePlate",
      label: "车牌号",
      required: true,
      element: (
        <FormPlate
          // accurate
          isShowKeyboard
          isShowNoLimit={false}
          province={window.YISACONF.province || ""}
          value={{
            plateNumber: form.licensePlate || "",
            plateTypeId: form.plateColorTypeId || 1,
            noplate: "",
          }}
          onChange={(v) => {
            setForm((form) => {
              return {
                ...form,
                licensePlate: v.plateNumber,
                plateColorTypeId: v.plateTypeId,
              };
            });
            // console.log(v);
          }}
          remind='提示:请输入准确车牌号(如:鲁A12345)或模糊车牌号码。模糊搜索时可用"*"代替任意位数，"?"代替一位数(如:京*45，京A?34?5)。'
        />
      ),
      validate(form) {
        // const plate = form.licensePlate;
        // const brandId = form.brandId;
        // const vehicleTypeId = form.vehicleTypeId;
        // const fields = [
        //   !plate || plate.length <= 0,
        //   !brandId || brandId.length <= 0,
        //   vehicleTypeId == -1,
        // ];

        // if (fields.every((field) => field)) {
        //   return "车牌号、车辆类别、品牌型号至少选择一项";
        // }


        // 2024-3-22需求修改：车牌号码必填，支持模糊车牌布控，不可布控本地区域的车牌（即车牌号码前2位）
        if (!form.licensePlate) {
          return "请输入车牌号码，支持模糊车牌布控"
        }
        if (form.licensePlate.length <= 2) {
          if ((window.YISACONF.province_plate ?? []).includes(form.licensePlate)) {
            return "不可布控本地区域的车牌"
          }
        } else {
          if (!validatePlate(form.licensePlate || "")) {
            return "请输入正确格式的车牌号码";
          }
        }

        return "";
      },
    },
    {
      /* 批量车牌号 */
      key: 2,
      show: activeTab === DeployBy.Batch,
      label: "车牌号",
      name: "licensePlateFileUrl",
      required: true,
      element: (
        <FormPlateNumber
          className="batch"
          formItemProps={{
            required: true,
          }}
          params={{
            type: "batch",
            licensePlateFile: form.licensePlateFileUrl,
            successNum: form.batchCount,
          }}
          onChange={(v) => {
            setForm({
              ...form,
              licensePlateFileUrl: v.licensePlateFile,
              batchCount: v.successNum,
            });
          }}
          showSwitch={false}
          address="/v1/monitor/upload-license-vehicle"
        />
      ),
      validate(form) {
        const uploadedFileUrl = form.licensePlateFileUrl;
        if (!uploadedFileUrl || uploadedFileUrl.length <= 0) {
          return "请上传车牌号";
        }
        return "";
      },
    },
    {
      key: 4,
      show: activeTab === DeployBy.Property,
      label: "品牌型号",
      name: "brandId",
      // required: true,
      element: (
        <FormVehicleModel
          getTriggerContainer={() =>
            document.querySelector(".add-deploy-modal .layout") as HTMLElement
          }
          formItemProps={{}}
          onChange={(value) => {
            const extra = value.extra;
            console.log(extra);

            const brandText = extra.brandData?.v;
            const modelText = extra?.modelData?.map((i: any) => i?.v);
            const yearText = extra?.yearData?.map((i: any) => i?.v);
            const renderText = [brandText, ...modelText, ...yearText].join("/");
            setForm({
              ...form,
              brandId: value.brandValue,
              modelId: value.modelValue,
              yearId: value.yearValue,
              carInfo: renderText,
            });
          }}
          brandValue={form.brandId}
          modelValue={form.modelId}
          yearValue={form.yearId}
        />
      ),
      // validate: validatePropertyRequired,
    },
    {
      key: 3,
      show: activeTab === DeployBy.Property,
      label: "车辆类别",
      name: "vehicleTypeId",
      // required: true,
      element: (
        <Select
          defaultValue={
            featureData["car"]["vehicleTypeId"]["value"][0]["value"]
          }
          options={featureData["car"]["vehicleTypeId"]["value"].map((item) => ({
            label: item.text,
            value: item.value,
          }))}
          showSearch={true}
          // mode="multiple"
          maxTagCount={1}
          value={form.vehicleTypeId}
          onChange={(val) => {
            console.log("车辆类别", val);
            setForm((form) => {
              return {
                ...form,
                vehicleTypeId: val as number,
              };
            });
          }}
        />
      ),
      // validate: validatePropertyRequired,
    },
    {
      key: 5,
      show: activeTab === DeployBy.Label,
      label: "标签",
      required: true,
      name: "labelId",
      element: (
        <FormLabelSelect
          multiple
          labelTypeId="vehicle"
          canDeploy
          maxTagCount={1}
          value={form.labelId as string[]}
          onChange={(value) => setForm({ ...form, labelId: value as string[] })}
        />
      ),
      validate(form) {
        const labels = form.labelId;
        if (!labels || labels.length <= 0) {
          return "请选择车辆标签";
        }
        return "";
      },
    },
    {
      key: 6,
      label: "预警方式",
      element: (
        <Checkbox.Group
          options={Object.entries(AlarmTypeTextSetting).map(
            ([name, textSetting]) => {
              return {
                label: textSetting.text,
                value: AlarmType[name],
                disabled: name === "System",
              };
            }
          )}
          value={form.alarmTypes}
          onChange={(v) => {
            setForm({ ...form, alarmTypes: v as AlarmType[] });
          }}
        />
      ),
    },
    {
      key: 7,
      label: "备注",
      element: (
        <Input.TextArea
          maxLength={20}
          showWordLimit
          style={{ minHeight: 64 }}
          autoSize={{ minRows: 4 }}
          value={form.remark}
          onChange={(e, v) => {
            setForm((form) => {
              return {
                ...form,
                remark: v,
              };
            });
          }}
        />
      ),
    },
  ];
  /* 需要校验的字段, formItems要设置相应的name */
  let validateFields: (keyof VehicleFormData)[];
  switch (form.deployBy) {
    case DeployBy.Property:
      validateFields = ["licensePlate", "vehicleTypeId", "brandId"];
      break;
    case DeployBy.Batch:
      validateFields = ["licensePlateFileUrl"];
      break;
    case DeployBy.Label:
      validateFields = ["labelId"];
      break;
  }
  return [form, setForm, formItems, reset, validateFields, clearState];
};
export default useVehicleForm;
