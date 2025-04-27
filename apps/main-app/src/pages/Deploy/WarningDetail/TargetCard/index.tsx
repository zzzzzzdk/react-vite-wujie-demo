import React, { useState, useEffect, useRef } from "react";
import { Image } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import classnames from "classnames";
import "./index.scss";
import { WarningItem } from "../../DeployWarning/interface";
import {
  isVehicleDeploy,
  isIdentityDeploy,
  isPictureDeploy,
} from "../../Deploy/interface";
import ColorfulPlate from "../../components/ColorfulPlate";
import { ColorfulLabelList } from "../../components/ColorfulLabel";
import useVehicleBrands from "../../hooks/useVehicleBrands";
import useVehicleTypes from "../../hooks/useVehicleTypes";

type CaptureCardProps = {
  item?: WarningItem;
  active?: boolean;
  index?: number;
  onClick?: () => void;
};
type IconText = {
  iconfont: string;
  text?: string;
  customText?: React.ReactNode;
  onClick?: (...args: any[]) => void;
};
export default function (props: CaptureCardProps) {
  const { active, item } = props;
  const monitorTarget = item?.monitorTarget;
  const vehicleDeploy = isVehicleDeploy(item?.monitorType);
  const pictureDeploy = isPictureDeploy(item?.monitorType);
  const identityDeploy = isIdentityDeploy(item?.monitorType);

  const vehicleBrands = useVehicleBrands();
  const vehicleTypes = useVehicleTypes();
  // 是否显示相似度, 显示两张图片
  const isComparable = pictureDeploy || identityDeploy;
  let icons: IconText[] = [];
  let deployType = "";
  // special
  if (vehicleDeploy) {
    deployType = "车辆布控";
    const info = [
      vehicleTypes.find(
        (v) => v.value === (monitorTarget?.vehicleTypeId as any)
      )?.text,
      vehicleBrands[monitorTarget?.brandId!]?.v,
    ].filter(Boolean);
    icons = [
      {
        iconfont: "chepai",
        customText: (
          <ColorfulPlate
            plate={monitorTarget?.licensePlate}
            color={monitorTarget?.plateColorTypeId as any}
          />
        ),
      },
      { iconfont: "cheliangxinghao", text: info.join("-") },
    ];
  }
  if (pictureDeploy) {
    deployType = "人脸布控";
  }
  if (identityDeploy) {
    deployType = "人员布控";
    icons = [
      {
        iconfont: "xingming",
        text: monitorTarget?.personName,
      },
      {
        iconfont: "shenfenzheng",
        text: monitorTarget?.license,
        onClick() {
          const params = {
            idNumber: monitorTarget?.license === '未知' ? '' : monitorTarget?.license,
            idType: "111",
            groupId: [],
            groupPlate: [],
          };

          const queryStr = encodeURIComponent(JSON.stringify(params));
          window.open(`#/record-detail-person/?${queryStr}`);
        },
      },
    ];
  }
  // common
  icons = [
    ...icons,
    { iconfont: "bukongleixing", text: deployType },

    {
      iconfont: "renyuanku1",
      customText: monitorTarget?.labelInfos?.length ? (
        <ColorfulLabelList
          key={item?.infoId}
          labels={monitorTarget?.labelInfos ?? []}
        />
      ) : (
        "-"
      ),
    },
    // { iconfont: "renyuanku1", text: item?.infoId },
  ];
  return (
    <div
      className={classnames("target-card", {
        active: active,
      })}
    >
      <div className="layout">
        <div className="image">
          {<Image src={monitorTarget?.monitorTargetUrl} />}
        </div>
        <div className="info">
          {icons.map((item, idx) => {
            return (
              <div key={idx} className="item">
                <Icon type={item.iconfont} />
                {item.customText ? (
                  item.customText
                ) : (
                  <span
                    className="text"
                    title={item.text}
                    onClick={item.onClick}
                  >
                    {item.text || "-"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
