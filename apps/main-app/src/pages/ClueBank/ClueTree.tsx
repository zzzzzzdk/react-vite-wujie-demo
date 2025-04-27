import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { Input, Tree, Tooltip, Button, Loading, Message, Space, PopConfirm, Notification, Checkbox, Pagination, Modal, Form } from '@yisa/webui'
import { Icon, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@yisa/webui/es/Icon'
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
// import { OfflineTreeProps, OfflineTreeItem, appendStatusType } from "./interface";
import ResizeObserver from 'resize-observer-polyfill'
import services from "@/services";
import { isArray, isFunction } from "@/utils";
import { useSelector, RootState, useDispatch } from "@/store";
import dayjs from 'dayjs'
import classNames from 'classnames'
import { ClueContext } from "./context";
import { isString } from "@/utils/is";
import { flushSync } from 'react-dom';
import AddModal from './AddModel'
const statusoptions = [
    {
        label: '事件',
        value: '0'
    },
    {
        label: '已立案',
        value: '1'
    },
    {
        label: '已侦破',
        value: '2'
    },
    {
        label: '侦破待复核',
        value: '3'
    },
    {
        label: '已结案',
        value: '4'
    },
    {
        label: '结案待复核',
        value: '5'
    },
    {
        label: '并案待复核',
        value: '6'
    },
    {
        label: '撤案待复核',
        value: '7'
    },
    {
        label: '结案归档',
        value: '8'
    },
    {
        label: '并案归档',
        value: '9'
    },
    {
        label: '撤案归档',
        value: '10'
    },
]
const ClueTree = (props: any) => {
    const {
        prefixCls,
        onSelect,
    } = props
    const {
        onclueTreeDataChange
    } = useContext(ClueContext)
    //tree
    const boxRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<any>(null)
    const inputRef = useRef<any>(null)
    const [treeHeight, setTreeHeight] = useState(0)
    const [ajaxLoading, setAjaxLoading] = useState(false)
    const [treeData, setTreeData] = useState<any[]>([])

    // 缓存treeData
    const cacheTreeData = useRef(treeData)

    const [inputValue, setInputValue] = useState('')
    const [filterValue, setFilterValue] = useState('')
    const [expandIds, setExpandIds] = useState<string[]>([])

    const [stateSelectedNodes, setStateSelectedNodes] = useState<NodeInstance[]>([])
    const currentSelectedNodes = 'selectedNodes' in props ? props.selectedNodes : stateSelectedNodes

    const userInfo = useSelector((state: RootState) => {
        return state.user.userInfo
    })
    //添加弹窗
    const [addmodel, setAddmodel] = useState(false)
    const [formdata, setFormdata] = useState({
        nid: '',
        name: '',
        casenum: '',
        time: [dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        brief: '',
        place: '1',
        details: '',
        status: '0',
        power: '1'
    })
    const initformdata = {
        nid: '',
        name: '',
        casenum: '',
        time: [dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        brief: '',
        place: '1',
        details: '',
        status: '0',
        power: '1'
    }
    const [status, setStatus] = useState('')//EDIT NORMAL ADD
    useEffect(() => {
        getData()

        if (boxRef.current) {
            const ro = new ResizeObserver(() => {
                // console.log(boxRef.current?.clientHeight)
                setTreeHeight(boxRef.current?.clientHeight || 0)
            })
            ro.observe(boxRef.current)
        }
        console.log(treeData);


    }, [])

    // // 递归格式化数据
    const formatData = (data: any[]) => {
        let result = [...data]
        function dg(arr: any[], j?: string, level?: number) {
            level = level || 0 //上一层的level
            level++
            arr.forEach((item, i) => {
                item.nid = item.nid + ""
                item.key = item.nid
                item.title = item.name
                item.__level = level
                item.__index = `${j ? j + '-' : ''}` + `${i}`
                if (item.children && item.children.length) {
                    dg(item.children, item.__index, level)
                }
            })
        }
        dg(result)
        return result
    }

    //获取线索树数据
    const getData = () => {
        setAjaxLoading(true)
        services.getClueList<any, any>().then(res => {
            console.log(res)
            setAjaxLoading(false)
            const resData = formatData(res.data || [])
            onclueTreeDataChange?.(resData)
            setTreeData(() => {
                console.log(resData);
                return resData
            })
        })
    }

    const changeInput = (e: any) => {
        const value = e.target.value
        setInputValue(value)
        if (!value) {
            setExpandIds([])
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterValue(inputValue)
        }, 300)

        return () => {
            timer && clearTimeout(timer)
        }
    }, [inputValue])

    const filterTreeNode = useCallback((node: any) => {
        let name = node.dataRef.name
        if (name) {
            if (name.props) {
                return true
            }
            return name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
        }
        else {
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
        // console.log(newSelectedNodes);

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
    const appendStatus = useRef<any>({
        status: false,   // 是否正在编辑
        value: '',
        _index: [],
        // 是否是新增一级任务名称
        inputError: inputError,
        type: 'add'
    })
    appendStatus.current.inputError = inputError
    //搜索框是否显示
    const [isAppending, setIsAppending] = useState(false)

    // 删除确认弹框打开时，保持按钮组显示
    const [delPopoverVisible, setDelPopoverVisible] = useState({
        visible: false,
        nid: "0"
    })

    // 是否有重复数据
    // const isTestCommonName = (data: any[], text = 'name') => {
    //     let size = new Set(data.map(v => v[text])).size
    //     // console.log(new Set(data.map(v => v[text])))
    //     // console.log(data.map(v => v[text]))
    //     if (size != data.length) {
    //         return false
    //     }
    //     return true
    // }

    const updateInputError = (flag: boolean) => {
        if (flag) {
            // setTimeout(() => {
            setTimeout(() => {
                if (inputRef.current && inputRef.current.dom) {
                    // console.log(inputRef.current.dom.classList, 112);

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
            placeholder="请输入任务名称，不超过15个字符"
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
        // if (inputValue) {
        //   Message.warning('请先将搜索内容清除之后再添加')
        //   return
        // }
        // appendStatus.current.type = 'Add'
        setStatus('ADD')
        // addTaskCommonFun(['0'], 'one')
        setAddmodel(true)
    }
    //判断标题是否重复
    const isCom = (titlename: string, data: any[]) => {
        let casearr = data.map((item) => item.name)
        // console.log(casearr);
        return casearr.findIndex((item) => {
            return item === titlename
        })

    }
    //弹窗取消
    const handlecancel = () => {
        console.log('取消');
        setAddmodel(false)
        setFormdata(initformdata)
    }
    //弹窗确认
    const handleok = () => {
        console.log('确认');
        if (!formdata.name.trim()) {
            Message.warning('案件名称不可为空')
            return
        }
        if (formdata.name.indexOf('-') !== -1) {
            return
        }
        //走编辑
        if (status === 'EDIT') {
            handleSave(formdata)
        }
        //走新增
        else if (status === 'ADD') {
            // console.log(formdata.name,treeData);
            // console.log(isCom(formdata.name));
            if (isCom(formdata.name, treeData) !== -1) {
                Message.warning('案件名已存在')
                return
            }
            addtask(formdata)
        }
        // console.log(formdata);

        //关闭弹窗 恢复初始数据
        setAddmodel(false)
        setFormdata(initformdata)
        // setTreeData([...treeData,formdata])

    }
    // 新增-一级
    const addtask = (formdata: any) => {
        services.addClue({
            jobName: '新建案件',
            parentId: formdata.parentId ? formdata.parentId : 0
        }).then(res => {
            const { nid, parentId } = res || {}
            updateTip('success', '添加成功!', 1000)
            let arr = [...treeData]
            let addNewObj = {
                ...formdata,
                __level: 1,
                // key: nid,
                parentId: parentId,
                nid: nid,
                children: [{
                    nid: nid + '1',
                    name: '默认分组',
                    parentId: nid,
                    // title:'分组1',
                    // __index: "0-0"
                    __level: 2
                }]
            }
            // 一级新增
            // if (appendStatus.current.isFirst) {
            // let isCommonTaskName = isTestCommonName([
            //     ...arr.slice(1),
            //     addNewObj
            // ])
            // if (!isCommonTaskName) {
            //     Message.warning('请勿添加重复案件名称')
            //     return
            // }

            //添加数据
            arr.unshift(addNewObj)
            //格式化数据
            const newTreeData = formatData(arr)
            //更新treedata
            setTreeData(newTreeData)

            //新的treedata缓存
            cacheTreeData.current = newTreeData
            // console.log(newTreeData, 'addnew')

            // appendStatus.current.isFirst = false
            // appendStatus.current.status = false
            setIsAppending(false)
            // console.log(appendStatus.current.value,1231313);
            // appendStatus.current.value = ''
            // console.log(inputRef.current,22);
            // if (inputRef.current) {

            // 搜索框清空
            setInputValue('')
            // }
        }).catch(err => {
            console.log(err)
            updateTip('error', '添加失败!', 1000)
        })
    }

    // 添加任务
    const addTaskCommonFun = (indexArray: string[], item?: any) => {
        // console.log(indexArray,item,9999);

        if (indexArray.length === 0) {
            return
        }
        let arr = [...treeData]
        setInputError('')
        const newItem = Object.assign({}, appendDom(), {
            parentId: item.nid,
            nid: "",
        })
        // console.log(newItem);
        handleNestedItem(arr, indexArray, newItem, 'add')
        appendStatus.current._index.push('0')
        setTreeData(arr)
        appendStatus.current.status = true
        setIsAppending(true)
    }

    //打开编辑-一级
    const handleEditItemF = (item: any, e: React.MouseEvent) => {
        // appendStatus.current.type = 'Edit'
        // setTitle(titlearr[0])
        setStatus('EDIT')
        // console.log(item);
        // setFormdata({
        //     nid:item.nid,
        //     name: item.name,
        //     casenum: item.casenum,
        //     time: item.time,
        //     brief: item.brief,
        //     place: item.place,
        //     details: item.details,
        //     status: item.status,
        //     power: item.power
        // })
        setFormdata(item)
        setAddmodel(true)
    }
    // 点击编辑--二级
    const handleEditItem = (item: any, e: React.MouseEvent) => {
        e.stopPropagation()
        if (appendStatus.current.status) {
            Message.warning('请完成本次操作')
            return
        }
        setIsAppending(true)
        appendStatus.current.type = 'edit'
        // 没编辑元素之前缓存
        cacheTreeData.current = [...treeData]
        // 获取目标元素索引
        let indexArray = item.__index?.split('-') || []
        // console.log(indexArray,'index');

        appendStatus.current._index = indexArray
        appendStatus.current.status = true
        appendStatus.current.value = item.name as string
        let newTreeData = JSON.parse(JSON.stringify(treeData)) // 防止浅拷贝，改变cacheTreeData.current引用
        // console.log(newTreeData,'newdatatree');
        // console.log(item,5566);
        const newChildren = Object.assign({}, item, { ...appendDom() })
        // console.log(item, newChildren);

        handleNestedItem(newTreeData, indexArray, newChildren, 'edit')
        // console.log(newTreeData)
        setTreeData(newTreeData)
    }

    // 二级取消新增/编辑状态
    const handleCancelEdit = (item: any, e: React.MouseEvent) => {
        e.stopPropagation()
        // let arr = [...treeData]
        // console.log(appendStatus.current.isFirst,123);

        // if (appendStatus.current.isFirst) {
        //     arr.splice(0, 1)
        //     setTreeData(arr)
        // } else {
        // console.log(cacheTreeData.current)
        // 数据恢复
        setTreeData(cacheTreeData.current)
        // }
        // appendStatus.current.isFirst = false
        appendStatus.current.status = false
        setIsAppending(false)
        appendStatus.current.value = ''
        if (inputRef.current) {
            setInputValue("")
        }
    }

    // 一级编辑确认保存
    const handleSave = (data: any) => {
        // const newData = data
        let arr = [...treeData]
        // arr.map
        // const index=arr.findIndex((item)=>item.nid===data.nid)
        let newData = arr.map((item) => {
            return item.nid === data.nid ? data : item
        })
        setTreeData(newData)
    }
    // 二级编辑确认保存
    const handleConfirmEdit = (item: any, e: React.MouseEvent) => {
        e.stopPropagation()
        if (appendStatus.current.inputError) {
            return
        }

        if (!appendStatus.current.value) {
            Message.warning('请输入任务名称')
            return
        }

        updateTip('loading', '正在保存...', 0)

        //新增的保存
        if (appendStatus.current.type === 'add') {
            // console.log(item);
            services.addClue({
                jobName: '添加子项',
                parentId: item.parentId ? item.parentId : 0,
            }).then(res => {
                const { nid, parentId } = res || {}
                updateTip('success', '添加成功!', 1000)

                let arr = [...treeData]

                let addNewObj = {
                    name: appendStatus.current.value,
                    __level: appendStatus.current._index.length + 1,
                    key: nid,
                    // old: true,
                    parentId: parentId,
                    nid: nid,
                }
                // console.log(appendStatus.current._index,1112);

                handleNestedItem(
                    arr,
                    appendStatus.current._index,
                    addNewObj,
                    'edit'
                )
                const newTreeData = formatData(arr)
                setTreeData(newTreeData)

                cacheTreeData.current = newTreeData
                // console.log(newTreeData)

                // appendStatus.current.isFirst = false
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

        } else if (appendStatus.current.type === 'edit') {//编辑的保存
            services.updateGroup({
                nid: item.nid,
                jobName: appendStatus.current.value,
                userUuid: userInfo.id
            }).then(res => {
                updateTip('success', '更新成功!', 1000)

                const { errorMessage } = res || {}
                let arr = [...treeData]

                let addNewObj = {
                    name: appendStatus.current.value,
                    __level: appendStatus.current._index.length + 1,
                    key: item.nid,
                    parentId: item.parentId,
                    nid: item.nid,
                    creator: item.creator,
                    createTime: item.createTime,
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
                setTreeData(newTreeData)
                cacheTreeData.current = newTreeData

                appendStatus.current.status = false
                setIsAppending(false)
                //清空
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
    const handleAddItem = (item: any) => {
        if (appendStatus.current.status) {
            Message.warning('请完成本次操作')
            return
        }
        appendStatus.current.type = 'add'
        // // 没添加元素之前缓存
        cacheTreeData.current = JSON.parse(JSON.stringify(treeData))
        // // 获取目标元素索引
        let indexArray = item.__index?.split('-') || []
        appendStatus.current._index = indexArray

        addTaskCommonFun(indexArray, item)
    }

    // 点击删除某一项
    const handleDelItem = (item: any) => {
        if (item.nid === (currentSelectedNodes?.length ? currentSelectedNodes[0].key : '')) {
            Message.warning('不能删除当前选中的任务名称')
            return
        }

        if (appendStatus.current.status) {
            Message.warning('请完成本次操作')
            return
        }

        updateTip('loading', '正在删除...', 0)
        services.delClue({ nid: item.nid }).then(res => {
            updateTip('success', '删除成功!', 1000)
            let arr = [...treeData]
            let _indexArray = item.__index?.split('-') || []

            handleNestedItem(arr, _indexArray, item, 'del')

            // console.log(arr)
            const newTreeData = formatData(arr)
            setTreeData(newTreeData)
            cacheTreeData.current = newTreeData
        }).catch(err => {
            // console.log(err)
            updateTip('error', '删除失败!', 1000)
        })
    }

    // 根据索引数组indexArray，在treeShapeArray数据对象中找到对应的数据项，替换成newChildren/删除对应项/在对应项下面添加子项
    const handleNestedItem = (treeShapeArray: any[], indexArray: string[], newChildren: any, type = 'add'): any | undefined => {
        // 检查是否已经遍历到了最后一层
        if (indexArray.length === 0) {
            return undefined;
        }

        // 获取当前层的索引
        const currentIndex = Number(indexArray[0]);
        // console.log(indexArray.length,55);
        // 检查当前层的索引是否有效
        if (currentIndex < 0 || currentIndex >= treeShapeArray.length) {
            return undefined;
        }

        const currentItem = treeShapeArray[currentIndex];

        if (indexArray.length === 1) {
            // console.log(currentItem,'cc')
            if (type === 'edit') {
                // console.log(treeShapeArray[currentIndex], '121213', newChildren);
                treeShapeArray[currentIndex] = Object.assign({}, treeShapeArray[currentIndex], newChildren)

            } else if (type === 'del') {
                treeShapeArray.splice(currentIndex, 1)
            } else if (type === 'add') {
                // treeShapeArray[currentIndex]
                // console.log(newChildren);

                // treeShapeArray[currentIndex].children = treeShapeArray[currentIndex].children ? treeShapeArray[currentIndex].children : []
                treeShapeArray[currentIndex].children.unshift(newChildren)
                // console.log(treeShapeArray[currentIndex])
            }
            // console.log(treeShapeArray[currentIndex]);
            // 新增子节点时，展开父节点
            if (treeShapeArray.length && treeShapeArray[indexArray[0]]?.nid && type === 'add') {
                const ids = new Set([...expandIds, String(treeShapeArray[indexArray[0]].nid)])
                setExpandIds([...ids])
            }
            return currentItem;
        }

        // 递归调用，继续查找下一层
        if (treeShapeArray[currentIndex] && treeShapeArray[currentIndex].children) {
            // console.log(1111);
            return handleNestedItem(treeShapeArray[currentIndex].children ?? [], indexArray.slice(1), newChildren, type);
        }
    }

    const renderItemTitle = (item: any) => {
        return (
            item.__level === 1 ?
                <Tooltip
                    ref={tooltipRef}
                    destroyTooltipOnHide
                    overlayClassName="tree-item-tooltip-overlay"
                    key={item.nid}
                    placement="bottom"
                    light={true}
                    getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
                    mouseEnterDelay={2}
                    // visible={true}
                    title={(
                        <div className="tree-item-tooltip">
                            <p className="name">案件名称：{isString(item.title) ? item.title : '-'}</p>
                            <p className="casenum"><span className="label">案件编号:</span>{item.casenum ? item.casenum : '-'}</p>
                            <p className="brief"><span className="label">简要案情:</span>{item.brief ? item.brief : '-'}</p>
                            <div className="time"><span className="label">事发时间:</span>
                                {item.time ?
                                    <div className='timebox'>
                                        <span>{item.time[0] + ' 至'}</span>
                                        <span>{item.time[1]}</span>
                                    </div>
                                    : '-'
                                }
                            </div>
                            <p className="place"><span className="label">事发地点:</span>{item.place ? item.place : '-'}</p>
                            <p className="details"><span className="label">详细地址:</span>{item.details ? item.details : '-'}</p>
                            <p className="status"><span className="label">案件状态:</span>
                                {
                                    item.status ?
                                        statusoptions.find((t) => {
                                            return t.value === item.status
                                        })?.label
                                        : '-'
                                }
                            </p>
                            <p className="power"><span className="label">权限配置:</span>{item.power ? item.power : '-'}</p>
                        </div>
                    )}
                >
                    <div className='tree-item-container'>
                        <div className='name f-title'>
                            {item.name}
                        </div>
                        <div
                            className=
                            {classNames(
                                "btn-group"
                                ,
                                {
                                    "show": (item.key === 'add-new-data' || (item.nid === delPopoverVisible.nid && delPopoverVisible.visible))
                                }
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            {
                                // item.key === 'add-new-data' ?
                                //     <Space size={4}>
                                //         <span className="ok" onClick={(e) => handleConfirmEdit(item, e)}>确定</span>
                                //         <span className="cancel" onClick={(e) => handleCancelEdit(item, e)}>取消</span>
                                //     </Space>
                                //     :
                                <Space size={4}>
                                    <span onClick={(e: React.MouseEvent) => handleEditItemF(item, e)}>
                                        <Icon type="bianji" />
                                    </span>
                                    {/* {
                                            item.__level === 1 ? */}
                                    {/* <> */}
                                    <span>
                                        <Icon type="weisuoding" />
                                    </span>
                                    <span onClick={() => handleAddItem(item)}>
                                        <Icon type="xinzeng" />
                                    </span>
                                    {/* </>  */}
                                    {/* : '' */}
                                    {/* } */}
                                    <PopConfirm
                                        title={'删除该任务，则下级分组及文件将会随之删除'}
                                        onConfirm={() => handleDelItem(item)}
                                        onVisibleChange={(visible) => {
                                            // console.log(visible)
                                            setDelPopoverVisible({
                                                nid: item.nid,
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
                        {
                            // item.key != 'add-new-data' && item.level != maxLavel ?
                            //     <div
                            //         className="tree-item-add-btn"
                            //         // onClick={(e) => {
                            //             // addTeskInput(item, e)
                            //         // }}
                            //     ></div> : <></>

                            //27.8
                            //35.2

                            //31.8
                            //39.5
                        }
                    </div>
                </Tooltip>
                : <div className={`tree-item-container ${item.key === 'add-new-data' ? 'add-new-content' : ''}`} >
                    <div className='name'>
                        {item.name}
                        {
                            item.key === 'add-new-data' && inputError ?
                                <p className="error-message">{inputError}</p>
                                : ''
                        }
                    </div>
                    <div
                        className={classNames(
                            "btn-group",
                            {
                                "show": (item.key === 'add-new-data' || (item.nid === delPopoverVisible.nid && delPopoverVisible.visible))
                            }
                        )}
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        {
                            item.key === 'add-new-data' ?
                                <Space size={4}>
                                    <span className="ok" onClick={(e) => handleConfirmEdit(item, e)}>确定</span>
                                    <span className="cancel" onClick={(e) => handleCancelEdit(item, e)}>取消</span>
                                </Space>
                                :
                                <Space size={4}>
                                    <span onClick={(e: React.MouseEvent) => handleEditItem(item, e)}>
                                        <Icon type="bianji" />
                                    </span>
                                    {/* {
                                        item.__level === 1 ?
                                            <>
                                                <span>
                                                    <Icon type="weisuoding" />
                                                </span>
                                                <span onClick={() => handleAddItem(item)}>
                                                    <Icon type="xinzeng" />
                                                </span>
                                            </> : ''
                                    } */}
                                    <PopConfirm
                                        title={'删除该分组，则对应文件将会随之删除'}
                                        onConfirm={() => handleDelItem(item)}
                                        onVisibleChange={(visible) => {
                                            // console.log(visible)
                                            setDelPopoverVisible({
                                                nid: item.nid,
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
                    {
                        // item.key != 'add-new-data' && item.level != maxLavel ?
                        //     <div
                        //         className="tree-item-add-btn"
                        //         // onClick={(e) => {
                        //             // addTeskInput(item, e)
                        //         // }}
                        //     ></div> : <></>
                    }
                </div>)
    }

    const handleRenderTree = (data: any[]) => {
        if (data && data.length) {
            return data.map(item => {
                let temp = (
                    <Tree.Node
                        key={item.nid}
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
                <div onClick={handleAddNewTask}>新建案件</div>
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
                            selectedKeys={currentSelectedNodes && isArray(currentSelectedNodes) ? currentSelectedNodes.map((item: any) => String(item.key)) : []}
                            onSelect={handleSelectLocation}
                            // treeData={treeData}  
                            // fieldNames={{
                            //   key: 'nid',
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
            <AddModal
                visible={addmodel}
                onCancel={handlecancel}
                onOk={handleok}
                formdata={formdata}
                title={status === 'EDIT' ? '编辑案件' : '新增案件'}
                setFormdata={setFormdata}
                statusoptions={statusoptions}
            >
            </AddModal>
        </div>
    )
}


export default ClueTree
