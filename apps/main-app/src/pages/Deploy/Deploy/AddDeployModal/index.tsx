import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Message, Divider, Modal, Button, Radio } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { RawLabelTreeNode } from "@/components/FormLabelSelect";

import { FormItemConfig } from "../../components/FormWrapper/interface";
import {
  DeployTargetTextSetting,
  DeployTargetType,
  AlarmType,
} from "../../DeployDetail/interface";
import FormWrapper from "../../components/FormWrapper";

import useIdentityForm from "./useIdentityForm";
import useVehicleForm from "./useVehicleForm";
import usePictureForm from "./usePictureForm";
import { DeployBy, MonitorType } from "../interface";

import "./index.scss";
import { useEditableContext } from "../EditableProvider";
/**
 * 接口, 所有布控类型：车辆 证件号 标签都要实现这个接口
 * @param activeTab: 当前时属性布控/批量布控/标签布控
 * @return [form, formItems, reset] form表示表单状态，formItems是相应的jsx, reset重置表单
 */
export type UseGenericForm<T> = (
  // activeTab: DeployBy,
  form?: BaseFormData
) => [
    form: T,
    setForm: React.Dispatch<React.SetStateAction<T>>,
    formItems: FormItemConfig<T>[],
    reset: () => void,
    validateFields?: string[],
    clearState?: () => void
  ];
export interface BaseFormData {
  type: DeployTargetType; // 车辆布控 证件号布控 人脸布控
  deployBy: DeployBy; // 标签布控 属性布控 批量布控
  monitorType?: MonitorType; // type * deployBy

  alarmTypes?: AlarmType[]; // 告警类型 System APP message
  remark?: string; // 备注
  itemId?: string | number; // 唯一标识
  formId?: string | number; // 仅前端使用，用于修改表单
  operation?: "create" | "update" | "delete"; // 仅提交布控使用（修改更新）

  batchCount?: number; // 仅前端使用, 批量个数
  licenses?: any[]; // 批量证件号/车牌号
  labelInfos?: RawLabelTreeNode[];
  labelId?: (number | string)[];
  // 抓拍信息 布控单详情用
  captureTime?: string; // 布控单详情中使用
  locationId?: string; // 同上
  locationName?: string; // 同上
  targetImage?: string; // 同上
  lngLat?: {
    lng: string;
    lat: string;
  };
}

export type AddDeployModalType = keyof typeof DeployTargetType;

