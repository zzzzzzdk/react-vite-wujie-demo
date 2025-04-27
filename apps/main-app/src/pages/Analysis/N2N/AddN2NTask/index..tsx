import { useEffect, useState, useMemo } from "react";

import {
  Message,
  Tree,
  TreeSelect,
  Button,
  Slider,
  Modal,
  Divider,
  Form,
  Tabs,
  Input,
} from "@yisa/webui";

import type { TabsProps } from "@yisa/webui/es/Tabs/interface";
import type { ButtonProps } from "@yisa/webui/es/Button";
import type { TreeSelectProps } from "@yisa/webui/es/TreeSelect/interface";

import { DBType, RawTask } from "../interface";
import services from "@/services";
import { FormItemConfig } from "@/pages/Deploy/components/FormWrapper/interface";
import { FormLabelSelect } from "@/components";
import { useResetState } from "ahooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SysConfigItem } from "@/store/slices/user";

type AddTaskModalFormData = {
  taskName: string;
  baseDbId: string;
  baseDbType?: DBType;
  compareDbId: string;
  compareDbType?: DBType;
  minSim: number;
};

enum Tabkey {
  LocalFile = "1",
  ImportantTarget = "2",
  DoubleDb = "3",
}
// 离线任务
export interface OfflineJob {
  jobId: string;
  parentId: OfflineJob["jobId"];
  name: string;
  creator: string;
  createTime: string;
  children?: (OfflineJob | OfflineFile)[];
}
// 离线文件
export interface OfflineFile {
  fileId: string;
  fileName: string;
}
interface TreeItem {
  // 通过key.split得到类型和id
  key: string;
  title: string;
  children?: TreeItem[];
}
export function isOfflineFile(
  obj: OfflineJob | OfflineFile
): obj is OfflineFile {
  return "fileId" in obj;
}
export function isOfflineJobId(id: string) {
  return id.startsWith("job-");
}
// 处理数据
function formatOfflineJob(jobs: OfflineJob[]) {
  function dfs(job: OfflineJob | OfflineFile): TreeItem {
    // base case
    if (isOfflineFile(job)) {
      return {
        key: job.fileId.toString(),
        title: job.fileName,
      };
    }

    const item: TreeItem = {
      key: job.jobId.toString(),
      title: job.name,
    };
    // make progress
    if (job.children) {
      item.children = job.children.map((subJob) => dfs(subJob));
    }
    return item;
  }
  return jobs.map((job) => dfs(job));
}

