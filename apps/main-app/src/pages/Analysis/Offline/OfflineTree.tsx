import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { Input, Tree, Tooltip, Button, Loading, Message, Space, PopConfirm, Notification, Checkbox, Pagination } from '@yisa/webui'
import { Icon, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@yisa/webui/es/Icon'
import { SharePermissions } from '@/components'
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import { OfflineTreeProps, OfflineTreeItem, appendStatusType } from "./interface";
import ResizeObserver from 'resize-observer-polyfill'
import services from "@/services";
import { isArray, isFunction } from "@/utils";
import { useSelector, RootState, useDispatch } from "@/store";
import dayjs from 'dayjs'
import classNames from 'classnames'
import { OfflineContext } from "./context";
import { isString } from "@/utils/is";
import { flushSync } from 'react-dom';
import { Receiver } from "@/pages/Deploy/Deploy/interface";

const OfflineTree = (props: OfflineTreeProps) => {
  const {
    prefixCls,
    onSelect,
  } = props
  const {
    onOfflineTreeDataChange
  } = useContext(OfflineContext)
  const boxRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<any>(null)
  const inputRef = useRef<any>(null)
  const [treeHeight, setTreeHeight] = useState(0)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [treeData, setTreeData] = useState<OfflineTreeItem[]>([])
  // 缓存treeData
  const cacheTreeData = useRef(treeData)

  const [inputValue, setInputValue] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [expandIds, setExpandIds] = useState<string[]>([])

  const [stateSelectedNodes, setStateSelectedNodes] = useState<NodeInstance[]>([])
  const currentSelectedNodes = 'selectedNodes' in props ? props.selectedNodes : stateSelectedNodes

  // 

  const [sharePermissionsVisible, setSharePermissionsVisible] = useState(false)
  const [currentData, setCurrentData] = useState<OfflineTreeItem | null>(null)

  const userInfo = useSelector((state: RootState) => {
    return state.user.userInfo
  })

  useEffect(() => {
    getData()

    const ro = new ResizeObserver(() => {
      // console.log(boxRef.current?.clientHeight)
      setTreeHeight(boxRef.current?.clientHeight || 0)
    })
    if (boxRef.current) {
      ro.observe(boxRef.current)
    }

    return () => {
      if (boxRef.current) {
        ro.unobserve(boxRef.current)
      }
    }

  }, [])

  // // 递归格式化数据
  const formatData = (data: OfflineTreeItem[]) => {
    let result = [...data]
    function dg(arr: OfflineTreeItem[], j?: string, level?: number, permission?: number) {
      level = level || 0
      level++
      arr.forEach((item, i) => {
        item.jobId = item.jobId + ""
        item.key = item.jobId
        item.title = item.name
        item.__level = level
        item.__index = `${j ? j + '-' : ''}` + `${i}`

        // 是否父传入的permission权限
        if (permission) {
          item.permission = permission
        }
        if (item.children && item.children.length) {
          dg(item.children, item.__index, level, item.permission)
        }
      })
    }
    dg(result)
    return result
  }

  const getData = () => {
    setAjaxLoading(true)
    services.offline.getJobList<any, any>().then(res => {
      // console.log(res)
      setAjaxLoading(false)
      const resData = formatData(res.data || [])
      onOfflineTreeDataChange?.(resData)
      setTreeData(resData)
    }).catch(err => {
      console.log(err)
    })
  }

  const changeInput = (e: any) => {
    const value = e.target.value
    setInputValue(value)
  }

  useEffect(() => {
    if (!inputValue) {
      setExpandIds([])
    }
    const timer = setTimeout(() => {
      setFilterValue(inputValue)
    }, 300)

    return () => {
      timer && clearTimeout(timer)
    }
  }, [inputValue])

  const filterTreeNode = useCallback((node: any) => {
    let name = node.dataRef.name
    // console.log(node, filterValue)
    // 关键词通过空格/逗号/分号分割，可能会有多个
    const pattern = /[\s,;，；]+/;
    const keywords = filterValue.split(pattern);
    if (name && typeof name === 'string') {
      return keywords.every(key => name?.includes(key));
    } else {
      return false
    }
  }, [filterValue])

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


  const handleSelectLocation = (selectedKeys: string[], extra: {
    selected: boolean;
    selectedNodes: NodeInstance[];
    node: NodeInstance;
    e: React.MouseEvent;
  }) => {

    // 新增元素和tooltip悬浮点击避免改变选中数据
    const classs = ['.tree-item-tooltip-overlay', '.add-new-content']
    let noSelected = false
    for (let i = 0; i < classs.length; i++) {
      const element = document.querySelector(classs[i])
      if (tooltipRef.current && element && element.contains(extra.e.target as Node)) {
        noSelected = true
      }
    }

    if (noSelected) {
      return
    }

    // 点击一级节点为切换开启关闭状态
    if (extra.node?.props?._level === 0 && selectedKeys.length) {
      const newExpandIds = [...expandIds]
      toggleArrayElement(newExpandIds, selectedKeys[0])
      setExpandIds(newExpandIds)
      return
    }

    let newSelectedNodes = extra.selectedNodes

    if (currentSelectedNodes?.length && selectedKeys.length && (Number(currentSelectedNodes[0].key) === Number(selectedKeys[0]))) {
      newSelectedNodes = []
    }

    if (!('selectedNodes' in props)) {
      setStateSelectedNodes(newSelectedNodes)
    }

    if (onSelect && isFunction(onSelect)) {
      onSelect(newSelectedNodes)
    }
  }

  // 树处理
  const [inputError, setInputError] = useState('')
  // 是否是添加状态
  const appendStatus = useRef<appendStatusType>({
    status: false,   // 是否正在编辑
    value: '',
    _index: [],
    // 是否是新增一级任务名称
    isFirst: false,
    inputError: inputError,
    type: 'add'
  })
  appendStatus.current.inputError = inputError
  const [isAppending, setIsAppending] = useState(false)

  // 删除确认弹框打开时，保持按钮组显示
  const [delPopoverVisible, setDelPopoverVisible] = useState({
    visible: false,
    jobId: "0"
  })

  // 是否有重复数据
  const isTestCommonName = (data: OfflineTreeItem[], text = 'name') => {
    let size = new Set(data.map(v => v[text])).size
    // console.log(new Set(data.map(v => v[text])))
    // console.log(data.map(v => v[text]))
    if (size != data.length) {
      return false
    }
    return true
  }

  const updateInputError = (flag: boolean) => {
    if (flag) {
      // setTimeout(() => {
      setTimeout(() => {
        if (inputRef.current && inputRef.current.dom) {
          inputRef.current.dom.classList.add('ysd-input-error')
          inputRef.current.dom.parentNode.classList.add('ysd-input-inner-error')
        }
      }, 100)
      // }, 100);
    } else {
      setTimeout(() => {
        if (inputRef.current && inputRef.current.dom) {
          inputRef.current.dom.classList.remove('ysd-input-error')
          inputRef.current.dom.parentNode.classList.remove('ysd-input-inner-error')
        }
      }, 100);
    }
  }

  const appendDom = useCallback(() => ({
    name: <Input
      className="add-task-name"
      ref={inputRef}
      defaultValue={appendStatus.current.value}
      placeholder="请输入任务名称"
      maxLength={15}
      onMouseOver={() => updateInputError(appendStatus.current.inputError !== '')}
      onMouseLeave={() => updateInputError(appendStatus.current.inputError !== '')}
      onBlur={() => updateInputError(appendStatus.current.inputError !== '')}
      onFocus={() => updateInputError(appendStatus.current.inputError !== '')}
      // {...(appendStatus.current.inputError && {
      //   error: appendStatus.current.inputError
      // })}
      onClick={(event) => {
        event.stopPropagation()
        inputRef.current.focus()
      }}
      onChange={(e) => {
        const value = e.target.value
        appendStatus.current.value = e.target.value
        // console.log(inputRef.current.dom.parentNode)
        if (value.indexOf('-') !== -1) {
          appendStatus.current.inputError = '不可输入字符【-】'
          setInputError('不可输入字符【-】')
        } else {
          appendStatus.current.inputError = ''
          setInputError('')
        }
        updateInputError(value.indexOf('-') !== -1)
      }}
    />,
    key: 'add-new-data',
    // old: true
  }), [appendStatus.current])

  // 点击“新建任务”
  const handleAddNewTask = () => {
    if (appendStatus.current.status) {
      Message.warning('请完成本次操作')
      return
    }
    if (inputValue) {
      Message.warning('请先将搜索内容清除之后再添加')
      return
    }
    appendStatus.current.type = 'add'
    addTaskCommonFun(['0'], 'one')
  }

  // 添加任务
  const addTaskCommonFun = (indexArray: string[], type = 'one', item?: OfflineTreeItem) => {
    if (indexArray.length === 0) {
      return
    }
    let arr = [...treeData]
    let _isFirst = type === 'one'
    // // console.log(_isFirst)
    setInputError('')
    if (_isFirst) {
      arr.unshift(Object.assign({}, appendDom(), {
        parentId: "0",
        jobId: "",
        creator: userInfo.name || '',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        privilege: 0,
        permission: 1,
        sharedUsers: []
      }))
    } else {
      const newItem = Object.assign({}, appendDom(), {
        parentId: item?.jobId || "0",
        jobId: "",
        creator: userInfo.name || '',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        privilege: 0,
        permission: 1,
        sharedUsers: []
      })
      handleNestedItem(arr, indexArray, newItem, 'add')
      appendStatus.current._index.push('0')
    }
    setTreeData(arr)

    appendStatus.current.isFirst = _isFirst
    appendStatus.current.status = true
    setIsAppending(true)
  }

  // 点击编辑某一项名称
  const handleEditItem = (item: OfflineTreeItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (appendStatus.current.status) {
      Message.warning('请完成本次操作')
      return
    }
    appendStatus.current.type = 'edit'
    // 没编辑元素之前缓存
    cacheTreeData.current = [...treeData]
    // 获取目标元素索引
    let indexArray = item.__index?.split('-') || []
    appendStatus.current._index = indexArray
    appendStatus.current.status = true
    appendStatus.current.value = item.name as string
    let newTreeData = JSON.parse(JSON.stringify(treeData)) // 防止浅拷贝，改变cacheTreeData.current引用
    const newChildren = Object.assign({}, item, { ...appendDom() })
    handleNestedItem(newTreeData, indexArray, newChildren, 'edit')
    // console.log(newTreeData)
    setTreeData(newTreeData)
  }

  // 取消新增/编辑状态
  const handleCancelEdit = (item: OfflineTreeItem, e: React.MouseEvent) => {
    e.stopPropagation()
    let arr = [...treeData]
    if (appendStatus.current.isFirst) {
      arr.splice(0, 1)
      onOfflineTreeDataChange?.(arr)
      setTreeData(arr)
    } else {
      // console.log(cacheTreeData.current)
      onOfflineTreeDataChange?.(cacheTreeData.current)
      setTreeData(cacheTreeData.current)
    }
    appendStatus.current.isFirst = false
    appendStatus.current.status = false
    setIsAppending(false)
    appendStatus.current.value = ''
    if (inputRef.current) {
      setInputValue("")
    }
  }

  // 编辑确认保存
  const handleConfirmEdit = (item: OfflineTreeItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (appendStatus.current.inputError) {
      return
    }

    if (!appendStatus.current.value) {
      Message.warning('请输入任务名称')
      return
    }

    // if (appendStatus.current.isFirst) {
    //   let isCommonTaskName = isTestCommonName([
    //     ...treeData.slice(1),
    //     {
    //       ...item,
    //       name: appendStatus.current.value
    //     }
    //   ])
    //   if (!isCommonTaskName) {
    //     Message.warning('请勿添加重复任务名称')
    //     return
    //   }
    // }

    updateTip('loading', '正在保存...', 0)


    if (appendStatus.current.type === 'add') {
      services.offline.addJob({
        jobName: appendStatus.current.value,
        parentId: item.parentId ? item.parentId : 0,
        userUuid: userInfo.id
      }).then(res => {
        const { errorMessage, jobId, parentId } = res || {}
        updateTip('success', '添加成功!', 1000)

        let arr = [...treeData]

        let addNewObj = {
          name: appendStatus.current.value,
          __level: appendStatus.current._index.length + 1,
          key: jobId,
          // old: true,
          parentId: parentId,
          jobId: jobId,
          creator: (userInfo.name || ''),
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          privilege: 0,
          permission: 1,
          sharedUsers: []
        }
        // 一级新增
        if (appendStatus.current.isFirst) {
          arr[0] = addNewObj
          getData()
        } else {
          // console.log(appendStatus.current._index)
          // console.log(appendStatus.current.value)
          handleNestedItem(
            arr,
            appendStatus.current._index,
            addNewObj,
            'edit'
          )
        }
        const newTreeData = formatData(arr)
        setTreeData(newTreeData)
        cacheTreeData.current = newTreeData
        // console.log(newTreeData)

        appendStatus.current.isFirst = false
        appendStatus.current.status = false
        setIsAppending(false)
        appendStatus.current.value = ''
        if (inputRef.current) {
          setInputValue('')
        }
      }).catch(err => {
        console.log(err)

        updateTip('error', '添加失败!', 1000)
      })

    } else if (appendStatus.current.type === 'edit') {
      services.offline.updateJob({
        jobId: item.jobId,
        jobName: appendStatus.current.value,
        userUuid: userInfo.id
      }).then(res => {
        updateTip('success', '更新成功!', 1000)

        const { errorMessage } = res || {}
        let arr = [...treeData]

        let addNewObj = {
          name: appendStatus.current.value,
          __level: appendStatus.current._index.length + 1,
          key: item.jobId,
          parentId: item.parentId,
          jobId: item.jobId,
          creator: item.creator,
          createTime: item.createTime,
          privilege: 0,
          permission: 1,
          sharedUsers: []
        }

        // console.log(appendStatus.current._index)
        // console.log(appendStatus.current.value)
        handleNestedItem(
          arr,
          appendStatus.current._index,
          addNewObj,
          'edit'
        )
        const newTreeData = formatData(arr)
        onOfflineTreeDataChange?.(newTreeData)
        setTreeData(newTreeData)
        cacheTreeData.current = newTreeData

        appendStatus.current.status = false
        setIsAppending(false)
        appendStatus.current.value = ''
        if (inputRef.current) {
          setInputValue('')
        }
      }).catch(err => {
        console.log(err)
        updateTip('error', '更新失败!', 1000)
      })
    }
  }


  // 添加/编辑/删除树列表的提示
  const updateTip = (tipType: string, tipText: string, tipDuration: number) => {
    Notification[tipType]({
      id: 'need_update',
      title: '更新任务列表',
      content: tipText,
      duration: tipDuration
    });
  }

  // 点击添加子项
  const handleAddItem = (item: OfflineTreeItem) => {
    if (appendStatus.current.status) {
      Message.warning('请完成本次操作')
      return
    }
    appendStatus.current.type = 'add'
    // 没添加元素之前缓存
    cacheTreeData.current = JSON.parse(JSON.stringify(treeData))
    // 获取目标元素索引
    let indexArray = item.__index?.split('-') || []
    appendStatus.current._index = indexArray
    addTaskCommonFun(indexArray, 'sub', item)
  }

  // 点击删除某一项
  const handleDelItem = (item: OfflineTreeItem) => {
    if (item.jobId === (currentSelectedNodes?.length ? currentSelectedNodes[0].key : '')) {
      Message.warning('不能删除当前选中的任务名称')
      return
    }
    if (item.jobId === (currentSelectedNodes?.length ? currentSelectedNodes[0].props.parentKey : '')) {
      Message.warning('不能删除当前选中的任务的父级任务')
      return
    }
    if (appendStatus.current.status) {
      Message.warning('请完成本次操作')
      return
    }

    updateTip('loading', '正在删除...', 0)
    services.offline.delJob({ jobId: item.jobId }).then(res => {
      updateTip('success', '删除成功!', 1000)
      let arr = [...treeData]
      let _indexArray = item.__index?.split('-') || []

      handleNestedItem(arr, _indexArray, item, 'del')
      console.log(arr)
      const newTreeData = formatData(arr)
      onOfflineTreeDataChange?.(newTreeData)
      setTreeData(newTreeData)
      cacheTreeData.current = newTreeData
    }).catch(err => {
      console.log(err)
      updateTip('error', '删除失败!', 1000)
    })
  }

  // 根据索引数组indexArray，在treeShapeArray数据对象中找到对应的数据项，替换成newChildren/删除对应项/在对应项下面添加子项
  const handleNestedItem = (treeShapeArray: OfflineTreeItem[], indexArray: string[], newChildren: OfflineTreeItem, type = 'add'): OfflineTreeItem | undefined => {
    // 检查是否已经遍历到了最后一层
    if (indexArray.length === 0) {
      return undefined;
    }

    // 获取当前层的索引
    const currentIndex = Number(indexArray[0]);

    // 检查当前层的索引是否有效
    if (currentIndex < 0 || currentIndex >= treeShapeArray.length) {
      return undefined;
    }

    const currentItem = treeShapeArray[currentIndex];

    if (indexArray.length === 1) {
      // console.log(currentItem)
      if (type === 'edit') {
        treeShapeArray[currentIndex] = Object.assign({}, treeShapeArray[currentIndex], newChildren)
      } else if (type === 'del') {
        treeShapeArray.splice(currentIndex, 1)
      } else if (type === 'add') {
        // treeShapeArray[currentIndex]
        treeShapeArray[currentIndex].children = treeShapeArray[currentIndex].children ? treeShapeArray[currentIndex].children : []
        treeShapeArray[currentIndex].children?.unshift(newChildren)
        // console.log(treeShapeArray[currentIndex])
      }
      // 新增子节点时，展开父节点
      if (treeShapeArray.length && treeShapeArray[indexArray[0]]?.jobId && type === 'add') {
        const ids = new Set([...expandIds, String(treeShapeArray[indexArray[0]].jobId)])
        setExpandIds([...ids])
      }
      return currentItem;
    }

    // 递归调用，继续查找下一层
    if (treeShapeArray[currentIndex] && treeShapeArray[currentIndex].children) {
      return handleNestedItem(treeShapeArray[currentIndex].children ?? [], indexArray.slice(1), newChildren, type);
    }
  }

  // 处理数据权限
  const handleItemAuth = (item: OfflineTreeItem) => {
    let indexArray = item.__index?.split('-') || []
    appendStatus.current._index = indexArray
    setCurrentData(item)
    setSharePermissionsVisible(true)
  }

  // 共享人员弹窗确定回调
  const handleSharePermissionOk = (data: { privilege: number, sharedUsers: Receiver[] }) => {
    console.log(data)
    updateTip('loading', '正在保存...', 0)
    const oldData = currentData as OfflineTreeItem

    services.offline.updateJob({
      jobId: oldData.jobId,
      userUuid: userInfo.id,
      jobName: oldData.name,
      // visibility: 0,
      ...data
    }).then(res => {

      updateTip('success', '更新成功!', 1000)

      const { errorMessage } = res || {}
      let arr = [...treeData]


      let addNewObj = {
        ...oldData,
        privilege: data.privilege,
        permission: 1,
        sharedUsers: data.sharedUsers.map(item => ({
          id: item.id,
          permission: 0
        }))
      }

      // console.log(appendStatus.current._index)
      // console.log(appendStatus.current.value)
      handleNestedItem(
        arr,
        oldData.__index?.split('-') || [],
        addNewObj,
        'edit'
      )
      const newTreeData = formatData(arr)
      console.log(`newTreeData`, newTreeData)
      onOfflineTreeDataChange?.(newTreeData)
      setTreeData(newTreeData)
      cacheTreeData.current = newTreeData

      appendStatus.current.status = false
      setIsAppending(false)
      appendStatus.current.value = ''
      if (inputRef.current) {
        setInputValue('')
      }

      setSharePermissionsVisible(false)
      setCurrentData(null)
    }).catch(err => {
      console.log(err)
      updateTip('error', '更新失败!', 1000)
    })
  }

  const handleSharePermissionCancel = () => {
    setSharePermissionsVisible(false)
    setCurrentData(null)
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

  const renderItemTitle = (item: OfflineTreeItem) => {
    const isParent = (item.__level === 1)
    // const hasPermission = is
    return (
      // <Tooltip
      //   ref={tooltipRef}
      //   destroyTooltipOnHide
      //   overlayClassName="tree-item-tooltip-overlay"
      //   key={item.jobId}
      //   placement="bottom"
      //   light={true}
      //   getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
      //   title={(
      //     <div className="tree-item-tooltip">
      //       <p className="name">{isString(item.name) ? item.name : ''}</p>
      //       <p className="creator"><span className="label">创建人</span>: {item.creator}</p>
      //       <p className="create-time"><span className="label">创建时间</span>: {item.createTime}</p>
      //     </div>
      //   )}
      // >
      <div className={`tree-item-container ${item.key === 'add-new-data' ? 'add-new-content' : ''}`} >
        <div className={classNames("name", { 'is-parent': isParent })} title={typeof item.name === 'string' ? item.name : ''}>
          {
            isParent ?
              expandIds.includes(item.key) ? <Icon type="wenjiandakai" /> : <Icon type="wenjianguanbi" />
              : ''
          }
          {typeof item.name === 'string' ? highlight(item.name, filterValue) : item.name}
          {
            item.key === 'add-new-data' && inputError ?
              <p className="error-message">{inputError}</p>
              : ''
          }
        </div>
        {
          item.permission === 1 ?
            <div
              className={classNames(
                "btn-group",
                {
                  "show": (item.key === 'add-new-data' || (item.jobId === delPopoverVisible.jobId && delPopoverVisible.visible))
                }
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {
                item.key === 'add-new-data' ?
                  <Space size={8}>
                    <span className="ok" onClick={(e) => handleConfirmEdit(item, e)}>确定</span>
                    <span className="cancel" onClick={(e) => handleCancelEdit(item, e)}>取消</span>
                  </Space>
                  :
                  <Space size={8}>
                    <span onClick={(e: React.MouseEvent) => handleEditItem(item, e)}>
                      <Icon type="bianji" />
                    </span>
                    {
                      isParent ?
                        <>
                          <span onClick={() => handleItemAuth(item)}>
                            <Icon type="weisuoding" />
                          </span>
                          <span onClick={() => handleAddItem(item)}>
                            <Icon type="xinzeng" />
                          </span>
                        </> : ''
                    }
                    <PopConfirm
                      title={isParent ? `删除该任务，则下级分组及文件将会随之删除` : `删除该分组，则对应文件将会随之删除`}
                      onConfirm={() => handleDelItem(item)}
                      onVisibleChange={(visible) => {
                        // console.log(visible)
                        setDelPopoverVisible({
                          jobId: item.jobId,
                          visible: visible
                        })
                      }}
                    // getPopupContainer={(triggerNode) => {
                    //   console.log(triggerNode.parentElement)
                    //   return triggerNode.parentElement || document.body
                    // }}
                    >
                      <span>
                        <Icon
                          type="lajitong"
                          className="del-btn"
                        />
                      </span>
                    </PopConfirm>
                  </Space>
              }
            </div>
            : ''
        }
        {
          // item.key != 'add-new-data' && item.level != maxLavel ?
          //     <div
          //         className="tree-item-add-btn"
          //         // onClick={(e) => {
          //             // addTeskInput(item, e)
          //         // }}
          //     ></div> : <></>
        }
      </div>
      // </Tooltip>
    )

  }

  const handleRenderTree = (data: OfflineTreeItem[]) => {
    if (data && data.length) {
      return data.map(item => {
        let temp = (
          <Tree.Node
            key={item.jobId}
            title={renderItemTitle(item)}
            parentKey={`${item.parentId || 0}`}
            className="tree-item-container"
            dataRef={item}
          // selectable={item.key !== "add-new-data"}
          // extra={item.extra}
          >
            {
              item.children && item.children.length ?
                handleRenderTree(item.children)
                : null
            }
          </Tree.Node>
        )
        return temp
      })
    }
  }

  return (
    <div className={`${prefixCls}-task-list`}>
      <div className="header">
        <div>任务列表</div>
        <div onClick={handleAddNewTask}>新建任务</div>
      </div>
      <div className="filter-input">
        <Input
          onChange={changeInput}
          value={inputValue}
          placeholder="请输入进行搜索..."
          suffix={<SearchOutlined />}
          allowClear
          disabled={isAppending}
        />
      </div>
      <div className="tree-wrap" ref={boxRef}>
        {
          ajaxLoading ?
            <Loading spinning={true} />
            :
            <Tree
              className="location-list"
              // checkable
              showLine={true}
              expandedKeys={expandIds}
              onExpand={handleExpand}
              selectedKeys={currentSelectedNodes && isArray(currentSelectedNodes) ? currentSelectedNodes.map(item => String(item.key)) : []}
              onSelect={handleSelectLocation}
              // treeData={treeData}  
              // fieldNames={{
              //   key: 'jobId',
              //   title: 'name',
              // }}
              autoExpandParent={false}
              isVirtual={true}
              virtualListProps={{ height: treeHeight }}
              {...(filterValue && {
                filterNode: filterTreeNode
              })}
            >
              {handleRenderTree(treeData)}
            </Tree>
        }
      </div>
      <SharePermissions
        modalProps={{
          visible: sharePermissionsVisible,
          onCancel: handleSharePermissionCancel
        }}
        onOk={handleSharePermissionOk}
        data={currentData}
      />
    </div>
  )
}

export default OfflineTree