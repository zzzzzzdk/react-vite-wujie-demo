import React, { useContext, useState, useCallback, useEffect } from "react";
import { ClueContext } from "../context";
// import BaseModalProps, { OfflineTreeSelectProps } from "./interface";
import { Modal, Form, Input, TreeSelect } from "@yisa/webui";
import { NodeProps } from "@yisa/webui/es/Tree/interface";
import { isFunction, isObject } from "@/utils";

const OfflineTreeSelect = (props: any) => {
  const { value, onChange } = props;
  const { clueTreeData } = useContext(ClueContext);
  const [stateValue, setStateValue] = useState(value);
  const currentValue = "value" in props ? value : stateValue;
  const [expandIds, setExpandIds] = useState<string[]>([]);
  const handleExpand = (expandedKeys: string[]) => {
    setExpandIds(expandedKeys);
  };
  const toggleArrayElement = (arr: string[], element: string) => {
    const index = arr.indexOf(element);

    if (index !== -1) {
      // 元素存在，删除它
      arr.splice(index, 1);
    } else {
      // 元素不存在，添加它
      arr.push(element);
    }
  };

  const handleTreeSelectChange = (
    value: any,
    extra: {
      trigger?: NodeProps;
      checked?: boolean;
      selected?: boolean;
    }
  ) => {
    // console.log(value, extra)
    // 点击一级节点为切换开启关闭状态
    if (extra.trigger?._level === 0 && value.length) {
      const newExpandIds = [...expandIds];
      toggleArrayElement(newExpandIds, value[value.length - 1]);
      setExpandIds(newExpandIds);
      return;
    }
    const newValue = value.length ? value[value.length - 1] : "";
    if (!("value" in props)) {
      setStateValue(newValue);
    }
    if (onChange && isFunction(onChange)) {
      onChange(newValue);
    }
  };

  const handleRenderTag = (props: any) => {
    // console.log(props)
    return (
      <div style={{ paddingLeft: "4px", lineHeight: "22px" }}>
        {props.label}
      </div>
    );
  };

  useEffect(() => {
    console.log(clueTreeData, "ppp");
  }, [clueTreeData]);
  return (
    <TreeSelect
      placeholder="请选择分组"
      // showSearch
      // allowClear
      // treeCheckable
      multiple
      treeData={clueTreeData ? clueTreeData : []}
      value={currentValue ? [currentValue] : []}
      onChange={handleTreeSelectChange}
      // filterTreeNode={filterTreeNode}
      renderTag={handleRenderTag}
      treeProps={{
        expandedKeys: expandIds,
        onExpand: handleExpand,
        isVirtual: true,
        virtualListProps: {
          height: 200,
        },
      }}
      fieldNames={{
        key: "id",
        title: "title",
      }}
    />
  );
};

export default OfflineTreeSelect;
