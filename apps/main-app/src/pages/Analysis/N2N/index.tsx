import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Divider,
  Table,
  Pagination,
  Checkbox,
  PopConfirm,
  Message,Space
} from "@yisa/webui";

import classNames from "classnames";
import { CloseOutlined, InfoCircleFilled } from "@yisa/webui/es/Icon";

import { ResultBox } from "@yisa/webui_business";

import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";

import { ResultHeader, TimeRangePicker, Export } from "@/components";
import services from "@/services";
import dictionary from "@/config/character.config";

import AddN2NTask from "./AddN2NTask/index.";

import { Icon } from "@yisa/webui/es/Icon";
import {
  SearchForm,
  Task,
  RawTask,
  TaskStatus,
  DB,
  DBType,
  DBName,
} from "./interface";
import { FormItemConfig } from "@/pages/Deploy/components/FormWrapper/interface";
import FormWrapper from "@/pages/Deploy/components/FormWrapper";

import "./index.scss";
import dayjs from "dayjs";
import type { OfflineFile } from "./AddN2NTask/index.";
import TableAction from "@/pages/Deploy/components/TableAction";
import useHandleDbClick from "./useHandleDbClick";
import { isObject } from "lodash";
import { useSearchParams } from "react-router-dom";
import { useResetState } from "ahooks";

const Option = Select.Option;
const TaskStatusSetting: Record<
  keyof typeof TaskStatus,
  {
    text: string;
    icon: string;
    color: string;
  }
> = {
  // All: { text: "不限", icon: "", color: "" },
  Processing: { text: "解析中", icon: "jiexizhong", color: "#FF8D1A1A" },
  Comparing: { text: "比对中", icon: "duibizhong", color: "#3377FF1A" },
  Failed: { text: "已失败", icon: "yishibai", color: "#FF5B4D1A" },
  Done: { text: "已完成", icon: "yichenggong", color: "#00CC661A" },
};

const initFormData: () => SearchForm = () => ({
  minCreateTime: dayjs()
    .subtract(6, "days")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss"),
  maxCreateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  page: 1,
  pageSize: dictionary.pageSizeOptions[0],
});

