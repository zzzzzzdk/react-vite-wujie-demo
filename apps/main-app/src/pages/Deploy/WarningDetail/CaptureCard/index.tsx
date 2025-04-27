import React, { useState, useEffect, useRef } from "react";
import { Image } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import classnames from "classnames";
import "./index.scss";
import { WarningItem } from "../../DeployWarning/interface";

type CaptureCardProps = {
  active?: boolean;
  index?: number;
  item: WarningItem;
  onClick: () => void;
};
export default function (props: CaptureCardProps) {
  const { active, item, index, onClick } = props;
  let icons = [
    {
      iconfont: "shijian",
      title: "告警时间",
      text: item.captureTime,
    },
    {
      iconfont: "didian",
      title: "告警地点",
      text: item.locationName,
    },
  ];
  return (
    <div
      className={classnames("card-detail-item", {
        active: active,
      })}
      onClick={onClick}
    >
      <span className="index">{index}</span>
      <div className="layout">
        <div className="image">
          <Image src={item.targetImage} />
        </div>
        <div className="info">
          {icons.map((item, idx) => {
            return (
              <div key={idx} className="info__item">
                <div className="icon">
                  <Icon type={item.iconfont} />
                  {item.title}
                </div>
                <div className="text" title={item.text}>
                  {item.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
