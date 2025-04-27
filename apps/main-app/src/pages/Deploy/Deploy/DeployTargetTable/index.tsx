import React, { useMemo, useState, useEffect } from "react";
import { Table, Button, PopConfirm } from "@yisa/webui";
import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import {
  DeployTargetTextSetting,
  DeployTargetType,
} from "../../DeployDetail/interface";
import { DeployBy } from "../interface";
import { BaseFormData } from "../AddDeployModal";
import { PictureFormData } from "../AddDeployModal/usePictureForm";
import { VehicleFormData } from "../AddDeployModal/useVehicleForm";
import { IdentityFormData } from "../AddDeployModal/useIdentityForm";
import services from "@/services";
import ColorfulPlate from "../../components/ColorfulPlate";
import useVehicleTypes from "../../hooks/useVehicleTypes";
import { useEditableContext } from "../EditableProvider";
import "./index.scss";
type DeployFormTableProps = {
  formList: BaseFormData[];
  // 点击表格操作栏
  onAction: (form: BaseFormData, action: "remove" | "view") => void;
  onClick?: (form: BaseFormData) => void;
  simple?: boolean;
};

function DeployFormTable(props: DeployFormTableProps) {
  const editable = useEditableContext();
  const { formList, onAction: handleAction, simple = false } = props;
  const list = formList.filter((item) => item.operation !== "delete");
  const [vehicleBrand, setBrand] = useState<{
    [index: number | string]: { k: number; v: string };
  }>({});
  /* 获取车辆品牌 */
  useEffect(() => {
    services.getBMY().then((res) => {
      let { brand, model, year } = res.data as any;
      setBrand(brand);
    });
  }, []);
  /* 获取车型 */
  const vehicleShape = useVehicleTypes();
  const columns: ColumnProps<BaseFormData>[] = [
    {
      title: "序号",
      dataIndex: "seq",
      key: "seq",
      width: "50px",
      render(col, item, index) {
        /* 倒序 */
        if (simple) {
          return index + 1;
        }
        return formList.length - index;
      },
    },
    {
      title: "布控类型",
      dataIndex: "type",
      key: "type",
      width: "90px",
      render(col, item, index) {
        return DeployTargetTextSetting[DeployTargetType[item.type]]?.text;
      },
    },
    {
      width: "290px",
      title: "目标信息",
      dataIndex: "objects",
      render(col, item, index) {
        switch (item.type) {
          case DeployTargetType.Vehicle: {
            const form = item as VehicleFormData;
            if (form.deployBy === DeployBy.Batch) {
              return `共上传${form.batchCount}个车牌号`;
            }
            if (form.deployBy === DeployBy.Label) {
              return `共选择${form.labelId?.length || form.labelInfos?.length || 0
                }个车辆标签`;
            }
            // 过滤未识别
            if (form.carInfo?.includes("未识别")) {
              form.carInfo = undefined;
            }
            const info = [
              form.carInfo ?? vehicleBrand[form.brandId!]?.v,
              form.vehicleTypeId != -1 &&
              vehicleShape.find((v) => v.value === form.vehicleTypeId)?.text,
            ].filter(Boolean);

            return (
              <div
                className="deploy-target-table__objects"
                title={[form.licensePlate, ...info].filter((i) => i).join("-")}
              >
                {!!form.licensePlate?.length && (
                  <ColorfulPlate
                    showTiTle={false}
                    plate={form.licensePlate}
                    color={form.plateColorTypeId}
                  />
                )}

                {info.length > 0 && !!form.licensePlate?.length && "-"}
                {info.filter(Boolean).join("-")}
              </div>
            );
          }
          case DeployTargetType.Identity: {
            const form = item as IdentityFormData;
            if (form.deployBy === DeployBy.Batch) {
              return `共${form.batchCount}个证件号`;
            }
            if (form.deployBy === DeployBy.Label) {
              return `共选择${form.labelId?.length || 0}个人员标签`;
            }
            const info = [form.personName, form.personAge, form.license];

            return info.filter(Boolean).join("-");
          }
          case DeployTargetType.Picture: {
            const form = item as PictureFormData;
            return `共上传${form.featureList?.length}张图片`;
          }
        }
      },
    },
    {
      title: "备注",
      key: "note",
      width: `${180}px`,
      ellipsis: true,
      render(col, item, index) {
        return item.remark || "-";
      },
    },
    {
      title: "操作",
      dataIndex: "actions",
      key: "actions",
      width: `120px`,
      render(col, item, index) {
        // console.log(item)
        return (
          <div className="actions">
            {
              editable ?
                <Button size="mini" onClick={() => handleAction(item, "view")}>
                  编辑
                </Button>
                :
                item.monitorType !== 'monitorVehiclePropertyType' ?
                  <Button size="mini" onClick={() => handleAction(item, "view")}>
                    查看
                  </Button>
                  :
                  '--'
            }
            {!simple && (
              <PopConfirm
                title="确定删除？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleAction(item, "remove");
                }}
                onCancel={(e) => {
                  e?.stopPropagation();
                }}
              >
                <Button
                  size="mini"
                  type="danger"
                  onClick={(e) => {
                    e?.stopPropagation();
                  }}
                >
                  删除
                </Button>
              </PopConfirm>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      className="deploy-target-table"
      rowKey="formId"
      data={list}
      columns={columns}
      onRow={(f) => {
        return {
          onClick(event) {
            if (props.onClick) props.onClick(f);
          },
        };
      }}
    />
  );
}

export default DeployFormTable;
