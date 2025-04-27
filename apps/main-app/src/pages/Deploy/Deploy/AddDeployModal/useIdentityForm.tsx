import React, { useState, useEffect } from "react";
import { BaseFormData, UseGenericForm } from ".";
import { useResetState } from "ahooks";
import {
  Form,
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
import { FormIdNumber, FormLabelSelect } from "@/components";
import { FormItemConfig } from "../../components/FormWrapper/interface";
import "./index.scss";
import {
  DeployTargetType,
  AlarmTypeTextSetting,
  AlarmType,
} from "../../DeployDetail/interface";

import PersonProfile from "./Profile";
import { TargetFeatureItem } from "@/config/CommonType";
import { DeployBy } from "../interface";
import { useInitialContext } from "../InitialProvider";
import { regular } from "@/utils";
import services from "@/services";
import { useEditableContext } from "../EditableProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SysConfigItem } from "@/store/slices/user";
export type Profile = {
  license?: string;
  personName?: string;
  tags?: string[];
  featureList?: TargetFeatureItem[];
};
export interface IdentityFormData extends BaseFormData {
  type: DeployTargetType.Identity; // 布控目标类型
  license?: string; // 身份证
  personName?: string; // 名字
  personAge?: string; // 年龄
  featureList: TargetFeatureItem[]; // 布控人像
  licenseFileUrl?: string; // 批量证件号上传地址
  batchCount?: number; // 批量导入的数量
  licenses?: {
    personName?: string;
    license?: string; // 身份证
  }[]; // 批量证件号/车牌号
  thresholds?: Partial<{
    dynSysThreshold: number; // 动态抓拍系统预警阈值
    dynSmsThreshold: number; // 动态抓拍短信预警阈值
    dynAppThreshold: number; // 动态抓拍APP预警阈值
    driSysThreshold: number; // 驾乘抓拍系统预警阈值
    driSmsThreshold: number; // 驾乘抓拍短信预警阈值
    driAppThreshold: number; // 驾乘抓拍App预警阈值
  }>;
}


const isIdentityForm = (
  form: BaseFormData | undefined
): form is IdentityFormData => {
  if (!form) return false;
  return form.type === DeployTargetType.Identity;
};

/**
 * @description 证件号码布控
 * @param activeTab
 * @returns
 */
const useIdentityForm: UseGenericForm<IdentityFormData> = (
  // activeTab,
  defaultForm
) => {
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig
  )["deploy"];
  const pdmConfig = Object.assign(
    {
      // 人脸动态
      faceThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
      // 人脸驾乘
      driverThreshold: {
        min: "60",
        default: "80",
        max: "100",
      },
    },
    pdmRaw
  );
  const editable = useEditableContext();
  const initial = useInitialContext().value;
  const [form, setForm, resetForm] = useResetState<IdentityFormData>({
    type: DeployTargetType.Identity,

    deployBy: initial.labelType === "1" ? DeployBy.Label : DeployBy.Property,
    license: "",
    featureList: [],

    alarmTypes: [AlarmType.System],
    thresholds: {
      driSysThreshold: Number(pdmConfig.driverThreshold.default),
      dynSysThreshold: Number(pdmConfig.faceThreshold.default),
    },
    remark: "",
    labelId: initial.labelType === "1" ? initial.labelList : [],
  });

  const [profile, setProfile, resetProfile] = useResetState<Profile>({
    license: "",
    personName: "",
    featureList: [],
  });

  const activeTab = form.deployBy;
  /* 同步 */
  useEffect(() => {
    if (isIdentityForm(defaultForm)) {
      setForm(defaultForm);
      setProfile({
        license: defaultForm.license || "",
        personName: defaultForm.personName || "",
        featureList: defaultForm.featureList || [],
      });
    }
  }, [defaultForm]);
  /*=========================================thresholds阈值设置逻辑============================= */
  /**
   * @description 获取字段名字
   * @param type
   * @param alarm
   * @returns
   */
  const getThresholdName = (type: "dri" | "dyn", alarm: AlarmType) => {
    switch (alarm) {
      case AlarmType.System: {
        return `${type}SysThreshold`;
      }
      case AlarmType.APP: {
        return `${type}AppThreshold`;
      }
      case AlarmType.Message: {
        return `${type}SmsThreshold`;
      }
    }
  };
  /**
   * @description
   * @param type 动态抓拍还是驾乘抓拍
   * @param alarm system app message相应的value
   */
  const handleThresholdChange = (field: string, value?: number) => {
    if (!value) {
      return;
    }

    setForm((form) => {
      return {
        ...form,
        thresholds: {
          ...form.thresholds,
          [field]: value,
        },
      };
    });
  };
  /**
   * @description 只有勾选才允许输入，取消勾选将相应的字段删除
   */
  const handleAlarmCheck = (field: string, checked: boolean) => {
    const newThresholds = { ...form.thresholds };
    if (checked) {
      newThresholds[field] = field.includes("dri")
        ? Number(pdmConfig.driverThreshold.default)
        : Number(pdmConfig.faceThreshold.default); // TODO获取PDM最小值or默认值
    } else {
      delete newThresholds[field];
    }
    setForm((form) => {
      return {
        ...form,
        thresholds: newThresholds,
      };
    });
  };
  const handleClick = () => {
    if (!regular.isIdcard.test(form.license || "")) {
      Message.warning("请输入正确证件号码");
      return;
    }
    services.deploy
      .getPersonProfile<
        { license: string },
        {
          license: string;
          personName: string;
          featureList: {
            targetImage: string;
            feature: string;
          }[];
        }
      >({
        license: form.license || "",
      })
      .then((res) => {
        if (res.data) {
          const data = res.data;
          if (data.license.length <= 0) {
            Message.warning(res.message || "查无此人");
            return;
          }
          setProfile({
            license: res.data.license,
            personName: res.data.personName,
            featureList: res.data.featureList.map((p, idx) => {
              return {
                infoId: String(idx),
                feature: p.feature,
                targetImage: p.targetImage,
              } as TargetFeatureItem;
            }),
          });
          resetForm();
          setForm((f) => ({
            ...f,
            formId: form.formId,
            itemId: form.itemId,
            license: res.data?.license || "",
            personName: res.data?.personName || "",
          }));
        } else {
          throw new Error("res.data格式有误");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const formItems: FormItemConfig<IdentityFormData>[] = [
    {
      key: 1,
      name: "license",
      show: activeTab === DeployBy.Property,
      label: "证件号码",
      required: true,
      element: (
        <div className="license-wrap">
          <Input
            disabled={!editable}
            maxLength={18}
            value={form.license}
            onChange={(e) => {
              setForm((form) => ({ ...form, license: e.target.value }));
            }}
          />
          <Button
            disabled={!editable}
            className="id-number-btn"
            type="primary"
            onClick={handleClick}
          >
            确认添加
          </Button>
        </div>
      ),
      validate(form) {
        const personId = form.license;
        if (!personId || personId.length <= 0) {
          return "请输入证件号码";
        }
        if (!regular.isIdcard.test(form.license || "")) {
          return "请输入正确证件号码";
        }
        if (!profile.license) {
          return "请添加布控人像";
        }
        return "";
      },
    },
    {
      key: 2,
      show: activeTab === DeployBy.Batch,
      label: "证件号码",
      required: true,
      name: "licenseFileUrl",
      element: (
        <FormIdNumber
          showSwitch={false}
          value={{
            uploadedFileURL: form.licenseFileUrl,
            batchCount: form.batchCount,
          }}
          onChange={(val) => {
            console.log("批量导入id", val);
            setForm((form) => {
              return {
                ...form,
                licenseFileUrl: val.uploadedFileURL,
                batchCount: val.batchCount,
              };
            });
          }}
        />
      ),

      validate(form) {
        const uploadedFileUrl = form.licenseFileUrl;
        if (!uploadedFileUrl || uploadedFileUrl.length <= 0) {
          return "请上传证件号码";
        }
        return "";
      },
    },
    {
      /* 标签 */
      key: 3,
      show: activeTab === DeployBy.Label,
      name: "labelId",
      label: "标签",
      required: true,
      element: (
        <FormLabelSelect
          multiple
          labelTypeId="personnel"
          canDeploy
          maxTagCount={1}
          value={form.labelId as string[]}
          onChange={(value) => setForm({ ...form, labelId: value as string[] })}
        />
      ),
      validate(form) {
        const labels = form.labelId;
        if (!labels || labels.length <= 0) {
          return "请选择人员标签";
        }
        return "";
      },
    },
    {
      key: 4,
      name: "featureList",
      show: !!profile.license && activeTab === DeployBy.Property,
      label: "布控人像",
      element: (
        <PersonProfile
          profile={profile}
          selected={form.featureList}
          onSelectedChange={(selected) => {
            setForm((form) => {
              return {
                ...form,
                featureList: selected,
              };
            });
          }}
          onDelete={() => {
            resetProfile();
            resetForm();
          }}
        />
      ),
      validate(form) {
        if (form.featureList.length <= 0) {
          return "请选择人员图片";
        }
        return "";
      },
    },
    {
      key: 5,
      /* 批量导入*/
      // show: activeTab !== DeployBy.Label,
      label: "预警方式",
      element: (
        <Table
          className="warning"
          data={[
            {
              key: "123455",
            },
          ]}
          columns={[
            {
              title: "动态抓拍阈值",
              render() {
                return (
                  <div className="group">
                    {Object.entries(AlarmTypeTextSetting).map(
                      ([name, textSetting]) => {
                        const fieldName = getThresholdName(
                          "dyn",
                          AlarmType[name]
                        );
                        return (
                          <div key={name} className="method">
                            <Checkbox
                              className="checkbox"
                              disabled={!editable || fieldName.includes("Sys")}
                              checked={form.thresholds?.[fieldName]}
                              onChange={(e) =>
                                handleAlarmCheck(fieldName, e.target.checked)
                              }
                            >
                              {textSetting.text}
                            </Checkbox>
                            <Input.InputNumber
                              className="input"
                              addAfter="%"
                              min={Number(pdmConfig["faceThreshold"].min)}
                              max={Number(pdmConfig["faceThreshold"].max)}
                              disabled={
                                !Boolean(form.thresholds?.[fieldName]) ||
                                !editable
                              }
                              value={form.thresholds?.[fieldName]}
                              onChange={(v) =>
                                handleThresholdChange(fieldName, v)
                              }
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              },
            },
            {
              title: "驾乘抓拍阈值",
              render() {
                return (
                  <div className="group">
                    {Object.entries(AlarmTypeTextSetting).map(
                      ([name, textSetting]) => {
                        const fieldName = getThresholdName(
                          "dri",
                          AlarmType[name]
                        );
                        return (
                          <div key={name} className="method">
                            <Checkbox
                              className="checkbox"
                              disabled={!editable || fieldName.includes("Sys")}
                              checked={form.thresholds?.[fieldName]}
                              onChange={(e) =>
                                handleAlarmCheck(fieldName, e.target.checked)
                              }
                            >
                              {textSetting.text}
                            </Checkbox>
                            <Input.InputNumber
                              className="input"
                              addAfter="%"
                              min={Number(pdmConfig["driverThreshold"].min)}
                              max={Number(pdmConfig["driverThreshold"].max)}
                              disabled={
                                !Boolean(form.thresholds?.[fieldName]) ||
                                !editable
                              }
                              value={form.thresholds?.[fieldName]}
                              onChange={(v) =>
                                handleThresholdChange(fieldName, v)
                              }
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      ),
    },
    {
      key: 6,
      show: false,
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
  let validateFields: (keyof IdentityFormData)[];
  switch (form.deployBy) {
    case DeployBy.Property:
      validateFields = ["license", "featureList"];
      break;
    case DeployBy.Batch:
      validateFields = ["licenseFileUrl"];
      break;
    case DeployBy.Label:
      validateFields = ["labelId"];
      break;
  }
  return [
    form,
    setForm,
    formItems,
    () => {
      resetForm();
      resetProfile();
    },
    validateFields,
  ];
};
export default useIdentityForm;
