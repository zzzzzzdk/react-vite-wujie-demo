import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@yisa/webui/es/Icon";
import {
  Divider,
  Modal,
  TreeSelect,
  Message,
  Form,
  Input,
  Radio,
  Select,
  Button,
} from "@yisa/webui";
import Heading from "../components/Heading";
import "./index.scss";
import dayjs from "dayjs";
import { FormItemConfig } from "../components/FormWrapper/interface";
import FormWrapper from "../components/FormWrapper";
import {
  Measure,
  DeployTime,
  MeasureTextSetting,
  DeployTimeTextSetting,
  DeployTargetType,
  BkType,
  DeployItem,
} from "../DeployDetail/interface";
import DeployFormTable from "./DeployTargetTable";

import { TimeRangePicker, LocationMapList } from "@/components";
import { DeployTargetTextSetting } from "../DeployDetail/interface";
import IconText from "../components/IconText";
import AddDeployModal, {
  AddDeployModalType,
  BaseFormData,
  EditFormRef,
} from "./AddDeployModal";
import {
  DatesParamsType,
  TimeSpan,
} from "@/components/TimeRangePicker/interface";
import services from "@/services";
import { useResetState } from "ahooks";
import dictionary from "@/config/character.config";
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import {
  Approver,
  DeployBy,
  MonitorType,
  Receiver,
  transformMonitorList,
} from "./interface";
import useApprovers from "../hooks/useApprovers";
import useReceivers from "../hooks/useReceivers";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { VehicleFormData } from "./AddDeployModal/useVehicleForm";
import InitialProvider, { Initial, useInitialContext } from "./InitialProvider";
import { IdentityFormData } from "./AddDeployModal/useIdentityForm";
import { flatten } from "lodash";
import EditableProvider from "./EditableProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { SysConfigItem } from "@/store/slices/user";
import { getParams } from "@/utils";
type DeployFormData = {
  title: string;
  deployTimeType: DeployTime; // 永久
  /* 具体时间 */
  timeType: "time" | "range";
  beginDate: string;
  endDate: string;
  beginTime: string;
  endTime: string;
  /* 数据源 */
  locationIds: string[];
  locationGroupIds: string[];
  offlineIds: (string | number)[];
  /* 采取措施 */
  measure: Measure;
  /* 接收审批人 */
  receiveUsers: string[];
  approveUser: string;
  /* 布控原因 */
  reason: string;
  /* 布控类型 */
  bkType: BkType;
  /* 多时间段 */
  spans: TimeSpan[];
  [index: string]: unknown;
};

