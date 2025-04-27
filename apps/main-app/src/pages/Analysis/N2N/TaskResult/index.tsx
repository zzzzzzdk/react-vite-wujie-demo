import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  Image,
  Message,
  Popover,
  Tag,
  Statistic,
  Form,
  Input,
  Button,
  Slider,
  Divider,
} from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { ResultBox } from "@yisa/webui_business";

import { ResultHeader, Export } from "@/components";

import services from "@/services";
import ComparativeCardList from "./ComparativeCard";
import "./index.scss";
import { DB, DBType, Task } from "../interface";
import { isObject } from "lodash";
import { useDispatch, useSelector, RootState } from '@/store'
import useBreadcrumb from '@/hooks/useBreadcrumb'
import { setRouterData, setSkin } from '@/store/slices/comment';
import { flushSync } from 'react-dom';
import store from "@/store";
import ComparativeBigImg from './ComparativeBigImg'

const prefixCls = "n2n-task-result";
// 身份证模糊搜索
const fuzzyIdCard = /^\d*x?$/i;
// 是否有数字
const haveDigit = /\d/;
// 是否包含X
const haveX = /x/i;
type Sorter = "asc" | "desc";
// 表单提交的内容
// Note: 可选参数不选时不传递参数不是设置""
// prettier-ignore
type TaskResultFormData = {
  idNumber?: string;     // 身份证号码支持模糊查询
  uname?: string;        // 姓名支持模糊查询
  minSimilarity: number;
  taskId: number;
  baseDbId: number;
  baseDbName: string;
  baseDbType: DBType;
  compareDbId: number;
  compareDbName: string;
  compareDbType: DBType;
};
// 请求结果数据
export type RawTaskResultItem = {
  taskId: number | string;
  infoId: string;
  // 基准
  baseName: string;
  baseDbId: number;
  baseExtraDbId: number[];
  baseDbName: string;
  baseDbType: DBType;
  baseExtraDbName: string[];
  baseImage: string;
  baseIdNumber: string;
  // 对比
  compareName: string;
  compareDbId: number;
  compareDbName: string;
  compareDbType: DBType;
  compareExtraDbId: number[];
  compareExtraDbName: string[];
  compareImage: string;
  compareIdNumber: string;
  similarity: number;
  caseIdType: '111' | '414';
  baseIdType: '111' | '414';
};

