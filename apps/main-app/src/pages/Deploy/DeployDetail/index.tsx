import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { RootState } from "@/store";
import dayjs from "dayjs";
import { Icon } from "@yisa/webui/es/Icon";
import { useSelector } from "react-redux";
import {
  Message,
  Link,
  Modal,
  Tooltip,
  Select,
  Checkbox,
  Table,
  Button,
  Tabs,
  Form,
  Input,
  Space
} from "@yisa/webui";
import type { ColumnProps } from "@yisa/webui/es/Table";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import {
  ResultHeader,
  TimeRangePicker,
  Export
} from "@/components";
import { UserInfoState } from "@/store/slices/user";

import type { PaginationLayoutProps } from "../components/PaginationPage";
import type { FormItemConfig } from "../components/FormWrapper/interface";
import dictionary from "@/config/character.config";
import services from "@/services";

import PaginationLayout from "../components/PaginationPage";
import DeployTargetOverview from "./DeployTargetOverview";
import "./index.scss";
import {
  BkTypeTextSetting,
  MeasureTextSetting,
  CloseTextSetting,
  DeployStatusTextSetting,
  DeployUserInfo,
  DeployTime,
} from "./interface";
import ReviewingModal, { operationType } from "./ReviewingModal";

import {
  DeployItem,
  DeployStatus,
  BkType,
  Measure,
  CloseType,
} from "./interface";
import TableAction, { TableActionProps } from "../components/TableAction";
import FormWrapper from "../components/FormWrapper";
import DeployStatusIcon from "../components/DeployStatusIcon";
import useTitleList from "./useTitleList";
import { useLatest, useResetState, useToggle } from "ahooks";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { ResultBox } from "@yisa/webui_business";
import LocationMap from "./LocationMap";
import { useSearchParams } from "react-router-dom";
import { isObject } from "lodash";
import { ajax, formatTimeFormToComponent } from "@/utils";
const Option = Select.Option;

/* 我创建的 ... */
export type TabsKey = "createdByMe" | DeployStatus;

// 表单类型
type DeployDetailFormData = {
  jobId: (number | string)[]; //单号标题
  createUser: string; // 创建人
  approveUser: string; // 审批人
  // bkType: BkType[]; // 布控类型，目标布控/全维布控
  target: string; // 模糊搜索,所以用字符串
  status: TabsKey[];
  measure: Measure[];
  // 与时间相关
  timeType: string;
  beginDate: string;
  endDate: string;
  beginTime: null | string;
  endTime: null | string;

  closeType: CloseType[]; // 关闭原因
  // 分页
  pageNo: number;
  pageSize: number;
  // 根据tab切换不同taskId
  taskId: string
};

const prefixCls = "deploy-detail";

