import React, { useState } from "react";
import { Button, Table, Image, Link } from "@yisa/webui";
import TableAction from "@/pages/Deploy/components/TableAction";
import type { ColumnProps } from "@yisa/webui/es/Table";
import { ActiveNightItem } from "../interface";
import ColorfulPlate from "@/pages/Deploy/components/ColorfulPlate";
import { BigImg, ListMoreBtn } from "@/components";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeFilterTags } from "@/store/slices/groupFilter";
import { RootState } from "@/store";
import { jumpRecordVehicle } from "@/utils";

export type TableViewProps = {
  items: ActiveNightItem[];
  selected?: (number | string)[];
  onSeletedChange?: (seleted: (string | number)[]) => void;
  onGroupFilterChange?: (data: GroupFilterCallBackType, cardData: any) => void;
};
const TableView: React.FC<TableViewProps> = (props) => {
  const { items, selected, onSeletedChange, onGroupFilterChange } = props;
  const dispatch = useDispatch();
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });
  const handleFilterChange = (item: ActiveNightItem) => {
    const newFilterTags = filterTags.concat({
      type: "id",
      text: item.licensePlate2,
      value: item.licensePlate2,
      tableName: "selected",
    });
    dispatch(changeFilterTags(newFilterTags));
    onGroupFilterChange?.({ filterTags: newFilterTags }, item);
  };
  const columns: ColumnProps<ActiveNightItem>[] = [
    {
      title: "序号",
      dataIndex: "number",
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: "抓拍车牌",
      dataIndex: "plateImage",
      render: (text, record, index) =>
        text ? <Image src={text} className="plate-img" /> : (text ||  "未识别"),
    },
    {
      title: "前端识别车牌",
      dataIndex: "licensePlate1",
      render: (text, record, index) =>
        record.licensePlate1Url ? (
          <Link href={record.licensePlate1Url}>{text}</Link>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "二次识别车牌",
      dataIndex: "licensePlate2",
      render: (text, record, index) =>
        text && text === '未识别' ?
          <span className={`plate2-text plate-bg plate-color-8`}></span>
          :
          <a
            target="_blank"
            href={jumpRecordVehicle(record.licensePlate2, record.plateColorTypeId2)}
            className={`plate2-text plate-bg plate-color-${record.plateColorTypeId2}`}
          >
            {text}
          </a>
    },
    {
      title: "车辆型号",
      dataIndex: "carInfo",
    },
    {
      title: "昼伏夜出天数",
      dataIndex: "nocturnalTimes",
      render(col, item, index) {
        return (
          <Link>
            <span
              onClick={() => {
                handleFilterChange(item);
              }}
            >
              {col}
            </span>
          </Link>
        );
      },
    },
    {
      title: "最新抓拍时间",
      dataIndex: "captureTime",
    },
    {
      title: "最新抓拍位置",
      dataIndex: "locationName",
    },
    {
      title: "操作",
      dataIndex: "action",
      width: "200px",
      render(col, item, index) {
        return (
          <div className="actions">
            <ListMoreBtn data={item} />
            <Button
              size="mini"
              onClick={() => {
                setBigImgModal({
                  visible: true,
                  currentIndex: index,
                });
              }}
            >
              查看大图
            </Button>
          </div>
        );
      },
    },
  ];
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
    <>
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
      />

      <Table
        className="active-night-table-view"
        rowKey={"infoId"}
        columns={columns}
        data={items}
        scroll={{ x: true }}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: onSeletedChange,
        }}
      />
    </>
  );
};

export default TableView;
