import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  TimePicker,
  Button,
  Modal,
  Radio,
  Divider,
  Message,
  Form,
  Space,
  Slider,
  Checkbox,
  Pagination,
  Input,
  Select,
  Tooltip,
} from "@yisa/webui";
import { ResultBox } from "@yisa/webui_business";
import { Icon, LoadingOutlined, PlusOutlined } from "@yisa/webui/es/Icon";
import cn from "classnames";
import {
  TimeRangePicker,
  ResultHeader,
  ResultGroupFilter,
  LocationMapList,
  FormPlate,
  FormVehicleModel,
  JoinClue,
  Export,
  CreateTrackBtn,
  GlobalMeaasge
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
import { LocationMapListCallBack } from "@/components/LocationMapList/interface";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { PlateValueProps } from "@/components/FormPlate/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { FrePassFormData, FrePassItem } from "./interface";
import "./index.scss";
//一次二次识别车牌
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import TableView from "./TableView";
import ImageView from "./ImageView";
import services from "@/services";
import { SysConfigItem } from "@/store/slices/user";

import FrePassForm from "./FrePassForm";
import ImageSearchBtn from "@/components/ImageSearchBtn";
type PageSizeConfig = {
  pageNo: number;
  pageSize: number;
};
const FrePass = () => {
  const prefixCls = "frepass";

  const { skin } = useSelector((state: RootState) => {
    return state.comment;
  });
  const dispatch = useDispatch();
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });
  const [loading, setLoading] = useState(false);
  const firstLoad = useRef<boolean>(true);
  //加入线索库
  const [showClue, setShowClue] = useState(false);
  const [showType, setShowType] = useState<"image" | "list">("image");

  /* 当卡片中点击抓拍次数后，进入selected, 此时：
   * -显示filter下拉
   * -卡片不再显示抓拍
   */
  const viewMode = filterTags.some((f) => f.type === "id") ? "selected" : null;

  //结果数据
  const [resultData, setResultData, resetResult] = useResetState<
    ApiResponse<FrePassItem[]>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  const frePassItems = resultData.data ?? [];
  /* 选中 */
  const [selectedRowKeys, setSelectedRowKeys] = useResetState<
    (string | number)[]
  >([]);

  const [pageSizeConfig, setpageSizeConfig, resetPageSizeConfig] =
    useResetState<PageSizeConfig>({
      pageNo: 1,
      pageSize: dictionary.pageSizeOptions[0],
    });

  /*
   * 注意：*点击搜索*触发handleSearch时,使用formData发送请求，然后同步到formDateBackup
   * 分页切换触发请求使用formDataBackup
   */
  const formDataBackup = useRef<FrePassFormData>({} as any);

  const fetchData = async (
    newForm: Partial<FrePassFormData> & PageSizeConfig,
    showWarning: boolean = false,
    difference?: string,
    noGlobalMeaasge?: boolean 
  ) => {
    // 打开loading
    setLoading(true);
    // 重置结果
    resetResult();
    // 重置选中
    setSelectedRowKeys([]);
    services.frepass
      .getVehicleData<any, FrePassItem[]>(
        newForm as any,
        noGlobalMeaasge ? undefined : (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
      )
      .then((res) => {
        setResultData(res);
        if (showWarning && difference) {
          console.log("warning", filterTags);
          Message.warning(`该车辆疑似存在停放行为，已过滤${difference}条结果`);
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
        firstLoad.current = false;
      });
  };

  // TODO 待重构
  const handleGroupFilterChange = ({ filterTags }: GroupFilterCallBackType, item?: FrePassItem) => {
    // 这里拿到最新的filterTags
    const pageConfig = {
      pageNo: 1,
      pageSize: dictionary.pageSizeOptions[0],
    };
    const extra: {
      licensePlate?: string;
      captureCount: -1 | 1;
    } = {
      captureCount: -1,
    };
    // console.table(filterTags);
    const plateFilter = filterTags?.find((f) => f.type === "id");
    resetPageSizeConfig();
    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.captureCount = 1;
    }
    fetchData(
      {
        ...formDataBackup.current,
        ...pageConfig,
        ...extra,
        ...(item ? {
          locationIds: [item.locationId ?? ''],
        } : {}),
        // excludeLicensePlates: [],
        groupFilters: filterTags?.filter((f) => f.type !== "id"),
      },
      filterTags?.length === 1, // 显示过滤警告
      plateFilter?.tableName, // 显示difference
      true
    );
  };

  // 勾选
  const handleSelectedChange = useCallback(
    (newSelectedRowKeys: (string | number)[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    []
  );
  // 底部全选checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(frePassItems.map((item) => item.infoId));
    } else {
      setSelectedRowKeys([]);
    }
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
    const extra: {
      licensePlate?: string;
      captureCount: -1 | 1;
    } = {
      captureCount: -1,
    };
    const plateFilter = filterTags?.find((f) => f.type === "id");
    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.captureCount = 1;
    }
    setpageSizeConfig(newPaginationConfig);
    fetchData({
      ...formDataBackup.current!,
      ...newPaginationConfig,
      ...extra,
      groupFilters: filterTags?.filter((f) => f.type !== "id"),
    });
  };
  const generateExtra = () => {
    // 根据当前group filter生成一组额外参数传给后端，（：
    const extra: {
      licensePlate?: string;
      captureCount: -1 | 1;
    } = {
      captureCount: -1,
    };
    const plateFilter = filterTags?.find((f) => f.type === "id");
    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.captureCount = 1;
    }
    return extra;
  };

  // 跳转
  const handleJump = (link: string) => {
    const params = selectedRowKeys
      .map((key) => {
        const item = frePassItems.find((item) => item.infoId === key);
        if (!item) return null;
        return {
          bigImage: item.bigImage,
          feature: item.feature,
          targetType: item.targetType,
          targetImage: item.targetImage,
        };
      })
      .filter(Boolean);

    const to = `#${link}?featureList=${encodeURIComponent(
      JSON.stringify(params)
    )}`;
    window.open(to);
  };
  useEffect(() => {
    //清空分组筛选条件
    dispatch(clearAll());
  }, []);
  return (
    <div className={`${prefixCls} page-content`}>
      <header className="page-top">
        <div className="retrieval">
          <div className="search">
            <FrePassForm
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
            />
          </div>
          {!!filterTags.length && (
            <div className="filter">
              <ResultGroupFilter.Show onChange={handleGroupFilterChange} />
            </div>
          )}
          <Divider />
        </div>
        <div className="outcomes">
          {!!frePassItems.length && (
            <ResultHeader
              needgroupchoose={false}
              defaultFilterTypeOptions={dictionary.filterType.slice(0, 3)}
              targetType="vehicle"
              className="outcomes-header"
              resultData={{
                ...resultData,
                data: viewMode === "selected" ? resultData.data : [],
              }}
              onGroupFilterChange={handleGroupFilterChange}
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
                  <Export
                    total={resultData?.totalRecords || 0}
                    url={`/v1/targetretrieval/frequent_pass/export`}
                    formData={{
                      ...formDataBackup.current,
                      ...generateExtra(),
                      ...pageSizeConfig,
                      checkedIds: selectedRowKeys,
                    }}
                  />
                </div>
              }
            />
          )}
          <div className={`outcomes-wrapper`}>
            <ResultBox
              nodata={frePassItems.length <= 0}
              loading={loading}
              nodataTip={firstLoad.current ? "请尝试检索一下" : "搜索结果为空"}
              nodataClass={firstLoad.current ? `first-coming-${skin}` : ""}
            >
              {/* 图文 */}
              {showType === "image" && (
                <ImageView
                  items={frePassItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
                />
              )}
              {/* 列表 */}
              {showType === "list" && (
                <TableView
                  items={frePassItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
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
              <Checkbox
                className="card-checked"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  !!selectedRowKeys.length &&
                  selectedRowKeys.length === frePassItems.length
                }
                indeterminate={
                  !!selectedRowKeys.length &&
                  selectedRowKeys.length !== frePassItems.length
                }
              >
                全选
              </Checkbox>
              已经选择<span className="num">{selectedRowKeys.length}</span>项
            </div>
            <div className="btn-group">
              {/* <Button
                size="small"
                disabled={
                  selectedRowKeys.length <= 0 || selectedRowKeys.length > 5
                }
                onClick={() => handleJump("/image")}
              >
                以图检索
              </Button> */}
              <ImageSearchBtn
                featureList={frePassItems.filter((i) =>
                  selectedRowKeys.includes(i.infoId)
                )}
              />
              <Button
                size="small"
                onClick={() => {
                  setShowClue(true);
                }}
                disabled={selectedRowKeys.length <= 0}
              >
                加入线索库
              </Button>
              <CreateTrackBtn
                disabled={selectedRowKeys.length <= 0}
                checkedList={selectedRowKeys
                  .map((key) => {
                    const item = frePassItems.find(
                      (item) => item.infoId === key
                    );
                    if (!item) return null;
                    return item;
                  })
                  .filter(Boolean)}
              />
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
      <JoinClue
        visible={showClue}
        clueDetails={frePassItems.filter((item) =>
          selectedRowKeys.includes(item.infoId)
        )}
        onOk={() => {
          setShowClue(false);
        }}
        onCancel={() => {
          setShowClue(false);
        }}
      />
    </div>
  );
};

export default FrePass;
