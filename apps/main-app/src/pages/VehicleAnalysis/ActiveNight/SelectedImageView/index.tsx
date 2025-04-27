import React, { useState } from "react";
import { BigImg, BottomRight, Card } from "@/components";
import type { TableViewProps } from "../TableView";
import "./index.scss";
import { ActiveNightItem } from "../interface";
import { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeFilterTags } from "@/store/slices/groupFilter";
const SelectedImageView: React.FC<TableViewProps> = (props) => {
  const { items, selected = [], onSeletedChange } = props;

  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0,
  });

  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false);
  // 大图
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index,
    });
  };
  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true);
    setBigImgModal({
      visible: false,
      currentIndex: index,
    });
  };
  const dispatch = useDispatch();
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });
  const handleCardFilter = ({ text, value, type }: GroupFilterCallBackType) => {
    const newFilterTags = filterTags.concat({
      type,
      text,
      value,
      tableName: "selected",
    });
    dispatch(changeFilterTags(newFilterTags));
  };
  const clickedItem =
    items[bigImgModal.currentIndex] ?? ({} as ActiveNightItem);
  return (
    <>
      {bottomRightMapVisible && (
        <BottomRight
          name={clickedItem.locationName || ""}
          lat={clickedItem.lngLat?.lat || ""}
          lng={clickedItem.lngLat?.lng || ""}
          onClose={() => {
            setBottomRightMapVisible(false);
            setBigImgModal({
              visible: false,
              currentIndex: 0,
            });
          }}
        />
      )}
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: () => {
            setBigImgModal({
              visible: false,
              currentIndex: 0,
            });
          },
        }}
        currentIndex={bigImgModal.currentIndex}
        onIndexChange={(index) => {
          setBigImgModal({
            visible: true,
            currentIndex: index,
          });
        }}
        data={items}
      />
      <div className="active-night-image-view">
        {items
          .map((item) => {
            item.nocturnalTimes = 0;
            return item;
          })
          .map((item, idx) => (
            <Card.Normal
              key={item.infoId}
              showImgZoom
              checked={selected.includes(item.infoId)}
              cardData={item}
              onImgClick={() => handleOpenBigImg(idx)}
              onLocationClick={() => handleLocationClick(idx)}
              onFilterChange={handleCardFilter}
              onChange={({ checked }) => {
                const newSelectedRowKeys = checked
                  ? [...selected, item.infoId]
                  : selected.filter((id) => id !== item.infoId);
                onSeletedChange?.(newSelectedRowKeys);
              }}
            />
          ))}
      </div>
    </>
  );
};

export default SelectedImageView;
