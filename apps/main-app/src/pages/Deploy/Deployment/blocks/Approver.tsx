import React from "react";
import Heading from "../../components/Heading";
import type { DeploymentBlockProps } from "../interface";
import InfoCellList from "@/pages/Deploy/components/InfoCell";
import { DeployStatus } from "../../DeployDetail/interface";
import Deploy from "../../Deploy";
function Index(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;
  const {
    userUUID: userId,
    userName,
    tel,
    organizationName,
  } = deployItem.approveUser;

  let statusStr = "";
  if (deployItem.approveStatus == 1) {
    statusStr = "通过";
  }
  if (deployItem.approveStatus == 2) {
    statusStr = "驳回";
  }

  const cells = [
    {
      title: "姓名",
      text: userName,
    },
    {
      title: "联系方式",
      text: tel,
    },
    {
      title: "所属部门",
      text: organizationName,
    },
    {
      title: "审批意见",
      // text: deployItem.approveReason,
      // text: deployItem.approveStatus === 1 ? "通过" : "驳回",
      text: statusStr,
    },
    {
      // 审批意见
      title: "备注",
      // text: deployItem.closeReason,
      text: deployItem.approveReason,
    },
    {
      title: "审批时间",
      text: deployItem.approveTime,
    }
  ];
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