const useN2NState = () => {
  // 搜索表单
  const [formData, setFormData, resetFormData] = useResetState<SearchForm>(initFormData);

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
        // 特殊的时间格式（-:, 没有使用time
        const { data } = res as any;
        setFormData((form) => {
          return {
            ...form,
            ...data,
            minCreateTime: data?.minCreateTime,
            maxCreateTime: data?.maxCreateTime,
          };
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => { });
  }, []);

  // 任务列表
  const [taskList, setTaskList] = useState<Task[]>([]);
  // 页码，页号
  const [loading, setLoading] = useState<boolean>(false);
  // 查询速度
  const [queryInfo, setQueryInfo] = useState<
    Record<"totalRecords" | "usedTime", number>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  // 查询函数
  /**
   *
   * @param form 表单
   * @param onSussess 成功时的回调
   * @param loading 是否显示loading
   * @returns
   */
  const fetchTaskList = (
    form: SearchForm,
    onSussess?: () => void,
    loading?: boolean
  ) => {
    setLoading(loading ?? true);
    // 过滤空值 "" 0 undefined
    let newFormData: any = {};
    for (const k in form) {
      if (form[k]) {
        newFormData[k] = form[k];
      }
    }
    return services.N2N.getTaskList<SearchForm, RawTask[]>(newFormData)
      .then((res) => {
        if (res.data) {
          const rawTasks = res.data;
          // 做了一层转换
          const tasks: Task[] = rawTasks.map((t) => {
            const {
              baseDb,
              baseDbName,
              baseDbType,
              baseDbIsDeleted,
              compareDb,
              compareDbName,
              compareDbType,
              compareDbIsDeleted,
              ...rest
            } = t;
            return {
              ...rest,
              baseDB: {
                id: baseDb,
                name: baseDbName,
                type: baseDbType,
                deleted: !!baseDbIsDeleted,
              },
              compareDB: {
                id: compareDb,
                name: compareDbName,
                type: compareDbType,
                deleted: !!compareDbIsDeleted,
              },
            };
          });
          setTaskList(tasks);
          setQueryInfo({
            totalRecords: res.totalRecords ?? 0,
            usedTime: res.usedTime ?? 0,
          });
          // 成功回调
          if (onSussess) {
            onSussess();
          }
        }
      })
      .catch((err) => {
        // 调试信息
        console.log("n2n/getTaskList", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // 初始加载
  const timerIdRef = useRef<any>(-1);
  useEffect(() => {
    // 如果有token则不初始化请求
    const token = searchParams.get("token");
    if (token) return;
    fetchTaskList(formData);
  }, []);

  useEffect(() => {
    // 10秒查询一次，
    timerIdRef.current = setInterval(() => {
      fetchTaskList(formData, undefined, false);
    }, 1000 * 10);
    // 清除
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [formData]);

  return {
    loading,
    taskList,
    formData,
    queryInfo,
    setLoading,
    setTaskList,
    setFormData,
    fetchTaskList,
    setQueryInfo,
    resetFormData
  } as const;
};
// 新增任务

const prefixCls = "n2n";
const N2N = () => {
  // 任务列表
  const {
    taskList,
    formData,
    loading,
    queryInfo,
    setFormData,
    setLoading,
    fetchTaskList,
    setQueryInfo,
    resetFormData
  } = useN2NState();
  // 选中的Task
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 先判断页面大小是否改变(必须)
    setSelectedRowKeys([]);
    let newFormData: SearchForm;
    if (pageSize !== formData.pageSize) {
      // console.log("pageSize", current, pageSize);
      newFormData = {
        ...formData,
        page: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      console.log("page", current, pageSize);
      newFormData = {
        ...formData,
        page: current,
        pageSize: pageSize,
      };
    }
    fetchTaskList(newFormData, () => {
      setFormData(newFormData);
    });
  };
  // 分页配置
  const paginationConfig: PaginationProps = {
    current: formData.page,
    pageSize: formData.pageSize,
    total: queryInfo.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
  };
  // 渲染表格中的库名
  const renderDBName = useCallback((dbName: DBName, task: Task) => {
    const db = task[dbName];
    return (
      <span
        title={db.name}
        className={classNames("db-name", {
          "db-deleted": db.deleted,
        })}
        onClick={() => handleDbNameClick(db)}
      >
        {db.name}
      </span>
    );
  }, []);
  // 列名
  const columns: ColumnProps<Task>[] = useMemo(
    () => [
      {
        title: "任务名称",
        dataIndex: "taskName",
        width: 180,
        ellipsis: true,
      },
      {
        title: "基准库",
        dataIndex: "baseDB",
        width: 280,
        ellipsis: true,
        render(_, task) {
          return renderDBName("baseDB", task);
        },
      },
      {
        title: "比对库",
        dataIndex: "compareDB",
        width: 280,
        ellipsis: true,
        render(_, task) {
          return renderDBName("compareDB", task);
        },
      },
      {
        title: "相似度阈值",
        dataIndex: "similarity",
        width: 100,
        ellipsis: true,
        render(_, task) {
          return `${task.similarity}%`;
        },
      },
      {
        title: "结果数",
        dataIndex: "outCome",
        width: 80,
        ellipsis: true,
        render(_, task) {
          return (
            <span
              className="table-count"
              // TODO handleTableOperation机上useCallback
              onClick={() => handleTableOperation(task, "check")}
            >
              {task.outCome}
            </span>
          );
        },
      },
      {
        title: "创建人",
        dataIndex: "uname",
        width: 280,
        ellipsis: true,
        render(col, item) {
          return `${item.organizationName ?? ""}-${item.uname}`;
        },
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
        width: 210,
        ellipsis: true,
      },
      {
        title: "任务状态",
        dataIndex: "taskStatus",
        width: 150,
        ellipsis: true,
        render(_, item) {
          return (
            <span>
              <span
                className="task-status"
                style={{
                  background:
                    TaskStatusSetting[TaskStatus[item.taskStatus]]?.color,
                }}
              >
                <Icon
                  type={TaskStatusSetting[TaskStatus[item.taskStatus]]?.icon}
                />
                <span className="text">
                  {TaskStatusSetting[TaskStatus[item.taskStatus]]?.text}
                </span>
              </span>
              {item.taskStatus === TaskStatus.Failed && (
                <>
                  <br />
                  {item.errMsg}
                </>
              )}
            </span>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "operations",
        fixed: "right",
        width: 181,
        render: (_, task) => (
          <span className="table-operations">
            <TableAction
              item={task}
              onClick={() => handleTableOperation(task, "check")}
              show={
                task.taskStatus === TaskStatus.Done ||
                task.taskStatus === TaskStatus.Comparing
              }
            >
              查看结果
            </TableAction>
            <TableAction
              className="operation-del"
              item={task}
              type="danger"
              dangerous
              onClick={() => handleTableOperation(task, "delete")}
            >
              删除
            </TableAction>
          </span>
        ),
      },
    ],
    []
  );
  // 通知条是否可见
  const [notificationVisible, setNotifictionVisible] = useState(true);
  // 点击库名
  const handleDbNameClick = useHandleDbClick();
  // 表格最后一栏操作
  const handleTableOperation = useCallback(
    (task: Task, type: "delete" | "check") => {
      if (type === "delete") {
        handleDeleteTasks([task.taskId]);
      } else {
        const query = {
          taskId: task.taskId.toString(),
          taskName: task.taskName,
          minSimilarity: task.similarity.toString(),
          baseDbId: task.baseDB.id.toString(),
          baseDbType: task.baseDB.type.toString(),
          baseDbName: task.baseDB.name.toString(),
          compareDbId: task.compareDB.id.toString(),
          compareDbType: task.compareDB.type.toString(),
          compareDbName: task.compareDB.name.toString(),
        };

        const queryString = new URLSearchParams(query);
        window.open(`#/n2n-result/?${queryString}`, "_blank");
      }
    },
    []
  );
  // 底部全选checkbox
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(taskList.map(({ taskId: key }) => key));
    } else {
      setSelectedRowKeys([]);
    }
  };
  // 删除
  const handleDeleteTasks = useCallback((taskIdList: React.Key[]) => {
    const willDeleteKeys = new Set(taskIdList);

    setLoading(true);
    services.N2N.deleteTaskList<{ taskIdList: React.Key[] }, undefined>({
      taskIdList,
    })
      .then((res) => {
        Message.success("删除成功");
        // 更新任务列表, 重置页号
        const maxCreateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const newFormData = {
          ...formData,
          maxCreateTime,
          page: 1,
        };
        fetchTaskList(newFormData, () => {
          setFormData(newFormData);
        });
        // 更新选中
        const newSelectedRowKeys = selectedRowKeys.filter(
          (taskId) => !willDeleteKeys.has(taskId)
        );
        setSelectedRowKeys(newSelectedRowKeys);
      })
      .catch(() => {
        Message.error("删除失败");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  // 勾选
  const handleSelectChange = useCallback(
    (newSelectedRowKeys: (string | number)[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    []
  );
  // 点击搜索按钮
  const handleSearch = () => {
    // 这里要重置页号
    const newFormData = {
      ...formData,
      page: 1,
    };
    setQueryInfo({
      totalRecords: 0,
      usedTime: 0,
    })
    fetchTaskList(newFormData, () => {
      setFormData(newFormData);
    });
  };
  // 表单配置
  const formItems: FormItemConfig<SearchForm>[] = [
    {
      key: 1,
      label: "任务名称",
      element: (
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          value={formData.taskName}
          onChange={(e) => {
            setFormData({
              ...formData,
              taskName: e.target.value,
            });
          }}
        />
      ),
    },
    {
      key: 2,
      label: "库名",
      element: (
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          value={formData.dbName}
          onChange={(e, value) => {
            setFormData({
              ...formData,
              dbName: value,
            });
          }}
        />
      ),
    },
    {
      key: 3,
      label: "任务状态",
      element: (
        <Select
          // defaultValue={TaskStatus.All}
          maxTagCount={1}
          mode="multiple"
          value={formData.taskStatus}
          onChange={(v) => {
            // console.log(v);
            setFormData({
              ...formData,
              taskStatus: v as TaskStatus[],
            });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        >
          {Object.entries(TaskStatusSetting).map(([status, setting]) => (
            <Option key={status} value={TaskStatus[status]}>
              {setting.text}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      key: 4,
      label: "创建人",
      element: (
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          value={formData.uname}
          onChange={(e, value) => {
            setFormData({
              ...formData,
              uname: value,
            });
          }}
        />
      ),
    },
    {
      key: 5,
      wrapped: true,
      element: (
        <TimeRangePicker
          className="date-picker"
          showTimeType={false}
          formItemProps={{ label: "创建时间" }}
          beginDate={formData.minCreateTime}
          endDate={formData.maxCreateTime}
          onChange={(range) => {
            setFormData({
              ...formData,
              minCreateTime: range.beginDate,
              maxCreateTime: range.endDate,
            });
          }}
        />
      ),
    },
    {
      key: 6,
      label: " ",
      element: (
        <Space size={10}>
          <Button disabled={loading} onClick={() => { resetFormData() }} type='default' className="reset-btn">重置</Button>
          <Button
            disabled={loading}
            className="btn-search"
            type="primary"
            onClick={handleSearch}
          >
            查询
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <section className={prefixCls}>
      <div className="container">
        <header className={`${prefixCls}-header`}>
          <FormWrapper
            className={`search-form`}
            layout="vertical"
            inline
            colon={false}
            form={formData}
            formItems={formItems}
          />
          <Divider style={{ margin: "10px 0" }} />
          <div className="overview">
            <ResultHeader
              className="overview-statistic"
              resultData={queryInfo}
              rightSlot={
                <div className="overview-operations">
                  <AddN2NTask
                    className="btn-add"
                    type="default"
                    // size="mini"
                    onSuccess={() => {
                      // 任务添加成功时，刷新任务列表()
                      // const maxCreateTime = dayjs().format(
                      //   "YYYY-MM-DD HH:mm:ss"
                      // );
                      const maxCreateTime = dayjs().endOf('day').format(
                        "YYYY-MM-DD HH:mm:ss"
                      );
                      console.log("成功==>", maxCreateTime);
                      const newFormData = {
                        ...formData,
                        maxCreateTime,
                        page: 1,
                      };
                      fetchTaskList(newFormData, () => {
                        setFormData(newFormData);
                      });
                    }}
                  />
                </div>
              }
            />
            <div
              className={`overview-notification ${notificationVisible ? "" : "overview-notification--hidden"
                }`}
            >
              <InfoCircleFilled className="danger-icon" />
              <span>人脸N:N比对仅可比对人脸目标。</span>
              <CloseOutlined
                className="close-icon"
                onClick={() => {
                  setNotifictionVisible(false);
                }}
              />
            </div>
          </div>
        </header>
        <ResultBox loading={loading} nodata={queryInfo.totalRecords === 0}>
          <main className={`${prefixCls}-main`}>
            <TaskTable
              columns={columns}
              taskList={taskList}
              selected={selectedRowKeys}
              onSelectChange={handleSelectChange}
            />
          </main>
        </ResultBox>
      </div>
      {!!queryInfo.totalRecords && (
        <footer className={`${prefixCls}-footer`}>
          <div className="batch-operations">
            <Checkbox
              checked={
                selectedRowKeys.length !== 0 &&
                selectedRowKeys.length === taskList.length
              }
              disabled={!taskList.length}
              onChange={(e) => {
                toggleSelectAll(e.target.checked);
              }}
              indeterminate={
                !!selectedRowKeys.length &&
                selectedRowKeys.length !== taskList.length
              }
            >
              全选
            </Checkbox>
            <p className="selected">
              已选择
              <span className="selected-count">{selectedRowKeys.length}</span>
              个任务
            </p>
            <PopConfirm
              title="确定删除所选数据"
              onConfirm={() => handleDeleteTasks(selectedRowKeys)}
            >
              <Button
                className="btn-delete"
                type="danger"
                size="mini"
                disabled={!selectedRowKeys.length}
              >
                删除
              </Button>
            </PopConfirm>
          </div>
          <Pagination disabled={loading} {...paginationConfig} />
        </footer>
      )}
    </section>
  );
};
//
interface TaskTableProps {
  columns: TableProps<Task>["columns"];
  taskList: TableProps<Task>["data"];
  selected: (string | number)[];
  onSelectChange: (
    selectedRowKeys: (string | number)[],
    selectedRows: Task[]
  ) => void;
}
const TaskTable = React.memo((props: TaskTableProps) => {
  const {
    columns,
    taskList,
    selected: selectedRowKeys,
    onSelectChange: handleSelectChange,
  } = props;
  return (
    <Table
      rowKey={(task) => task.taskId}
      // loading={loading}
      className="table"
      columns={columns}
      data={taskList}
      scroll={{
        x: 1600,
      }}
      rowSelection={{
        selectedRowKeys,
        onChange: handleSelectChange,
      }}
    />
  );
});

export default N2N;
