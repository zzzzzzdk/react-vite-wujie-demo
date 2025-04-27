import React, { useContext, useState } from "react";
import { Image, Divider, Statistic, Link, Checkbox } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import classnames from "classnames";
import "./index.scss";
import FooterLinks from "@/components/Card/FooterLinks";
import ColorfulPlate from "../../components/ColorfulPlate";
import { DeployTargetTextSetting } from "../../DeployDetail/interface";
import { WarningItem } from "../interface";
import { useToggle } from "ahooks";
import { BigImg } from "@/components";
import MapContext from "../MapContext";
import { useNavigate } from "react-router-dom";
import {
  isIdentityDeploy,
  isPictureDeploy,
  isVehicleDeploy,
} from "../../Deploy/interface";

type IconText = {
  iconfont: string;
  text?: string;
  customText?: React.ReactNode;
  onClick?: (...args: any[]) => void;
};

type WarningCardProps = {
  item: WarningItem;
  checked: boolean;
  onCheck?: (id: number | string) => void;
  onClick?: (id: number | string) => void;
};
export function WarningCard(props: WarningCardProps) {
  const { item, checked, onCheck, onClick } = props;
  const mapContext = useContext(MapContext);
  const navigate = useNavigate();
  //=======================icon==========================
  let icons: IconText[] = [];

  const vehicleDeploy = isVehicleDeploy(item.monitorType);
  const pictureDeploy = isPictureDeploy(item.monitorType);
  const identityDeploy = isIdentityDeploy(item.monitorType);
  // 是否显示相似度, 显示两张图片
  const isComparable = pictureDeploy || identityDeploy;
  const monitorTarget = item.monitorTarget;
  if (vehicleDeploy) {
    icons = [{ iconfont: "cheliangxinghao", text: item.carInfo }];
  }
  if (pictureDeploy) {
    // icons = [{ iconfont: "cheliangxinghao", text: item.personBasicInfo?.name }];
  }
  if (identityDeploy) {
    const params = {
      idNumber: monitorTarget?.license === '未知' ? '' : monitorTarget?.license,
      idType: "111",
      groupId: [],
      groupPlate: [],
    };

    const queryStr = encodeURIComponent(JSON.stringify(params));

    icons = [
      {
        iconfont: "xingming",
        customText: monitorTarget?.personName ? (
          <span className="person-info">
            <span>{monitorTarget.personName}</span>
            <Link href={`#/record-detail-person/?${queryStr}`} target="_blank">
              {monitorTarget.license}
            </Link>
          </span>
        ) : null,
      },
    ];
  }
  /* 公共部分: 抓拍时间 抓拍地点 */
  icons = [
    ...icons,
    { iconfont: "shijian", text: item.captureTime },
    {
      iconfont: "didian",
      text: item.locationName,
      onClick() {
        mapContext.showLngLat({
          name: item.locationName || "",
          lat: item.lngLat?.lat || "",
          lng: item.lngLat?.lng || "",
        });
      },
    },
  ];
  //=======================title==========================
  const title = vehicleDeploy
    ? DeployTargetTextSetting["Vehicle"]
    : pictureDeploy
      ? DeployTargetTextSetting["Picture"]
      : DeployTargetTextSetting["Identity"];
  // console.log(vehicleDeploy, pictureDeploy, identityDeploy);
  return (
    <section
      className={classnames("deploy-warning-card", {
        "deploy-warning-card-checked": checked,
      })}
    >
      <header>
        <h4>
          {/* {title.text}-{item.title} */}
          <Link href={`#/deployment/${item.jobId}`} target="_blank">
            {item.title}
          </Link>
        </h4>
        {/* <span title="布控单号">{item.jobId}</span> */}
        <Link href={`#/warning-detail/${item.resultId}`} target="_blank">
          <span>告警详情</span>
        </Link>
      </header>
      <main>
        <div
          className="images"
          onClick={() => {
            onClick?.(item.uniqueId);
          }}
        >
          {isComparable && <div className="img-item">
            <Image src={item.monitorTarget?.monitorTargetUrl} />
            <span className="tip">布控目标</span>
          </div>
          }
          <div className="img-item">
            <Image src={item.targetImage} />
            {
              isComparable && <span className="tip">告警目标</span>
            }
          </div>
          <Checkbox
            className="checkbox"
            checked={checked}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onCheck?.(item.uniqueId);
            }}
          />
        </div>
        {vehicleDeploy ? (
          <div className="plate">
            <a className="link">{item.licensePlate1}</a>
            <ColorfulPlate
              plate={item.licensePlate2}
              color={item.plateColorTypeId2}
            />
          </div>
        ) : (
          <Divider className="similarity" orientation="center">
            <Statistic
              value={item.similarity?.toFixed(2)}
              precision={2}
              suffix="%"
            />
          </Divider>
        )}

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
      </main>
      <footer>
        <FooterLinks cardData={item as any} />
      </footer>
    </section>
  );
}

//=======================title==========================

type WarningCardListProps = {
  items: WarningCardProps["item"][];
  selected?: (number | string)[];
  onSeletedChange?: (seleted: (string | number)[]) => void;
};
export default function WarningCardList(props: WarningCardListProps) {
  const { items, selected = [], onSeletedChange } = props;
  const handleChecked = (id: number | string) => {
    let newSelected = [];
    if (selected.includes(id)) {
      newSelected = selected.filter((i) => i !== id);
    } else {
      newSelected = [...selected, id];
    }
    onSeletedChange?.(newSelected);
  };

  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0,
  });
  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0,
    });
  };
  return (
    <div className="deploy-warning-card-list">
      {items.map((item) => (
        <WarningCard
          checked={selected.includes(item.uniqueId)}
          key={item.uniqueId}
          item={item}
          onCheck={handleChecked}
          onClick={(id) => {
            setBigImgModal({
              visible: true,
              currentIndex: items.findIndex((item) => item.uniqueId === id),
            });
          }}
        />
      ))}

      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: handleCloseBigImg,
        }}
        currentIndex={bigImgModal.currentIndex}
        onIndexChange={(index) => {
          setBigImgModal({
            visible: true,
            currentIndex: index,
          });
        }}
        data={items}
        matchesDesc="布控目标"
        resultDesc="告警目标"
      />
    </div>
  );
}
