import React, { useCallback, useMemo, useState } from "react";
import { BigImg, BottomRight, Card, Collapse } from "@/components";
import type { TableViewProps } from "../TableView";
import "./index.scss";
import { ResultLabelItem } from "../interface";
import { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeFilterTags } from "@/store/slices/groupFilter";
import { Icon } from '@yisa/webui/es/Icon'

const ImageView: React.FC<TableViewProps> = (props) => {
  const { items = [], onLabelSetChange, onAddTargetChange, onLabelChange, onDelChange } = props;
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


  const clickedItem = items[bigImgModal.currentIndex] ?? ({} as ResultLabelItem);

  type GroupedByLabelSetType = {
    [key: string]: {
      labelSetId: number;
      labelSetName: string;
      authoritySet?: 'visible' | 'manage';
      items?: ResultLabelItem[];
    }
  }

  const groupedByLabelSet: GroupedByLabelSetType = useMemo(() => {
    const grouped = [...items].reduce((groups, item) => {
      // 如果groups中还没有这个labelSetId，则添加它作为一个新数组  
      if (!groups[item.labelSetId]) {
        groups[item.labelSetId] = {
          labelSetId: item.labelSetId,
          labelSetName: item.labelSetName,
          authoritySet: item.authoritySet,
          visiblePermissionsSet: item.visiblePermissionsSet,
          managePermissionsSet: item.managePermissionsSet,
          managePersonsSet: item.managePersonsSet,
          visiblePersonsSet: item.visiblePersonsSet,
          labelCount: item.labelCount,
          items: []
        }
      }
      // 将当前项添加到对应labelSetId的数组中  
      groups[item.labelSetId].items.push(item);
      return groups;
    }, {});
    return grouped
  }, [JSON.stringify(items)])


  const handleLabelSetEdit = (item: {
    labelSetId: number;
    labelSetName: string;
    items?: ResultLabelItem[]
  }, type: 'add' | 'edit' | 'view') => {
    console.log(item)
    onLabelSetChange?.(item as ResultLabelItem, type)
  }

  return (
    <>
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
      <div className="label-manage-image-view">
        {
          Object.values(groupedByLabelSet).map((item, idx) => {
            return (
              <div className="result-item" key={`${item.labelSetId} + ${idx}`}>
                <Collapse title={(
                  <div>
                    <span onClick={() => handleLabelSetEdit(item, 'view')}>{item.labelSetName || '--'}（{item.items?.length || 0}）</span>
                    {
                      item.authoritySet && item.authoritySet === 'manage' ?
                      <span onClick={() => handleLabelSetEdit(item, 'edit')} className="edit-item"><Icon type="bianji" /></span>
                      : ''
                    }
                  </div>
                )}>
                  <div className="result-item-con">{
                    item.items?.map((elem, index) => (
                      <Card.Label
                        key={`${elem.labelId} + ${index} + ${idx}`}
                        cardData={elem}
                        onAddTargetChange={onAddTargetChange}
                        onLabelChange={onLabelChange}
                        onDelChange={onDelChange}
                      // showImgZoom
                      // onImgClick={() => handleOpenBigImg(index)}
                      // onLocationClick={() => handleLocationClick(index)}
                      // onChange={({ checked }) => {
                      // const newSelectedRowKeys = checked
                      //   ? [...selected, item.infoId]
                      //   : selected.filter((id) => id !== item.infoId);
                      // onSeletedChange?.(newSelectedRowKeys);
                      // }}
                      />
                    ))
                  }</div>
                </Collapse>
              </div>
            )
          })
        }
      </div>
    </>
  );
};

export default ImageView;
