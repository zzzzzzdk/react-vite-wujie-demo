import React from "react";
import { Icon } from "@yisa/webui/es/Icon";
import "./index.scss";
import { TextSetting } from "../../DeployDetail/interface";
import classnames from "classnames";
type Props = TextSetting & {
  className?: string;
  onClick?: (...args: any[]) => void;
};
function IconText(props: Props) {
  const { text = "", iconfont, className, onClick } = props;
  return (
    <div className={classnames("icon-text", className)} onClick={onClick}>
      <Icon className="icon" type={iconfont} />
      <span className="text">{text}</span>
    </div>
  );
}

export default IconText;
