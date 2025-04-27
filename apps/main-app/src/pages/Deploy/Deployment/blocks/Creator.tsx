import React from "react";
import Heading from "../../components/Heading";
import type { DeploymentBlockProps } from "../interface";
import InfoCellList from "@/pages/Deploy/components/InfoCell";
function Index(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;
  const cells = [
    {
      title: "姓名",
      text: deployItem.createUser.userName,
    },
    {
      title: "联系方式",
      text: deployItem.createUser.tel,
    },
    {
      title: "所属部门",
      text: deployItem.createUser.organizationName,
    },
    {
      title: "创建时间",
      text: deployItem.createTime,
    },
  ];
  return (
    <section className="creator">
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
