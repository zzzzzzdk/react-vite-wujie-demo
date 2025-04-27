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

import { DBType, RawTask } from "./interface";
import services from "@/services";
import { FormItemConfig } from "@/pages/Deploy/components/FormWrapper/interface";

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
interface OfflineJob {
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
type TreeKey = `${DBType}@${string | number}`;
interface TreeItem {
  // 通过key.split得到类型和id
  key: TreeKey;
  title: string;
  children?: TreeItem[];
}
function isOfflineFile(obj: OfflineJob | OfflineFile): obj is OfflineFile {
  return "fileId" in obj;
}
// 处理数据
function formatOfflineJob(jobs: OfflineJob[]) {
  function dfs(job: OfflineJob | OfflineFile): TreeItem {
    // base case
    if (isOfflineFile(job)) {
      return {
        key: `${DBType.OfflineFile}@${job.fileId}`,
        title: job.fileName,
      };
    }

    const item: TreeItem = {
      key: `${DBType.OfflineTask}@${job.jobId}`,
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
const AddTaskModalButton = (
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
  const [activeTab, setActiveTab] = useState(Tabkey.LocalFile);
  // tab 配置
  const tabData: TabsProps["data"] = [
    {
      key: Tabkey.LocalFile,
      name: "本地文件比对",
    },
    {
      key: Tabkey.ImportantTarget,
      name: "查找重点目标",
      disabled: true,
    },
    {
      key: Tabkey.DoubleDb,
      name: "双库比对",
      disabled: true,
    },
  ];
  // 表单字段
  const [formData, setFormData] = useState<AddTaskModalFormData>({
    taskName: "",
    baseDbId: "",
    compareDbId: "",
    minSim: 30,
  });
  // 需要校验的字段
  const [validateFields, setValidateFields] = useState<
    (keyof AddTaskModalFormData)[]
  >([]);
  // 表单元素配置
  const formItems: FormItemConfig<AddTaskModalFormData>[] = [
    {
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
      name: "baseDbId",
      label: <span className="form-item-label">基准库</span>,
      element: (
        <TreeSelect
          value={
            Number.isNaN(formData.baseDbId) ? "" : formData.baseDbId.toString()
          }
          onChange={(k, extra) => {
            setValidateFields((fields) => [...fields, "baseDbId"]);
            setFormData({
              ...formData,
              baseDbId: k,
            });
          }}
          treeData={treeData}
          placeholder="请选择离线分析文件"
          treeProps={{
            isVirtual: true,
            virtualListProps: { height: 200 },
          }}
        />
      ),
      validate(form) {
        const { baseDbId, compareDbId } = form;
        if (Number.isNaN(baseDbId)) return "请选择离线任务或文件";
        if (baseDbId === compareDbId) return "请选择不同离线任务或文件";
        return "";
      },
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
          onChange={(k) => {
            console.log(k);
            setValidateFields((fields) => [...fields, "compareDbId"]);
            setFormData({
              ...formData,
              compareDbId: k,
            });
          }}
          treeProps={{
            isVirtual: true,
            virtualListProps: { height: 200 },
          }}
          treeData={treeData}
          placeholder="请选择离线分析文件"
        />
      ),
      validate(form) {
        const { baseDbId, compareDbId } = form;
        if (Number.isNaN(baseDbId)) return "请选择离线任务或文件";
        if (baseDbId === compareDbId) return "请选择不同离线任务或文件";
        return "";
      },
    },
    {
      name: "minSim",
      label: <span className="form-item-label">相似度</span>,
      element: (
        <Slider
          defaultValue={30}
          showInput={true}
          tooltip={{ popupVisible: true }}
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
  /*
   * 刚开始对数据进行了处理，理论上每个key都符合`type-id`这种结构
   * 此外，后端返回的jobid，带有job-前缀，提交时我们把它去掉。
   */
  const recoveryOriginalKey = (key: TreeKey) => {
    return key
      .split("@")
      .map((i) => {
        // 这里要去掉‘job-’前缀，后端问题
        if (i.startsWith("job-")) {
          return i.slice(4);
        }
        return i;
      })
      .map(Number) as [DBType, string]; // Trick 压制警告
  };

  const handleSumbmit = () => {
    /* 需要重构 */
    const temp = { ...formData };
    console.log(formData.baseDbId, formData.compareDbId);
    [temp.baseDbType, temp.baseDbId] = recoveryOriginalKey(
      formData.baseDbId as TreeKey
    );
    [temp.compareDbType, temp.compareDbId] = recoveryOriginalKey(
      formData.compareDbId as TreeKey
    );
    services.N2N.addN2NTask<AddTaskModalFormData, any>(temp)
      .then(() => {
        Message.success("添加成功");
        setVisible(false);
        // 成功的时候重置表单
        setValidateFields([]);
        setFormData({
          taskName: "",
          baseDbId: "",
          compareDbId: "",
          minSim: 30,
        });
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
            console.log(items);
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
        okButtonProps={{
          disabled: !formItems.every((item) => {
            if (!item.validate) return true;
            return item.validate(formData).length === 0;
          }),
        }}
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
            onChange={(key) => setActiveTab(key as Tabkey)}
            data={tabData}
          />
          <Form
            className={`${prefixCls}-form`}
            labelAlign="left"
            labelWidth={85}
          >
            <p className="text-span tip">
              注：需要提前完成本地文件
              <Button
                size="mini"
                onClick={() => {
                  window.open("/#/offline");
                }}
              >
                离线数据分析
              </Button>
            </p>
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
export default AddTaskModalButton;