function Deploy() {
  const pdmRaw = useSelector<RootState, SysConfigItem>(
    (state) => state.user.sysConfig
  )["deploy"];
  const location = useLocation()
  const pdmConfig = Object.assign(
    {
      timeRange: {
        min: "1",
        default: "7",
        max: "90",
      },
    },
    pdmRaw
  );
  /* ======================================表单相关========================================= */
  const [formData, setFormData, reset] = useResetState<DeployFormData>({
    title: "",
    deployTimeType: DeployTime.Short,
    bkType: BkType.Target,

    timeType: "time",
    // beginDate: dayjs()
    //   .add(Number(pdmConfig.timeRange?.default) - 1, "days")
    //   .startOf("day")
    //   .format("YYYY-MM-DD HH:mm:ss"),
    beginDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs()
      .add(Number(pdmConfig.timeRange?.default) - 1, "days")
      .endOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    beginTime: "",
    endTime: "",
    spans: [["00:00:00", "23:59:59"]],
    locationGroupIds: [],
    locationIds: [],
    offlineIds: [],

    measure: Measure.Concern,
    receiveUsers: [],
    approveUser: "",
    reason: "",
  });
  /* ===========================获取修改布控单数据=============================== */
  /*
   * mode表示当前是创建布控单还是修改布控单
   * add状态下，每个布控项中的operation都是无效字段, 并且不会提交已经被删除的布控单（operation:delete）
   * update状态下，每个布控项中的operation都是*有效*字段, 并且*会*提交已经被删除的布控单（operation:delete）
   */
  const { jobId } = useParams();
  const searchParams = getParams(location.search)
  console.log(searchParams)
  const [mode, setMode] = useState<"add" | "update">("add");
  useEffect(() => {
    if (!jobId) return;
    services.deploy
      .getDeploy<any, DeployItem>({ jobId: Number(jobId) })
      .then((res) => {
        if (!res.data) return;
        setMode("update");
        const deployItem = res.data;
        let newForm = {};
        const copyField = [
          "jobId",
          "title",
          "deployTimeType",
          "locationIds",
          "offlineIds",
          "measure",
          "reason",
          "bkType",
        ];
        copyField.forEach((f) => {
          newForm[f] = deployItem[f];
        });
        /* transform */
        newForm["approveUser"] = deployItem.approveUser.userUUID;
        newForm["receiveUsers"] = deployItem.receiveUsers.map(
          (u) => u.userUUID
        );
        if (deployItem.deployTimeType === DeployTime.Short) {
          if (deployItem.timeRange?.times) {
            const times = deployItem.timeRange.times;
            [newForm["beginDate"], newForm["endDate"]] = times;
            newForm["timeType"] = "time";
          }
          if (deployItem.timeRange?.periods) {
            const periods = deployItem.timeRange.periods;
            newForm["timeType"] = "range";
            [newForm["beginDate"], newForm["endDate"]] = periods.dates || [
              "",
              "",
            ];
            [newForm["beginTime"], newForm["endTime"]] = periods.times || [
              "",
              "",
            ];

            const spans =
              periods?.times?.reduce(
                (gaps, t) => {
                  if (gaps[gaps.length - 1].length === 2) {
                    return [...gaps, [t]];
                  } else {
                    gaps[gaps.length - 1].push(t);
                    return gaps;
                  }
                },
                [[]] as string[][]
              ) ?? [];
            console.log(spans, spans);
            newForm["spans"] = spans;
          }
        }

        const monitorList = transformMonitorList(deployItem.monitorList ?? []);
        setDeployList(monitorList);
        setFormData({
          ...formData,
          ...newForm,
        });
      });
  }, []);

  const initial = useInitialContext().value;
  const [activeModal, setActiveModal] = useState<
    AddDeployModalType | undefined
  >(initial.activeModal);

  const [loading, setLoading] = useState(false);
  // 处理日期变化
  const handleDateChange = (dates: DatesParamsType) => {
    console.log("日期变化", dates);
    setFormData({
      ...formData,
      timeType: dates.timeType as any,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };
  // 数据源变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
      locationGroupIds: data.locationGroupIds,
      offlineIds: data.offlineIds,
    });
  };

  /* 获取审批人 */
  const approverList = useApprovers();
  /* 获取接收人 */
  const receiverList = useReceivers();

  const filterTreeNode = useCallback((inputText: string, node: any) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  }, []);

  const formItems: FormItemConfig<DeployFormData>[] = [
    {
      key: 1,
      name: "title",
      label: "布控标题",
      required: true,
      element: (
        <Input
          autoFocus
          placeholder="请输入布控标题"
          maxLength={20}
          showWordLimit
          value={formData.title}
          onChange={(e, v) => {
            setFormData((form) => {
              return {
                ...form,
                title: v,
              };
            });
          }}
        />
      ),
      validate(form) {
        if (form?.title.length <= 0) {
          return "请输入标题";
        }
        return "";
      },
    },
    {
      key: 2,
      name: "deployTimeType",
      label: "布控时限",
      element: (
        <Radio.Group
          value={formData.deployTimeType}
          onChange={(e) => {
            console.log(e.target.value);
            setFormData({ ...formData, deployTimeType: e.target.value });
          }}
          options={Object.entries(DeployTimeTextSetting).map(
            ([name, textSetting]) => {
              return {
                label: textSetting.text,
                value: DeployTime[name],
              };
            }
          )}
        />
      ),
      required: true,
    },
    {
      key: 3,
      show: formData.deployTimeType === DeployTime.Short,
      name: "deployTimeType",
      element: (
        <TimeRangePicker
          futureFirst
          multiRange
          timeLayout="vertical"
          className="timer-picker"
          timeType={formData.timeType}
          beginDate={formData.beginDate}
          endDate={formData.endDate}
          beginTime={formData.beginTime}
          endTime={formData.endTime}
          onChange={handleDateChange}
          spans={formData.spans}
          showYesterday={false}
          onSpansChange={(spans) => {
            console.log("时间段变化 change", spans);
            setFormData({ ...formData, spans });
          }}
        />
      ),
      // validate(form) { if (
      //     form.deployTimeType === DeployTime.Short &&
      //     form.timeType === "range" &&
      //     form.spans.some((span) => !span[0])
      //   ) {
      //     return "请选择时间段";
      //   }
      //   return "";
      // },
      // validate(form) {

      //   return ''
      // },
    },
    {
      key: 4,
      element: (
        <LocationMapList
          className="data-source"
          formItemProps={{ label: <span>数据源</span> }}
          title="选择点位"
          locationIds={formData.locationIds}
          locationGroupIds={formData.locationGroupIds}
          offlineIds={formData.offlineIds}
          onChange={handleLocationChange}
          tagTypes={dictionary.tagTypes.slice(0, 2)}
          showOperator={true}
        />
      ),
      wrapped: true,
    },
    {
      key: 5,
      // show: formData.deployTimeType === DeployTimeType.Short,
      label: "采取措施",
      element: (
        <Radio.Group
          value={formData.measure}
          onChange={(e) => {
            setFormData({ ...formData, measure: e.target.value as Measure });
          }}
          options={Object.entries(MeasureTextSetting).map(
            ([name, textSetting]) => {
              return {
                label: textSetting.text,
                value: Measure[name],
              };
            }
          )}
        />
      ),
      required: true,
    },
    {
      key: 6,
      name: "receiveUsers",
      label: "接收人",
      element: (
        <TreeSelect
          placeholder="请选择"
          showSearch
          multiple
          treeCheckable
          fieldNames={{
            key: "id",
            title: "name",
          }}
          maxTagCount={1}
          filterTreeNode={filterTreeNode}
          value={formData.receiveUsers}
          treeData={receiverList}
          treeCheckedStrategy="child"
          treeProps={{
            isVirtual: true,
            virtualListProps: {
              height: 250
            }
          }}
          onChange={(value) => {
            console.log(value);
            setFormData((f) => {
              return {
                ...f,
                receiveUsers: value as string[],
              };
            });
          }}
        />
      ),
      required: true,
      validate(form) {
        if (form.receiveUsers.length <= 0) {
          return "请选择接收人";
        }
        return "";
      },
    },
    {
      key: 7,
      name: "approveUser",
      label: "审批人",
      element: (
        <Select
          showSearch
          placeholder="请选择"
          options={approverList.map((a) => ({
            label: a.userName,
            value: a.userUUID,
          }))}
          value={formData.approveUser}
          onChange={(value) => {
            setFormData((f) => {
              return {
                ...f,
                approveUser: value as string,
              };
            });
          }}
        />
      ),
      validate(form) {
        if (!form.approveUser?.length) {
          return "请选择审批人";
        }
        return "";
      },
      required: true,
    },
    {
      key: 8,
      className: "deploy-reason",
      label: "布控原因",
      element: (
        <Input.TextArea
          maxLength={50}
          showWordLimit
          style={{ minHeight: 64 }}
          autoSize={{ minRows: 4 }}
          value={formData.reason}
          onChange={(e, v) => setFormData({ ...formData, reason: v })}
        />
      ),
    },
  ];
  // 处理提交
  const [validateFields, setValidateFields] = useState<
    (keyof DeployFormData)[]
  >([]);
  const handleSubmit = () => {
    // 校验基本信息，布控目标相关的表单在AddDeployModal中校验
    if (
      formItems.some((item) => {
        const msg = item.validate?.(formData);
        return !!msg;
      })
    ) {
      Message.warning("请将必填项填写完整");
      // 需要校验的字段名称
      setValidateFields([
        "title",
        "approveUser",
        "receiveUsers",
        "deployTimeType",
      ]);
      return;
    }

    // 时间范围校验
    const diff =
      Math.abs(dayjs(formData.beginDate).diff(formData.endDate, "day")) + 1;
    if (diff > Number(pdmConfig.timeRange.max)) {
      debugger;
      Message.warning(`时间范围不能超过${pdmConfig.timeRange.max}天`);
      return;
    }

    setValidateFields([]);
    /* 表单后处理 */
    const newForm = { ...formData, operation: searchParams.operation };
    // 点位和任务ids
    // newForm["locationIds"] = [
    //   ...newForm.locationIds,
    //   ...newForm.locationGroupIds,
    // ];
    // 时间, 转换成timeRange
    let timeRange = {};
    if (formData.timeType === "time") {
      timeRange = { times: [formData.beginDate, formData.endDate] };
    } else {
      timeRange = {
        periods: {
          dates: [formData.beginDate, formData.endDate],
          times: flatten(formData.spans).filter(Boolean),
        },
      };
    }
    // 只有短期布控要这个字段
    if (formData.deployTimeType === DeployTime.Short) {
      newForm["timeRange"] = timeRange;
    }
    // 布控类型
    const monitorList = deployList
      .map((item) => {
        switch (item.type) {
          case DeployTargetType.Vehicle: {
            let monitorType: MonitorType = "monitorImageType";
            const vehecleItem = item as VehicleFormData;
            if (item.deployBy === DeployBy.Property) {
              monitorType = "monitorVehiclePropertyType";
            }
            if (item.deployBy === DeployBy.Batch) {
              monitorType = "monitorVehicleBatchType";
            }
            if (item.deployBy === DeployBy.Label) {
              monitorType = "monitorVehicleTagType";
            }
            return {
              ...item,
              monitorType,
              brandId: vehecleItem.brandId ? Number(vehecleItem.brandId) : -1,
              labelId: (vehecleItem.labelId || []).map((id) => {
                const newId = Number(id) || -1;
                return newId;
              }),
              modelId: vehecleItem.modelId ? vehecleItem.modelId?.map(o => Number(o)) : [],
              yearId: vehecleItem.yearId ? vehecleItem.yearId?.map(o => Number(o)) : []
            };
          }
          case DeployTargetType.Identity: {
            let monitorType: MonitorType = "monitorImageType";
            const identityItem = item as IdentityFormData;
            if (item.deployBy === DeployBy.Property) {
              monitorType = "monitorPersonIdType";
            }
            if (item.deployBy === DeployBy.Batch) {
              monitorType = "monitorPersonBatchType";
            }
            if (item.deployBy === DeployBy.Label) {
              monitorType = "monitorPersonTagType";
            }
            return {
              ...item,
              monitorType,
              labelId: (identityItem.labelId || []).map((id) => {
                const newId = Number(id) || -1;
                return newId;
              }),
            };
          }
          case DeployTargetType.Picture: {
            return { ...item, monitorType: "monitorImageType" };
          }
          default: {
            return {
              monitorType: "未知布控类型",
            };
          }
        }
      })
      .map((item) => {
        const newItem = { ...item };
        delete newItem["type"];
        delete newItem["deployBy"];
        delete newItem["formId"];
        delete newItem["batchCount"];
        return newItem;
      });
    newForm["monitorList"] = monitorList;
    // 删减不必要的属性
    const delKeys = [
      "timeType",
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
      // "locationGroupIds",
    ];
    delKeys.forEach((key) => delete newForm[key]);
    setLoading(true);
    services.deploy
      .postDeploy<DeployFormData, any>(newForm, mode)
      .then(() => {
        Message.success("提交成功");
        setDeployList([]);
        reset();
        setLoading(false);
        /* 提交后一定变回创建模式 */
        // navigate("/deploy", { replace: true });
        setMode("add");

        // 提交之后跳转至布控明细
        setTimeout(() => {
          navigate("/deploy-detail", { replace: true });
        }, 1000);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigate = useNavigate();
  /* ======================================布控目标相应的表单========================================= */
  const [deployList, setDeployList] = useState<BaseFormData[]>([]);
  const [selectedForm, setSelectedForm] = useState<BaseFormData>();
  const addRef = useRef<EditFormRef>(null);

  const [showWarning, setShowWarning] = useState(false);
  return (
    <EditableProvider editable={mode == "add"}>
      <section className="deploy">
        <aside>
          <Heading round>基本信息</Heading>
          <FormWrapper
            className="form"
            labelAlign="right"
            form={formData}
            formItems={formItems}
            validateFields={validateFields as string[]}
          />
        </aside>
        <div className="right">
          <header>
            <Heading round>布控目标</Heading>
            {mode == "add" && (
              <div className="target-card">
                {Object.entries(DeployTargetTextSetting).map((setting) => {
                  const [name, { ...rest }] = setting;
                  return (
                    <IconText
                      onClick={() => setActiveModal(name as AddDeployModalType)}
                      className="deploytarget-icon"
                      key={name}
                      {...rest}
                    />
                  );
                })}
              </div>
            )}
          </header>
          <main>
            {deployList.filter((d) => d.operation !== "delete").length > 0 ? (
              <DeployFormTable
                simple={mode === "update"}
                formList={deployList}
                onClick={(item) => {
                  /* 查看 */
                  setSelectedForm(item);
                  setActiveModal(
                    DeployTargetType[item.type] as AddDeployModalType
                  );
                }}
                onAction={(item, action) => {
                  if (action === "remove") {
                    /* 删除 */
                    if (mode == "update" && item.itemId) {
                      /*更新模式下，且itemId存在，表示这是一条后端返回的布控项
                       * 此时不删除这条布控项，而是设置operation='delete',提交时一并返回
                       */
                      setDeployList((formList) => {
                        return formList.map((f) => {
                          if (f.formId === item.formId) {
                            return {
                              ...f,
                              operation: "delete",
                            };
                          }
                          return f;
                        });
                      });
                      return;
                    }
                    setDeployList((formList) => {
                      return formList.filter((f) => f.formId !== item.formId);
                    });
                  } else {
                    /* 查看 */
                    setSelectedForm(item);
                    setActiveModal(
                      DeployTargetType[item.type] as AddDeployModalType
                    );
                  }
                }}
              />
            ) : (
              <div className="placeholder">
                <div className="no-data"></div>
                <span>请选择布控类型进行布控，支持多个布控目标</span>
              </div>
            )}
          </main>
          <footer>
            <Button
              type="primary"
              disabled={deployList.length <= 0}
              onClick={() => {
                // if (addRef.current?.haveUnSaved()) {
                //   // 警告
                //   setShowWarning(true);
                // } else {
                // 直接提交
                handleSubmit();
                // }
              }}
              loading={loading}
            >
              确定
            </Button>
          </footer>
        </div>
      </section>
      <AddDeployModal
        ref={addRef}
        defaultForm={selectedForm}
        deployTargetType={activeModal}
        close={() => {
          setActiveModal(undefined);
          setSelectedForm(undefined);
        }}
        onSuccess={(form) => {
          setDeployList((formList) => {
            return [form, ...formList.filter((f) => f.formId !== form.formId)];
          });
        }}
      />
      <Modal
        className={`deploy-submit-warning`}
        title="提交"
        onOk={() => {
          setShowWarning(false);
          handleSubmit();
        }}
        onCancel={() => setShowWarning(false)}
        visible={showWarning}
      >
        <div className="text">
          <Icon className="icon" type="zhuyi" />
          有未保存的布控目标，确定提交布控单吗？
        </div>
        <Divider />
      </Modal>
    </EditableProvider>
  );
}

export default () => {
  return (
    <InitialProvider>
      <Deploy />
    </InitialProvider>
  );
};
