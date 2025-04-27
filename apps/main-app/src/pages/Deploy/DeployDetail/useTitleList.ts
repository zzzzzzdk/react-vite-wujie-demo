import React, { useEffect, useState } from "react";
import { TabsKey } from ".";
import services from "@/services";
type T = TabsKey | "all";
function useTitleList(activeTab: T) {
  const [titleList, setTitleList] = useState<
    {
      jobId: string | number;
      title: string;
    }[]
  >([]);
  useEffect(() => {
    services.deploy
      .getTitles<{ status: T }, any>({ status: activeTab })
      .then((res) => {
        setTitleList(res.data);
      });
  }, [activeTab]);
  return titleList;
}

export default useTitleList;
