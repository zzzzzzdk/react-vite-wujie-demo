import { Message } from "@yisa/webui";
import services from "@/services";
import { useCallback } from "react";
import { OfflineFile, OfflineJob, isOfflineFile } from "./AddN2NTask/index.";
import { DB, DBType } from "./interface";

export default function useHandleDbClick() {
  return useCallback((db: DB) => {
    function getRoot(root: OfflineJob): any {
      // base case
      if (root.jobId === `job-${db.id}`) {
        return root;
      }
      // make progress
      for (const r of root.children ?? []) {
        const node = getRoot(r as any);
        if (node) return node;
      }
    }
    function getAllOfflineFile(root: OfflineJob) {
      // base case 是离线文件
      if (isOfflineFile(root)) {
        return [root.fileId];
      }
      // make progress 是离线任务
      const allFile: string[] = [];
      root.children?.forEach((r) => {
        allFile.push(...getAllOfflineFile(r as any));
      });
      return allFile;
    }
    if (db.deleted) return;
    if (db.type === DBType.Label) {
      // 任务是双库比对,跳转至人员标签库
      // Message.warning("Not impl");
      const params = {
        text: '人员标签(1个)',//写死就行 
        searchType: '1',//精确检索类型
        data: {
          label: [db.id.toString()],//标签id
          profileType: "3",
          age: ["", ""],
          captureCount: ["", ""]
        }
      }
      const queryStr = encodeURIComponent(JSON.stringify(params));
      window.open(`#/record-list?${queryStr}`);
    } else if (db.type === DBType.OfflineFile) {
      window.open(`#/target/?offlineIds=${JSON.stringify([String(db.id)])}`);
    } else {
      // 先获取任务中的文件后再跳转

      services.offline
        .getAllOfflineFile<null, OfflineJob[]>()
        .then((res) => {
          if (res.data) {
            if (!res.data) return;
            console.log(res.data);
            // step.1 找到这个离线任务
            for (const root of res.data) {
              const target = getRoot(root);
              if (target) {
                // step.2 获取这个离线文件下面的所有离线文件
                const offlineIds = getAllOfflineFile(target);
                window.open(
                  `#/target/?offlineIds=${JSON.stringify(offlineIds)}`
                );
                return;
              }
            }
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally();
    }
  }, []);
}
