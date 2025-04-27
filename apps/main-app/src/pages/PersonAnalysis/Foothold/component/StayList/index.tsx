import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@yisa/webui/es/Icon";
import { Image, Divider } from "@yisa/webui";
// import { ImgZoom } from '@/components'
import classnames from "classnames";
import "./index.scss";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { StayListProps } from "./interface";
export default function (props: StayListProps) {
  const {
    index,
    cardData,
    onImgClick = () => {},
    onCardClick,
    active = false,
    // target
  } = props;
  // const { target, peer } = cardData
  const mark = (arr: ResultRowType[], index: number) => {
    if (arr.length === 2) {
      if (
        arr[0].lngLat.lat === arr[1].lngLat.lat &&
        arr[0].lngLat.lng === arr[1].lngLat.lng
      ) {
        if (index == 1) {
          return <span className="gait-number">最晚抓拍</span>;
        }
        return <span className="gait-number">最早抓拍</span>;
      } else {
        if (index == 1) {
          return <span className="gait-number">落脚点B</span>;
        } else {
          return <span className="gait-number">落脚点A</span>;
        }
      }
    } else {
      return <span className="gait-number">落脚点</span>;
    }
  };
  const handleImgClick = (
    event: React.MouseEvent,
    item: ResultRowType,
    index: number
  ) => {
    console.log(item, index);

    if (onImgClick) {
      onImgClick(item.infoId);
    }
  };
  return (
    <div
      className={classnames("card-detail-itemt", {
        active: active,
      })}
      onClick={onCardClick}
    >
      {
        index && <span className="index">{index}</span>
        // <span className="index">{index}</span>
      }
      <div className="infos-con">
        {cardData.personInfo.map(
          (item: ResultRowType, index: number, arr: ResultRowType[]) => {
            return (
              <div
                className="identify-img-item"
                key={index}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="img-wrap"
                  onClick={(e) => {
                    handleImgClick(e, item, index);
                  }}
                >
                  <Image src={item.targetImage} />
                  {mark(arr, index)}
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className="sss">
        <div className="item-location">
          <Icon type="shijian" />
          <div className="item-location-content">{cardData.parkingTime}</div>
        </div>
        <div className="item-location">
          <Icon type="shichangicon" />
          <div className="item-location-content">
            落脚时长 {cardData.duration || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
