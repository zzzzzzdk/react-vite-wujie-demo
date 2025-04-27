import { useEffect, useState, useMemo } from "react";

import { Button, Modal, Divider } from "@yisa/webui";

import type { ButtonProps } from "@yisa/webui/es/Button";
import DeployTargetList from "../../components/DeployTargetList";

import {
  DeployItem,
  DeployTarget,
  DeployTargetTextSetting,
  DeployTargetChoice,
} from "../interface";

const Index = (
  props: ButtonProps & {
    deployItem: DeployItem;
  }
) => {
  const { deployItem, ...btnProps } = props;
  const [visible, setVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);
  const targets = deployItem.deployTargets;

  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number>(-1);
  const selectedTarget: DeployTarget | undefined = targets[selectedTargetIndex];

  return (
    <>
      <span
        {...btnProps}
        onClick={() => {
          setVisible(true);
        }}
      >
        共{targets.length}个目标
      </span>
      <Modal
        className="add-task-modal"
        title={`${deployItem.deployNumber}-布控目标`}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <DeployTargetList targets={deployItem.deployTargets} />
        <Divider />
      </Modal>
    </>
  );
};
export default Index;
