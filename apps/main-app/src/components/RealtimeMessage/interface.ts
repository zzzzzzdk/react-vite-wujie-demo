import { ResultRowType } from "@/pages/Search/Target/interface";
import { isObject } from "lodash";

export type MessageType =
  | "prompt"
  | "feedback"
  | "monitorResult"
  | "monitorState"
  | "archAppState";

export const MessageTypeSetting: Record<
  MessageType,
  {
    text: string;
    backgroundColor: React.CSSProperties["backgroundColor"];
  }
> = {
  archAppState: { text: "档案", backgroundColor: "#ff8d1a" },
  feedback: { text: "回复", backgroundColor: "#00cc66" },
  monitorResult: { text: "布控", backgroundColor: "#ff8d1a" },
  monitorState: { text: "布控", backgroundColor: "#ff8d1a" },
  prompt: { text: "消息", backgroundColor: "#ff8d1a" },
};

type Feedback = Record<
  | "feedbackPerson" // 反馈人
  | "feedbackTime" // 时间
  | "feedbackType" // 类型
  | "description", //描述
  string
>;

export type MessageRecord = {
  // id为前端生成，需要自己处理
  id: string;
  type?: MessageType;
  type_data?: 1 | 2 | 3; // pdm 布控 人员
  content?: string;
  create_time?: string;
  // 额外信息
  to_id?: "";
  feedback_message?: Partial<Feedback>;
  link_url?: string;
  image_url?: string;
} & ResultRowType;

type UnreadCount = {
  unread_count?: number;
};

/* WS推这两种格式的消息, 将接口分开，方式单个接口膨胀太快 */
export type MessageProtocol = MessageRecord | UnreadCount;

export const isUnReadCount = (data: MessageProtocol): data is UnreadCount => {
  return isObject(data) && "unread_count" in data;
};

export const isMessageRecord = (
  data: MessageProtocol
): data is MessageRecord => {
  return (
    isObject(data) && Object.keys(MessageTypeSetting).includes(data["type"])
  );
};

export const MagicStr = "__SYS_SHOW_NOTIFY";