const TaskReslult = () => {
  // const { skin } = useSelector((state: RootState) => state.comment)
  const { pushHandel, backHandel } = useBreadcrumb()
  const dispatch = useDispatch()
  // 排序
  const [sorter, setSorter] = useState<Sorter>("desc");
  const isDesc = sorter === "desc";
  const isAsc = !isDesc;
  // 输入框值
  const [value, SetValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 获取url查询参数
  const [query] = useSearchParams();
  // 相似度
  const taskSimilarity = Number(query.get("minSimilarity")) ?? 30;
  // 表单初始化
  const [formData, setFormData] = useState<TaskResultFormData>({
    // 根据前value设置uname/idNumber
    // uname: "", // TODO 不是状态
    // idNumber: "", // TODO 不是状态
    taskId: Number(query.get("taskId") ?? ""),
    minSimilarity: taskSimilarity,
    baseDbId: Number(query.get("baseDbId") ?? ""),
    baseDbName: query.get("baseDbName") ?? "",
    baseDbType: Number(query.get("baseDbType") ?? ""),
    compareDbId: Number(query.get("compareDbId") ?? ""),
    compareDbName: query.get("compareDbName") ?? "",
    compareDbType: Number(query.get("compareDbType") ?? ""),
  });

  // 大图相关
  const [bigImg, setBigImg] = useState({
    currentIndex: 0,
    visible: false
  });

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
        SetValue(data.idNumber || data.uname);
        setFormData((form) => {
          return {
            ...form,
            ...data,
          };
        });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => { });
  }, []);

  const previousSearchData = useRef(formData);
  // 查询速度
  const [queryInfo, setQueryInfo] = useState<
    Record<"totalRecords" | "usedTime", number>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  // 任务结果
  const [taskReslultList, setTaskResultList] = useState<RawTaskResultItem[]>(
    []
  );
  // 排序
  const sortedTaskResultList = useMemo(
    () =>
      [...taskReslultList].sort((t1, t2) => {
        // asc 升序(小->大)排序
        if (isAsc) {
          return t1.similarity - t2.similarity;
        } else {
          return t2.similarity - t1.similarity;
        }
      }),
    [taskReslultList, isAsc]
  );

  const fetchTaskResult = (form: TaskResultFormData) => {
    // 备份一份表单, 用于导出
    previousSearchData.current = form;
    setLoading(true);
    services.N2N.getTaskResult<TaskResultFormData, RawTaskResultItem[]>(form)
      .then((res) => {
        if (res.data) {
          setTaskResultList(res.data);
          setQueryInfo({
            totalRecords: res.totalRecords ?? 0,
            usedTime: res.usedTime ?? 0,
          });
        } else {
          // 没有data字段
          throw "未找到data字段";
        }
      })
      .catch((error) => {
        console.log("调试信息", "N2N/getTaskResult", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // 页面初始化发送请求
  useEffect(() => {
    setTimeout(() => {
      const routerData = store.getState().comment.routerData
      dispatch(setRouterData({
        ...routerData,
        breadcrumb: [...routerData.breadcrumb.slice(0, 2), { text: routerData.breadcrumb[2]['text'] + ' - ' + query.get('taskName') }]
      }))
    }, 1000)

    const token = searchParams.get("token");
    // 如果有token则不初始化请求
    if (token) return;
    fetchTaskResult(formData);
  }, []);

  const handleSearch = () => {
    // 未输入视为不限制
    if (!value) {
      fetchTaskResult(formData);
      return;
    }

    if (haveDigit.test(value) || haveX.test(value)) {
      // 只要输入框有数字或者x X就认为输入了身份证
      if (fuzzyIdCard.test(value)) {
        // 合法身份证(模糊)
        fetchTaskResult({ ...formData, idNumber: value });
      } else {
        // 非法
        Message.clear();
        Message.warning("请输入有效证件号");
      }
    } else {
      // 输入的是人名
      fetchTaskResult({ ...formData, uname: value });
    }
  };

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const handleSelectedChange = (newSelectedIds: (string | number)[]) => {
    setSelectedIds(newSelectedIds);
  };
  return (
    <section className={`${prefixCls}`}>
      <header>
        <Form className="search-form" layout="vertical" inline colon={false}>
          <Form.Item label="人员信息">
            <Input
              placeholder="输入姓名或证件号，模糊检索"
              maxLength={18}
              value={value}
              onChange={(e) => {
                SetValue(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item className="form-item" label="相似度阈值">
            <Slider
              defaultValue={taskSimilarity}
              min={taskSimilarity}
              max={100}
              showInput={true}
              tooltip={{ popupVisible: true }}
              value={formData.minSimilarity}
              onChange={(v) => {
                setFormData({ ...formData, minSimilarity: v as number });
              }}
            />
          </Form.Item>
          <Form.Item className="btn-wrapper" label=" ">
            <Button
              type="primary"
              className="btn-search"
              onClick={handleSearch}
            >
              查询
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: "14px 0" }} />
        <ResultHeader
          className="statistic"
          resultData={queryInfo}
          rightSlot={
            <div className="operations">
              <Button
                className="btn-filter"
                type="default"
                size="small"
                onClick={() => {
                  console.log("sim change");
                  if (isDesc) {
                    setSorter("asc");
                  } else {
                    setSorter("desc");
                  }
                }}
              >
                相似度
                <Icon type="daoxu" className={isAsc ? "active" : ""} />
                <Icon type="zhengxu" className={isDesc ? "active" : ""} />
              </Button>
              <Export
                total={queryInfo.totalRecords}
                url={`/v1/comparison/nvsn/export`}
                formData={{
                  ...previousSearchData.current,
                  pageNo: 1,
                  pageSize: queryInfo.totalRecords,
                  checkedIds: selectedIds,
                  infoId: selectedIds,
                }}
              />
            </div>
          }
        />
      </header>
      <main>
        <ResultBox loading={loading} nodata={sortedTaskResultList.length === 0}>
          <div className="results">
            <ComparativeCardList
              items={sortedTaskResultList}
              value={selectedIds}
              onChange={handleSelectedChange}
              onShowBigImg={(index) => {
                setBigImg({ ...bigImg, currentIndex: index, visible: true })
              }}
            />
          </div>
        </ResultBox>
      </main>
      <ComparativeBigImg
        data={sortedTaskResultList}
        onIndexChange={(index) => setBigImg({ ...bigImg, currentIndex: index })}
        currentIndex={bigImg.currentIndex}
        modalProps={{
          visible: bigImg.visible,
          footer: null,
          onCancel: () => {
            setBigImg({ ...bigImg, currentIndex: 0, visible: false })
          },
        }}
      />
    </section>
  );
};

export default TaskReslult;
