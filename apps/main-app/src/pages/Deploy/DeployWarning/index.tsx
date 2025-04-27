import React, { useState, useCallback, useRef } from "react";

import { Icon } from "@yisa/webui/es/Icon";
import { Radio, Checkbox, Button } from "@yisa/webui";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";

import {
  BottomRight,
  JoinClue,
  ResultHeader,
  Export,
  CreateTrackBtn,
} from "@/components";

import type { PaginationLayoutProps } from "../components/PaginationPage";
import dictionary from "@/config/character.config";
import services from "@/services";

import PaginationLayout from "../components/PaginationPage";
import { useToggle } from "ahooks";
import "./index.scss";
import { ResultBox } from "@yisa/webui_business";
import WarningCardList from "./WarningCardList";
import WarningList from "./WarningList";
import { WarningItem } from "./interface";
import MapContext from "./MapContext";
import DeployWarningForm, { DeployWarningFormData } from "./DeployWaringForm";
import { BkType, Measure } from "../DeployDetail/interface";
import dayjs from "dayjs";
import ImageSearchBtn from "@/components/ImageSearchBtn";
const prefixCls = "deploy-warning";
function DeployWarning() {
  const [mode, setMode] = useState<"Card" | "List">("Card");
  const [loading, setLoading] = useState(false);
  // 查询速度
  const [queryInfo, setQueryInfo] = useState<
    Record<"totalRecords" | "usedTime", number>
  >({
    totalRecords: 0,
    usedTime: 0,
  });
  /* 表单: 用于分页请求/导出 */
  const formDataBackup = useRef<DeployWarningFormData>({
    jobId: [],
    // bkType: [BkType.All],
    alarmTarget: "",
    timeType: "time",
    beginDate: dayjs()
      .subtract(30, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    beginTime: "",
    endTime: "",
    locationGroupIds: [],
    locationIds: [],
    offlineIds: [],
    measure: [Measure.Capature, Measure.Control, Measure.Concern],
    similarity: 30,
  });
  /* =================分页================= */
  const [pageSizeConfig, setPageSizeConfig] = useState<{
    pageNo: number;
    pageSize: number;
  }>({
    pageNo: 1,
    pageSize: dictionary.pageSizeOptions[0],
  });
  // 展示右下角地图
  const [showMap, setShowMap] = useState(false);
  const [lnglat, setLnglat] = useState<Record<"lng" | "lat" | "name", string>>({
    name: "",
    lng: "",
    lat: "",
  });
  /* 卡片数据 */
  const [warningList, setWarningList] = useState<WarningItem[]>([]);
  // 勾选
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    []
  );
  // 切换勾选
  const handleSelectChange = useCallback(
    (newSelectedRowKeys: (string | number)[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    []
  );
  // 底部全选checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(warningList.map(({ uniqueId: key }) => key!));
    } else {
      setSelectedRowKeys([]);
    }
  };
  // 分页切换
  const handlePageChange: PaginationProps["onChange"] = (current, pageSize) => {
    // 分页清除所有选中
    setSelectedRowKeys([]);
    // 先判断页面大小是否改变(必须)
    let newPageSizeConfig = {
      ...pageSizeConfig,
    };
    if (pageSize !== pageSizeConfig.pageSize) {
      newPageSizeConfig = {
        pageNo: 1,
        pageSize: pageSize,
      };
    } else {
      // 页号改变
      newPageSizeConfig = {
        pageNo: current,
        pageSize: pageSize,
      };
    }
    setPageSizeConfig(newPageSizeConfig);
    fetchWarningItemList({
      ...formDataBackup.current,
      ...newPageSizeConfig,
    });
  };
  // 查询
  const fetchWarningItemList = (
    form: DeployWarningFormData,
    shouldIgnore = () => false
  ) => {
    setLoading(true);
    return services.deploy
      .getAlarmHistory<any, WarningItem[]>(form)
      .then((res) => {
        const ignore = shouldIgnore();
        if (ignore) {
          return;
        }
        if (res.data) {
          const temp = res.data.map((w, idx) => {
            return {
              ...w,
              // uniqueId: uniqueId("@warning-item_"),
              uniqueId: idx,
              matches: w.similarity
                ? [
                    {
                      ...w,
                      targetImage: w.monitorTarget?.monitorTargetUrl,
                    } as any,
                  ]
                : [],
            };
          });
          setWarningList(temp || []);
          setQueryInfo({
            totalRecords: res.totalRecords ?? 0,
            usedTime: res.usedTime ?? 0,
          });
        }
      })
      .catch((err) => {
        // 调试信息
        setWarningList([]);
        console.error("deploywarning", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (form: DeployWarningFormData) => {
    /* 备份一份表单参数 */
    formDataBackup.current = form;
    /* 页码置1 */
    const newPageSizeConfig = {
      pageNo: 1,
      pageSize: pageSizeConfig.pageSize,
    };
    setPageSizeConfig(newPageSizeConfig);
    fetchWarningItemList({
      ...formDataBackup.current,
      ...newPageSizeConfig,
    });
  };

  const handleJump = (link: string) => {
    const params = selectedRowKeys
      .map((key) => {
        const item = warningList.find((item) => item.uniqueId === key);
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
  /* 分页配置 */
  const paginationConfig: PaginationProps = {
    current: pageSizeConfig.pageNo,
    pageSize: pageSizeConfig.pageSize,
    total: queryInfo.totalRecords,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: dictionary.pageSizeOptions,
    onChange: handlePageChange,
    disabled: loading,
  };

  const [showClue, { toggle }] = useToggle(false);
  const deployWarningPage: PaginationLayoutProps = {
    classname: prefixCls,
    header: <DeployWarningForm loading={loading} onSubmit={handleSubmit} />,
    main: (
      <ResultBox loading={loading} nodata={warningList.length <= 0}>
        <ResultHeader
          resultData={queryInfo}
          rightSlot={
            <div className="operations">
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
                    value: "Card",
                  },
                  {
                    label: (
                      <span>
                        <Icon type="liebiao" /> 列表
                      </span>
                    ),
                    value: "List",
                  },
                ]}
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                }}
              />
              <Export
                total={queryInfo.totalRecords}
                url={`/v1/monitor/result/export`}
                formData={{
                  ...formDataBackup.current,
                  ...pageSizeConfig,
                  checkedIds: selectedRowKeys,
                  data: warningList.filter((item) =>
                    selectedRowKeys.includes(item.uniqueId)
                  ),
                }}
              />
            </div>
          }
        />
        {mode == "Card" ? (
          <WarningCardList
            selected={selectedRowKeys}
            onSeletedChange={handleSelectChange}
            items={warningList}
          />
        ) : (
          <WarningList
            selected={selectedRowKeys}
            onSeletedChange={handleSelectChange}
            items={warningList}
          />
        )}
      </ResultBox>
    ),
    footer: (
      <div className="footer-slot">
        {showMap && (
          <BottomRight
            {...lnglat}
            onClose={() => {
              setShowMap(false);
            }}
          />
        )}
        <Checkbox
          checked={
            selectedRowKeys.length !== 0 &&
            selectedRowKeys.length === warningList.length
          }
          disabled={!warningList.length}
          onChange={(e) => {
            handleSelectAll(e.target.checked);
          }}
          indeterminate={
            !!selectedRowKeys.length &&
            selectedRowKeys.length !== warningList.length
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
          {/* <Button
            disabled={!selectedRowKeys.length || selectedRowKeys.length > 5}
            onClick={() => handleJump("/image")}
            size="small"
          >
            以图检索
          </Button> */}
          <ImageSearchBtn
            featureList={warningList.filter((i) =>
              selectedRowKeys.includes(i.uniqueId)
            )}
          />
          <Button
            disabled={!selectedRowKeys.length}
            size="small"
            onClick={toggle}
          >
            加入线索库
          </Button>
          <CreateTrackBtn
            disabled={!selectedRowKeys.length}
            checkedList={selectedRowKeys
              .map((key) => {
                const item = warningList.find((item) => item.uniqueId === key);
                if (!item) return null;
                return item;
              })
              .filter(Boolean)}
          />
        </div>
      </div>
    ),
    showFooter: !!queryInfo.totalRecords,
    paginationProps: paginationConfig,
  };

  return (
    <>
      <JoinClue
        visible={showClue}
        clueDetails={
          warningList.filter((w) => selectedRowKeys.includes(w.uniqueId)) as any
        }
        onOk={toggle}
        onCancel={toggle}
      />
      <MapContext.Provider
        value={{
          showLngLat(...args) {
            setShowMap(true);
            setLnglat(...args);
          },
        }}
      >
        <PaginationLayout {...deployWarningPage} />
      </MapContext.Provider>
    </>
  );
}

export default DeployWarning;
