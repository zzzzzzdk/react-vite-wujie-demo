import React, { useEffect } from "react";
import { DetailCardPropsType } from "./interface";
import "./index.scss";
import { ImgZoom } from "@/components";
import { Icon } from "@yisa/webui/es/Icon";
import { Image } from "@yisa/webui";
import "./index.scss";

export default function DetailCard(props: DetailCardPropsType) {
  const {
    index = 0,
    tab = "1",
    data = {},
    active = false,
    onHandleCard = () => {},
    onHandleCardImg = () => {},
  } = props;

  const renderCard = () => {
    const {
      targetImage = "",
      captureTime = "",
      locationName = "",
      status = 0,
    } = data;
    return (
      <>
        <div className="img" onClick={handleImg}>
          <Image src={targetImage} />
        </div>
        <div>
          <Icon type="shijian" />
          <span>{captureTime}</span>
        </div>
        <div className="location" title={locationName}>
          <Icon type="didian" />
          <span>{locationName}</span>
          {status ? (
            <span className={`status ${status === -1 ? "go" : "out"}`}>
              {status === -1 ? "进入" : "离开"}
            </span>
          ) : null}
        </div>
        <div className="index">{index}</div>
      </>
    );
  };

  const handleImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHandleCardImg();
  };

  useEffect(() => {
    if (active) {
      document
        .querySelector(".person-regional-mapping-detail-card.active")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  }, [active]);

  return (
    <div
      className={`person-regional-mapping-detail-card
      ${tab === "1" ? "dubious" : "peer"}
      ${active ? "active" : ""}`}
      onClick={onHandleCard}
    >
      {renderCard()}
    </div>
  );
}
