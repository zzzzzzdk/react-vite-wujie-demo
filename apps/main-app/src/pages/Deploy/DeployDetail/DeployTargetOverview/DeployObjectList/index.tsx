import { Message, Table, Modal } from "@yisa/webui";
import { ModalProps } from "@yisa/webui/es/Modal/interface";
import type { ColumnProps } from "@yisa/webui/es/Table";
import { BigImg } from "@/components";
import ColorfulPlate from "../../../components/ColorfulPlate";
import { BaseFormData } from "../../../Deploy/AddDeployModal";
import { VehicleFormData } from "../../../Deploy/AddDeployModal/useVehicleForm";
import { IdentityFormData } from "../../../Deploy/AddDeployModal/useIdentityForm";
import { PictureFormData } from "../../../Deploy/AddDeployModal/usePictureForm";
import {
  DeployBy,
  isVehicleDeploy,
  isIdentityDeploy,
  isPictureDeploy
} from "../../../Deploy/interface";
import TableAction from "../../../components/TableAction";
import ColorfulLabel from "../../../components/ColorfulLabel";
import { useState } from "react";

type Props<T extends BaseFormData> = {
  item: T;
  modalProps: ModalProps;
};

const Vehicle = (props: Props<VehicleFormData>) => {
  const { item, modalProps } = props;
  const showWarning = () => {
    Message.warning("本地未部署车辆档案/标签系统，请联系以萨交付工作人员");
  };

  const batchColumns: ColumnProps<
    NonNullable<VehicleFormData["licenses"]>[number]
  >[] = [
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
          return (
            <ColorfulPlate
              plate={vehicle.licensePlate}
              color={vehicle.plateColorTypeId}
              showTiTle={false}
            />
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        render(_, vehicle) {
          return (
            <TableAction
              item={vehicle}
              onClick={() => {
                const params = {
                  licensePlate: vehicle.licensePlate,
                  plateColorTypeId: vehicle.plateColorTypeId,
                };
                const queryStr = encodeURIComponent(JSON.stringify(params));
                window.open(`#/record-detail-vehicle/?${queryStr}`);
              }}
            >
              查看
            </TableAction>
          );
        },
      },
    ];
  const labelColumns: ColumnProps<
    NonNullable<BaseFormData["labelInfos"]>[number]
  >[] = [
      {
        title: "序号",
        width: "84px",
        render(_, __, index) {
          return index + 1;
        },
      },
      {
        title: "标签",
        dataIndex: "plate",
        ellipsis: true,
        width: "200px",
        render(_, label) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ColorfulLabel ellipsis label={label} />
            </div>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        render(_, label) {

          return (
            "--"
            // <TableAction item={label} onClick={() => {

            // }}>
            //   查看
            // </TableAction>
          );
        },
      },
    ];

  const batchConfig = {
    columns: batchColumns,
    data: item.licenses,
  } as const;

  const labelConfig = {
    columns: labelColumns,
    data: item.labelInfos,
  };

  const { columns, data } = (
    item.deployBy === DeployBy.Batch ? batchConfig : labelConfig
  ) as any;
  return (
    <Modal {...modalProps}>
      <Table
        columns={columns}
        data={data}
        virtualized
        scroll={{
          y: 500,
        }}
      />
    </Modal>
  );
};
const Identity = (props: Props<IdentityFormData>) => {
  const { item, modalProps } = props;
  const showWarning = () => {
    Message.warning("本地未部署人员档案/标签系统，请联系以萨交付工作人员");
  };

  const batchColumns: ColumnProps<any>[] = [
    {
      title: "序号",
      render(_, __, index) {
        return index + 1;
      },
    },
    {
      title: "姓名",
      dataIndex: "personName",
    },
    {
      title: "证件号",
      dataIndex: "license",
    },
  ];
  const labelColumns: ColumnProps<
    NonNullable<BaseFormData["labelInfos"]>[number]
  >[] = [
      {
        title: "序号",
        width: "84px",
        render(_, __, index) {
          return index + 1;
        },
      },
      {
        title: "标签",
        dataIndex: "plate",
        ellipsis: true,
        width: "200px",
        render(_, label) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ColorfulLabel className="colorful-label-ellipsis" label={label} />
            </div>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "action",
        render(_, label) {
          return (
            <TableAction item={label} onClick={() => {
              const params = {
                text: '人员标签(1个)',//写死就行
                searchType: '1',//精确检索类型
                data: {
                  label: [label.id.toString()],//标签id
                  profileType: "3",
                  age: ["", ""],
                  captureCount: ["", ""]
                }
              }
              const queryStr = encodeURIComponent(JSON.stringify(params));
              window.open(`#/record-list?${queryStr}`);
            }}>
              查看
            </TableAction>
          );
        },
      },
    ];
  const batchConfig = {
    columns: batchColumns,
    data: item.licenses,
  } as const;

  const labelConfig = {
    columns: labelColumns,
    data: item.labelInfos,
  };

  const { columns, data } = (
    item.deployBy === DeployBy.Batch ? batchConfig : labelConfig
  ) as any;

  return (
    <Modal {...modalProps}>
      <Table
        columns={columns}
        data={data}
        virtualized
        scroll={{
          y: 500,
        }}
      />
    </Modal>
  );
};
const Picture = (props: Props<PictureFormData>) => {
  const { item, modalProps } = props;
  const [currentIndex, setCurrentIndex] = useState(0)
  return (
    <BigImg
      modalProps={{
        ...modalProps,
        onCancel: () => {
          setCurrentIndex(0)
          modalProps.onCancel?.()
        }
      }}
      disabledAssociateTarget={true}
      currentIndex={currentIndex}
      showRightInfo={false}
      data={item.featureList}
      onIndexChange={index => {
        setCurrentIndex(index)
      }}
    />
  );
};
type DeployObjectListProps = {
  item?: BaseFormData;
  modalProps: ModalProps;
};
function DeployObjectList(props: DeployObjectListProps) {
  const { item, modalProps } = props;
  if (!item) return null;
  const vehicle = isVehicleDeploy(item.monitorType);
  const identity = isIdentityDeploy(item.monitorType);
  const picture = isPictureDeploy(item.monitorType);
  if (vehicle)
    return <Vehicle item={item as VehicleFormData} modalProps={modalProps} />;
  if (identity)
    return <Identity item={item as IdentityFormData} modalProps={modalProps} />;
  if (picture)
    return <Picture item={item as PictureFormData} modalProps={modalProps} />;

  return <Modal visible>未提供实现</Modal>;
}

export default DeployObjectList;
