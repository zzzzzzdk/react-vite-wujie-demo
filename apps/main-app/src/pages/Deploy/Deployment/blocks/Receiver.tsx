import React from "react";
import Heading from "../../components/Heading";
import type { DeploymentBlockProps } from "../interface";
import InfoCellList from "@/pages/Deploy/components/InfoCell";
function Index(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;
  const receives = deployItem.receiveUsers.map((r) => r.userName);
  const cells = [
    {
      title: "姓名",
      text: receives.join("、"),
    },
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
