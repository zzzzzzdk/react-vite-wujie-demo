import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Radio, Divider, Checkbox, Pagination } from "@yisa/webui";
import { ResultBox } from "@yisa/webui_business";
import { Icon } from "@yisa/webui/es/Icon";
import cn from "classnames";
import {
  ResultHeader,
  ResultGroupFilter,
  JoinClue,
  Export,
  CreateTrackBtn,
  GlobalMeaasge
} from "@/components";
import { useResetState } from "ahooks";
import { ApiResponse } from "@/services";
import { useSelector, useDispatch, RootState } from "@/store";
import dictionary from "@/config/character.config";
import { clearAll } from "@/store/slices/groupFilter";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { ActiveFormData, ActiveNightItem } from "./interface";
import "./index.scss";
//一次二次识别车牌
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";
import TableView from "./TableView";
import ImageView from "./ImageView";
import SelectedView from "./SelectedView";
import SelectedImageView from "./SelectedImageView";
import services from "@/services";
import ActiveNightForm from "./ActiveNightForm";
import ImageSearchBtn from "@/components/ImageSearchBtn";

const ActiveNight = () => {
  const prefixCls = "active-night";
  const dispatch = useDispatch();

  const { skin } = useSelector((state: RootState) => {
    return state.comment;
  });

  const firstLoad = useRef<boolean>(true);

  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });

  const [loading, setLoading] = useState(false);
  //加入线索库
  const [showClue, setShowClue] = useState(false);
  /**
   * image(form + filter) =====click昼伏夜出天数==>  selected(form + filter + plate + 昼伏夜出天数)
   * =====click 白昼/夜晚抓拍次数==> seletedList(form + filter + plate + 抓拍次数)
   * */
  const [showType, setShowType] = useState<"image" | "list">("image");

  const viewMode: "image" | "list" | "selected" | "selectedImage" =
    filterTags.some((f) => f.tableName === "selectedImage")
      ? "selectedImage"
      : filterTags.some((f) => f.tableName === "selected")
        ? "selected"
        : showType;
  /* 表单备份，格式化之后的数据 */
  const formDataBackup = useRef<ActiveFormData>({} as any);
  const [pageSizeConfig, setPageSizeConfig] = useState({
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
  });

  const [resultData, setResultData, resetResult] = useResetState<
    ApiResponse<ActiveNightItem[]>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  const activeNightItems = resultData.data ?? [];
  /* 选中 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  /* 获取数据 */
  const fetchData = async (
    newForm: ActiveFormData & {
      pageNo: number;
      pageSize: number;
    }
  ) => {
    // 打开loading
    setLoading(true);
    // 重置结果
    resetResult();
    // 重置选中
    setSelectedRowKeys([]);
    services.activeNight
      .getVehicleData<ActiveFormData, ActiveNightItem[]>(
        newForm,
        (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
      )
      .then((res) => {
        setResultData(res);
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
  const handleGroupFilterChange = ({ filterTags }: GroupFilterCallBackType, cardData?: ActiveNightItem) => {
    // 这里拿到最新的filterTags
    const extra: {
      licensePlate?: string;
      days?: number; // 昼伏夜出天数
      daytimeOccurrences?: number | string; // 白天抓拍次数
      nighttimeOccurrences?: number | string; //晚上抓拍次数
    } = {};

    const plateFilter = filterTags?.find((f) => f.tableName === "selected");
    const dayOccurFilter = filterTags?.find((f) => f.text?.startsWith("白"));
    const nightOccurFilter = filterTags?.find((f) => f.text?.startsWith("夜"));

    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.days = 1;
    }
    if (dayOccurFilter) {
      extra.daytimeOccurrences = dayOccurFilter.value;
      extra.days = -1;
    }
    if (nightOccurFilter) {
      extra.nighttimeOccurrences = nightOccurFilter.value;
      extra.days = -1;
    }
    console.table(filterTags);
    // 重置分页
    const newPageSizeConfig = {
      pageNo: 1,
      pageSize: dictionary.pageSizeOptions[0],
    };
    setPageSizeConfig(newPageSizeConfig);
    fetchData({
      ...formDataBackup.current,
      excludeLicensePlates: plateFilter
        ? []
        : formDataBackup.current.excludeLicensePlates,
      ...newPageSizeConfig,
      ...extra,
      groupFilters: filterTags?.filter((f) => f.type !== "id"),
      ...(cardData?.plateColorTypeId2 ? {
        plateColorTypeId: cardData?.plateColorTypeId2 || -1, // 车牌颜色不与表单选择的车牌颜色一致

      } : {})
    });
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
      setSelectedRowKeys(activeNightItems.map((item) => item.infoId));
    } else {
      setSelectedRowKeys([]);
    }
  };
  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 先判断页面大小是否改变(必须)
    let newPageSizeData = {
      ...pageSizeConfig,
    };
    if (pageSize !== pageSizeConfig.pageSize) {
      newPageSizeData = {
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      newPageSizeData = {
        pageNo: current,
        pageSize: pageSize,
      };
    }
    /* 改变分页 */
    setPageSizeConfig(newPageSizeData);
    /* 带上filter */
    const extra: {
      licensePlate?: string;
      days?: number; // 昼伏夜出天数
      daytimeOccurrences?: number | string; // 白天抓拍次数
      nighttimeOccurrences?: number | string; //晚上抓拍次数
    } = {};

    const plateFilter = filterTags?.find((f) => f.tableName === "selected");
    const dayOccurFilter = filterTags?.find((f) => f.text?.startsWith("白"));
    const nightOccurFilter = filterTags?.find((f) => f.text?.startsWith("夜"));

    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.days = 1;
    } else {
      extra.days = -1;
    }
    if (dayOccurFilter) {
      extra.daytimeOccurrences = dayOccurFilter.value;
      extra.days = -1;
    } else {
      extra.daytimeOccurrences = -1;
    }

    if (nightOccurFilter) {
      extra.nighttimeOccurrences = nightOccurFilter.value;
      extra.days = -1;
    } else {
      extra.nighttimeOccurrences = -1;
    }

    fetchData({
      ...formDataBackup.current,
      ...extra,
      excludeLicensePlates: plateFilter
        ? []
        : formDataBackup.current.excludeLicensePlates,
      pageNo: newPageSizeData.pageNo,
      pageSize: newPageSizeData.pageSize,
      groupFilters: filterTags?.filter((f) => f.type !== "id"),
    });
  };

  const generateExtra = () => {
    /* 带上filter */
    const extra: {
      licensePlate?: string;
      days?: number; // 昼伏夜出天数
      daytimeOccurrences?: number | string; // 白天抓拍次数
      nighttimeOccurrences?: number | string; //晚上抓拍次数
      excludeLicensePlates?: ActiveFormData["excludeLicensePlates"];
    } = {};

    const plateFilter = filterTags?.find((f) => f.tableName === "selected");
    const dayOccurFilter = filterTags?.find((f) => f.text?.startsWith("白"));
    const nightOccurFilter = filterTags?.find((f) => f.text?.startsWith("夜"));

    if (plateFilter) {
      extra.licensePlate = plateFilter.value;
      extra.days = 1;
      extra.excludeLicensePlates = [];
    } else {
      extra.days = -1;
    }
    if (dayOccurFilter) {
      extra.daytimeOccurrences = dayOccurFilter.value;
      extra.days = -1;
    } else {
      extra.daytimeOccurrences = -1;
    }

    if (nightOccurFilter) {
      extra.nighttimeOccurrences = nightOccurFilter.value;
      extra.days = -1;
    } else {
      extra.nighttimeOccurrences = -1;
    }
    return extra;
  };

  // 跳转
  const handleJump = (link: string) => {
    const params = selectedRowKeys
      .map((key) => {
        const item = activeNightItems.find((item) => item.infoId === key);
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
            <ActiveNightForm
              loading={loading}
              onSubmit={(form) => {
                // 重置页号
                const newPageSizeConfig = {
                  pageNo: 1,
                  pageSize: 40,
                };
                setPageSizeConfig(newPageSizeConfig);
                // 备份表单
                formDataBackup.current = form;
                // 清除所有filter
                dispatch(clearAll());
                // 发送请求
                fetchData({
                  ...newPageSizeConfig,
                  ...form,
                });
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
          {!!activeNightItems.length && viewMode !== "selected" && (
            <ResultHeader
              needgroupchoose={false}
              defaultFilterTypeOptions={dictionary.filterType.slice(0, 3)}
              targetType="vehicle"
              className="outcomes-header"
              resultData={{
                ...resultData,
                data: viewMode === "selectedImage" ? resultData.data : [],
              }}
              groupFilterDisabled={viewMode !== "selectedImage"}
              onGroupFilterChange={handleGroupFilterChange}
              rightSlot={
                <div className="operations">
                  {viewMode !== "selectedImage" && (
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
                  )}
                  <Export
                    hasAll={false}
                    total={resultData?.totalRecords || 0}
                    url={`/v1/targetretrieval/nocturnal_vehicles/export`}
                    formData={{
                      ...formDataBackup.current,
                      ...generateExtra(),
                      pageNo: pageSizeConfig.pageNo,
                      pageSize: pageSizeConfig.pageSize,
                      checkedIds: selectedRowKeys,
                    }}
                  />
                </div>
              }
            />
          )}
          <div className={`outcomes-wrapper`}>
            <ResultBox
              nodata={activeNightItems.length <= 0}
              loading={loading}
              nodataTip={firstLoad.current ? "请尝试检索一下" : "搜索结果为空"}
              nodataClass={firstLoad.current ? `first-coming-${skin}` : ""}
            >
              {/* 图文 */}
              {viewMode === "image" && (
                <ImageView
                  items={activeNightItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
                />
              )}
              {/* 列表 */}
              {viewMode === "list" && (
                <TableView
                  items={activeNightItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
                />
              )}
              {/* 点击昼伏夜出天数 */}
              {viewMode === "selected" && (
                <SelectedView
                  items={activeNightItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
                />
              )}
              {/* 点击白昼/夜晚抓拍 */}
              {viewMode === "selectedImage" && (
                <SelectedImageView
                  items={activeNightItems}
                  selected={selectedRowKeys}
                  onSeletedChange={handleSelectedChange}
                  onGroupFilterChange={handleGroupFilterChange}
                />
              )}
            </ResultBox>
          </div>
        </div>
      </header>
      {!!resultData?.data?.length && viewMode !== "selected" && (
        <div className="page-bottom">
          <div className="left">
            <div className={cn("check-box", {})}>
              <Checkbox
                className="card-checked"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  !!selectedRowKeys.length &&
                  selectedRowKeys.length === activeNightItems.length
                }
                indeterminate={
                  !!selectedRowKeys.length &&
                  selectedRowKeys.length !== activeNightItems.length
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
                featureList={activeNightItems.filter((i) =>
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
                    const item = activeNightItems.find(
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
            showSizeChanger={false}
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
        clueDetails={activeNightItems.filter((item) =>
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

export default ActiveNight;
