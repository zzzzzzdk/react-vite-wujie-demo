import React, { useState } from "react";
import { Button, Table, Image, Link } from "@yisa/webui";
import type { ColumnProps } from "@yisa/webui/es/Table";
import { ActiveNightItem } from "../interface";
import "./index.scss";
import { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import { RootState } from "@/store";
import { changeFilterTags } from "@/store/slices/groupFilter";
import { useDispatch, useSelector } from "react-redux";
import { GroupFilterItem } from "@/config/CommonType";
import { TableViewProps } from "../TableView";
const SelectedView: React.FC<TableViewProps> = (props) => {
  const { items, selected, onSeletedChange, onGroupFilterChange } = props;

  const dispatch = useDispatch();
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });

  const handleClick = (time: "night" | "day", value: number | string, item: ActiveNightItem) => {
    const newFilterTags = [
      ...filterTags,
      {
        type: "id",
        text: `${time === "day" ? "白昼" : "夜晚"}抓拍${value}次数`,
        value,
        tableName: "selectedImage",
      },
    ] as GroupFilterItem[];
    dispatch(changeFilterTags(newFilterTags));

    onGroupFilterChange?.({ filterTags: newFilterTags }, item);
  };

  const columns: ColumnProps<ActiveNightItem>[] = [
    {
      title: "序号",
      width: "84px",
      dataIndex: "number",
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: "白昼抓拍时间",
      dataIndex: "dateRangeDay",
      render(col, item, index) {
        return (
          <div className="time-range">
            <span>
              {item.dateRange?.start}-{item.dateRange?.end}
            </span>
            <span>
              {item.daytime?.start}-{item.daytime?.end}
            </span>
          </div>
        );
      },
    },
    {
      title: "白昼抓拍次数",
      dataIndex: "daytimeOccurrences",
      render(col, item, index) {
        return (
          <span
            onClick={() => handleClick("day", item.daytimeOccurrences || 0, item)}
          >
            <Link>{item.daytimeOccurrences}</Link>
          </span>
        );
      },
    },
    {
      title: "夜晚抓拍时间",
      dataIndex: "dateRangeNight",
      render(col, item, index) {
        return (
          <div className="time-range">
            <span>
              {item.dateRange?.start}-{item.dateRange?.end}
            </span>
            <span>
              {item.nighttime?.start}-{item.nighttime?.end}
            </span>
          </div>
        );
      },
    },
    {
      title: "夜晚抓拍次数",
      dataIndex: "nighttimeOccurrences",
      render(col, item, index) {
        return (
          <span
            onClick={() => handleClick("night", item.nighttimeOccurrences || 0, item)}
          >
            <Link>{item.nighttimeOccurrences}</Link>
          </span>
        );
      },
    },
    {
      title: "昼夜抓拍差值",
      dataIndex: "difference",
    },
    {
      title: "白昼最新抓拍时间",
      dataIndex: "latestCaptureTimeDay",
    },
    {
      title: "白昼最新抓拍位置",
      dataIndex: "latestLocationDaytime",
    },
    {
      title: "夜晚最新抓拍时间",
      dataIndex: "latestCaptureTimeNight",
    },
    {
      title: "夜晚最新抓拍位置",
      dataIndex: "latestLocationNight",
    },
  ];
  return (
    <>
      <Table
        className="active-night-selected-view"
        rowKey={"infoId"}
        columns={columns}
        data={items}
        scroll={{ x: true }}
      />
    </>
  );
};

export default SelectedView;
