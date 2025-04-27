import React, { useState, useEffect, useMemo } from "react";
import { Receiver } from "../Deploy/interface";
import { useSelector, RootState, useDispatch } from "@/store";
import services from "@/services";

function formatReceiver(recevs: Receiver[], userId?: string): Receiver[] {
  /* base case */
  // 是用户，不进行预处理
  function dfs(recev: Receiver): Receiver | null {
    // 如果当前节点是用户且 userId 匹配，则过滤掉
    if (recev.type === "user" && recev.id === userId) {
      return null;
    }

    // 如果是用户且不匹配，直接返回
    if (recev.type === "user") {
      return recev;
    }

    // 是组织，并且没有子元素, 将其disabled
    if (!recev.children?.length) {
      return {
        ...recev,
        id: `org${recev.id}`, // 防止
        disabled: true,
      };
    }
    // 是组织，并且有子元素, 递归
    const newOrg: Receiver = {
      ...recev,
      id: `org${recev.id}`, // 防止
      children: [],
    };

    for (const child of recev.children) {
      const processedChild = dfs(child);
      if (processedChild) {
        newOrg.children!.push(processedChild);
      }
    }
    // 如果组织处理后没有子元素，则将其 disabled
    if (newOrg.children!.length === 0) {
      return {
        ...newOrg,
        disabled: true,
      };
    }

    return newOrg;
  }
  // 过滤掉 null 值
  return recevs.map((r) => dfs(r)).filter((r): r is Receiver => r !== null);
}
function useReceivers() {
  const userInfo = useSelector((state: RootState) => {
    return state.user.userInfo
  })
  const [receiverList, setReceiverList] = useState<Receiver[]>([]);
  useEffect(() => {
    services.deploy
      .getReceiver<any, Receiver[]>()
      .then((res) => {
        if (res.data) {
          setReceiverList(res.data);
        }
      })
      .catch(console.error);
  }, []);

  return useMemo(() => formatReceiver(receiverList, userInfo.id), [receiverList, userInfo.id]);
}

export default useReceivers;
