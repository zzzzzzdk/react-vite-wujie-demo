import { Modal } from "@yisa/webui";
import {
  AttributeOptionType,
  LastResDataType,
  PersonAttributeProps,
} from "./interface";
import { Radio, Form, Button, Message } from "@yisa/webui";
import character from "@/config/character.config";
import { RadioChangeEvent } from "@yisa/webui/es/Radio/interface";
import { TargetType } from "@/config/CommonType";
import "./index.scss";
import React, { useRef, useEffect, useState } from "react";
import { CheckableTag } from "@yisa/webui_business";
import {
  CheckableTagDataType,
  characterDataType,
} from "@yisa/webui_business/es/CheckableTag/interface";
import { FormPlate } from "@/components";
import { CheckboxChangeEvent } from "@yisa/webui/es/Checkbox";
import { PlateValueProps } from "@/components/FormPlate/interface";
import featureData from "@/config/featureVertical.json";
import {
  featureDirectionToShow,
  featureColorToShow,
} from "@/pages/Search/Target/FeatureList";
import { useLocation } from "react-router-dom";
import { getLogData } from "@/utils/log";
import { isEmptyObject } from "@/utils/is";
import {
  isNumber,
  getParams,
  isObject,
  formatTimeFormToComponent,
} from "@/utils";

