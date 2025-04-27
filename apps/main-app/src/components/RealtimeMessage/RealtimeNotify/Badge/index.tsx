import { useState } from "react";
import "./index.scss";
import { useInterval } from "ahooks";
import services from "@/services";
import { isNumber } from "@/utils";
import classnames from "classnames";
type BadgeProps = {
  unread?: number;
};
const Badge: React.FC<BadgeProps> = (props) => {
  const {unread} = props
  // const [unread, setUnread] = useState(0);
  // /* 定时请求未读消息，暂定间隔60s */
  // useInterval(
  //   () => {
  //     services.notify
  //       .getUnreadMessageCount<any, number>()
  //       .then((res) => {
  //         const data = res.data;
  //         if (!isNumber(data)) return;
  //         setUnread(data ?? 0);
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   },
  //   60 * 1000,
  //   { immediate: true }
  // );
  if (!unread) return null;
  const fmt = unread > 99 ? "99+" : unread;
  return (
    <div
      className={classnames("realtime-badge", {
        max: unread > 99,
      })}
    >
      {fmt}
    </div>
  );
};
export default Badge;
