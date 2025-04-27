/**
 * @file 告警消息 审批消息
 */
import classnames from "classnames";
import "./index.scss";
import { createPortal } from "react-dom";
import { Icon } from "@yisa/webui/es/Icon";
import Badge from "./RealtimeNotify/Badge";
import SystemMessage from "./SystemMessage";
import { useToggle } from "ahooks";
import { useState } from "react";
import RealtimeNotify from "./RealtimeNotify";
const prefixCls = "realtime-message";
const RealtimeMessage = () => {
  const [systemMessageVisible, setSystemlMessageVisible] = useState(false);

  return (
    <section className={classnames(prefixCls)}>
      <div
        className="trigger"
        onClick={() => {
          setSystemlMessageVisible(!systemMessageVisible);
        }}
      >
        <Icon type="xiaoxi1" />
      </div>
      <SystemMessage
        visible={systemMessageVisible}
        onCancel={() => setSystemlMessageVisible(false)}
        footer={null}
      />
      <RealtimeNotify />
    </section>
  );
};

const RealtimeMessageWrapper = () => {
  return createPortal(<RealtimeMessage />, document.body);
};

export default RealtimeMessageWrapper;
