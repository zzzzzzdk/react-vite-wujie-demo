import React, { useCallback, useEffect, useState } from "react";
import { TreeSelect, Select, Form, Tag } from "@yisa/webui";
import { TreeSelectProps } from "@yisa/webui/es/TreeSelect/interface";

import classnames from "classnames";
import "./index.scss";
import services from "@/services";
/**
 * @description 人员车辆标签选择
 */

export type RawLabelTreeNode = {
  id: string | number;
  name: string;
  color?: string | number;
  /**
   * @description 如果有labels,则为标签集, 否则为标签
   */
  labels?: RawLabelTreeNode[];
};
/**
 * @description 对原始数据进行处理
 * @param node
 * @returns
 */
function formatTree(nodes: RawLabelTreeNode[]): TreeSelectProps["treeData"] {
  function dfs(
    root: RawLabelTreeNode
  ): NonNullable<TreeSelectProps["treeData"]>[number] {
    // base case
    if (!root.labels) {
      return { key: String(root.id), title: root.name };
    }
    if (!root.labels.length) {
      return { key: String(root.id), title: root.name, disabled: true };
    }
    // make progress
    // 禁止选中标签集
    return {
      checkable: false,
      disabled: true,
      key: String(root.id),
      title: root.name,
      children: root.labels.map(dfs) as any,
    };
  }
  return nodes.map(dfs);
}

type FormLabelSelectProps = {
  // 车辆、人员、不限
  labelTypeId?: "vehicle" | "personnel" | "all";
  className?: string;
  canDeploy?: boolean;
} & Omit<TreeSelectProps, "children" | "treeData">;

function FormLabelSelect(props: FormLabelSelectProps) {
  const { className, labelTypeId = "personnel", canDeploy = false, ...selectProps } = props;
  const [options, setOptions] = useState<TreeSelectProps["treeData"]>([]);
  useEffect(() => {
    // const query = labelType === "vehicle" ? 2 : labelType === "person" ? 1 : 0;
    services
      .getLabels<any, RawLabelTreeNode[]>({
        labelTypeId: labelTypeId,
        canDeploy
      })
      .then((res) => {
        if (res.data) {
          const labelTree = formatTree(res.data);
          setOptions(labelTree);
        }
      });
  }, [labelTypeId]);
  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, []);
  return (
    <TreeSelect
      placeholder={
        labelTypeId === "all"
          ? "请选择标签"
          : labelTypeId === "personnel"
            ? "请选择人员标签"
            : "请选择车辆标签"
      }
      maxTagCount={1}
      className={classnames("fusion3-form-select-label", className)}
      treeCheckable
      filterTreeNode={filterTreeNode}
      treeCheckedStrategy="child"
      {...selectProps}
      treeData={options}
      // @ts-ignore
      getTriggerContainer={(triggerNode) =>
        triggerNode.parentNode as HTMLElement
      }
    />
  );
}

export default FormLabelSelect;
