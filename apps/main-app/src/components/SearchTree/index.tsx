import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Input,
  Tree,
  Tooltip,
  Loading,
  Message,
  Space,
  PopConfirm,
  Notification,
} from "@yisa/webui";
import { Icon, SearchOutlined } from "@yisa/webui/es/Icon";
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import {
  appendStatusType,
  ClueFormData,
  ClueTreeItem,
  GroupItem,
  LocationItem,
  SearchTreeProps,
} from "./interface";
import ResizeObserver from "resize-observer-polyfill";
import services, { ApiResponse } from "@/services";
import { isArray, isFunction } from "@/utils";
import classNames from "classnames";
import { isString } from "@/utils/is";
import "./index.scss";
import AddModal from "./AddModel";
import { SharePermissions } from "..";
import { Receiver } from "@/pages/Deploy/Deploy/interface";
const statusoptions = [
  {
    label: "事件",
    value: 0,
  },
  {
    label: "已立案",
    value: 1,
  },
  {
    label: "已侦破",
    value: 2,
  },
  {
    label: "侦破待复核",
    value: 3,
  },
  {
    label: "已结案",
    value: 4,
  },
  {
    label: "结案待复核",
    value: 5,
  },
  {
    label: "并案待复核",
    value: 6,
  },
  {
    label: "撤案待复核",
    value: 7,
  },
  {
    label: "结案归档",
    value: 8,
  },
  {
    label: "并案归档",
    value: 9,
  },
  {
    label: "撤案归档",
    value: 10,
  },
];
function SearchTree(props: SearchTreeProps) {
  const {
    onSelect,
    onclueTreeDataChange,
    ontreestatus,
    changemodelstatus,
    ismodel = false,
  } = props;
  const boxRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const location = useRef<any>({
    code: [],
    name: [],
  });
  const [treeHeight, setTreeHeight] = useState(0);
  const [ajaxLoading, setAjaxLoading] = useState(false);
  const [treeData, setTreeData] = useState<ClueTreeItem[]>([]);
  const [firstLoad, setFirstLoad] = useState(true);
  // 缓存treeData
  const cacheTreeData = useRef(treeData);
  // const firstLoad=useRef(true)
  const [inputValue, setInputValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [expandIds, setExpandIds] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<ClueTreeItem | null>(null);
  const [sharePermissionsVisible, setSharePermissionsVisible] = useState(false);
  const [stateSelectedNodes, setStateSelectedNodes] = useState<NodeInstance[]>(
    []
  );
  let currentSelectedNodes = stateSelectedNodes;
  //添加弹窗
  function isClueTreeItem(obj: ClueTreeItem | GroupItem): obj is ClueTreeItem {
    return "children" in obj;
  }
  const [addmodel, setAddmodel] = useState(false);
  const [options, setOptions] = useState<LocationItem[]>([]);
  const [formdata, setFormdata] = useState<ClueFormData>({
    id: "",
    title: "",
    caseId: "",
    // caseTime: [dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
    caseTime: [],
    caseDetails: "",
    caseRegionCode: [],
    casePlace: "", //详细地址
    caseStatus: 0,
    privilege: 1, //共享
    // privilege: 0,//不共享
    caseRegionName: [],
    // sharedUsers: [],
    // permission: 1//管理权限
    privilegeUser: [],
  });
  const initformdata = {
    id: "",
    title: "",
    caseId: "",
    caseTime: [],
    // caseTime: [dayjs().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')],
    caseDetails: "",
    caseRegionCode: location.current.code,
    casePlace: "",
    caseStatus: 0,
    privilege: 1,
    // privilege: 0,//不共享
    caseRegionName: location.current.name,
    // sharedUsers: [],
    // permission: 1
    privilegeUser: [],
  };
  useEffect(() => {
    getData();
    if (boxRef.current) {
      const ro = new ResizeObserver(() => {
        setTreeHeight(boxRef.current?.clientHeight || 0);
      });
      ro.observe(boxRef.current);
    }
    // setFirstLoad(false)
  }, []);

  useEffect(() => {
    services.getlocation().then((res) => {
      let opi = fn1(res.data);
      setOptions(opi);
      location.current.code = res.regionCode.reverse();
      location.current.name = res.regionName.replace(/-/g, " / ").split();
      setFormdata({
        ...formdata,
        caseRegionCode: location.current.code,
        caseRegionName: location.current.name,
      });
    });
  }, []);

  const fn1 = (data: LocationItem[]) => {
    let result = [...data];
    function dg(arr: LocationItem[]) {
      arr.forEach((item: LocationItem, i: number) => {
        item.value = item.id;
        item.label = item.name;
        if (item.nodes) {
          item.children = item.nodes;
          dg(item.nodes);
        }
      });
    }
    dg(result);
    return result;
  };
  // // 递归格式化数据
  const formatData = (data: ClueTreeItem[]) => {
    let result = [...data];
    function dg(
      arr: ClueTreeItem[] | GroupItem[],
      j?: string,
      level?: number,
      parentId?: string
    ) {
      level = level || 0; //上一层的level
      level++;
      arr.forEach((item, i) => {
        item.id = item.id + "";
        item.key = item.id;
        if (!isClueTreeItem(item) && parentId) item.parentId = parentId;
        if (isClueTreeItem(item) && isString(item.caseRegionName)) {
          item.caseRegionName = [item.caseRegionName?.replace(/-/g, " / ")];
        }
        item.__level = level;
        item.__index = `${j ? j + "-" : ""}` + `${i}`;
        if (isClueTreeItem(item)) {
          if (item.children.length) {
            dg(item.children, item.__index, level, item.id);
          }
        }
      });
    }
    dg(result);
    return result;
  };

  //获取线索树数据
  const getData = () => {
    setAjaxLoading(true);
    services.getClueList<ApiResponse<ClueFormData>, any>().then((res) => {
      setAjaxLoading(false);
      const resData = formatData(res.data || []);
      onclueTreeDataChange?.(resData);
      setTreeData(() => {
        cacheTreeData.current = [...resData];
        return resData;
      });
    });
  };

  const changeInput = (e: any) => {
    const value = e.target.value;
    setInputValue(value);
    if (!value) {
      setExpandIds([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilterValue(inputValue);
    }, 300);

    return () => {
      timer && clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    if (
      ismodel &&
      treeData.length > 0 &&
      !appendStatus.current.status &&
      firstLoad
    ) {
      //打开弹出后
      // 打开弹窗的默认展开和选中
      if (firstLoad) {
        setFirstLoad(false);
      }
      if (treeData[0].children.length > 0) {
        setExpandIds([treeData[0].key]);
        setStateSelectedNodes([treeData[0].children[0] as any]);
        if (onSelect && isFunction(onSelect)) {
          onSelect([treeData[0].children[0] as any]);
        }
      }
    }
    onclueTreeDataChange?.(treeData);
  }, [treeData]);

  const filterTreeNode = useCallback(
    (node: any) => {
      let title = node.dataRef?.title;
      if (title) {
        if (title.props) {
          return true;
        }
        return title.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
      } else {
        return false;
      }
    },
    [filterValue]
  );

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

  const handleSelectLocation = (
    selectedKeys: string[],
    extra: {
      selected: boolean;
      selectedNodes: NodeInstance[];
      node: NodeInstance;
      e: React.MouseEvent;
    }
  ) => {
    // 新增元素和tooltip悬浮点击避免改变选中数据
    // console.log(extra,"[");

    const classs = [".tree-item-tooltip-overlay", ".add-new-content"];
    let noSelected = false;
    for (let i = 0; i < classs.length; i++) {
      const element = document.querySelector(classs[i]);
      if (
        tooltipRef.current &&
        element &&
        element.contains(extra.e.target as Node)
      ) {
        noSelected = true;
      }
    }

    if (noSelected) {
      return;
    }

    // 点击一级节点为切换开启关闭状态
    if (extra.node?.props?._level === 0 && selectedKeys.length) {
      const newExpandIds = [...expandIds];
      toggleArrayElement(newExpandIds, selectedKeys[0]);
      setExpandIds(newExpandIds);
      return;
    }

    let newSelectedNodes = extra.selectedNodes;
    if (
      currentSelectedNodes?.length &&
      selectedKeys.length &&
      Number(currentSelectedNodes[0].key) === Number(selectedKeys[0])
    ) {
      newSelectedNodes = [];
    }

    if (!("selectedNodes" in props)) {
      setStateSelectedNodes(newSelectedNodes);
    }

    if (onSelect && isFunction(onSelect)) {
      onSelect(newSelectedNodes);
    }
  };

  // 树处理
  const [inputError, setInputError] = useState("");
  // 是否是添加状态
  const appendStatus = useRef<appendStatusType>({
    isfirst: true, //首次
    status: false, // 是否正在编辑
    value: "",
    _index: [],
    // 是否是新增一级任务名称
    inputError: inputError,
    type: "add",
    parentId: "",
  });
  appendStatus.current.inputError = inputError;
  //搜索框是否显示
  const [isAppending, setIsAppending] = useState(false);

  // 删除确认弹框打开时，保持按钮组显示
  const [delPopoverVisible, setDelPopoverVisible] = useState({
    visible: false,
    id: "0",
  });

  const updateInputError = (flag: boolean) => {
    if (flag) {
      // setTimeout(() => {
      setTimeout(() => {
        if (inputRef.current && inputRef.current.dom) {
          inputRef.current.dom.classList.add("ysd-input-error");
          inputRef.current.dom.parentNode.classList.add(
            "ysd-input-inner-error"
          );
        }
      }, 100);
      // }, 100);
    } else {
      setTimeout(() => {
        if (inputRef.current && inputRef.current.dom) {
          inputRef.current.dom.classList.remove("ysd-input-error");
          inputRef.current.dom.parentNode.classList.remove(
            "ysd-input-inner-error"
          );
        }
      }, 100);
    }
  };

  const appendDom = useCallback(
    () => ({
      title: (
        <Input
          className="add-task-name"
          ref={inputRef}
          defaultValue={appendStatus.current.value}
          placeholder="请输入任务名称"
          maxLength={15}
          onMouseOver={() =>
            updateInputError(appendStatus.current.inputError !== "")
          }
          onMouseLeave={() =>
            updateInputError(appendStatus.current.inputError !== "")
          }
          onBlur={() =>
            updateInputError(appendStatus.current.inputError !== "")
          }
          onFocus={() =>
            updateInputError(appendStatus.current.inputError !== "")
          }
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current.focus();
          }}
          onChange={(e) => {
            const value = e.target.value;
            appendStatus.current.value = e.target.value;
            if (value.indexOf("-") !== -1) {
              appendStatus.current.inputError = "不可输入字符【-】";
              setInputError("不可输入字符【-】");
            } else {
              appendStatus.current.inputError = "";
              setInputError("");
            }
            updateInputError(value.indexOf("-") !== -1);
          }}
        />
      ),
      key: "add-new-data",
      // old: true
    }),
    [appendStatus.current]
  );

  // 点击“新建任务”
  const handleAddNewTask = () => {
    if (appendStatus.current.status) {
      Message.warning("请完成本次操作");
      return;
    }
    appendStatus.current.type = "Add";
    setAddmodel(true);
  };
  //判断标题是否重复
  const isCom = (
    titlename: string,
    data: ClueTreeItem[],
    editid?: string | number
  ) => {
    let casearr = [];
    if (editid) {
      let newdata = data.filter((item: ClueTreeItem) => {
        return item.id != editid;
      });
      casearr = newdata.map((item: ClueTreeItem) => item.title.trim());
    } else {
      casearr = data.map((item) => item.title.trim());
    }
    return casearr.findIndex((item: string) => {
      return item === titlename.trim();
    });
  };
  //弹窗取消
  const handlecancel = () => {
    console.log("取消");
    setAddmodel(false);
    setFormdata(initformdata);
  };
  //弹窗确认 一级新增/编辑
  const handleok = () => {
    console.log("确认");
    if (!formdata.title.trim()) {
      Message.warning("案件名称不可为空");
      return;
    }
    if (formdata.title.indexOf("-") !== -1) {
      return;
    }
    let newformdata ={...formdata}
    delete newformdata['__index']
    delete newformdata['__level']
    //走编辑
    if (appendStatus.current.type === "Edit") {
      if (isCom(formdata.title, treeData, formdata.id) !== -1) {
        Message.warning("案件名已存在");
        return;
      }
      services
        .updateGroup({
          ...newformdata,
          caseStartTime: formdata.caseTime[0],
          caseEndTime: formdata.caseTime[1],
        })
        .then((res) => {
          updateTip("success", "更新成功!", 1000);
          getData();
          setInputValue("");
        })
        .catch((err) => {
          updateTip("error", "更新失败!", 1000);
          return;
        });
    }
    //走新增
    else if (appendStatus.current.type === "Add") {
      if (isCom(formdata.title, treeData) !== -1) {
        Message.warning("案件名已存在");
        return;
      }
      services
        .addClue({
          ...newformdata,
          caseStartTime: formdata.caseTime[0],
          caseEndTime: formdata.caseTime[1],
        })
        .then((res) => {
          const { data, parentId } = res || {};
          updateTip("success", "添加成功!", 1000);
          //添加数据
          getData();
          setIsAppending(false);
          // 搜索框清空
          setInputValue("");

          // }
        })
        .catch((err) => {
          updateTip("error", "添加失败!", 1000);
        });
    }
    //关闭弹窗 恢复初始数据
    setAddmodel(false);
    setFormdata(initformdata);
  };

  // 添加二级任务
  const addTaskCommonFun = (indexArray: string[], item: ClueTreeItem) => {
    if (indexArray.length === 0) {
      return;
    }

    let arr = [...treeData];
    setInputError("");
    const newItem = Object.assign({}, appendDom(), {
      parentId: item.id as string,
      id: "",
    });
    handleNestedItem(arr, indexArray, newItem, "add");
    appendStatus.current._index.push("0");
    setTreeData(arr);
    appendStatus.current.status = true;
    ontreestatus?.(appendStatus.current.status);
    appendStatus.current.parentId = item.id as string;
    if (ismodel) {
      changemodelstatus?.(appendStatus.current.status);
    }
    setIsAppending(true);
  };

  //打开编辑-一级
  const handleEditItemF = (item: ClueTreeItem, e: React.MouseEvent) => {
    if (appendStatus.current.status) {
      Message.warning("请完成本次操作");
      return;
    }
    appendStatus.current.type = "Edit";
    setFormdata(item);
    setAddmodel(true);
  };
  // 点击编辑--二级
  const handleEditItem = (item: GroupItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (appendStatus.current.status) {
      Message.warning("请完成本次操作");
      return;
    }
    setIsAppending(true);
    appendStatus.current.type = "edit";
    // 没编辑元素之前缓存
    cacheTreeData.current = [...treeData];
    // 获取目标元素索引
    let indexArray = item.__index?.split("-") || [];

    appendStatus.current._index = indexArray;
    appendStatus.current.status = true;
    ontreestatus?.(appendStatus.current.status);
    appendStatus.current.value = item.title;
    let newTreeData = JSON.parse(JSON.stringify(treeData)); // 防止浅拷贝，改变cacheTreeData.current引用
    const newChildren = Object.assign({}, item, { ...appendDom() });

    handleNestedItem(newTreeData, indexArray, newChildren, "edit");
    setTreeData(newTreeData);
  };

  // 二级取消新增/编辑状态
  const handleCancelEdit = (item: GroupItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // 数据恢复
    setTreeData(cacheTreeData.current);
    appendStatus.current.status = false;
    ontreestatus?.(appendStatus.current.status);
    if (ismodel) {
      changemodelstatus?.(appendStatus.current.status);
    }
    setIsAppending(false);
    appendStatus.current.value = "";
    //清空搜索框
    // if (inputRef.current) {
    //     setInputValue("")
    // }
  };
  //二级判断标题是否重复
  const isComSecond = (
    titlename: string,
    parentId: string,
    id: string | number
  ) => {
    let detailarr = treeData.filter((item: any) => {
      return parentId == item.id;
    })[0].children;
    let newdetailarr = detailarr.filter((item: any) => {
      return item.id != id;
    });
    let arr = newdetailarr.map((item: any) => item.title.trim());
    return arr.findIndex((item: string) => {
      return item === titlename.trim();
    });
  };
  // 二级编辑确认保存
  const handleConfirmEdit = (item: GroupItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (appendStatus.current.inputError) {
      return;
    }
    if (!appendStatus.current.value) {
      Message.warning("请输入任务名称");
      return;
    }
    if (
      isComSecond(appendStatus.current.value, item.parentId, item.id) !== -1
    ) {
      updateTip("error", "操作失败，线索已存在!", 1000);
      return;
    }
    updateTip("loading", "正在保存...", 0);
    //新增的保存
    if (appendStatus.current.type === "add") {
      services
        .addClue({
          title: appendStatus.current.value,
          parentId: appendStatus.current.parentId,
        })
        .then((res) => {
          const { data } = res || {};
          updateTip("success", "添加成功!", 1000);

          let arr = [...treeData];

          let addNewObj = {
            title: appendStatus.current.value,
            __level: appendStatus.current._index.length + 1,
            key: data,
            // old: true,
            parentId: appendStatus.current.parentId,
            id: data as string,
          };
          handleNestedItem(arr, appendStatus.current._index, addNewObj, "edit");
          const newTreeData = formatData(arr);
          setTreeData(newTreeData);

          cacheTreeData.current = newTreeData;
          appendStatus.current.status = false;
          ontreestatus?.(appendStatus.current.status);
          if (ismodel) {
            changemodelstatus?.(appendStatus.current.status);
          }
          setIsAppending(false);
          appendStatus.current.value = "";
          //清空搜索框
          if (inputRef.current) {
            setInputValue("");
          }
        })
        .catch((err) => {
          updateTip("error", "添加失败!", 1000);
        });
    } else if (appendStatus.current.type === "edit") {
      //编辑的保存
      services
        .updateGroup({
          id: item.id,
          title: appendStatus.current.value,
          parentId: item.parentId,
        })
        .then((res) => {
          updateTip("success", "更新成功!", 1000);

          const { errorMessage } = res || {};
          let arr = [...treeData];

          let addNewObj = {
            title: appendStatus.current.value,
            __level: appendStatus.current._index.length + 1,
            key: item.id,
            parentId: item.parentId,
            id: item.id,
          };
          handleNestedItem(arr, appendStatus.current._index, addNewObj, "edit");
          const newTreeData = formatData(arr);
          setTreeData(newTreeData);
          cacheTreeData.current = newTreeData;

          appendStatus.current.status = false;
          ontreestatus?.(appendStatus.current.status);
          setIsAppending(false);
          //清空
          appendStatus.current.value = "";
          if (inputRef.current) {
            setInputValue("");
          }
        })
        .catch((err) => {
          updateTip("error", "更新失败!", 1000);
        });
    }
  };

  // 添加/编辑/删除树列表的提示
  const updateTip = (tipType: string, tipText: string, tipDuration: number) => {
    Notification[tipType]({
      id: "need_update",
      title: "更新任务列表",
      content: tipText,
      duration: tipDuration,
    });
  };

  // 点击添加子项
  const handleAddItem = (item: ClueTreeItem) => {
    if (appendStatus.current.status) {
      Message.warning("请完成本次操作");
      return;
    }
    appendStatus.current.type = "add";
    // // 没添加元素之前缓存
    cacheTreeData.current = JSON.parse(JSON.stringify(treeData));
    // // 获取目标元素索引
    let indexArray = item.__index?.split("-") || [];
    appendStatus.current._index = indexArray;

    addTaskCommonFun(indexArray, item);
  };

  // 点击删除某一项
  const handleDelItem = (item: ClueTreeItem | GroupItem) => {
    // item.key选中的
    if (
      item.id ===
      (currentSelectedNodes?.length ? currentSelectedNodes[0].key : "")
    ) {
      Message.warning("不能删除当前选中的任务名称");
      return;
    }
    if (
      item.id ===
      (currentSelectedNodes?.length
        ? currentSelectedNodes[0].props.parentKey
        : "")
    ) {
      Message.warning("不能删除当前选中的任务所属案事件");
      return;
    }

    if (appendStatus.current.status) {
      Message.warning("请完成本次操作");
      return;
    }

    updateTip("loading", "正在删除...", 0);
    services
      .delClue({ id: item.id })
      .then((res) => {
        updateTip("success", "删除成功!", 1000);
        let arr = [...treeData];
        let _indexArray = item.__index?.split("-") || [];

        handleNestedItem(arr, _indexArray, item, "del");
        const newTreeData = formatData(arr);
        setTreeData(newTreeData);
        cacheTreeData.current = newTreeData;
      })
      .catch((err) => {
        updateTip("error", "删除失败!", 1000);
      });
  };
  const modeltitle = () => {
    if (appendStatus.current.type === "Edit") {
      return "编辑案件";
    } else if (appendStatus.current.type === "Add") {
      return "新建案件";
    }
  };
  const handleNestedItem = (
    treeShapeArray: ClueTreeItem[] | GroupItem[],
    indexArray: string[],
    newChildren: GroupItem | ClueTreeItem,
    type = "add"
  ): ClueTreeItem | GroupItem | undefined => {
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
      if (type === "edit") {
        treeShapeArray[currentIndex] = Object.assign(
          {},
          treeShapeArray[currentIndex],
          newChildren
        );
      } else if (type === "del") {
        treeShapeArray.splice(currentIndex, 1);
      } else if (type === "add") {
        let arr = treeShapeArray[currentIndex];
        if (isClueTreeItem(arr)) arr.children.unshift(newChildren as GroupItem);
      }
      // 新增子节点时，展开父节点
      if (
        treeShapeArray.length &&
        treeShapeArray[indexArray[0]]?.id &&
        type === "add"
      ) {
        const ids = new Set([
          ...expandIds,
          String(treeShapeArray[indexArray[0]].id),
        ]);
        setExpandIds([...ids]);
      }
      return currentItem;
    }
    // 递归调用，继续查找下一层
    // if (treeShapeArray[currentIndex] && treeShapeArray[currentIndex].children) {
    //     return handleNestedItem(treeShapeArray[currentIndex].children ?? [], indexArray.slice(1), newChildren, type);
    // }
    if (currentItem && isClueTreeItem(currentItem)) {
      return handleNestedItem(
        currentItem.children ?? [],
        indexArray.slice(1),
        newChildren,
        type
      );
    }
  };

  const handleItemAuth = (item: ClueTreeItem) => {
    let indexArray = item.__index?.split("-") || [];
    appendStatus.current._index = indexArray;
    setCurrentData(item);
    setSharePermissionsVisible(true);
  };
  const handleSharePermissionCancel = () => {
    setSharePermissionsVisible(false);
    setCurrentData(null);
  };
  // 共享人员弹窗确定回调
  const handleSharePermissionOk = (data: {
    privilege: number;
    sharedUsers: Receiver[];
  }) => {
    // console.log(data)
    if (data.privilege === 1 && data.sharedUsers.length === 0) {
      Message.warning("未选择共享对象");
      return;
    }
    updateTip("loading", "正在保存...", 0);
    services
      .updateGroup({
        ...currentData,
        caseStartTime: currentData?.caseTime[0],
        caseEndTime: currentData?.caseTime[1],
        privilege: data.privilege,
        privilegeUser: data.sharedUsers.map((item) => item.id),
      })
      .then((res) => {
        updateTip("success", "更新成功!", 1000);
        setSharePermissionsVisible(false);
        setCurrentData(null);
        getData();
        setInputValue("");
      })
      .catch((err) => {
        updateTip("error", "更新失败!", 1000);
        return;
      });
  };
  const renderItemTitle = (item: ClueTreeItem | GroupItem) => {
    const isParent = item.__level === 1;
    return isClueTreeItem(item) ? (
      ismodel ? (
        <div className="tree-item-container">
          <div className="name f-title">{item.title}</div>
          <div
            className={classNames("btn-group", {
              show:
                item.key === "add-new-data" ||
                (item.id === delPopoverVisible.id && delPopoverVisible.visible),
            })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Space size={8}>
              <span onClick={() => handleAddItem(item)}>
                <Icon type="xinzeng" />
              </span>
            </Space>
          </div>
        </div>
      ) : (
        <Tooltip
          ref={tooltipRef}
          destroyTooltipOnHide
          overlayClassName="tree-item-tooltip-overlay"
          key={item.id}
          placement="bottom"
          light={true}
          getPopupContainer={(triggerNode: HTMLElement) => triggerNode}
          mouseEnterDelay={0.3}
          title={
            <div className="tree-item-tooltip">
              <p className="name">
                案件名称：{isString(item.title) ? item.title : "-"}
              </p>
              <p className="caseId">
                <span className="label">案件编号:</span>
                <span title={item.caseId}>
                  {item.caseId ? item.caseId : "-"}
                </span>
              </p>
              <p className="caseDetails">
                <span className="label">简要案情:</span>
                <span title={item.caseDetails}>
                  {item.caseDetails ? item.caseDetails : "-"}
                </span>
              </p>
              <div className="time">
                <span className="label">事发时间:</span>
                {item.caseTime.length > 0 ? (
                  <div className="timebox">
                    <span>{item.caseTime[0] + " 至"}</span>
                    <span>{item.caseTime[1]}</span>
                  </div>
                ) : (
                  "-"
                )}
              </div>
              <p className="caseRegionCode">
                <span className="label">事发地点:</span>
                <span
                  title={item.caseRegionName ? item.caseRegionName[0] : "-"}
                >
                  {item.caseRegionName ? item.caseRegionName[0] : "-"}
                </span>
              </p>
              <p className="casePlace">
                <span className="label">详细地址:</span>
                <span title={item.casePlace}>
                  {item.casePlace ? item.casePlace : "-"}
                </span>
              </p>
              <p className="status">
                <span className="label">案件状态:</span>
                {item.caseStatus !== undefined
                  ? statusoptions.find((t) => {
                      return t.value === item.caseStatus;
                    })?.label
                  : "-"}
              </p>
              <p className="privilege">
                <span className="label">权限配置:</span>
                <span>
                  {item.privilege != undefined
                    ? item.privilege == 0
                      ? "私有"
                      : "共享"
                    : "-"}
                </span>
              </p>
            </div>
          }
        >
          <div className="tree-item-container">
            <div className="name f-title">
              {isParent ? (
                expandIds.includes(item.key) ? (
                  <Icon type="wenjiandakai" />
                ) : (
                  <Icon type="wenjianguanbi" />
                )
              ) : (
                ""
              )}
              {item.title}
            </div>
            <div
              className={classNames("btn-group", {
                show:
                  item.key === "add-new-data" ||
                  (item.id === delPopoverVisible.id &&
                    delPopoverVisible.visible),
              })}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {
                <Space size={8}>
                  <span
                    onClick={(e: React.MouseEvent) => handleEditItemF(item, e)}
                  >
                    <Icon type="bianji" />
                  </span>
                  <span onClick={() => handleItemAuth(item)}>
                    {/* <span> */}
                    <Icon type="weisuoding" />
                  </span>
                  <span onClick={() => handleAddItem(item)}>
                    <Icon type="xinzeng" />
                  </span>
                  <PopConfirm
                    title={"删除该任务，则下级分组及文件将会随之删除"}
                    onConfirm={() => handleDelItem(item)}
                    onVisibleChange={(visible) => {
                      setDelPopoverVisible({
                        id: item.id as string,
                        visible: visible,
                      });
                    }}
                  >
                    <span>
                      <Icon type="lajitong" className="del-btn" />
                    </span>
                  </PopConfirm>
                </Space>
              }
            </div>
          </div>
        </Tooltip>
      )
    ) : (
      <div
        className={`tree-item-container ${
          item.key === "add-new-data" ? "add-new-content" : ""
        }`}
      >
        <div className="name">
          {item.title}
          {item.key === "add-new-data" && inputError ? (
            <p className="error-message">{inputError}</p>
          ) : (
            ""
          )}
        </div>
        <div
          className={classNames("btn-group", {
            show:
              item.key === "add-new-data" ||
              (item.id === delPopoverVisible.id && delPopoverVisible.visible),
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {item.key === "add-new-data" ? (
            <Space size={8}>
              <span className="ok" onClick={(e) => handleConfirmEdit(item, e)}>
                确定
              </span>
              <span
                className="cancel"
                onClick={(e) => handleCancelEdit(item, e)}
              >
                取消
              </span>
            </Space>
          ) : ismodel ? (
            ""
          ) : (
            <Space size={8}>
              <span onClick={(e: React.MouseEvent) => handleEditItem(item, e)}>
                <Icon type="bianji" />
              </span>
              <PopConfirm
                title={"删除该分组，则对应文件将会随之删除"}
                onConfirm={() => handleDelItem(item)}
                onVisibleChange={(visible) => {
                  setDelPopoverVisible({
                    id: item.id as string,
                    visible: visible,
                  });
                }}
              >
                <span>
                  <Icon type="lajitong" className="del-btn" />
                </span>
              </PopConfirm>
            </Space>
          )}
        </div>
      </div>
    );
  };

  const handleRenderTree = (data: ClueTreeItem[] | GroupItem[]) => {
    if (data && data.length) {
      return data.map((item) => {
        let temp = (
          <Tree.Node
            key={item.id}
            title={renderItemTitle(item)}
            // parentKey={`${item.parentId || 0}`}
            parentKey={isClueTreeItem(item) ? "0" : item.parentId}
            className="tree-item-container"
            dataRef={item}
          >
            {isClueTreeItem(item) ? handleRenderTree(item.children) : null}
          </Tree.Node>
        );
        return temp;
      });
    }
  };
  return (
    <div className="search-tree">
      {ismodel ? (
        ""
      ) : (
        <div className="header">
          <div>任务列表</div>
          <div onClick={handleAddNewTask}>新建案件</div>
        </div>
      )}
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
        {ajaxLoading ? (
          <Loading spinning={true} />
        ) : (
          <Tree
            className="location-list"
            showLine={true}
            expandedKeys={expandIds}
            onExpand={handleExpand}
            selectedKeys={
              currentSelectedNodes && isArray(currentSelectedNodes)
                ? currentSelectedNodes.map((item) => String(item.key))
                : []
            }
            onSelect={handleSelectLocation}
            autoExpandParent={false}
            isVirtual={true}
            virtualListProps={{ height: treeHeight }}
            {...(filterValue && {
              filterNode: filterTreeNode,
            })}
          >
            {handleRenderTree(treeData)}
          </Tree>
        )}
      </div>
      <AddModal
        visible={addmodel}
        onCancel={handlecancel}
        onOk={handleok}
        options={options}
        formdata={formdata}
        title={modeltitle()}
        setFormdata={setFormdata}
        statusoptions={statusoptions}
      ></AddModal>
      <SharePermissions
        modalProps={{
          visible: sharePermissionsVisible,
          onCancel: handleSharePermissionCancel,
        }}
        onOk={handleSharePermissionOk}
        data={currentData}
      />
    </div>
  );
}
export default SearchTree;
