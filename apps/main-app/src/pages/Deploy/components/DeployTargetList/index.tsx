import React, { useState } from "react";
import { Table, Button } from "@yisa/webui";
import {
  DeployItem,
  DeployTarget,
  DeployTargetChoice,
  DeployTargetTextSetting,
} from "../../DeployDetail/interface";

import useTableColumns from "./useTableColumns";
import DeployObjectList from "../../components/DeployObjectList";

type Props = {
  targets: DeployTarget[];
};

const DeployTargetList: React.FC<Props> = (props) => {
  const { targets } = props;
  const columns = useTableColumns<DeployTarget>(
    [
      {
        title: "布控类型",
        dataIndex: "type",
        render(col, item, index) {
          return DeployTargetTextSetting[DeployTargetChoice[item.type]]?.text;
        },
      },
      {
        title: "目标信息",
        dataIndex: "objects",
        render(col, item, index) {
          const { type, objects } = item;
          if (objects.length <= 0) {
            return "无布控对象";
          }
          switch (type) {
            case DeployTargetChoice.Vehicle: {
              return `${objects[0].plate}${objects.length > 1 ? "等" : ""}`;
            }
            case DeployTargetChoice.Identity: {
              return `${objects[0].name}${objects.length > 1 ? "等" : ""}`;
            }
            case DeployTargetChoice.Picture: {
              return `共${objects.length}张图片`;
            }
            default: {
              return "未知布控类型";
            }
          }
        },
      },
    ],
    {
      withNumber: true,
      actions: [
        {
          children: "查看",
          show: true,
          onClick(item) {
            setVisible(true);
            setSelectedTarget(item);
          },
        },
      ],
    }
  );
  const [visible, setVisible] = useState(false);

  const [selectedTarget, setSelectedTarget] = useState<DeployTarget>();
  return (
    <>
      <Table columns={columns} data={targets} />
      {selectedTarget && (
        <DeployObjectList
          item={selectedTarget}
          modalProps={{
            title:
              DeployTargetTextSetting[DeployTargetChoice[selectedTarget.type]]
                .text,
            footer: null,
            visible,
            onCancel() {
              setVisible(false);
            },
          }}
        />
      )}
    </>
  );
};
export default DeployTargetList;
