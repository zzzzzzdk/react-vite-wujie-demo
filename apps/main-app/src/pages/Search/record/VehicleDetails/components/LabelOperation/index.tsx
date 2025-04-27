import React, { useCallback } from 'react'
import { TreeSelect, Popover } from '@yisa/webui'
import type { LabelOperationType } from './interface'
import './index.scss'

export default function (props: LabelOperationType) {
  const {
    isEdit = false,
    tagNum = 4,
    labelData,
    value,
    labels,
    handleChangeSelect = () => { },

  } = props
  const prefixCls = "label-operation"

  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, [])
  return (
    <div className={prefixCls}>
      {
        isEdit ?
          <TreeSelect
            multiple
            treeCheckable
            maxTagCount={1}
            treeData={labelData}
            filterTreeNode={filterTreeNode}
            // showSearch={true}
            fieldNames={{
              key: "id",
              title: 'name',
              children: 'labels'
            }}
            treeCheckedStrategy={TreeSelect.SHOW_CHILD}
            onChange={handleChangeSelect}
            value={value}
            // @ts-ignore
            getTriggerContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
          />
          :
          labels.length <= tagNum ?
            labels.map((ele) => {
              return <div key={ele.id}
                className={`label-item label-item-${ele.color}`}
                title={ele.name}
              >{ele.name}</div>
            })
            :
            <>
              {
                labels.slice(0, tagNum - 1).map((ele) => {
                  return <div key={ele.id}
                    className={`label-item label-item-${ele.color}`}
                    title={ele.name}
                  >{ele.name}</div>
                })
              }
              <Popover
                overlayClassName="label-operation-tag-more"
                // getPopupContainer={(triggerNode: HTMLElement) => triggerNode.parentElement || document.body}
                placement="top"
                content={<div className="tag-more">
                  {
                    labels.map((ele) => {
                      return <div key={ele.id}
                        className={`label-item label-item-${ele.color}`}
                        title={ele.name}
                      >{ele.name}</div>
                    })
                  }
                </div>
                }
                key={-1}
              >
                <div className="label-item more">···</div>
              </Popover>
            </>
      }
    </div>)
}

