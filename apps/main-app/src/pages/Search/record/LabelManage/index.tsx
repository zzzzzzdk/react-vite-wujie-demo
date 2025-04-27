import React, {
  useState,
  useRef,
  useEffect
} from "react";
import {
  Radio,
  Divider,
  Message,
  Pagination,
  Button
} from "@yisa/webui";
import { ResultBox } from "@yisa/webui_business";
import { Icon, LoadingOutlined, PlusOutlined } from "@yisa/webui/es/Icon";
import cn from "classnames";
import {
  TimeRangePicker,
  ResultHeader,
} from "@/components";
import { useGetState, useResetState } from "ahooks";
import dayjs from "dayjs";
import ajax, { ApiResponse } from "@/services";
import { useSelector, useDispatch, RootState } from "@/store";
import dictionary from "@/config/character.config";
import { validatePlate } from "@/utils";
import { clearAll } from "@/store/slices/groupFilter";
import featureData from "@/config/feature.json";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { LabelManageFormData, PageSizeConfig, ResultLabelItem } from "./interface";
import "./index.scss";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import TableView from "./TableView";
import ImageView from "./ImageView";
import services from "@/services";
import LabelManageForm from './LabelManageForm'
import LabelSetModal from './components/LabelSetModal'
import { LabelSetType } from "./components/LabelSetModal/interface";
import AddTargetModal from "./components/AddTargetModal";
import LabelModal from "./components/LabelModal";
import useReceivers from "@/pages/Deploy/hooks/useReceivers";
import { logReport } from "@/utils/log";
import LabelSetManageModal from './components/LabelSetManageModal'
// TODO：操作日志包含：查看标签集、查看标签、查看目标、添加目标、编辑标签集、编辑标签、删除，显示【标签管理-【标签集-标签名称】-【操作名称：操作信息】，例如：【标签管理-人员属性-未成年人-编辑:标签基本信息:标签集:人员年龄;标签名称:未成年人;目标类型:人员;标签颜色:蓝色;标签备注:未满18岁;目标标签更新规则:更新规则:根据配置规则打标签;规则配置:[基础信息-年龄]<18;允许标签布控：否;标签权限:可见权限:全部用户;管理权限:全部用户】

