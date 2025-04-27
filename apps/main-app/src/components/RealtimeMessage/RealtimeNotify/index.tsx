import { getToken } from "@/utils";
import { Notification } from "@yisa/webui";
import { useInterval, useLocalStorageState, useWebSocket } from "ahooks";
import { useEffect, useState } from "react";
import NotifyTemplate from "../NotifyTemplate";
import { MagicStr, isMessageRecord, isUnReadCount } from "../interface";
import "./index.scss";
import Badge from "./Badge";
const REMOTE_URL = window.YISACONF.websocketUrl || "ws://localhost:8081/ws";
const RealtimeNotify = () => {
  const [unread, setUnread] = useState(0);
  const { readyState, sendMessage, latestMessage, disconnect, connect } =
    useWebSocket(`${REMOTE_URL}?token=${getToken()}`, {
      reconnectLimit: 3,
      onOpen() {
        // console.log("websocket连接成功");
      },
      onError(e) {
        // console.error("websocket连接失败", e);
      },
      onClose(e) {
        console.error("websocket关闭", e.reason);
      },
      onMessage(message) {
        if (!message.data) return;
        let data = {};
        try {
          data =
            typeof message.data == "string"
              ? JSON.parse(message.data)
              : message.data;
        } catch (error) {
          console.error("格式有误");
          data = {};
        }
        // 推的是未读消息个数
        if (isUnReadCount(data)) {
          setUnread(Number(data?.unread_count ?? 0));
          return;
        }
        /* 从localStorage拿到数据 */
        let showNotify = true;
        try {
          showNotify = JSON.parse(localStorage.getItem(MagicStr) ?? "true");
        } catch (error) {
          console.error(error);
        }
        if (isMessageRecord(data) && showNotify) {
          HandleWarnVoice()
          Notification.info({
            notificationType: "system",
            duration: 5 * 1000,
            position: "bottomRight",
            content: <NotifyTemplate compact item={data || {}} />,
          });
        }
      },
    });

  const HandleWarnVoice = () => {
    // console.log(1111111111111111)

    if (document.getElementById("iframe-voice")) {
      // @ts-ignore
      document.getElementById("iframe-voice")?.contentWindow.location.reload();
      return
    }
    let iframeNode = document.createElement("iframe");
    iframeNode.setAttribute("id", "iframe-voice");
    iframeNode.setAttribute("allow", "autoplay");
    iframeNode.setAttribute("src", "./static/mp3/alarm.mp3");
    iframeNode.style.display = "none";
    document.body.appendChild(iframeNode);
  }
  // useInterval(
  //   () => {
  //     Notification.info({
  //       notificationType: "system",
  //       duration: 5 * 1000,
  //       position: "bottomRight",
  //       content: (
  //         <NotifyTemplate
  //           compact
  //           item={{
  //             type: "monitorResult",
  //             content: "这是回复".repeat(50),
  //             feedback_message: {
  //               feedbackType: "这是反馈类型",
  //               description: "内容".repeat(50),
  //             },
  //           }}
  //         />
  //       ),
  //     });
  //   },
  //   3000,
  //   { immediate: true }
  // );

  return <Badge unread={unread} />;
};
export default RealtimeNotify;
