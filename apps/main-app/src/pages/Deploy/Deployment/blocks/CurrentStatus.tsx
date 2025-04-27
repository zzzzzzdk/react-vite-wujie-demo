import React from "react";
import Heading from "../../components/Heading";
import type { DeploymentBlockProps } from "../interface";
import InfoCellList from "@/pages/Deploy/components/InfoCell";
import {
  CloseTextSetting,
  CloseType,
  DeployStatusTextSetting,
} from "../../DeployDetail/interface";
function Index(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;
  const closeTypes: CloseType[] = ["close", "expire", "reject", "undo"];

  const closed = closeTypes.includes(deployItem.status as CloseType);
  const cells = [
    {
      title: "当前状态",
      text: closed
        ? DeployStatusTextSetting["close"].text
        : DeployStatusTextSetting[deployItem.status]?.text,
    },
  ];
  if (closed) {
    cells.push(
      {
        title: "关闭时间",
        text: deployItem.closeTime,
      },
      {
        title: "关闭原因",
        // text: CloseTextSetting[deployItem.status],
        text: deployItem.closeReason,
      }
    );
  }
  return (
    <section>
      <Heading level={2} id={id} round>
        {title}
      </Heading>
      <section className="block-main">
        <InfoCellList cells={cells} />
      </section>
    </section>
  );
}

export default Index;