const LabelManage = () => {

  const prefixCls = "label-manage";

  const { skin } = useSelector((state: RootState) => {
    return state.comment;
  });
  const dispatch = useDispatch();

  const receiverList = useReceivers();

  const [selectData, setSelectData] = useState<{ [key: string]: { value: string, label: string }[] }>({
    // 标签集
    labelSet: [],
    // 标签名称
    labelName: [],
    // 创建人
    creator: [],
    // 创建人所属部门
    creatorDepart: [],
    // 标签类型
    labelType: []
  })

  const [loading, setLoading] = useState(false);
  const firstLoad = useRef<boolean>(true);
  const [showType, setShowType] = useState<"image" | "list">("image");

  const [labelSetModal, setLabelSetModal] = useState<{
    visible: boolean;
    type: 'add' | 'view' | 'edit';
    data: ResultLabelItem
  }>({
    visible: false,
    type: 'add',
    data: {} as ResultLabelItem
  })

  const [labelSetManageModal, setLabelSetManageModal] = useState(false)

  const [addTargetModal, setAddTargetModal] = useState({
    visible: false,
    data: {} as ResultLabelItem
  })

  const [labelModal, setLabelModal] = useState<{
    visible: boolean;
    type: 'add' | 'view' | 'edit';
    data: ResultLabelItem
  }>({
    visible: false,
    type: 'add',
    data: {} as ResultLabelItem
  })

  // 结果数据
  const [resultData, setResultData, resetResult] = useResetState<
    ApiResponse<ResultLabelItem[]>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  const LabelManageItems = resultData.data ?? [];

  const [pageSizeConfig, setpageSizeConfig, resetPageSizeConfig] =
    useResetState<PageSizeConfig>({
      pageNo: 1,
      pageSize: dictionary.pageSizeOptions[0],
    });

  /*
   * 注意：*点击搜索*触发handleSearch时,使用formData发送请求，然后同步到formDateBackup
   * 分页切换触发请求使用formDataBackup
   */
  const formDataBackup = useRef<LabelManageFormData>({} as any);

  const fetchData = async (
    newForm: Partial<LabelManageFormData> & PageSizeConfig,
  ) => {
    // 打开loading
    setLoading(true);
    // 重置结果
    resetResult();

    services.labelManage.getLabelList<Partial<LabelManageFormData> & PageSizeConfig, any>(newForm).then(res => {
      console.log(res)
      setLoading(false);
      setResultData(res)
    }).catch((error) => {
      setLoading(false);
      console.log(error)
    }).finally(() => {
      setLoading(false);
      firstLoad.current = false;
    });

  };

  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 先判断页面大小是否改变(必须)
    let newPaginationConfig: PageSizeConfig;
    if (pageSize !== pageSizeConfig.pageSize) {
      newPaginationConfig = {
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      newPaginationConfig = {
        pageNo: current,
        pageSize: pageSize,
      };
    }


    setpageSizeConfig(newPaginationConfig);
    fetchData({
      ...formDataBackup.current!,
      ...newPaginationConfig,
    });
  };

  // 标签集新增编辑
  const handleLabelSetChange = (item: ResultLabelItem, type: LabelSetType) => {
    setLabelSetModal({
      ...labelSetModal,
      data: item,
      type: type,
      visible: true,
    })
  }

  // 标签集确认
  const handleLabelSetOk = (data: ResultLabelItem) => {

    if (labelSetModal.type === 'edit') {
      const newResultData = { ...resultData }
      newResultData.data?.forEach(item => {
        if (item.labelSetId === labelSetModal.data.labelSetId) {
          item.managePermissionsSet = data.managePermissionsSet
          item.managePersonsSet = data.managePersonsSet
          item.visiblePermissionsSet = data.visiblePermissionsSet
          item.visiblePersonsSet = data.visiblePersonsSet
          item.labelSetName = data.labelSetName
        }
      })
      console.log('newResultData', newResultData)
      setResultData(newResultData)
    }

    setLabelSetModal({
      ...labelSetModal,
      visible: false
    })

    getSelectData()
  }

  // 打开添加目标
  const handleAddTarget = (data: ResultLabelItem) => {
    setAddTargetModal({
      ...addTargetModal,
      visible: true,
      data: data
    })
  }

  // 添加目标确认
  const handleAddTargetOk = (data: any) => {
    console.log(data)
    const addCount = data.importType === 'single' ? 1 : data.success
    const newResultData = { ...resultData }
    newResultData.data?.forEach(item => {
      if (item.labelId === data.labelId) {
        item.labelCount = item.labelCount + addCount
      }
    })
    setResultData(newResultData)
    
    setAddTargetModal({
      ...addTargetModal,
      visible: false,
    })
  }

  // 查看编辑标签
  const handleLabelChange = (item: ResultLabelItem | {}, type: LabelSetType) => {
    setLabelModal({
      ...labelModal,
      data: item as ResultLabelItem,
      type: type,
      visible: true
    })
  }

  // 新建/编辑标签确认
  const handleLabelOk = (data: any) => {
    if (labelModal.type === 'edit') {
      const newResultData = { ...resultData }
      newResultData.data?.forEach((item, index) => {
        if (item.labelId === labelModal.data.labelId) {
          if (newResultData.data) {
            newResultData.data[index] = data
          }
        }
      })
      console.log('newResultData', newResultData)
      setResultData(newResultData)
    }
    setLabelModal({
      ...labelModal,
      visible: false
    })
    if (labelModal.type === 'add') {
      fetchData({
        ...formDataBackup.current!,
        ...pageSizeConfig
      });
    }
  }

  const handleDelChange = (data: any) => {
    console.log(data)
    // 提交标签 更新
    services.labelManage.delLabel({
      labelId: data.labelId
    }).then(res => {
      console.log(res)
      Message.success("删除成功")
      fetchData({
        ...formDataBackup.current!,
        ...pageSizeConfig
      });
    }).catch(err => {
      console.log(err)
    })
  }

  // 获取下拉数据
  const getSelectData = () => {
    services.labelManage.getSelectData<unknown, {}>().then(res => {
      // console.log(res)
      const { data = {} } = res
      setSelectData({
        labelSet: [],
        labelName: [],
        creator: [],
        creatorDepart: [],
        labelType: [],
        ...data,
      })
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    getSelectData()
  }, [])

  return (
    <div className={`${prefixCls} page-content`}>
      <header className="page-top">
        <div className="retrieval">
          <div className="search">
            <LabelManageForm
              loading={loading}
              onSearch={(newFormData) => {
                /* 备份一次，分页以及过滤都根据formDataBackup */
                formDataBackup.current = newFormData;
                /* 点击搜索时重置页号 */
                const newPaginationConfig = {
                  pageNo: 1,
                  pageSize: 40,
                };
                setpageSizeConfig(newPaginationConfig);
                fetchData({ ...newFormData, ...newPaginationConfig });
                dispatch(clearAll());
              }}
              selectData={selectData}
            />
          </div>
          <Divider />
        </div>
        <div className="outcomes">
          {/* {!!LabelManageItems.length && ( */}
          <ResultHeader
            needgroupchoose={false}
            needFilterChoose={false}
            targetType="vehicle"
            className="outcomes-header"
            resultData={{
              ...resultData,
              data: resultData.data
            }}
            leftSlot={<>
              共<span>{resultData?.totalRecords || 0}</span>条结果，
              用时<span>{resultData.usedTime?.toFixed(2) || 0}</span>秒
            </>}
            rightSlot={
              <div className="operations">
                {
                  <Radio.Group
                    size="mini"
                    optionType="button"
                    options={[
                      {
                        label: (
                          <span>
                            <Icon type="tuwen" /> 图文
                          </span>
                        ),
                        value: "image",
                      },
                      {
                        label: (
                          <span>
                            <Icon type="liebiao" /> 列表
                          </span>
                        ),
                        value: "list",
                      },
                    ]}
                    value={showType}
                    onChange={(e) => {
                      setShowType(e.target.value);
                    }}
                  />
                }
                <Button
                  type='primary'
                  size='middle'
                  onClick={() => setLabelSetModal({
                    ...labelSetModal,
                    type: 'add',
                    visible: true
                  })}
                >新建标签集</Button>
                <Button
                  type='primary'
                  size='middle'
                  onClick={() => setLabelSetManageModal(true)}
                >管理标签集</Button>
                <Button type='primary' size='middle' onClick={() => handleLabelChange({}, 'add')}>新建标签</Button>
              </div>
            }
          />
          {/* )} */}
          <div className={`outcomes-wrapper`}>
            <ResultBox
              nodata={LabelManageItems.length <= 0}
              loading={loading}
              nodataTip={firstLoad.current ? "请尝试检索一下" : "搜索结果为空"}
              nodataClass={firstLoad.current ? `first-coming-${skin}` : ""}
            >
              {/* 图文 */}
              {showType === "image" && (
                <ImageView
                  items={LabelManageItems}
                  onLabelSetChange={handleLabelSetChange}
                  onAddTargetChange={handleAddTarget}
                  onLabelChange={handleLabelChange}
                  onDelChange={handleDelChange}
                />
              )}
              {/* 列表 */}
              {showType === "list" && (
                <TableView
                  items={LabelManageItems}
                  onLabelSetChange={handleLabelSetChange}
                  onAddTargetChange={handleAddTarget}
                  onLabelChange={handleLabelChange}
                  onDelChange={handleDelChange}
                />
              )}
            </ResultBox>
          </div>
        </div>
      </header>
      {!!resultData?.data?.length && (
        <div className="page-bottom">
          <div className="left">
            <div className={cn("check-box", {})}>
            </div>
            <div className="btn-group">
            </div>
          </div>
          <Pagination
            disabled={!resultData.totalRecords || loading}
            showSizeChanger
            showQuickJumper
            showTotal={() => `共 ${resultData.totalRecords} 条`}
            total={resultData.totalRecords}
            current={pageSizeConfig.pageNo}
            pageSize={pageSizeConfig.pageSize}
            pageSizeOptions={dictionary.pageSizeOptions}
            onChange={handlePageChange}
          />
        </div>
      )}
      <LabelSetModal
        modalProps={{
          visible: labelSetModal.visible,
          onCancel: () => setLabelSetModal({
            ...labelSetModal,
            visible: false,
          })
        }}
        onModalConfirm={handleLabelSetOk}
        receiverList={receiverList}
        modalType={labelSetModal.type}
        data={labelSetModal.data}
      />
      <LabelSetManageModal
        receiverList={receiverList}
        modalProps={{
          visible: labelSetManageModal,
          onCancel: () => {
            getSelectData()
            fetchData({
              ...formDataBackup.current!,
              ...pageSizeConfig
            });
            setLabelSetManageModal(false)
          }
        }}
        onModalConfirm={() => {
          setLabelSetManageModal(false)
          getSelectData()
          fetchData({
            ...formDataBackup.current!,
            ...pageSizeConfig
          });
        }}
      />
      <AddTargetModal
        modalProps={{
          visible: addTargetModal.visible,
          onCancel: () => setAddTargetModal({ ...addTargetModal, visible: false })
        }}
        onModalConfirm={handleAddTargetOk}
        data={addTargetModal.data}
      />
      <LabelModal
        modalProps={{
          visible: labelModal.visible,
          onCancel: () => setLabelModal({ ...labelModal, visible: false })
        }}
        onModalConfirm={handleLabelOk}
        receiverList={receiverList}
        modalType={labelModal.type}
        data={labelModal.data}
        selectData={selectData}
      />
    </div>
  );
}

export default LabelManage