export default function PersonAttributeModal(props: PersonAttributeProps) {
  const {
    open = false,
    cancel = () => { },
    confirm = () => { },
    changevectorData = () => { },
  } = props;

  const [targetType, setTargetType] = useState<TargetType>("face");

  const [resData, setResData] = useState<AttributeOptionType[]>([]);

  const lastResData = useRef<LastResDataType>({
    targetType: "face",
    data: [],
  });

  // 获取token loading
  const [tokenLoading, setTokenLoading] = useState(false);

  const location = useLocation();

  // 渲染属性项
  const renderOptions = (item: AttributeOptionType, index: number) => {
    const { key, label, isSingle, data, value } = item;
    return key === "licensePlate" ? (
      <div className="ysdb-checkable-tag" key={`${targetType}_${key}`}>
        <div className="ysdb-checkable-tag-children">
          <div className="ysdb-checkable-tag-name">{label}</div>
          <div className="ysd-checkbox-group ysdb-checkable-tag-content">
            <FormPlate
              isShowColor={false}
              isShowKeyboard
              value={{
                plateTypeId: -1,
                plateNumber: typeof value === "string" ? value : "",
                noplate: "",
              }}
              onChange={(value) => handlePlateNumberChange(value, index)}
            />
          </div>
        </div>
      </div>
    ) : (
      <CheckableTag
        key={`${targetType}_${key}`}
        dataSource={data || []}
        value={Array.isArray(value) ? value : ["-1"]}
        labelName={label}
        onChange={(event: CheckboxChangeEvent, data: CheckableTagDataType) =>
          handleCheckChange(event, data, isSingle, index)
        }
        fieldName={key}
        showAsRadio={isSingle}
      />
    );
  };

  // 改变target type
  const handleTargetTypeChange = (event: RadioChangeEvent) => {
    setTargetType(event.target.value);
    ruleData(event.target.value);
  };

  // 处理数据
  const ruleData = (type: string, isInit?: string, isGetData?: boolean) => {
    const thisFeatureData = featureData[type] || {};
    let arr = Object.keys(thisFeatureData).map((key) => {
      const item = thisFeatureData[key as keyof typeof thisFeatureData];
      const hasColor = key.indexOf("Color") > -1 || key.indexOf("color") > -1;
      const hasIcon = key.indexOf("movingDirection") > -1;
      const thisValue: Array<characterDataType> = item["value"] || [];
      const dataSource: Array<characterDataType> = thisValue.map(
        (elem: characterDataType) => {
          let colorOpt = {};
          if (
            hasColor &&
            parseInt(elem.value) !== -1 &&
            parseInt(elem.value) !== 99
          ) {
            colorOpt = {
              showStyle: "colorBlock",
              color:
                featureColorToShow[
                elem.value as unknown as keyof typeof featureColorToShow
                ],
              borderColor:
                featureColorToShow[
                elem.value as unknown as keyof typeof featureColorToShow
                ],
            };
          }
          let iconOpt = {};
          if (
            hasIcon &&
            parseInt(elem.value) !== -1 &&
            parseInt(elem.value) !== 99
          ) {
            iconOpt = {
              showStyle: "icon",
              icon: featureDirectionToShow[
                elem.value as unknown as keyof typeof featureDirectionToShow
              ],
            };
          }

          return {
            value: elem.value + "",
            text: elem.text,
            isSingle: elem["isSingle"],
            cancelOther: parseInt(elem.value) === -1,
            ...colorOpt,
            ...iconOpt,
          };
        }
      );

      return {
        key: key,
        label: item.desc,
        value: key === "licensePlate" ? "" : item.desc === "质量过滤" ? ["1"] : ["-1"],
        isSingle: item.isSingle,
        data: dataSource,
      };
    });
    if (isGetData) {
      return arr;
    } else {
      setResData(arr);
      if (isInit === "init") {
        const { defaultFeatureForm, num } = ruleConfirmData(arr);
        confirm({ ...defaultFeatureForm, type: targetType }, num);
        lastResData.current = { targetType: targetType, data: arr };
      }
    }
  };

  // 属性变化
  const handleCheckChange = (
    event: CheckboxChangeEvent,
    data: CheckableTagDataType,
    isSingle: boolean,
    index: number
  ) => {
    const { formItemName, formItemData } = data;
    let valueArr: string[] = [];
    formItemData.forEach((elem) => {
      valueArr.push(elem.value);
    });
    let arr = [...resData];
    arr[index].value = valueArr;
    setResData(arr);
  };

  // 车牌号变化
  const handlePlateNumberChange = (value: PlateValueProps, index: number) => {
    let arr = [...resData];
    arr[index].value = value.plateNumber;
    setResData(arr);
  };

  // 重置
  const handleReset = () => {
    ruleData(targetType);
  };

  // 点击确定
  const handleConfirm = () => {
    const { defaultFeatureForm, num } = ruleConfirmData(resData);
    lastResData.current = { targetType: targetType, data: resData };
    confirm({ ...defaultFeatureForm, type: targetType }, num);
  };

  const ruleConfirmData = (arr: AttributeOptionType[]) => {
    let defaultFeatureForm = {};
    let num = 0;
    arr.forEach((item) => {
      if (item.key === "licensePlate") {
        if (item.value) {
          num++;
        }
        defaultFeatureForm[item.key] = item.value || "";
      } else {
        let resValue: string | number | number[] = "";
        if (Array.isArray(item.value) && item.value.length) {
          if (item.isSingle) {
            resValue =
              Number(item.value[0]) || Number(item.value[0]) === 0
                ? Number(item.value[0])
                : "";
            resValue !== -1 && num++;
            item.label==="质量过滤" && (resValue === -1 ? num++ : num--);
          } else {
            resValue = item.value.map((elem) => {
              elem !== "-1" && num++;
              return Number(elem);
            });
          }
        }
        defaultFeatureForm[item.key] = resValue;
      }
    });
    return { defaultFeatureForm: defaultFeatureForm, num };
  };

  useEffect(() => {
    ruleData(targetType, "init");
  }, []);

  useEffect(() => {
    if (open) {
      if (lastResData.current.data.length) {
        setResData(lastResData.current.data);
        setTargetType(lastResData.current.targetType);
      }
    }
  }, [open]);

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
              if (Array.isArray(data.personTags)) {
                paramsFormData.personTags = data.personTags.map(
                  (item: number) => item + ""
                );
              }
              if (Array.isArray(data.areaData)) {
                changevectorData(data.areaData);
              }
              const _targetType = paramsFormData.attributes.type;
              const _attributes = paramsFormData.attributes;
              let _data = ruleData(_targetType, undefined, true) || [];
              _data.forEach((item) => {
                let value =
                  _attributes &&
                    (_attributes[item.key] || _attributes[item.key] === 0)
                    ? _attributes[item.key]
                    : "";
                if (value || value === 0) {
                  if (Array.isArray(value)) {
                    item.value = value.map((item) => item + "");
                  } else if (isNumber(value)) {
                    item.value = [value + ""];
                  } else {
                    item.value = value;
                  }
                }
              });
              setResData(_data);
              setTargetType(_targetType);
              const { num } = ruleConfirmData(_data);
              lastResData.current = { targetType: _targetType, data: _data };
              confirm(
                { ..._attributes, type: _targetType },
                num,
                paramsFormData
              );
            } catch (error) {
              Message.error(`数据解析失败`);
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    handleParamsData();
  }, []);

  return (
    <Modal
      className="person-attribute-modal"
      title="人员属性"
      visible={open}
      width={713}
      onCancel={cancel}
      footer={null}
    >
      <div className="modal-body">
        <Form
          layout="horizontal"
          colon={false}
          labelAlign="left"
          labelWidth={65}
        >
          <Form.Item label="目标类型" className="target-type">
            <Radio.Group
              optionType="button"
              options={character.targetTypes.filter(
                (item) => item.value !== "vehicle"
              )}
              onChange={handleTargetTypeChange}
              value={targetType}
            />
          </Form.Item>
        </Form>
        <div className={`${targetType} feature-list`}>
          <div
            className={"feature-options"}
            style={{
              minHeight:
                targetType === "face"
                  ? "408px"
                  : targetType === "pedestrian"
                    ? "674px"
                    : targetType === "bicycle"
                      ? "640px"
                      : "526px",
            }}
          >
            {resData && resData.length
              ? resData.map((item, index) => renderOptions(item, index))
              : null}
          </div>
        </div>
      </div>
      <div className="ysd-modal-footer">
        <span className="btn-reset" onClick={handleReset}>
          重置
        </span>
        <Button onClick={cancel}>取消</Button>
        <Button type="primary" onClick={handleConfirm}>
          确认
        </Button>
      </div>
    </Modal>
  );
}
