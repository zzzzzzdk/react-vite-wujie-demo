import React, { useState } from "react";
import { Button, Table, Image, Link, PopConfirm } from "@yisa/webui";
import TableAction from "@/pages/Deploy/components/TableAction";
import type { ColumnProps } from "@yisa/webui/es/Table";
import { ResultLabelItem } from "../interface";
import ColorfulPlate from "@/pages/Deploy/components/ColorfulPlate";
import { BigImg, ListMoreBtn } from "@/components";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeFilterTags } from "@/store/slices/groupFilter";
import { LabelSetType } from "../components/LabelSetModal/interface";

export type TableViewProps = {
  items: ResultLabelItem[];
  onLabelSetChange?: (data: ResultLabelItem, type: LabelSetType) => void;
  onAddTargetChange?: (data: ResultLabelItem) => void;
  onLabelChange?: (data: ResultLabelItem, type: LabelSetType) => void;
  onDelChange?: (data: ResultLabelItem) => void;
};
const TableView: React.FC<TableViewProps> = (props) => {
  const { items, onLabelSetChange, onAddTargetChange, onLabelChange, onDelChange } = props;
  const dispatch = useDispatch();

  const columns: ColumnProps<ResultLabelItem>[] = [
    {
      title: "序号",
      dataIndex: "number",
      width: 60,
      render: (_, __, index) => {
        return index + 1;
      },
    },
    {
      title: "标签集",
      dataIndex: "labelSetName",
      render: (text, record, index) => <span className="status-text" onClick={() => onLabelSetChange?.(record, 'view')}>{text || "--"}</span>
    },
    {
      title: "标签名称",
      dataIndex: "labelName",
      render: (text, record, index) => <span className="status-text" onClick={() => onLabelChange?.(record, 'view')}>{text || "--"}</span>
    },
    {
      title: "备注",
      dataIndex: "remarks",
      render: (text, record, index) => text || "--"
    },
    {
      title: "目标类型",
      dataIndex: "labelType",
      render: (text, record, index) => text || "--"
    },
    {
      title: "目标总数",
      dataIndex: "labelCount",
      width: 100,
      render: (text, record, index) => <span>{text || "--"}</span> //  className="status-text"
    },
    {
      title: "是否可布控",
      dataIndex: "canDeploy",
      width: 100,
      render: (text, record, index) => {
        return (
          text === "yes" ? "是" : "否"
        );
      },
    },
    {
      title: "创建人",
      dataIndex: "creator",
    },
    {
      title: "创建人所属部门",
      dataIndex: "creatorDepart",
    },
    {
      title: "更新时间",
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 336,
      render(text, record, index) {
        return (
          <div className="actions">
            <span onClick={() => {
              const dataType = record.labelTypeId
              window.open(`#/record-list?${encodeURIComponent(JSON.stringify({
                text: `${dataType === 'vehicle' ? '车辆' : '人员'}标签(1个)`,//写死就行
                searchType: dataType === 'vehicle' ? '2' : '1',//精确检索类型
                data: {
                  ...(dataType === 'vehicle' ? {
                    vehicleLabels: [record.labelId],
                    idNumber: "",
                    idType: "111",
                    licensePlate: "",
                    personName: "",
                    plateColor: -1
                  } : {
                    label: [record.labelId],
                    profileType: "3",
                    age: ["", ""],
                    captureCount: ["", ""]
                  }),
                }
              }))}`)
            }}>查看目标</span>
            {
              record.isSystem === 1 ?
                null
                :
                <>
                  {
                    record.authority === 'manage' &&
                    <span onClick={() => onAddTargetChange?.(record)}>添加目标</span>
                  }
                  {
                    record.authoritySet === 'manage' &&
                    <span onClick={() => onLabelSetChange?.(record, 'edit')}>编辑标签集</span>
                  }
                  {
                    record.authority === 'manage' &&
                    <>
                      <span onClick={() => onLabelChange?.(record, 'edit')}>编辑标签</span>
                      <span className="del">
                        <PopConfirm
                          title="确认要删除这条内容吗？"
                          onConfirm={() => onDelChange?.(record)}
                        >删除</PopConfirm>
                      </span>
                    </>
                  }
                </>
            }
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
        className="label-manage-table-view"
        rowKey={"labelId"}
        columns={columns}
        data={items}
        scroll={{ x: true }}
      />
    </>
  );
};

export default TableView;
