import React, { useState } from "react";
import NormalProps from "./interface";
import { AspectRatioBox, ImgZoom } from "@/components";
import { Image, Tooltip, Checkbox } from "@yisa/webui";
import { CheckboxChangeEvent } from "@yisa/webui/es/Checkbox";
import { Icon } from "@yisa/webui/es/Icon";
import classNames from "classnames";
import { isFunction } from "@/utils";
import FooterLinks from "@/components/Card/FooterLinks";
import { validatePlate, jumpRecordVehicle } from "@/utils";
import "./index.scss";

function Card(props: NormalProps) {
  const {
    className,
    cardData = {},
    onImgClick = () => { },
    locationCanClick = true,
    onLocationClick,
    onCardClick,
    showChecked = true,
    checked = false,
    onChange,
    showImgZoom = false,
    onImgDragStart,
    onImgDragEnd,
    linkEleClick,
    draggable = false,
    hasfooter = true,
  } = props;
  const [stateChecked, setStateChecked] = useState(checked);
  const isChecked = "checked" in props ? checked : stateChecked;
  const handleCheckedChange = (event: CheckboxChangeEvent) => {
    if (!("checked" in props)) {
      setStateChecked(event.target.checked);
    }

    if (onChange && isFunction(onChange)) {
      onChange({
        cardData: cardData,
        checked: event.target.checked,
      });
    }
  };

  const handleCardClick = (event: React.MouseEvent) => {
    if (onCardClick) {
      onCardClick(event);
    }
  };

  const handleLocClick = (event: React.MouseEvent) => {
    if (onLocationClick) {
      onLocationClick(event);
    }
  };

  // 拖拽事件
  const handleImgDragStart = (event: React.DragEvent) => {
    event.dataTransfer.dropEffect = "copy";
    event.dataTransfer.effectAllowed = "all";
    event.dataTransfer.setData("Text", JSON.stringify(cardData));
    if (onImgDragStart && isFunction(onImgDragStart)) {
      console.log(event);
      onImgDragStart(event);
    }
  };

  const handleImgDragEnd = (event: React.DragEvent) => {
    if (onImgDragEnd && isFunction(onImgDragEnd)) {
      onImgDragEnd(event);
    }
  };

  return (
    <div
      className={classNames("card-normal-item", className, {
        checked: isChecked,
      })}
      onClick={handleCardClick}
    >
      <AspectRatioBox className="card-img" ratio={188 / 188}>
        {showChecked ? (
          <Checkbox
            className="card-checked"
            checked={isChecked}
            onChange={handleCheckedChange}
          />
        ) : (
          ""
        )}
        <div
          className="card-img-inner"
          onClick={onImgClick}
          onDragStart={handleImgDragStart}
          onDragEnd={handleImgDragEnd}
          draggable={!showImgZoom}
        >
          {showImgZoom ? (
            <ImgZoom imgSrc={cardData.targetImage} draggable={draggable} />
          ) : (
            <Image src={cardData.targetImage} />
          )}
        </div>
      </AspectRatioBox>
      {cardData.licensePlate1 ? (
        <div className="card-info plate-wrap">
          {cardData.licensePlate1Url &&
            cardData.licensePlate1Url != "" &&
            validatePlate(cardData.licensePlate1) ? (
            <a
              target="_blank"
              href={cardData.licensePlate1Url}
              className={"plate-text"}
            >
              {cardData.licensePlate1}
            </a>
          ) : (
            <span
              className={"plate-text plate-error"}
            >
              {cardData.licensePlate1}
            </span>
          )}
          {cardData.licensePlate2 ? (
            <Tooltip placement="bottom" title="二次识别">
              {cardData.licensePlate2 === '未识别' ?
                (
                  <span className={`plate2-text plate-bg plate-color-8`}></span>
                )
                :
                (
                  <a
                    target="_blank"
                    href={jumpRecordVehicle(cardData.licensePlate2, cardData.plateColorTypeId2)}
                    className={`plate2-text plate-bg plate-color-${cardData.plateColorTypeId2}`}>{cardData.licensePlate2}
                  </a>
                )

              }
            </Tooltip>
          ) : null}
        </div>
      ) : null}
      {cardData.carInfo ? (
        <div className="card-info">
          {cardData.drivingLibraryModel ? <div className="card-info-label">识别车型：</div> : <Icon type="cheliangxinghao" />}
          <div className="card-info-content" title={cardData.carInfo}>
            {cardData.carInfo || "-"}
          </div>
        </div>
      ) : (
        ""
      )}
      {cardData.drivingLibraryModel ? (
        <div className="card-info">
          <div className="card-info-label">登记车型：</div>
          <div className="card-info-content" title={cardData.drivingLibraryModel}>
            {cardData.drivingLibraryModel || "-"}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="card-info">最近抓拍:</div>
      {cardData.captureTime ? (
        <div className="card-info">
          <Icon type="shijian" />
          <div className="card-info-content">{cardData.captureTime || "-"}</div>
        </div>
      ) : null}
      {cardData.locationName ||
        (cardData.lngLat?.lng && cardData.lngLat?.lat) ? (
        <div className="card-info">
          <Icon type="didian" />
          <div
            className={classNames("card-info-content location", {
              "can-click": locationCanClick,
            })}
            title={cardData.locationName || "-"}
            onClick={locationCanClick ? handleLocClick : () => { }}
          >
            {cardData.locationName || "-"}
          </div>
        </div>
      ) : (
        ""
      )}
      {cardData.daysElapsed ? (
        <div className="card-info">
          <Icon type="zhuapaicishu"></Icon>
          <div className="card-info-content">
            出现
            <span className="card-info-content-daysElapsed">
              {cardData.daysElapsed || 0}
            </span>
            天
          </div>
        </div>
      ) : null}
      {hasfooter ? (
        <FooterLinks eleClick={linkEleClick} cardData={cardData} />
      ) : null}
    </div>
  );
}

export default Card;
