import React, { useState, useCallback, useEffect, useRef } from "react";
import { SharePermissionsProps } from './interface'
import { Modal, Select, Loading, Tree, Input, VirtualList, Image } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import classNames from 'classnames'
import characterConfig from "@/config/character.config";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import services from "@/services";
import { Receiver } from "@/pages/Deploy/Deploy/interface";
import NoAuthPng from '@/assets/images/no-auth.png'
import './index.scss'
import { isObject } from "@/utils";
import { ClueFormData, ClueTreeItem } from "../SearchTree/interface";
import { OfflineTreeItem } from "@/pages/Analysis/Offline/interface";
import useReceivers from "@/pages/Deploy/hooks/useReceivers";

const SharePermissions = (props: SharePermissionsProps) => {
  const {
    style,
    className,
    modalProps,
    onOk,
    data
  } = props

  const [formData, setFormData] = useState({
    privilege: 0,
    // sharedUsers: []
  })
  const [treeLoading, setTreeLoading] = useState(false)

  const [checkedList, setCheckedList] = useState<Receiver[]>([])
  const checkedUsers = checkedList.filter(item => item.type === 'user')

  const [filterText, setFilterText] = useState('')

  const receiverList = useReceivers(); // 用户列表数据
  const treeDataRef = useRef(receiverList)
  treeDataRef.current = receiverList
  const defaultchecked=useRef<Receiver[]>([])

  // useEffect(() => {
  //   handleDefaultChecked()
  // }, [])

  useEffect(() => {
    // console.log(data,1)
    handleDefaultChecked()
  }, [data])

  useEffect(() => {
    // console.log(data,1)
    handleDefaultChecked()
  }, [treeDataRef.current])

  function hasSharedUsers(obj: ClueTreeItem | OfflineTreeItem | ClueFormData): obj is OfflineTreeItem {
    return "sharedUsers" in obj;
  }

  // 设置默认选中
  const handleDefaultChecked =() => {
    if (data && isObject(data)) {
      const { privilege = 0 } = data    
      if (privilege === 1 && treeDataRef.current.length) {
        let checkIds = [] as any[]
        if (hasSharedUsers(data))
          checkIds = data.sharedUsers.map(item => item.id)
        else
          checkIds = data.privilegeUser
        let newwCheckedList = flatTreeData(treeDataRef.current)
        let newCheckedList = newwCheckedList.filter(item => checkIds.includes(item.id))

        if (!hasSharedUsers(data)){
          if(data.privilegeUser.length===0){
            //备份
            defaultchecked.current=newwCheckedList
            setCheckedList(newwCheckedList)
          }else{
            defaultchecked.current=newCheckedList
            setCheckedList(newCheckedList)
          }//共享 并且共享人为[]，则为全体共享
        }
        else{
          defaultchecked.current=newCheckedList
          setCheckedList(newCheckedList)
        }
      } else {
        setCheckedList([])
        setFilterText('')
      }
      setFormData({
        privilege: privilege,
        // sharedUsers: []
      })
    }
  }

  const handleSelectChange = (value: any) => {
    setFormData({
      ...formData,
      privilege: value
    })

    // 私有操作，去除选中
    if (value === 0) {
      setCheckedList([])
      // setCheckedList(flatTreeData(treeDataRef.current))
      setFilterText('')
    }
    if(value===1){
      setCheckedList(flatTreeData(treeDataRef.current))
      setFilterText('')
    }
  }

  const handleChangeFilterText = (e: any) => {
    setFilterText(e.target.value)
  }

  const filterTreeNode = useCallback((node: NodeProps) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterText.split(pattern);

    return keywords.every(key => (node.title as string)?.includes(key));
  }, [filterText])

  // 递归检索的方法
  const filterDataHandle = (data: Receiver[]) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterText.split(pattern);
    // console.log(keywords)

    let result: Receiver[] = []
    data.forEach(ele => {
      if (keywords.every(key => ele.name.includes(key)) || ele?.children) {
        if (ele?.children) {
          let res = filterDataHandle(ele.children)
          res.length === 0 ? (keywords.every(key => ele.name.includes(key)) && result.push(ele)) : result.push({ ...ele, children: res })
          return
        }
        result.push(ele)
      }
    });
    return result
  }

  const handleFilterTreeData = () => {
    let result = filterDataHandle(receiverList)
    return result
  }

  /**数据扁平化梳理*/
  const flatTreeData = (data: Receiver[]) => {
    // console.log(data)
    let result: Receiver[] = [];
    (function recursionFun(_data) {
      _data.forEach(item => {
        if (item.children && item.children.length) {
          recursionFun(item.children)
          // delete item.nodes
        }
        result.push(item)
      })
    })(data)
    return result
  }

  // 全选
  const handleCheckAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    let nowData = (filterText.trim() ? handleFilterTreeData() : receiverList);

    let newCheckedList = flatTreeData(nowData)
    setCheckedList(newCheckedList)
  }

  const handleTreeCheck = (ids: string[], {
    checkedNodes,
    halfCheckedKeys,
    halfCheckedNodes
  }: { checkedNodes: NodeInstance[], halfCheckedKeys: string[], halfCheckedNodes: NodeInstance[] }) => {
    const newCheckedList = checkedNodes.map(node => node.props.dataRef)
    console.log(newCheckedList)
    setCheckedList(newCheckedList as Receiver[])
  }

  const handleRenderNodeTitle = (node: NodeProps) => {
    return highlight((node.dataRef?.name || ''), filterText)
  }

  const highlight = (text: string, highlightText: string) => {
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = highlightText.split(pattern);
    if (highlightText) {
      const regex = new RegExp(keywords.map(keyword => `${keyword.trim()}`).join('|'), "gi");
      return <span dangerouslySetInnerHTML={{ __html: text.replace(regex, (match) => `<mark>${match}</mark>`) }}></span>
    }
    return text
  };

  const handleClearAll = () => {
    setCheckedList([])
  }

  const handleOk = () => {
    onOk?.({
      ...formData,
      sharedUsers: checkedUsers
    })
  }

  const handleCancel = () => {
    modalProps?.onCancel?.()
    setCheckedList(defaultchecked.current)
  }

  const handleSetShare = () => {
    setFormData({
      ...formData,
      privilege: 1
    })
  }

  return (
    <Modal
      title="设置共享权限"
      {...(modalProps || {})}
      style={style}
      className={classNames("share-permissions-modal", className)}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="share-permissions-content">
        <div className="share-permissions-select">
          <label>设置权限：</label>
          <Select
            options={characterConfig.permissionType}
            value={formData.privilege}
            onChange={handleSelectChange}
          />
        </div>
        <div className="share-permissions-tree-wrap">
          <div className="title">设置指定人员权限：</div>
          {
            formData.privilege === 1 ?
              <div className="share-permissions-tree-con">
                <div className="share-permissions-tree">
                  <div className="item-head">可选人员</div>
                  <Input
                    placeholder="筛选"
                    value={filterText}
                    onChange={handleChangeFilterText}
                    suffix={<span className="check-all" onClick={handleCheckAll}>全选</span>}
                    allowClear
                  />
                  <Loading spinning={treeLoading}>
                    <Tree
                      className="location-list"
                      checkable
                      checkedKeys={checkedList.map(item => item.id)}
                      onCheck={handleTreeCheck}
                      actionOnClick={"check"}
                      treeData={receiverList}
                      fieldNames={{
                        key: 'id',
                        title: 'name',
                      }}
                      filterNode={filterTreeNode}
                      renderTitle={handleRenderNodeTitle}
                      isVirtual={true}
                      virtualListProps={{ height: 300 }}
                      checkedStrategy={'child'}
                    />
                  </Loading>
                </div>
                <div className="share-permissions-tree-checked-list">
                  <div className="item-head">
                    <span><b>已选人员</b>（{checkedUsers.length}）</span>
                    <span className="clear" onClick={handleClearAll}>清空</span>
                  </div>
                  <div className="checked-list">
                    {
                      checkedUsers.length ?
                        <VirtualList
                          data={checkedUsers}
                          height={350}
                          itemKey={child => child.id}
                          itemHeight={24}
                          virtual={true}
                        >
                          {
                            child => {
                              const { id, text, listType, parent } = child
                              return (
                                <div className="checked-list-item" key={child.id}>
                                  <div className="text">{child.name}</div>
                                  <div className="btn"><Icon type="shanchu" /></div>
                                </div>
                              )
                            }
                          }
                        </VirtualList>
                        :
                        <div className="ysdb-result-box-nodata"></div>
                    }
                  </div>
                </div>
              </div>
              :
              <div className="share-permissions-tip">
                <div className="img-wrap">
                  {/* <img src={NoAuthPng} alt="没有设置共享人员" /> */}
                </div>
                <div className="tip">
                  仅自己可以访问，
                  <span className="btn" onClick={handleSetShare}>设置共享人员</span>
                  可分享给他人查看、编辑。
                </div>
              </div>
          }
        </div>
      </div>
    </Modal>
  )
}

export default SharePermissions