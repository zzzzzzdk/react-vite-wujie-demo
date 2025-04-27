import React from "react";
import { Image, Divider, Statistic, Link } from "@yisa/webui";
import classnames from "classnames";
import "./index.scss";
import ColorfulPlate from "../../components/ColorfulPlate";
import {
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
} from "../../Deploy/interface";
import { WarningItem } from "../../DeployWarning/interface";

import { Icon } from "@yisa/webui/es/Icon";
import { ColorfulLabelList } from "../../components/ColorfulLabel";
export type IconTextType = {
  iconfont: string;
  text?: string;
  customText?: React.ReactNode;
  onClick?: (...args: any[]) => void;
};

type AlarmCardProps = {
  item: WarningItem;
  checked: boolean;
  onCheck?: (id: number | string) => void;
  onClick?: (id: number | string) => void;
};
export function AlarmCard(props: AlarmCardProps) {
  const { item, checked, onClick } = props;
  //=======================icon==========================
  let specialIcons: IconTextType[] = [];
  let commonIcons: IconTextType[] = [];

  const originalInfo = item.monitorTarget;

  const vehicleDeploy = isVehicleDeploy(item.monitorType);
  const pictureDeploy = isPictureDeploy(item.monitorType);
  const identityDeploy = isIdentityDeploy(item.monitorType);
  // 是否显示相似度, 显示两张图片
  const isComparable = pictureDeploy || identityDeploy;

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
      {
        iconfont: "renyuanku1",
        customText: item.monitorTarget?.labelInfos?.length ? (
          <ColorfulLabelList
            key={item.infoId}
            labels={item.monitorTarget?.labelInfos ?? []}
          />
        ) : (
          "-"
        ),
      },
    ];
  }
  if (pictureDeploy) {
  }
  if (identityDeploy) {
    specialIcons = [
      {
        iconfont: "xingming",
        text: item?.monitorTarget?.personName || "",
      },
      {
        iconfont: "shenfenzheng",
        text: originalInfo?.license,
        onClick() {
          const params = {
            idNumber: originalInfo?.license === '未知' ? '' : originalInfo?.license,
            idType: "111",
            groupId: [],
            groupPlate: [],
          };

          const queryStr = encodeURIComponent(JSON.stringify(params));
          window.open(`#/record-detail-person/?${queryStr}`);
        },
      },
      {
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
      },
    ];
  }

  /* 公共部分: 抓拍时间 抓拍地点 */
  commonIcons = [
    ...commonIcons,
    { iconfont: "shijian", text: item.captureTime },
    {
      iconfont: "didian",
      // text: item.locationName,
      customText: <span className="location">{item.locationName}</span>,
    },
  ];
  return (
    <section
      className={classnames("deploy-alarm-card", {
        "deploy-warning-card-checked": checked,
      })}
    >
      <header>
        {item.title}-
        <Link href={`#/deployment/${item.jobId}`} target="_blank">
          {item.jobId}
        </Link>
      </header>
      <main>
        <div
          className={classnames("images", {
            "images--single": !isComparable,
          })}
          onClick={() => {
            onClick?.(item.infoId);
          }}
        >
          {isComparable && (
            <>
              <div className="image-wrapper">
                <span>目标图</span>
                <Image src={item?.monitorTarget?.monitorTargetUrl} />
              </div>

            </>
          )}
          <span></span>
          <div className="image-wrapper">
            <span>抓拍图</span>
            <Image src={item.targetImage} />
          </div>
        </div>
        {
          item.targetType === 'vehicle' ?
            <div className="line-spacing"></div>
            :
            <Divider className="similarity" orientation="center">
              <Statistic value={item.similarity} precision={2} suffix="%" />
            </Divider>
        }
        <div className="info">
          {specialIcons.length > 0 && (
            <div className="special">
              {specialIcons.map((item, idx) => {
                // console.log(item)
                const isLink = item.iconfont === "shenfenzheng"
                return (
                  <div key={idx} className={classnames("item", {
                    "is-link": isLink
                  })}>
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
          )}
          <div className="common">
            {commonIcons.map((item, idx) => {
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
      </main>
    </section>
  );
}
