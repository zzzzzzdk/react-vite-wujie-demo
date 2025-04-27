import HistoryStack from "@/components/RealtimeMessage/SystemMessage/MessageStack";
import useRealtimeNotification from "@/components/RealtimeMessage/useRealtimeNofication";
import {
  MessageRecord,
  isMessageRecord,
} from "@/components/RealtimeMessage/interface";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Card from "../Card";
import services from "@/services";
import dayjs from "dayjs";
import { uniqueId } from "lodash";
import { useHover } from "ahooks";

const PersonProfile = () => {
  // 只放200条数据
  const [buffer, setBuffer] = useState<MessageRecord[]>([]);

  const [recordList, setRecordList] = useState<MessageRecord[]>([]);

  const [loading, setLoading] = useState(false);
  useRealtimeNotification((data) => {
    if (isMessageRecord(data)) {
      setBuffer((previous) => {
        const newRecordList = [...previous];
        return [data, ...newRecordList].slice(0, 200);
      });
    }
  });
  // 测试代码
  // useEffect(() => {
  //   setInterval(() => {
  //     setBuffer((previous) => {
  //       const newRecordList = [...previous];
  //       const item: MessageRecord = {
  //         id: uniqueId(),
  //         content:
  //           "[测试布控单关闭] 于 2024-01-23 01:09:34 在 [大珠山中路临港卡口1] 检测到目标 [张三] 告警。" +
  //           Math.random(),
  //         type: "monitorResult",
  //         type_data: 2,
  //         link_url: "/fusion3/#/deploy-warning/185/",
  //         image_url:
  //           Math.random() > 0.5
  //             ? "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F81_e5c5f7e4-9570-11ed-98ea-3473790e9619.jpg&xywh=770%2C866%2C106%2C138"
  //             : "http://192.168.5.82:9898/image_proxy?exactly=1&img_uuid=http%3A%2F%2F192.168.7.206%3A8000%2F75_e03c50ac-9570-11ed-98ea-3473790e9619.jpg&xywh=593%2C293%2C128%2C148",
  //         create_time: "2024-01-23 09:17:58",
  //       };
  //       return [item, ...newRecordList].slice(0, 200);
  //     });
  //   }, 1000);
  // }, []);
  // 获取初始数据
  const fetchRecordList = () => {
    setLoading(true);
    services.notify
      .getHistoryMessage()
      .then((res) => {
        if (!res.data || !Array.isArray(res.data)) {
          setBuffer([]);
          return;
        }
        if (res.data.length <= 0) {
          setBuffer([]);
          return;
        }

        const rawData = res.data;
        /**
         * 返回的数据可能是字符串格式需要JSON.parse
         */
        if (typeof rawData[0] === "string") {
          try {
            setBuffer(res.data.map((t) => JSON.parse(t as string)));
          } catch (e) {
            throw Error("MessagePanel解析错误");
          }
        } else {
          setBuffer(rawData as MessageRecord[]);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // 初始化
  useEffect(() => {
    fetchRecordList();
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const hovering = useHover(ref);
  useEffect(() => {
    if (hovering) return;
    console.log(hovering);
    // 列表更新时机：鼠标 不 悬浮在个人中心
    setRecordList(buffer);
  }, [hovering, buffer]);

  return (
    <Card
      iconfont="gerenzhongxin1"
      title="个人中心"
      // title={hovering ? "hover" : "not hover"}
    >
      <div
        ref={ref}
        style={{
          transition: "all 0.3s ease",
        }}
      >
        <HistoryStack visible recordList={recordList} />
      </div>
    </Card>
  );
};
PersonProfile.displayName = "PersonProfile";
export default PersonProfile;