function DeployDetail() {
  // 当前用户是否有审批权限
  const user = useSelector<RootState, UserInfoState>(
    (state) => (state.user as any).userInfo
  );
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    services.deploy
      .isApprover<any, { approveMonitor: boolean }>()
      .then((res) => {
        setHasPermission(!!res.data?.approveMonitor);
      });
  }, [user]);
  // 搜索表单

  const setId = () => {
    let stamp = new Date().getTime();
    return (((1 + Math.random()) * stamp) | 0).toString(16);
  }

  const isFirst = useRef(true)
  const [formData, setFormData, reset] = useResetState<DeployDetailFormData>({
    jobId: [],
    // bkType: [],
    target: "",
    status: [],
    measure: [],
    closeType: [],
    /*魔化搜索  */
    createUser: "",
    approveUser: "",
    // 时间
    timeType: "time",
    // beginDate: dayjs()
    //   .subtract(6, "days")
    //   .startOf("day")
    //   .format("YYYY-MM-DD HH:mm:ss"),
    // endDate: dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    beginDate: "",
    endDate: "",
    beginTime: "",
    endTime: "",

    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
    taskId: setId()
  });
  const [ajaxFormData, setAjaxFormData] = useState(formData)

  const [deployList, setDeployList] = useState<DeployItem[]>([]);
  const [loading, setLoading] = useState(false);
  // 查询速度
  const [queryInfo, setQueryInfo] = useState<
    Record<"totalRecords" | "usedTime", number>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  /* 当前选中的布控单Id
   * TODO： 为什么不是直接选中布控单，而是选择相应id?
   */
  const [activeDeployItemId, setActiveDeployItemId] = useState<
    number | string
  >();

  const [currentLocationIds, setCurrentLocationIds] = useState<string[]>([])

  const activeDeployItem = deployList.find((item) => {
    return activeDeployItemId === item.jobId;
  });

  /* 弹窗 */
  const [showReviewModal, setShowReviewModal] = useState<operationType>();
  const [showMap, setShowMap] = useState(false);
  /* 选中 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  // 勾选
  const handleSelectChange = useCallback(
    (newSelectedRowKeys: (string | number)[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    []
  );
  // 底部全选checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(deployList.map(({ jobId: key }) => key));
    } else {
      setSelectedRowKeys([]);
    }
  };
  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 分页清除所有选中
    setSelectedRowKeys([]);
    // 先判断页面大小是否改变(必须)
    let newFormData: DeployDetailFormData = ajaxFormData
    if (pageSize !== newFormData.pageSize) {
      newFormData = {
        ...newFormData,
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...newFormData,
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setAjaxFormData(newFormData)
    fetchDeployItemList(newFormData, () => { });
  };
  // 时间
  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };
  // 查询
  const fetchDeployItemList = (
    form: DeployDetailFormData,
    onSussess?: () => void,
    shouldIgnore = () => false,
    showLoading = true
  ) => {
    setLoading(showLoading);
    return services.deploy
      .getDeployList<any, DeployItem[]>(beforeSubmit(form))
      .then((res) => {
        const ignore = shouldIgnore();
        console.log("shouldIgnore", ignore);
        if (ignore) {
          return;
        }
        if (!Array.isArray(res.data)) {
          console.log("返回值错误");
          return;
        }
        setDeployList(res.data);
        setQueryInfo({
          totalRecords: res.totalRecords ?? 0,
          usedTime: res.usedTime ?? 0,
        });
        if (onSussess) {
          onSussess();
        }
      })
      .catch((err) => {
        // 调试信息
        // 重置
        setQueryInfo({
          totalRecords: 0,
          usedTime: 0,
        });
        console.log("错误");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 获取token
  const [searchParams, _] = useSearchParams();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;
    services.log
      .getLogData({ token })
      .then((res) => {
        if (!res.data || !isObject(res.data)) {
          throw Error("Token参数解析失败");
        }
        const { data } = res as any;
        // 时间格式恢复
        if (data.timeRange) {
          formatTimeFormToComponent(data.timeRange, data);
        }
        // 恢复tab
        const status = data.status as TabsKey[];
        if (status.includes("createdByMe")) {
          setActiveTab("createdByMe");
        }
        if (status.length === 1) {
          setActiveTab(status[0]);
        }
        const newFormData = {
          ...formData,
          ...data,
          status: data.status.filter((i: string) => i !== "createdByMe"),
        }
        setFormData((form) => {
          return newFormData;
        });
        fetchDeployItemList(newFormData);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => { });
  }, []);

  /* 对提交前的表单进行调整, 非纯函数*/
  const beforeSubmit = (form: DeployDetailFormData) => {
    const status = [...new Set([activeTab, ...form.status])];
    const newForm = { ...form, status };
    let timeRange = {};
    if (form.timeType === "time") {
      timeRange = { times: [form.beginDate, form.endDate] };
    } else {
      timeRange = {
        periods: {
          dates: [form.beginDate, form.endDate],
          times: [form.beginTime, form.endTime],
        },
      };
    }
    const delKeys = [
      "timeType",
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
    ];
    delKeys.forEach((key) => delete newForm[key]);
    newForm["timeRange"] = timeRange;
    return newForm;
  };
  const handleSubmit = () => {
    /* 页码置1 */
    const newFormData = {
      ...formData,
      pageNo: 1,
    };
    setAjaxFormData(newFormData)
    // setFormData(newFormData)
    fetchDeployItemList(newFormData, () => { });
  };
  /* 分页配置 */
  const paginationConfig: PaginationProps = {
    current: ajaxFormData.pageNo,
    pageSize: ajaxFormData.pageSize,
    total: queryInfo.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
    disabled: loading,
  };
  /* Tab配置 */
  const [activeTab, setActiveTab] = useState<TabsKey>("createdByMe");
  const tabsData = [
    {
      key: "createdByMe",
      name: "我创建的",
      disabled: loading,
    },
    {
      key: "reviewing",
      name: "待审批",
      disabled: loading,
    },
    {
      key: "monitoring",
      name: "布控中",
      disabled: loading,
    },
    {
      key: "close",
      name: "已关闭",
      disabled: loading,
    },
  ];
  /* 初始加载  */
  useEffect(() => {
    // 如果有token则不初始化请求
    const token = searchParams.get("token");
    if (token) return;
    fetchDeployItemList(formData);
  }, []);
  /*  */





  const latestFormRef = useLatest(formData);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    const curtaskid = setId()
    setFormData({
      ...formData,
      taskId: curtaskid
    })
    setAjaxFormData({ ...latestFormRef.current })
    fetchDeployItemList({
      ...latestFormRef.current,
      taskId: curtaskid
    });
  }, [activeTab]);

  /* 定时刷新 */
  useEffect(() => {
    let ignore = false;
    // const timerId = setInterval(() => {
    //   fetchDeployItemList(
    //     ajaxFormData,
    //     undefined,
    //     () => {
    //       return ignore;
    //     },
    //     false
    //   );
    // }, 1000 * 10);
    return () => {
      ignore = true;
      // clearTimeout(timerId);
    };
  }, [ajaxFormData, activeTab]);

  /* 获取标题 */
  const titleList = useTitleList(activeTab);
  // 表单配置
  const formItems: FormItemConfig<DeployDetailFormData>[] = [
    {
      key: 1,
      label: "单号标题",
      element: (
        <Select
          showSearch
          mode="multiple"
          maxTagCount={1}
          options={titleList.map((t) => {
            return {
              label: `${t.jobId}-${t.title}`,
              value: t.jobId,
            };
          })}
          value={formData.jobId as any}
          onChange={(v) => {
            setFormData({ ...formData, jobId: v as any });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      ),
    },
    {
      key: 2,
      label: (
        <Tooltip
          className="label-tooltip"
          trigger="hover"
          title="模糊搜索：姓名、身份证号、车牌号、车辆类别、品牌-型号-年款任一值"
        >
          布控目标
          <Icon type="bangzhu" />
        </Tooltip>
      ),
      element: (
        <Input
          placeholder="模糊搜索"
          value={formData.target}
          onChange={(e, v) => {
            setFormData({ ...formData, target: v });
          }}
        />
      ),
    },
    /* TODO 未完成 */
    // {
    //   key: 3,
    //   label: "布控类型",
    //   element: (
    //     <Select
    //       mode="multiple"
    //       maxTagCount={1}
    //       options={Object.entries(BkTypeTextSetting).map((item) => {
    //         const [name, setting] = item;
    //         return {
    //           label: setting.text,
    //           value: BkType[name],
    //         };
    //       })}
    //       value={formData.bkType}
    //       onChange={(v) => {
    //         setFormData({ ...formData, bkType: v as any });
    //       }}
    //       // @ts-ignore
    //       getTriggerContainer={(triggerNode) =>
    //         triggerNode.parentNode as HTMLElement
    //       }
    //     />
    //   ),
    // },
    {
      key: 4,
      label: "采取措施",
      element: (
        <Select
          mode="multiple"
          maxTagCount={1}
          options={Object.entries(MeasureTextSetting).map((item) => {
            const [name, setting] = item;
            return {
              label: setting.text,
              value: Measure[name],
            };
          })}
          value={formData.measure}
          onChange={(v) => {
            setFormData({ ...formData, measure: v as any });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        />
      ),
    },
    {
      key: 5,
      element: (
        <TimeRangePicker
          className="timer-picker"
          timeType={formData.timeType}
          beginDate={formData.beginDate}
          endDate={formData.endDate}
          beginTime={formData.beginTime}
          endTime={formData.endTime}
          onChange={handleDateChange}
          allowClear
        />
      ),
      wrapped: true,
    },
    /* 动态切换 */
    {
      key: 6,
      label: (
        <Tooltip
          className="label-tooltip"
          trigger="hover"
          title="模糊搜索：创建人姓名、手机号码"
        >
          创建人
          <Icon type="bangzhu" />
        </Tooltip>
      ),
      element: (
        <Input
          value={formData.createUser}
          onChange={(e, v) => {
            setFormData({ ...formData, createUser: v });
          }}
        />
      ),
      show: activeTab !== "createdByMe",
    },
    {
      key: "approver",
      label: (
        <Tooltip
          className="label-tooltip"
          trigger="hover"
          title="模糊搜索：审批人姓名、手机号码"
          placement="topRight"
        >
          审批人
          <Icon type="bangzhu" />
        </Tooltip>
      ),
      element: (
        <Input
          value={formData.approveUser}
          onChange={(e, v) => {
            setFormData({ ...formData, approveUser: v });
          }}
        />
      ),

      show: activeTab !== "reviewing",
    },
    {
      key: 8,
      name: "status",
      label: (
        <Tooltip
          className="label-tooltip"
          trigger="hover"
          title="已关闭包括：撤销、驳回、过期、手动关闭"
          placement="topRight"
        >
          布控状态
          <Icon type="bangzhu" />
        </Tooltip>
      ),
      element: (
        <Select
          key="status"
          mode="multiple"
          maxTagCount={1}
          value={formData.status}
          onChange={(v) => {
            setFormData({ ...formData, status: v as any });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        >
          {Object.entries(DeployStatusTextSetting).map(([name, setting]) => (
            <Option key={name} value={name}>
              {setting.text}
            </Option>
          ))}
        </Select>
      ),
      show: activeTab === "createdByMe",
    },
    {
      key: 9,
      label: "关闭原因",
      element: (
        <Select
          mode="multiple"
          maxTagCount={1}
          value={formData.closeType}
          onChange={(v) => {
            setFormData({ ...formData, closeType: v as any });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        >
          {Object.entries(CloseTextSetting).map(([name, text]) => (
            <Option key={name} value={name}>
              {text}
            </Option>
          ))}
        </Select>
      ),
      show: activeTab === "close",
    },
    {
      key: 10,
      className: "search-btn",
      element: (
        <Space size={10}>
          <Button disabled={loading} onClick={() => { reset() }} type='default' className="reset-btn">重置</Button>
          <Button type="primary" onClick={handleSubmit} disabled={loading}>
            查询
          </Button>
        </Space>
      ),
    },
  ];
  // 操作按钮配置
  const actions: TableActionProps<DeployItem>[] = [
    {
      children: "查看",
      show(user, item) {
        return item?.permissions?.includes("view")
      },
      onClick(item) {
        window.open(`#/deployment/${item.jobId}`);
      },
    },
    {
      children: "编辑",
      show(user, item) {
        // 当前用户是创建人，并且布控单没有关闭(待审批，布控中)
        return item?.permissions?.includes("edit")
        // return (
        //   sameUser(user, item.createUser) &&
        //   (item.status == "monitoring" || item.status === "reviewing")
        // );
        // return
      },
      onClick(item) {
        window.open(`#/deploy/${item.jobId}?operation=edit`);
      },
    },
    {
      children: "撤销",
      dangerous: true,
      show(user, item) {
        return item?.permissions?.includes("undo")
        // return sameUser(user, item.createUser) && item.status === "reviewing";
      },
      onClick(deployItem) {
        setShowReviewModal("undo");
        setActiveDeployItemId(deployItem.jobId);
      },
    },
    {
      children: "审批",
      // 当前用户有审批权限且布控单状态为审批中
      show(user, item) {
        // TODO 怎么判断是不是有审批权限
        return item?.permissions?.includes("approval")
        // return (
        //   item.status === "reviewing" &&
        //   hasPermission &&
        //   sameUser(user, item.approveUser)
        // );
        // return
      },
      onClick(deployItem) {
        setShowReviewModal("review");
        setActiveDeployItemId(deployItem.jobId);
      },
    },
    {
      children: "关闭",
      dangerous: true,
      show(user, item) {
        // 当前用户是创建人，布控状态为布控中
        return item?.permissions?.includes("close")
        // return sameUser(user, item.createUser) && item.status === "monitoring";
      },
      onClick(deployItem) {
        setShowReviewModal("close");
        setActiveDeployItemId(deployItem.jobId);
      },
    },
    {
      // 当前用户是创建人 并且布控状态已经关闭: 手动关闭 撤销 驳回 过期
      children: "重新布控",
      show(user, item) {
        return item?.permissions?.includes("redeploy")
        // return (
        //   sameUser(user, item.createUser) &&
        //   (item.status === "close" ||
        //     item.status === "expire" ||
        //     item.status === "reject" ||
        //     item.status === "undo")
        // );
      },
      onClick(item) {
        window.open(`#/deploy/${item.jobId}?operation=redeploy`);
      },
    },
  ];
  // 表格配置
  const columns: ColumnProps<DeployItem>[] = [
    {
      title: "序号",
      key: "index",
      width: "70px",
      render(_, __, index) {
        return deployList.length - index;
      },
    },
    {
      width: "100px",
      title: "布控单号",
      dataIndex: "jobId",
    },
    // {
    //   width: "110px",
    //   title: "布控类型",
    //   dataIndex: "deployType",
    //   render(col, item, index) {
    //     return BkTypeTextSetting[BkType[item.bkType]]?.text;
    //   },
    // },
    {
      title: "布控标题",
      width: "200px",
      dataIndex: "deployTitle",
      render(col, item, index) {
        return (
          <span
            className="blue-cell"
            onClick={() => {
              window.open(`#/deployment/${item.jobId}`);
            }}
          >
            {item.title}
          </span>
        );
      },
    },
    {
      width: "120px",
      title: "布控目标",
      dataIndex: "deployTarget",
      render(_, item) {
        return <DeployTargetOverview className="blue-cell" deployItem={item} />;
      },
    },
    {
      width: "110px",
      title: "采取措施",
      dataIndex: "method",
      render(col, item, index) {
        return MeasureTextSetting[Measure[item.measure]]?.text;
      },
    },
    {
      width: "300px",
      title: "布控时间",
      dataIndex: "timeRange",
      render(col, item, index) {
        if (item.deployTimeType === DeployTime.Short) {
          if (item.timeRange?.times) {
            const times = item.timeRange.times.map((t) =>
              dayjs(t).format("YYYY/MM/DD HH:mm:ss")
            );
            return (
              <div className="time-spans">
                <span>{`${times[0]} -`}</span>
                <span>{times[1]}</span>
              </div>
            );
          }
          if (item.timeRange?.periods) {
            const periods = item.timeRange.periods;
            const dates =
              periods.dates?.map((t) => dayjs(t).format("YYYY/MM/DD")) || [];
            const times = periods.times?.map((t) => t) || [];
            const dateFormat = `${dates[0]} - ${dates[1]}`;

            const spans = times
              .reduce(
                (gaps, t) => {
                  if (gaps[gaps.length - 1].length === 2) {
                    return [...gaps, [t]];
                  } else {
                    gaps[gaps.length - 1].push(t);
                    return gaps;
                  }
                },
                [[]] as string[][]
              )
              .filter(Boolean);

            return (
              <span className="time-spans">
                {dateFormat}
                {spans.map((span, idx) => {
                  return <span key={idx}>{`${span[0]} - ${span[1]}`}</span>;
                })}
              </span>
            );
          }
        }
        if (item.deployTimeType === DeployTime.Forever) {
          return "永久布控";
        } else {
        }
        return "-";
      },
    },
    {
      width: "160px",
      title: "点位范围",
      dataIndex: "locationIds",
      render(col, item, index) {
        // const locationIds = item?.locationIds?.filter(Boolean);
        if (!item?.locationCount) {
          return "-";
        }
        return (
          <span
            className="blue-cell"
            onClick={() => {
              setActiveDeployItemId(item.jobId);
              if (item.locationCount) {
                services.deploy.getLocationIdsByJobId<{ jobId: string | number }, string[]>({ jobId: item.jobId })
                  .then(res => {
                    Array.isArray(res.data) && setCurrentLocationIds(res.data)
                    setShowMap(true);
                  })
                  .catch(err => {
                    setCurrentLocationIds([])
                    setShowMap(true);
                  })
              } else {
                Message.warning("未布控点位")
                // setShowMap(true);
              }

            }}
          >{`共${item?.locationCount || 0}个点位`}</span>
        );
      },
    },
    {
      width: "250px",
      title: "创建时间",
      dataIndex: "createTime",
    },
    /* 根据条件渲染 */
    {
      width: "100px",
      title: "创建人",
      dataIndex: "creator",
      show: activeTab !== "createdByMe",
      render(col, item, index) {
        return item.createUser.userName;
      },
    },
    {
      width: "150px",
      title: "审批人",
      dataIndex: "approver",
      show: activeTab !== "reviewing",
      render(col, item, index) {
        return item.approveUser.userName;
      },
    },
    {
      title: "布控状态",
      width: "100px",
      dataIndex: "deployStatus",
      show: activeTab === "createdByMe",
      render(col, item, index) {
        return <DeployStatusIcon deployItem={item} />;
      },
    },
    {
      width: "110px",
      title: "关闭原因",
      dataIndex: "reason",
      show: activeTab === "close",
      render(col, item, index) {
        return CloseTextSetting[item.status];
      },
    },
    {
      width: "130px",
      title: "布控结果",
      dataIndex: "deployResult",
      show: activeTab === "close" || activeTab === "monitoring",
      render(col, item, index) {
        return (
          <Link href={`#/deploy-warning/${item.jobId}`} target="_blank">
            {item.monitorCount}
          </Link>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render(col, item) {
        return (
          <div className="actions">
            {actions.map((action) => (
              <TableAction key={action.children} {...action} item={item} />
            ))}
          </div>
        );
      },
    },
  ];
  /* 页面配置 */
  const deployDetailPage: PaginationLayoutProps = {
    classname: prefixCls,
    header: (
      <section className="header-slot">
        <Tabs
          className="tabs"
          type="line"
          data={tabsData}
          activeKey={activeTab}
          onChange={(key) => {
            // 重置表单
            reset();
            // 重置勾选
            setSelectedRowKeys([]);
            // 重置列表
            setDeployList([]);
            setActiveTab(key as TabsKey);
          }}
        />
        <FormWrapper
          inline
          className="form"
          labelAlign="left"
          layout="vertical"
          colon={false}
          form={formData}
          formItems={formItems}
        />
      </section>
    ),
    main: (
      <>
        <ResultBox loading={loading} nodata={deployList.length <= 0}>
          <ResultHeader
            resultData={queryInfo}
            rightSlot={
              <div className="operations">
                <Export
                  total={queryInfo.totalRecords}
                  url={`/v1/monitor/list/export`}
                  formData={Object.assign({}, beforeSubmit(formData), {
                    checkedIds: selectedRowKeys,
                  })}
                />
              </div>
            }
          />
          <Table
            key={activeTab}
            className="table"
            rowKey="jobId"
            columns={columns.filter((c) => c.show ?? true)}
            data={deployList}
            // scroll={{
            //   x: true,
            // }}
            rowSelection={{
              selectedRowKeys,
              onChange: handleSelectChange,
            }}
          />
        </ResultBox>
      </>
    ),
    footer: (
      <div className="footer-slot">
        <Checkbox
          checked={
            selectedRowKeys.length !== 0 &&
            selectedRowKeys.length === deployList.length
          }
          disabled={!deployList.length}
          onChange={(e) => {
            handleSelectAll(e.target.checked);
          }}
          indeterminate={
            !!selectedRowKeys.length &&
            selectedRowKeys.length !== deployList.length
          }
        >
          全选
        </Checkbox>
        <p>
          已选择
          <span className="num">{selectedRowKeys.length}</span>
          个任务
        </p>
        <div className="btn-groups">
          {/* <Button disabled={selectedRowKeys.length === 0}>以图检索</Button> */}
          {/* <Button
            disabled={selectedRowKeys.length === 0}
            onClick={toggle}
            size="small"
          >
            加入线索库
          </Button> */}
          {/* <Button disabled={selectedRowKeys.length === 0} size="small">
            生成轨迹
          </Button> */}
        </div>
      </div>
    ),
    showFooter: !!queryInfo.totalRecords,
    paginationProps: paginationConfig,
  };

  return (
    <>
      <PaginationLayout {...deployDetailPage} />
      <Modal
        visible={showMap}
        title={"点位范围"}
        width={"60vw"}
        onCancel={() => {
          setShowMap(false);
        }}
        footer={null}
      >
        <div className="deploy-detail location-map">
          <LocationMap locationIds={currentLocationIds?.length ? currentLocationIds : activeDeployItem?.locationIds} />
        </div>
      </Modal>
      <ReviewingModal
        modalType={showReviewModal}
        deployItem={activeDeployItem}
        close={() => setShowReviewModal(undefined)}
        onSuccess={() => {
          Message.success("操作成功");
          fetchDeployItemList(formData);
        }}
      />
    </>
  );
}
export default DeployDetail;

// 是不是同一个用户
const sameUser = (currentUser: UserInfoState, u2: DeployUserInfo) =>
  String(currentUser.id) === String(u2.userUUID);
