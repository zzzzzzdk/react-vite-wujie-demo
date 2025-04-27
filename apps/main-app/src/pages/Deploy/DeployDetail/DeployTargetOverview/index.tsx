import { useEffect, useState, useMemo } from "react";

import { Button, Modal, Divider } from "@yisa/webui";

import type { ButtonProps } from "@yisa/webui/es/Button";
import DeployFormTable from "../../Deploy/DeployTargetTable";
import { DeployItem } from "../interface";
import { BaseFormData } from "../../Deploy/AddDeployModal";
import {
  DeployBy,
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
  transformMonitorList,
} from "../../Deploy/interface";
import DeployObjectList from "./DeployObjectList";
import { IdentityFormData } from "../../Deploy/AddDeployModal/useIdentityForm";
import { VehicleFormData } from "../../Deploy/AddDeployModal/useVehicleForm";

const DeployTargetOverview = (
  props: ButtonProps & {
    deployItem: DeployItem;
  }
) => {
  const { deployItem, ...btnProps } = props;
  const [visible, setVisible] = useState(false);
  const targets = deployItem.monitorList;
  const [seletedItem, setSelectedItem] = useState<BaseFormData>();
  const monitorList = transformMonitorList(deployItem.monitorList);

  return (
    <>
      <span
        {...btnProps}
        onClick={() => {
          setVisible(true);
        }}
      >
        共{deployItem.monitorItemCount || targets.length}个目标
      </span>
      <Modal
        className="add-task-modal"
        title={`${deployItem.jobId}-${deployItem.title}`}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        width={"50vw"}
        footer={null}
      >
        <DeployFormTable
          simple
          formList={monitorList as BaseFormData[]}
          onAction={(item) => {
            const vehicle = isVehicleDeploy(item.monitorType);
            const identity = isIdentityDeploy(item.monitorType);
            // 是人员布控并且是属性，没有二级弹窗
            if (identity && item.deployBy === DeployBy.Property) {
              const params = {
                idNumber: (item as IdentityFormData).license === '未知' ? '' : (item as IdentityFormData).license,
                idType: "111",
                groupId: [],
                groupPlate: [],
              };

              const queryStr = encodeURIComponent(JSON.stringify(params));
              window.open(`#/record-detail-person?${queryStr}`);
              return;
            }

            // 是车辆布控并且是属性，没有二级弹窗
            if (vehicle && item.deployBy === DeployBy.Property) {
              const params = {
                licensePlate: (item as VehicleFormData).licensePlate,
                plateColorTypeId: (item as VehicleFormData).plateColorTypeId,
              };
              const queryStr = encodeURIComponent(JSON.stringify(params));
              window.open(`#/record-detail-vehicle/?${queryStr}`);
              return;
            }
            // 激活二次弹窗
            setSelectedItem(item);
          }}
        />
        <DeployObjectList
          modalProps={{
            title: `${deployItem.jobId}-${deployItem.title}`,
            width: "30vw",
            footer: null,
            visible: !!seletedItem,
            onCancel: () => setSelectedItem(undefined),
          }}
          item={seletedItem}
        />
        <Divider />
      </Modal>
    </>
  );
};
export default DeployTargetOverview;
