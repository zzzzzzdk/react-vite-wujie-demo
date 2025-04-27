import React from "react";
import { Icon } from "@yisa/webui/es/Icon";
import {
  DeployStatusTextSetting,
  DeployItem,
  CloseType,
} from "../../DeployDetail/interface";
import './index.scss'

function DeployStatusIcon(props: { deployItem: DeployItem }) {
  const { deployItem } = props;
  const closeTypes: CloseType[] = ["close", "expire", "reject", "undo"];
  const closed = closeTypes.find((i) => i === deployItem.status);

  if (closed) {
    return (
      <span
        style={{
          borderRadius:'4px',
          width: "80px",
          height: "29px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: DeployStatusTextSetting["close"]?.backgroundColor,
        }}
        className="deploy-status-icon"
      >
        <Icon type={DeployStatusTextSetting["close"]?.iconfont}  />
        {DeployStatusTextSetting["close"]?.text}
      </span>
    );
  }

  return (
    <span
      style={{
        width: "80px",
        height: "29px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: DeployStatusTextSetting[deployItem.status]?.backgroundColor,
      }}
      className="deploy-status-icon"
    >
      <Icon type={DeployStatusTextSetting[deployItem.status]?.iconfont} />
      {DeployStatusTextSetting[deployItem.status]?.text}
    </span>
  );
}

export default DeployStatusIcon;
