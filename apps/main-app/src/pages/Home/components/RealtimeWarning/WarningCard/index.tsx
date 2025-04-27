import React from "react";
import { Image, Divider, Statistic, Link } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import classnames from "classnames";
import "./index.scss";
import { WarningItem } from "@/pages/Deploy/DeployWarning/interface";
import {
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
} from "@/pages/Deploy/Deploy/interface";
import ColorfulPlate from "@/pages/Deploy/components/ColorfulPlate";
import { ColorfulLabelList } from "@/components";

export type IconTextType = {
  iconfont: string;
  text?: string;
  customText?: React.ReactNode;
  onClick?: (...args: any[]) => void;
};

type WarningCardProps = {
  item: WarningItem;
  onClick?: (...args: any[]) => void;
};
export function WarningCard(props: WarningCardProps) {
  const { item, onClick } = props;
  //=======================icon==========================
  let specialIcons: IconTextType[] = [];
  let commonIcons: IconTextType[] = [];

  const originalInfo = item.monitorTarget;

  const vehicleDeploy = isVehicleDeploy(item.monitorType);
  const pictureDeploy = isPictureDeploy(item.monitorType);
  const identityDeploy = isIdentityDeploy(item.monitorType);

  if (vehicleDeploy) {
    // TODO 车型 品牌
    specialIcons = [
      {
        iconfont: "chepai",
        customText: (
          <ColorfulPlate
            plate={item.licensePlate2}
            color={item.plateColorTypeId2}
          />
        ),
      },
      { iconfont: "cheliangxinghao", text: item.carInfo },
    ];
  }
  if (pictureDeploy) {
  }
  if (identityDeploy) {
    specialIcons = [
      {
        iconfont: "xingming",
        text: "",
      },
      {
        iconfont: "shenfenzheng",
        text: originalInfo?.license,
      },
    ];
  }

  /* 公共部分: 抓拍时间 抓拍地点 */
  commonIcons = [
    { iconfont: "shijian", text: item.captureTime },
    {
      iconfont: "didian",
      text: item.locationName,
    },
  ];
  // 如果由标签，显示标签
  if (item.monitorTarget?.labelInfos) {
    commonIcons.push({
      iconfont: "renyuanku1",
      text: item.infoId,
      customText: item.monitorTarget?.labelInfos?.length ? (
        <ColorfulLabelList
          key={item.infoId}
          labels={item.monitorTarget?.labelInfos ?? []}
        />
      ) : (
        "-"
      ),
    });
  }
  const prefixCls = "realtime-warning-card";
  return (
    <section
      className={prefixCls}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div className={`${prefixCls}-image`}>
        <span>告警目标</span>
        <Image src={item.targetImage} />
      </div>
      <div className={`${prefixCls}-info`}>
        <p
          className="similarity"
          style={{
            opacity: item.similarity ? 1 : 0,
          }}
        >
          <Statistic
            value={item.similarity || 0}
            precision={2}
            valueStyle={{ color: "#FF5B4D" }}
            suffix="%"
          />
        </p>
        <p className="title">{item.title}</p>
        <div className="group">
          {[...specialIcons, ...commonIcons].map((item, idx) => {
            return (
              <div key={idx} className="item">
                <Icon type={item.iconfont} />
                {item.customText ? (
                  item.customText
                ) : (
                  <span className="text" title={item.text}>
                    {item.text || "-"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
