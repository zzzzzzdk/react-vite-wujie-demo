import React, { useEffect, useRef, useState } from "react";
import { Input, Select, Checkbox } from "@yisa/webui";
import { ImgUpload } from "@/components";
import { FormItemConfig } from "../../components/FormWrapper/interface";
import {
  AlarmTypeTextSetting,
  AlarmType,
  DeployTargetType,
} from "../../DeployDetail/interface";
import { useResetState } from "ahooks";

import { BaseFormData, UseGenericForm } from ".";
import { TargetFeatureItem, TargetType } from "@/config/CommonType";

import "./index.scss";
import { DeployBy } from "../interface";
import { useInitialContext } from "../InitialProvider";
import { RefImgUploadType } from "@/components/ImgUpload/interface";
import { rest } from "lodash";
import { useEditableContext } from "../EditableProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SysConfigItem } from "@/store/slices/user";

type ThresholdField = `${TargetFeatureItem["targetType"]}Threshold`;
export type TargetType2Anything<T> = Partial<Record<ThresholdField, T>>;

const TargetTypeNames: TargetType2Anything<string> = {
  bicycleThreshold: "二轮车",
  faceThreshold: "人脸",
  pedestrianThreshold: "人体",
  tricycleThreshold: "三轮车",
  vehicleThreshold: "汽车",
};

export interface PictureFormData extends BaseFormData {
  type: DeployTargetType.Picture;
  featureList: TargetFeatureItem[];
  thresholds: TargetType2Anything<number>;
}

export const isPictureForm = (
  form: BaseFormData | undefined
): form is PictureFormData => {
  if (!form) return false;
  return form.type === DeployTargetType.Picture;
};
const usePictureForm: UseGenericForm<PictureFormData> = (
  // activeTab,
  editForm
) => {
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig
  )["deploy"];
  const pdmConfig = Object.assign(
    {
      faceThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
      bicycleThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
      pedestrianThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
      tricycleThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
      vehicleThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
    },
    pdmRaw
  );

  const editable = useEditableContext();
  const initial = useInitialContext().value;
  console.log('initial', initial)
  const imgUploadRef = useRef<RefImgUploadType>(null);
  const bigImagehasOpend = useRef(false);
  /* 打开大图 */
  useEffect(() => {
    if (initial.bigImage && !bigImagehasOpend.current) {
      if (imgUploadRef.current) {
        imgUploadRef.current.handleAutoUpload?.({
          bigImage: initial.bigImage,
        });
        bigImagehasOpend.current = true;
      }
    }

  });
  if (initial.featureList && initial.featureList.length) {
    const newThresholds = {};
    initial.featureList.forEach((feature) => {
      const field: ThresholdField = `${feature.targetType}Threshold`;
      newThresholds[field] = Number(pdmConfig[field].default); // 初始值
    });
    initial.thresholds = newThresholds
  }

  const [form, setForm, reset] = useResetState<PictureFormData>({
    type: DeployTargetType.Picture,
    deployBy: DeployBy.Property,
    alarmTypes: [AlarmType.System],
    featureList: initial.featureList,
    thresholds: initial.thresholds || {},
    remark: "",
  });

  /* 同步 */
  useEffect(() => {
    if (isPictureForm(editForm)) {
      console.log('editForm', editForm)
      setForm(editForm);
    }
  }, [editForm]);
  /* 判断需要显示哪些阈值输入框/文本 */
  const thresholds = Object.entries(form.thresholds).map(([type, value]) => {
    return [type, TargetTypeNames[type]];
  }) as Array<[ThresholdField, string]>;

  /* 更新阈值  */
  const handleThresholdChange = (targetType: ThresholdField, value: number) => {
    setForm((form) => {
      return {
        ...form,
        thresholds: {
          ...form.thresholds,
          [targetType]: value,
        },
      };
    });
  };
  /* 表单组件 */
  const formItems: FormItemConfig<PictureFormData>[] = [
    {
      key: 1,
      element: (
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          请上传人脸图片目标，进行布控比对:
        </p>
      ),
    },
    {
      key: 2,
      name: "featureList",
      label: "上传图片",
      element: (
        <ImgUpload
          ref={imgUploadRef}
          multiple={true}
          showConfirmBtn={false}
          limit={5}
          onChange={(featureList) => {
            // console.log(featureList)
            /*特征变化的时候，thresholds要同步变化*/
            const newThresholds = {};
            featureList.forEach((feature) => {
              const field: ThresholdField = `${feature.targetType}Threshold`;
              newThresholds[field] = form.thresholds[field] || Number(pdmConfig[field].default); // 初始值
            });
            setForm((form) => ({
              ...form,
              featureList: featureList,
              thresholds: newThresholds,
            }));
          }}
          featureList={form.featureList}
          formData={{
            analysisType: 'face' // 人脸布控，只能布控人脸
          }}
          uploadHistoryType="face"
        />
      ),
      validate(form) {
        if (form.featureList.length <= 0) {
          return "请上传人脸图片目标，进行布控比对";
        }
        return "";
      },
    },
    {
      key: 3,
      show: form.featureList.length > 0,
      label: "阈值设置",
      element: (
        <div className="threshold">
          {thresholds.map((item) => {
            const [targetType, text] = item;
            return (
              <React.Fragment key={targetType}>
                {`${text}抓拍`}
                <Input.InputNumber
                  disabled={!editable}
                  min={Number(pdmConfig[targetType].min)}
                  max={Number(pdmConfig[targetType].max)}
                  addAfter="%"
                  value={form.thresholds[targetType]}
                  onChange={(value) =>
                    handleThresholdChange(targetType, value!)
                  }
                />
              </React.Fragment>
            );
          })}
        </div>
      ),
    },
    {
      key: 4,
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
      key: 5,
      label: "备注",
      element: (
        <Input.TextArea
          maxLength={20}
          showWordLimit
          style={{ minHeight: 64 }}
          autoSize={{ minRows: 4 }}
          value={form.remark}
          onChange={(e) => {
            setForm({
              ...form,
              remark: e.target.value,
            });
          }}
        />
      ),
    },
  ];

  /* 需要校验的字段, formItems要设置相应的name */
  const validateFields: (keyof PictureFormData)[] = ["featureList"];
  return [
    form,
    setForm,
    formItems,
    () => {
      reset();
      setForm((f) => ({ ...f, featureList: [] }));
    },
    validateFields,
  ];
};
export default usePictureForm;
