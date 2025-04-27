import services from "@/services";
import { Message, Modal, Tabs, Switch, Space } from "@yisa/webui";
import type { ModalProps } from "@yisa/webui/es/Modal/interface";
import React, { useEffect, useState } from "react";
import { MagicStr, MessageProtocol, MessageRecord } from "../interface";
import MessageStack from "./MessageStack";
import "./index.scss";
import { useLocalStorageState, useMount } from "ahooks";
import { ResultBox } from "@yisa/webui_business";
import { uniqueId } from "lodash";
type MessagePanelProps = ModalProps;
type RecordType = "history" | "unread";

const fetchHistory = () => {
  return services.notify.getHistoryMessage<any, string | MessageRecord>();
};

const fetchUnread = () => {
  return services.notify.getUnreadMessage<any, string | MessageRecord>();
};

const MessagePanel: React.FC<MessagePanelProps> = (props) => {
  const [showNotify, setShowNotify] = useLocalStorageState<boolean>(MagicStr, {
    defaultValue: true,
  });

  const [recordList, setRecordList] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "unread">("unread");

  const fetchRecordList = (type: RecordType = "history") => {
    const fetcher = type === "history" ? fetchHistory : fetchUnread;
    setLoading(true);
    fetcher()
      .then((res) => {
        if (!res.data || !Array.isArray(res.data)) {
          setRecordList([]);
          return;
        }
        if (res.data.length <= 0) {
          setRecordList([]);
          return;
        }

        const rawData = res.data;
        /**
         * 返回的数据可能是字符串格式需要JSON.parse
         */
        if (typeof rawData[0] === "string") {
          try {
            setRecordList(
              res.data
                .map((t) => JSON.parse(t as string))
                .map((t) => {
                  return {
                    ...t,
                    id: t.id ?? uniqueId("@REALTIME@"),
                  };
                })
            );
          } catch (e) {
            throw Error("MessagePanel解析错误");
          }
        } else {
          setRecordList(
            (rawData as MessageRecord[]).map((t) => {
              return {
                ...t,
                id: t.id ?? uniqueId("@REALTIME@"),
              };
            })
          );
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (props.visible) {
      fetchRecordList(activeTab);
    }
  }, [props.visible]);
  return (
    <Modal
      //  重新挂载组件，保证打开时会在body最下面，否者会被大图遮住
      key={String(props.visible)}
      title="系统消息"
      {...props}
      width={"800px"}
      className="message-panel"
      wrapClassName="message-panel-wrap"
      maskStyle={{
        zIndex: 2022
      }}
    >
      <div className="message-panel__switch">
        <Space>
          <span>悬浮提示:</span>
          <Switch
            checkedChildren={"开启"}
            unCheckedChildren={"关闭"}
            checked={showNotify}
            onChange={(e) => {
              setShowNotify(e);
            }}
          />
        </Space>
      </div>
      <Tabs
        type="line"
        activeKey={activeTab}
        data={[
          { key: "unread", name: "未读消息" },
          { key: "history", name: "全部消息" },
        ]}
        onChange={(k) => {
          console.log(k);
          setActiveTab(k as any);
          fetchRecordList(k as any);
        }}
      />
      <ResultBox
        loading={loading}
        nodata={recordList.length <= 0}
        nodataTip="暂无消息"
      >
        <MessageStack visible={props.visible!} recordList={recordList} />
      </ResultBox>
    </Modal>
  );
};
export default MessagePanel;