const prefixCls = "add-task-modal";
const AddN2NTask = (
  props: ButtonProps & {
    onSuccess?: () => void; // 添加任务成功时回调函数
  }
) => {
  const { onSuccess, ...btnProps } = props;
  // 树选择数据
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  // 模态框是否可见
  const [visible, setVisible] = useState(false);
  // activateTab
  const [activeTab, setActiveTab] = useState(Tabkey.DoubleDb);
  // tab 配置
  const tabData: TabsProps["data"] = [
    // {
    //   key: Tabkey.LocalFile,
    //   name: "本地文件比对",
    // },
    // {
    //   key: Tabkey.ImportantTarget,
    //   name: "查找重点目标",
    // },
    {
      key: Tabkey.DoubleDb,
      name: "双库比对",
    },
  ];
  const handleBaseDbChange: TreeSelectProps["onChange"] = (k) => {
    setValidateFields((fields) => [...fields, "baseDbId"]);
    setFormData({
      ...formData,
      baseDbId: k,
    });
  };
  const handleCompareDbChange: TreeSelectProps["onChange"] = (k) => {
    setValidateFields((fields) => [...fields, "compareDbId"]);
    setFormData({
      ...formData,
      compareDbId: k,
    });
  };
  const validateBaseDb = () => {
    const { baseDbId, compareDbId } = formData;
    if (baseDbId.length <= 0) return "请选择标签";//离线任务、文件、
    if (baseDbId === compareDbId) return "请选择不同标签";//离线任务、文件、
    return "";
  };
  const validateCompareDb = () => {
    const { baseDbId, compareDbId } = formData;
    if (compareDbId.length <= 0) return "请选择标签";//离线任务、文件、
    if (baseDbId === compareDbId) return "请选择不同标签";//离线任务、文件、
    return "";
  };
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig
  )["n2n"];
  const pdmConfig = Object.assign(
    {
      thresholdRange: {
        min: "0",
        default: "80",
        max: "100",
      },
    },
    pdmRaw
  );
  // 表单字段
  const [formData, setFormData, reset] = useResetState<AddTaskModalFormData>({
    taskName: "",
    baseDbId: "",
    compareDbId: "",
    minSim: Number(pdmConfig.thresholdRange.default),
  });
  // 需要校验的字段
  const [validateFields, setValidateFields] = useState<
    (keyof AddTaskModalFormData)[]
  >([]);

  // 本地文件对比，两个离线
  const localFileFormItems: FormItemConfig<AddTaskModalFormData>[] = [
    {
      name: "baseDbId",
      label: <span className="form-item-label">基准库</span>,
      element: (
        <TreeSelect
          value={
            Number.isNaN(formData.baseDbId) ? "" : formData.baseDbId.toString()
          }
          onChange={handleBaseDbChange}
          treeData={treeData}
          placeholder="请选择离线分析文件"
          treeProps={{
            isVirtual: true,
            virtualListProps: { height: 200 },
          }}
        />
      ),
      validate: validateBaseDb,
    },
    {
      name: "compareDbId",
      label: <span className="form-item-label">比对库</span>,
      element: (
        <TreeSelect
          value={
            Number.isNaN(formData.compareDbId)
              ? ""
              : formData.compareDbId.toString()
          }
          onChange={handleCompareDbChange}
          treeProps={{
            isVirtual: true,
            virtualListProps: { height: 200 },
          }}
          treeData={treeData}
          placeholder="请选择离线分析文件"
        />
      ),
      validate: validateCompareDb,
    },
  ];
  // 查找重要目标, 一个离线，一个标签
  const importantTargetFormItems: FormItemConfig<AddTaskModalFormData>[] = [
    {
      name: "baseDbId",
      label: <span className="form-item-label">基准库</span>,
      element: (
        <FormLabelSelect
          treeCheckable={false}
          value={formData.baseDbId}
          onChange={handleBaseDbChange}
        />
      ),
      validate: validateBaseDb,
    },
    {
      name: "compareDbId",
      label: <span className="form-item-label">比对库</span>,
      element: (
        <TreeSelect
          value={
            Number.isNaN(formData.compareDbId)
              ? ""
              : String(formData.compareDbId)
          }
          onChange={handleCompareDbChange}
          treeData={treeData}
          placeholder="请选择离线分析文件"
          treeProps={{
            isVirtual: true,
            virtualListProps: { height: 200 },
          }}
        />
      ),
      validate: validateCompareDb,
    },
  ];
  // 双库对比, 两个标签
  const doubleDbFormItems: FormItemConfig<AddTaskModalFormData>[] = [
    {
      name: "baseDbId",
      label: <span className="form-item-label">基准库</span>,
      element: (
        <FormLabelSelect
          treeCheckable={false}
          value={formData.baseDbId}
          onChange={handleBaseDbChange}
        />
      ),
      validate: validateBaseDb,
    },
    {
      name: "compareDbId",
      label: <span className="form-item-label">比对库</span>,
      element: (
        <FormLabelSelect
          treeCheckable={false}
          value={formData.compareDbId}
          onChange={handleCompareDbChange}
        />
      ),
      validate: validateCompareDb,
    },
  ];
  // 公共配置
  const commonItems: [
    taskName: FormItemConfig<AddTaskModalFormData>,
    similarity: FormItemConfig<AddTaskModalFormData>
  ] = [
    {
      key: 1,
      name: "taskName",
      label: <span className="form-item-label">任务名称</span>,
      element: (
        <Input
          placeholder="请填写任务名称"
          error="请输入正确任务名称"
          maxLength={30}
          value={formData.taskName}
          onChange={(e) => {
            setValidateFields((fields) => [...fields, "taskName"]);
            setFormData((form) => {
              return {
                ...form,
                taskName: e.target.value,
              };
            });
          }}
        />
      ),
      validate(form) {
        const taskName = form.taskName;
        if (taskName.length <= 0) return "请输入任务名称";
        if (taskName.includes("-")) return "不可输入字符【-】";
        return "";
      },
    },
    {
      key: 4,
      name: "minSim",
      label: <span className="form-item-label">相似度</span>,
      element: (
        <Slider
          defaultValue={30}
          showInput={true}
          tooltip={{ popupVisible: true }}
          min={Number(pdmConfig?.thresholdRange?.min)}
          max={Number(pdmConfig?.thresholdRange?.max)}
          value={formData.minSim}
          onChange={(v) => {
            if (Array.isArray(v)) {
              setFormData({ ...formData, minSim: v[0] });
            } else {
              setFormData({ ...formData, minSim: v });
            }
          }}
        />
      ),
    },
  ];
  let formItems: FormItemConfig<AddTaskModalFormData>[] = [];
  if (activeTab === Tabkey.LocalFile) {
    formItems = [commonItems[0], ...localFileFormItems, commonItems[1]];
  }
  if (activeTab === Tabkey.DoubleDb) {
    formItems = [commonItems[0], ...doubleDbFormItems, commonItems[1]];
  }
  if (activeTab === Tabkey.ImportantTarget) {
    formItems = [commonItems[0], ...importantTargetFormItems, commonItems[1]];
  }

  const handleSumbmit = () => {
    if (
      formItems.some((item) => {
        const msg = item.validate?.(formData);
        return !!msg;
      })
    ) {
      Message.warning("请正确填写表单");
      setValidateFields(["taskName", "compareDbId", "baseDbId"]);
      return;
    }

    /* 需要重构 */
    const temp = { ...formData };
    console.log(formData.baseDbId, formData.compareDbId);
    // ========================本地文件: 离线 vs 离线===================
    if (activeTab === Tabkey.LocalFile) {
      temp.baseDbType = DBType.OfflineFile;
      temp.compareDbType = DBType.OfflineFile;
      if (isOfflineJobId(temp.baseDbId)) {
        temp.baseDbType = DBType.OfflineTask;
        temp.baseDbId = temp.baseDbId.slice(4); // job-xxx
      }
      if (isOfflineJobId(temp.compareDbId)) {
        temp.compareDbType = DBType.OfflineTask;
        temp.compareDbId = temp.compareDbId.slice(4); // job-xxx
      }
    }
    // ========================重点目标: 标签 vs 离线===================
    if (activeTab === Tabkey.ImportantTarget) {
      temp.baseDbType = DBType.Label;
      temp.compareDbType = DBType.OfflineFile;
      if (isOfflineJobId(temp.compareDbId)) {
        temp.compareDbType = DBType.OfflineTask;
        temp.compareDbId = temp.compareDbId.slice(4); // job-xxx
      }
    }
    // ========================双库对比： 标签 vs 标签===================
    if (activeTab === Tabkey.DoubleDb) {
      temp.baseDbType = temp.compareDbType = DBType.Label;
    }
    services.N2N.addN2NTask<any, any>({
      ...temp,
      baseDbId: Number(temp.baseDbId),
      compareDbId: Number(temp.compareDbId),
    })
      .then(() => {
        Message.success("添加成功");
        setVisible(false);
        // 成功的时候重置表单
        setValidateFields([]);
        reset();
        // 成功回调
        props.onSuccess?.();
      })
      .catch(() => {
        Message.error("添加失败");
      })
      .finally(() => {});
  };
  // 发送请求
  useEffect(() => {
    if (visible) {
      services.offline
        .getAllOfflineFile<null, OfflineJob[]>()
        .then((res) => {
          if (res.data) {
            const items = formatOfflineJob(res.data);
            setTreeData(items);
          }
        })
        .catch()
        .finally();
    }
  }, [visible]);

  return (
    <>
      <Button
        {...btnProps}
        onClick={() => {
          setVisible(true);
        }}
      >
        新增
      </Button>
      <Modal
        className="add-task-modal"
        title="新增"
        // okButtonProps={{
        //   disabled: !formItems.every((item) => {
        //     if (!item.validate) return true;
        //     return item.validate(formData).length === 0;
        //   }),
        // }}
        visible={visible}
        onOk={handleSumbmit}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className={`${prefixCls}-wrapper`}>
          <Tabs
            className={`${prefixCls}-tabs`}
            defaultActiveKey={Tabkey.LocalFile}
            activeKey={activeTab}
            data={tabData}
            onChange={(key) => {
              setActiveTab(key as Tabkey);
              // 重置
              setValidateFields([]);
              reset();
            }}
          />
          <Form
            className={`${prefixCls}-form`}
            labelAlign="left"
            labelWidth={85}
          >
            {/*  */}
            {/* <p className="text-span tip">
              注：需要提前完成本地文件
              <Button
                size="mini"
                onClick={() => {
                  window.open("/#/offline");
                }}
              >
                离线数据分析
              </Button>
            </p> */}
            {formItems.map((item, index) => {
              return (
                <Form.Item
                  key={index}
                  label={item.label}
                  required={item.validate ? true : false}
                  errorMessage={
                    validateFields.includes(
                      item.name as keyof AddTaskModalFormData
                    ) && item.validate?.(formData)
                  }
                >
                  {item.element}
                </Form.Item>
              );
            })}
          </Form>
        </div>
        <Divider />
      </Modal>
    </>
  );
};
export default AddN2NTask;
