import React, { useContext, useState, useCallback, useEffect } from "react";
import { OfflineContext } from "../context";
import BaseModalProps, { OfflineTreeSelectProps } from "./interface";
import { Modal, Form, Input, TreeSelect } from '@yisa/webui'
import { NodeProps } from '@yisa/webui/es/Tree/interface'
import { isFunction, isObject } from "@/utils";
import { ResultRowType } from "../interface";

const OfflineTreeSelect = (props: OfflineTreeSelectProps) => {
  const {
    value,
    onChange
  } = props

  const {
    offlineTreeData
  } = useContext(OfflineContext)

  const [stateValue, setStateValue] = useState(value)
  const currentValue = 'value' in props ? value : stateValue

  const [expandIds, setExpandIds] = useState<string[]>([])

  const filterTreeNode = useCallback((inputText: string, treeNode: any) => {
    return (treeNode.props?.dataRef?.name || '').toLowerCase().indexOf(inputText?.toLowerCase() || '') > -1
  }, [offlineTreeData])

  const handleExpand = (expandedKeys: string[]) => {
    setExpandIds(expandedKeys)
  }

  const toggleArrayElement = (arr: string[], element: string) => {
    const index = arr.indexOf(element);

    if (index !== -1) {
      // 元素存在，删除它
      arr.splice(index, 1);
    } else {
      // 元素不存在，添加它
      arr.push(element);
    }
  }

  const handleTreeSelectChange = (value: any, extra: {
    trigger?: NodeProps;
    checked?: boolean;
    selected?: boolean;
  }) => {
    // console.log(value, extra)
    // 点击一级节点为切换开启关闭状态
    if (extra.trigger?._level === 0 && value.length) {
      const newExpandIds = [...expandIds]
      toggleArrayElement(newExpandIds, value[value.length - 1])
      setExpandIds(newExpandIds)
      return
    }
    // setStateData(Object.assign({}, stateData, {
    //   jobId: value.length ? value[value.length - 1] : ''
    // }))
    const newValue = value.length ? value[value.length - 1] : ''
    if (!('value' in props)) {
      setStateValue(newValue)
    }
    if (onChange && isFunction(onChange)) {
      onChange(newValue)
    }
  }

  const handleRenderTag = (props: any) => {
    // console.log(props)
    return <div style={{ paddingLeft: '4px', lineHeight: '22px' }}>{props.label}</div>
  }

  return (

    <TreeSelect
      placeholder='请选择分组'
      showSearch
      allowClear
      // treeCheckable
      multiple
      treeData={offlineTreeData ? [...offlineTreeData] : []}
      value={currentValue ? [currentValue] : []}
      onChange={handleTreeSelectChange}
      // filterTreeNode={filterTreeNode}
      renderTag={handleRenderTag}
      treeProps={{
        expandedKeys: expandIds,
        onExpand: handleExpand,
        isVirtual: true,
        virtualListProps: {
          height: 200
        }
      }}
      fieldNames={{
        key: 'jobId',
        title: 'name'
      }}
       // @ts-ignore
      getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement}
    />
  )
}

export default OfflineTreeSelect