type AddDeployModalProps = {
  deployTargetType?: AddDeployModalType; // 车辆布控、证件号布控、人脸布控
  defaultForm?: BaseFormData; // 默认数据， 表单修改时设置
  close: (...args: any[]) => void; // 如何关闭弹窗
  onSuccess: (form: BaseFormData) => void; // 点击保存时的回调
};
const prefixCls = "add-deploy-modal";
export type EditFormRef = {
  haveUnSaved: () => boolean;
};
function AddDeployModal(
  props: AddDeployModalProps,
  ref: React.Ref<EditFormRef>
) {
  const editable = useEditableContext();
  const { deployTargetType, close, onSuccess, defaultForm } = props;
  const options: { value: DeployBy; label: string }[] = [
    {
      value: DeployBy.Property,
      label: "属性布控",
    },
    {
      value: DeployBy.Batch,
      label: "批量布控",
    },
  ];
  if (deployTargetType === 'Identity' || deployTargetType === 'Vehicle') {
    options.push({
      value: DeployBy.Label,
      label: "标签布控",
    })
  }
  const forms = {
    Vehicle: useVehicleForm(defaultForm),
    Identity: useIdentityForm(defaultForm),
    Picture: usePictureForm(defaultForm),
  };

  useImperativeHandle(
    ref,
    () => {
      const haveUnSaved = () => {
        const allForms = [forms.Identity, forms.Picture, forms.Vehicle];

        return allForms.some((item) => {
          const [form, _, formItems, __, validate] = item;

          const formItemsCopy = [...formItems]
          // 需要校验的字段
          const needValidateFormItems = formItemsCopy.filter((item: any) =>
          
            validate?.includes(item.name as any)
          );
          return needValidateFormItems.some((item: any) => {
            if (!item.validate) return true;
            return item.validate(form as any) === "";
          });
        });
      };

      return {
        haveUnSaved,
      };
    },
    [forms]
  );

  // 准备激活的tab
  const preActiveTabRef = useRef<DeployBy>(DeployBy.Property);
  // 显示切换tab警告
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
  // 校验
  const [validateFields, setValidateFields] = useState<string[] | undefined>(
    []
  );

  if (!deployTargetType) {
    return null;
  }

  const [form, setForm, formItems, reset, validate, clearState] = forms[
    deployTargetType
  ] as ReturnType<UseGenericForm<BaseFormData>>;

  const activeTab = form.deployBy;

  const handleOk = () => {
    if (
      formItems
        .filter((item) => item.name && (item.show ?? true))
        .some((item) => {
          const msg = item.validate?.(form);
          return !!msg;
        })
    ) {
      setValidateFields(validate);
      Message.warning("请正确填写表单");
      return;
    }
    /**
     * deployBy, 表示以属性/标签/批量
     * formID, 唯一标识
     */
    onSuccess({
      ...form,
      formId: form.formId ?? Math.random().toString(),
      /* TODO：放到deploy统一更新 */
      /* 判断是否有form.itemId， 有的话一定是后端返回的 */
      operation: form.itemId ? "update" : "create",
    });
    /* 关闭 */
    close();
    /* 重置表单 */
    reset();
    setValidateFields([]);
  };

  const handleCancle = () => {
    setValidateFields([]);
    setShowTabSwitchWarning(false);
    close(); // 关闭弹窗
    if (defaultForm) {
      /* 如果defalutForm存在，必定是对已经保存的布控目标进行修改
      ，因此关闭弹窗时将相应表单清空*/
      reset();
    }
  };

  return (
    <>
      <Modal
        className={prefixCls}
        width="760px"
        title={DeployTargetTextSetting[deployTargetType].text}
        visible
        okText="保存"
        okButtonProps={{
          disabled: !editable,
        }}
        onCancel={handleCancle}
        onOk={handleOk}
      >
        <div className="layout">
          <header>
            {/* 人脸布控没有属性/批量/标签之分 */}
            {deployTargetType !== "Picture" && (
              // 为什么没用Tabs: 编写时，Tabs组件不受控
              <Radio.Group
                disabled={!editable}
                buttonGap
                className="tabs"
                optionType="button"
                options={options}
                value={activeTab}
                onChange={(e) => {
                  preActiveTabRef.current = e.target.value as DeployBy;

                  const subFormItems = formItems.filter((item) =>
                    validate?.includes(item.name as any)
                  );
                  /* 填了必填项才会进行警告，非必填项填了也不会进行警告 */
                  if (
                    subFormItems.some((item) => {
                      if (!item.validate) return true;

                      return item.validate(form) === "";
                    })
                  ) {
                    // 唤起警告
                    setShowTabSwitchWarning(true);
                  } else {
                    /* 切换tab时也要重置 */
                    reset();
                    /* 防止Id被重置 */
                    const formId = form.formId;
                    const itemId = form.itemId;
                    setForm((f) => {
                      return {
                        ...f,
                        deployBy: preActiveTabRef.current,
                        formId,
                        itemId,
                      };
                    });
                  }
                }}
              />
            )}
          </header>
          <main>
            <FormWrapper
              disabled={!editable}
              colon
              className="form"
              labelAlign="left"
              form={form}
              formItems={formItems}
              validateFields={validateFields}
            />
          </main>
        </div>
        <Divider />
      </Modal>
      <Modal
        className={`${prefixCls}-switch-warning`}
        title="目标切换提示"
        visible={showTabSwitchWarning}
        onOk={() => {
          setShowTabSwitchWarning(false);
          /* 切换tab时也要重置 */
          reset();
          clearState?.()
          /* 防止Id被重置 */
          const formId = form.formId;
          const itemId = form.itemId;
          setForm((f) => {
            return {
              ...f,
              deployBy: preActiveTabRef.current,
              formId,
              itemId,
            };
          });
        }}
        onCancel={() => setShowTabSwitchWarning(false)}
      >
        <div className="text">
          <Icon className="icon" type="zhuyi" />
          切换布控方式将清空当前布控参数，确认切换吗？
        </div>
        <Divider />
      </Modal>
    </>
  );
}

const EditDeploy = forwardRef<EditFormRef, AddDeployModalProps>(AddDeployModal);
// export default AddDeployModal;
export default EditDeploy;
