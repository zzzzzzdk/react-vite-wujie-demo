import React, { useState, useEffect } from "react";
import { Approver } from "../Deploy/interface";
import services from "@/services";

function useApprovers() {
  const [approverList, setApproverList] = useState<Approver[]>([]);
  useEffect(() => {
    services.deploy
      .getApprover<any, Approver[]>()
      .then((res) => {
        if (res.data) {
          setApproverList(res.data);
        }
      })
      .catch();
  }, []);
  return approverList;
}

export default useApprovers;
