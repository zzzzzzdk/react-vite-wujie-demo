import { TargetFeatureItem } from "@/config/CommonType";
import { DeployTargetType } from "../DeployDetail/interface";
import { BaseFormData } from "./AddDeployModal";

/* 属性布控 批量布控 标签布控 */
export enum DeployBy {
  Property,
  Batch,
  Label,
}
/**
 * @description 后端定义的接口
 * 等同于 DeployTargetType * DeployBy
 */
export type MonitorType =
  | "monitorVehiclePropertyType" // 车辆属性
  | "monitorVehicleBatchType" // 车辆批量
  | "monitorVehicleTagType" // 车辆标签
  | "monitorPersonIdType" // 证件号属性
  | "monitorPersonBatchType" // 证件号批量
  | "monitorPersonTagType" // 证件号标签
  | "monitorImageType"; // 人脸布控

export const isVehicleDeploy = (m?: MonitorType) => {
  return m?.includes("Vehicle");
};

export const isIdentityDeploy = (m?: MonitorType) => {
  return m?.includes("Person");
};
export const isPictureDeploy = (m?: MonitorType) => {
  return m?.includes("Image");
};
export function transformMonitorList(list: BaseFormData[]): BaseFormData[] {
  const monitorList = list.map((item) => {
    switch (item.monitorType) {
      case "monitorImageType": {
        return {
          ...item,
          type: DeployTargetType.Picture,
          deployBy: DeployBy.Property,
          formId: item.itemId,
        };
      }
      case "monitorPersonBatchType": {
        return {
          ...item,
          type: DeployTargetType.Identity,
          deployBy: DeployBy.Batch,
          formId: item.itemId,
          licensePlateFileUrl:
            item["licensePlateFIleUrl"] || "mock@@uploadedAddress",
          batchCount: item.licenses?.length ?? 0,
        };
      }
      case "monitorPersonIdType": {
        return {
          ...item,
          type: DeployTargetType.Identity,
          deployBy: DeployBy.Property,
          formId: item.itemId,
        };
      }
      case "monitorPersonTagType": {
        return {
          ...item,
          type: DeployTargetType.Identity,
          deployBy: DeployBy.Label,
          formId: item.itemId,
          labelId: (item.labelInfos || []).map((l) => String(l.id)),
        };
      }
      case "monitorVehicleBatchType": {
        return {
          ...item,
          type: DeployTargetType.Vehicle,
          deployBy: DeployBy.Batch,
          formId: item.itemId,
          batchCount: item.licenses?.length ?? 0,
        };
      }
      case "monitorVehiclePropertyType": {
        return {
          ...item,
          type: DeployTargetType.Vehicle,
          deployBy: DeployBy.Property,
          formId: item.itemId,
        };
      }
      case "monitorVehicleTagType": {
        return {
          ...item,
          type: DeployTargetType.Vehicle,
          deployBy: DeployBy.Label,
          labelId: (item.labelInfos || []).map((l) => String(l.id)),
          formId: item.itemId,
        };
      }
      default: {
        console.log("未知布控类型");
        return {};
      }
    }
  });
  return monitorList as BaseFormData[];
}
// 接收人
export interface Receiver {
  type: "user" | "org";
  parentId: string;
  name: string;
  id: string;
  tel: string;
  children: Receiver[] | undefined;
  disabled?: boolean;
}

/*审批人 */
export type Approver = Record<
  "account" | "userName" | "userUUID" | "tel" | "origanizationUUID",
  string
>;

/* 跳转函数 */
type ParsedParams = {
  /* ========车辆标签或者人员标签======= */
  type: "vehicle" | "person";
  labels: string | string[];
  /**
   * @description 小图跳转
   */
  /* ========人脸布控======= */
  featureList?: TargetFeatureItem[];
  /**
   * @description 大图跳转
   */
  bigImage?: string;
};
export const jumpToDeploy = () => {};
