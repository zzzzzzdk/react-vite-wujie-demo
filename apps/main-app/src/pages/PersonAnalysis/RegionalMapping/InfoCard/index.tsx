import React, { useEffect } from "react";
import { InfoCardPropsType } from "./interface";
import "./index.scss";
import { ImgZoom } from "@/components";
import { Checkbox, Image } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import "./index.scss";

export default function InfoCard(props: InfoCardPropsType) {
  const {
    tab = "1",
    data = {},
    active = false,
    // checked = false,
    onHandleCard = () => {},
    // onChange = () => { },
  } = props;

  const renderLocation = (
    data: {
      captureTime: string;
      locationName: string;
    },
    title: string = ""
  ) => {
    const { captureTime = "", locationName = "" } = data;
    return (
      <div>
        <span>{title}</span>
        <div>
          <Icon type="shijian" />
          <span>{captureTime}</span>
        </div>
        <div className="location" title={locationName}>
          <Icon type="didian" />
          <span>{locationName}</span>
        </div>
      </div>
    );
  };

  const renderDubious = () => {
    const {
      name = "未知",
      stayTime = 0,
      targetImage = "",
      firstCaptureTime = "",
      firstLocationName = "",
      lastCaptureTime = "",
      lastLocationName = "",
    } = data;

    return (
      <>
        <div className="left">
          <div className="target-img" draggable={false}>
            {/* <ImgZoom imgSrc={targetImage} draggable={false} /> */}
            {/* ImgZoom图片加载性能问题 */}
            <Image src={targetImage} />
          </div>
          <div
            className="target-info"
            title={name || "未知" + "停留" + stayTime + "h"}
          >
            <span className="name">{name || "未知"}</span>
            停留
            <span className="time">{stayTime}</span>h
          </div>
        </div>
        <div className="right">
          {renderLocation(
            { captureTime: lastCaptureTime, locationName: lastLocationName },
            "最后离开信息:"
          )}
          {renderLocation(
            { captureTime: firstCaptureTime, locationName: firstLocationName },
            "最早出现信息:"
          )}
        </div>
        {/* <Checkbox
          className="card-checkbox"
          checked={checked}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(e.target.checked)}
        /> */}
      </>
    );
  };

  const rederPeer = () => {
    const {
      targetName = "未知",
      targetImage = "",
      firstCaptureTime = "",
      firstLocationName = "",
      lastCaptureTime = "",
      lastLocationName = "",
      count = 0,
      peerName = "未知",
      peerImage = "",
    } = data;
    return (
      <>
        <div className="left">
          <div className="num-box">
            {/* <Checkbox
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onChange(e.target.checked)}
              checked={checked}
            /> */}
            <span>共{count || 0}次同行</span>
          </div>
          <div className="img-box">
            <div className="peer-img">
              <div draggable={false}>
                <Image src={peerImage} draggable={false} />
              </div>
              <div className="name">{peerName || "未知"}</div>
            </div>
            <div className="dubious-img">
              <div draggable={false}>
                <Image src={targetImage} draggable={false} />
              </div>
              <div className="name">{targetName || "未知"}</div>
            </div>
          </div>
        </div>
        <div className="right">
          {renderLocation(
            { captureTime: lastCaptureTime, locationName: lastLocationName },
            "最后离开信息:"
          )}
          {renderLocation(
            { captureTime: firstCaptureTime, locationName: firstLocationName },
            "最早出现信息:"
          )}
        </div>
      </>
    );
  };

  useEffect(() => {
    document
      .querySelector(".person-regional-mapping-info-card.active")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [active]);

  return (
    <div
      className={`person-regional-mapping-info-card
      ${tab === "1" ? "dubious" : "peer"}
      ${active ? "active" : ""}`}
      onClick={onHandleCard}
    >
      {tab === "1" ? renderDubious() : rederPeer()}
    </div>
  );
}
