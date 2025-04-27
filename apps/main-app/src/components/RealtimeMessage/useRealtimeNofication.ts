import { getToken } from "@/utils";
import { Notification } from "@yisa/webui";
import { useInterval, useWebSocket } from "ahooks";
import { useEffect, useState } from "react";
import "./index.scss";
import { MessageProtocol, isMessageRecord, isUnReadCount } from "./interface";
import { uniqueId } from "lodash";
const REMOTE_URL = window.YISACONF.websocketUrl || "ws://localhost:3004/ws";
const useRealtimeNotification = (
  callback?: (data: MessageProtocol) => void
) => {
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
        let data:MessageProtocol = {};
        try {
          data =
            typeof message.data == "string"
              ? JSON.parse(message.data)
              : message.data;
        } catch (error) {
          console.error("格式有误");
          data = {};
        }
        callback?.({ ...data, id: uniqueId("@REALTIME@") });
      },
    });
};
export default useRealtimeNotification;
