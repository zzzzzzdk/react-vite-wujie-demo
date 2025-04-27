import React, { useState } from "react";
import { BigImg, BottomRight, Card } from "@/components";
import type { TableViewProps } from "../TableView";
import "./index.scss";
import { FrePassItem } from "../interface";
import { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeFilterTags } from "@/store/slices/groupFilter";
const ImageView: React.FC<TableViewProps> = (props) => {
  const { items, selected = [], onSeletedChange, onGroupFilterChange } = props;

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
  const handleCardFilter = ({
    text,
    value,
    type,
    cardData,
  }: GroupFilterCallBackType) => {
    if (!cardData) return;
    const newFilterTags = filterTags.concat({
      type,
      text,
      value,
      /* trick, 把difference存在这里了 (-: */
      tableName: (cardData as any)?.groupCount?.difference,
    });
    dispatch(changeFilterTags(newFilterTags));
    onGroupFilterChange?.({ filterTags: newFilterTags }, cardData);
  };
  const clickedItem = items[bigImgModal.currentIndex] ?? ({} as FrePassItem);

  return (
    <>
      {bottomRightMapVisible && (
        <BottomRight
          name={clickedItem.locationName || ""}
          lat={clickedItem.lngLat?.lat || ""}
          lng={clickedItem.lngLat?.lng || ""}
          onClose={() => {
            setBottomRightMapVisible(false);
            setBigImgModal((arg) => ({
              ...arg,
              visible: false,
            }));
          }}
        />
      )}
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: () => {
            setBigImgModal((arg) => ({
              ...arg,
              visible: false,
            }));
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
        {items.map((item, idx) => (
          <Card.Normal
            key={item.infoId}
            showImgZoom
            checked={selected.includes(item.infoId)}
            cardData={{
              ...item,
              count: filterTags.some((f) => f.type === "id")
                ? null
                : item.groupCount?.remainingCount,
            }}
            onImgClick={() => handleOpenBigImg(idx)}
            onLocationClick={() => handleLocationClick(idx)}
            onFilterChange={handleCardFilter}
            onChange={({ checked }) => {
              const newSelectedRowKeys = checked
                ? [...selected, item.infoId]/*  */
                : selected.filter((id) => id !== item.infoId);
              onSeletedChange?.(newSelectedRowKeys);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ImageView;
