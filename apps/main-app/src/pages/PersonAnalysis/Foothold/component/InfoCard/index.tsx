import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@yisa/webui/es/Icon";
import { Image, Checkbox } from "@yisa/webui";
import classnames from "classnames";
import { DetailCardType } from "./interface";
import "./index.scss";
import { isFunction } from "@/utils";
const leftText = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

export default function (props: DetailCardType) {
  const {
    index,
    cardData,
    // type='过夜',
    checked = false,
    onChange,
    active = false,
    onCardClick,
    type
  } = props;
  const {
    locationName,
    locationId,
    parkingCount,
    parkingFrequency,
    parkingActions,
    parkingLocations
  } = cardData;
  const tag = (type: string) => {
    let stylename = "";
    let message = "";
    switch (type) {
      case "night":
        stylename = "guoye";
        message = "过夜";
        break;
      case "days":
        stylename = "duori";
        message = "多日";
        break;
      case "short":
        stylename = "duanzan";
        message = "短暂";
        break;
    }
    return <span className={"tag " + stylename}>{message}</span>;
  };
  const handleCheckedChange = () => {
    if (isFunction(onChange) && onChange) {
      onChange(cardData);
    }
  };
  return (
    <div
      className={classnames("foothold-card-detail-item", {
        active: active,
      })}
      onClick={onCardClick}
    >
      {
        index && <span className="index">{index}</span>
        // <span className="index">{index}</span>
      }
      {/* <span onClick={(e) => { e.stopPropagation() }}>
        <Checkbox
          className="card-checked"
          checked={checked}
          onChange={handleCheckedChange}
        />
      </span> */}
      <div className="tag-box">
        {parkingActions.indexOf("days") > -1 ? tag("days") : ""}
        {parkingActions.indexOf("short") > -1 ? tag("short") : ""}
        {parkingActions.indexOf("night") > -1 ? tag("night") : ""}
      </div>
      <div className="sss">
        <div className={`item-location${type === 'vehicle' ? ' vehicle' : ''}`}>
          <Icon type="didian" />
          <div className="item-location-content" title={locationName}>
            {
              type && type === 'vehicle' ?
                parkingLocations ?
                  parkingLocations?.map((loc, i) => (
                    <p>{parkingLocations.length > 1 ? leftText[i] : ''} {loc}</p>
                  ))
                  : locationName || "-"
                :
                locationName || "-"
            }
          </div>
        </div>
        <div className="item-location">
          <Icon type="fill-jiachetonghang" />
          <div className="item-location-content">
            落脚次数 {parkingCount || "-"} 次
          </div>
        </div>
        <div className="item-location">
          <Icon type="fill-jiachetonghang" />
          <div className="item-location-content">
            落脚频率{" "}
            {(Math.round(parkingFrequency * 100) / 100).toFixed(2) || "-"} 次/周
          </div>
        </div>
      </div>
    </div>
  );
}
