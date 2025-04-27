import { Table, Modal } from "@yisa/webui";
import { ModalProps } from "@yisa/webui/es/Modal/interface";
import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import { BigImg } from "@/components";
import ColorfulPlate from "../ColorfulPlate";
import {
  DeployTarget,
  VehicleObject,
  IdentityObject,
  PictureObject,
  DeployTargetChoice,
} from "../../DeployDetail/interface";

type DeployObjectListProps = {
  item: DeployTarget;
  modalProps: ModalProps;
};
type Props<T> = {
  objects: T[];
  modalProps: ModalProps;
};

const Vehicle = (props: Props<VehicleObject>) => {
  const { objects, modalProps } = props;

  const columns: ColumnProps<VehicleObject>[] = [
    {
      title: "序号",
      width: "84px",
      render(_, __, index) {
        return index + 1;
      },
    },
    {
      title: "车牌号",
      dataIndex: "plate",
      render(_, vehicle) {
        return <ColorfulPlate plate={vehicle.plate} type={16} />;
      },
    },
  ];
  return (
    <Modal {...modalProps}>
      <Table columns={columns} data={objects} />
    </Modal>
  );
};
const Identity = (props: Props<IdentityObject>) => {
  const { objects, modalProps } = props;
  const columns: ColumnProps<IdentityObject>[] = [
    {
      title: "序号",
      render(_, __, index) {
        return index + 1;
      },
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "证件号",
      dataIndex: "id",
    },
  ];
  return (
    <Modal {...modalProps}>
      <Table columns={columns} data={objects} />
    </Modal>
  );
};
const Picture = (props: Props<PictureObject>) => {
  const { objects, modalProps } = props;
  return (
    <>
      <BigImg modalProps={modalProps} showRightInfo={false} data={objects} />
    </>
  );
};

function DeployObjectList(props: DeployObjectListProps) {
  const { item, modalProps } = props;
  switch (item.type) {
    case DeployTargetChoice.Vehicle: {
      return <Vehicle objects={item.objects} modalProps={modalProps} />;
    }
    case DeployTargetChoice.Identity: {
      return <Identity objects={item.objects} modalProps={modalProps} />;
    }
    case DeployTargetChoice.Picture: {
      return <Picture objects={item.objects} modalProps={modalProps} />;
    }
    default: {
      return <Modal visible>未提供实现</Modal>;
    }
  }
}

export default DeployObjectList;
