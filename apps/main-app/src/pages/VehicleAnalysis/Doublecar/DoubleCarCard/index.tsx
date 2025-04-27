import React, { useEffect } from "react";
import { Card } from "@/components";
import "./index.scss";
import { isFunction } from "@/utils";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { DoubleCarCardProps } from "./interface";
function DoubleCarCard(props: DoubleCarCardProps) {
  const {
    cardData,
    onCheckedChange,
    checkedList = [],
    handleOpenBigImg,
    handleLocationClick,
  } = props;
  const handleCheckedChange = (data: {
    cardData: ResultRowType;
    checked: boolean;
  }) => {
    if (onCheckedChange && isFunction(onCheckedChange)) {
      onCheckedChange(data);
      console.log(data);
    }
  };
  return (
    <div className="double-box">
      <div className="title-box">
        <div>
          距离<span>{cardData.distance}</span>km
        </div>
        <div>
          时间差<span>{cardData.timedifference}</span>s
        </div>
        <div>
          时速<span>{cardData.speed}</span>km/h
        </div>
      </div>
      <div className="card-box">
        {cardData.doublecar.map(
          (item: ResultRowType, index: number, data: ResultRowType[]) => (
            <Card.Normal
              checked={
                checkedList.filter(
                  (it: ResultRowType) => it.infoId === item.infoId
                ).length > 0
              }
              key={item.infoId}
              cardData={item}
              onLocationClick={() => handleLocationClick(item)}
              onImgClick={() => handleOpenBigImg(index, data, cardData)}
              onChange={handleCheckedChange}
              hasCaptureTitle
            />
          )
        )}
      </div>
    </div>
  );
}

export default DoubleCarCard;
