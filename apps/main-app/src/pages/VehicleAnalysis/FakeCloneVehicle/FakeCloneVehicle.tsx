import React, { useState, useRef } from "react";
import { Button, Divider, Checkbox, Pagination, Tooltip } from "@yisa/webui";
import {
  ResultHeader,
  ResultGroupFilter,
  JoinClue,
  CreateTrackBtn,
  Export,
  GlobalMeaasge
} from "@/components";
import Result from "./Result/Result";
import { useRequest } from "ahooks";
import dayjs from "dayjs";
import ajax, { ApiResponse } from "@/services";
import { useSelector, useDispatch, RootState } from "@/store";
import dictionary from "@/config/character.config";
import { clearAll } from "@/store/slices/groupFilter";
import { CheckboxChangeEvent } from "@yisa/webui/es/Checkbox//Checkbox";
import { GroupFilterCallBackType } from "@/components/ResultGroupFilter/interface";
import { ResultDataType, formDataRefType, formDataType } from "./interface";
import { Link } from "react-router-dom";
import Search from "./Search/Search";
import "./index.scss";
import { logReport } from "@/utils/log";
import { formatTimeComponentToForm } from "@/utils";

export default function FakeCloneVehicle(props: { module: 1 | 2 }) {
  const dispatch = useDispatch();

  const pageConfig = useSelector((state: RootState) => {
    return (
      state.user.sysConfig[props.module === 1 ? "vehicle-fake" : "vehicle-clone"] ||
      {}
    );
  });
console.log(pageConfig)
  const pageDataRef = useRef<formDataRefType>({
    searchForm: {
      warningId: [props.module], // 1假牌 2套牌
      timeType: "time",
      beginDate: dayjs()
        .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      beginTime: "",
      endTime: "",
      timeRange: {},
      locationIds: [],
      locationGroupIds: [],
      licensePlate: "",
      plateColorTypeId: -1,
      noplate: "",
      vehicleTypeId: [-1],
      brandId: "",
      modelId: [],
      yearId: [],
      sort: {
        field: "MaxCaptureTime",
        order: "DESC",
      },
      filters: [],
      pageNo: 1,
      pageSize: dictionary.pageSizeOptions[0],
    },
    // 返回结果默认值
    defaultResultData: {
      data: [],
      totalRecords: 0,
      usedTime: 0,
    },
  });

  const pageData = pageDataRef.current;

  const [searchForm, setSearchForm] = useState<formDataType>(
    pageData.searchForm
  );

  const [resultData, setResultData] = useState<ApiResponse<ResultDataType[]>>(
    pageData.defaultResultData
  );

  const [checkAll, setCheckAll] = useState(false);

  //已经选择的结果数据
  const [checkedList, setCheckedList] = useState<ResultDataType[]>([]);

  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);

  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false);

  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter;
  });

  //加入线索库
  const [showClue, setShowClue] = useState(false);

  const [jumpData, setJumpData] = useState({
    to: "",
  });

  const handleGroupFilterChange = ({
    filterTags = [],
  }: GroupFilterCallBackType) => {
    pageData.searchForm.pageNo = 1;
    pageData.searchForm.pageSize = dictionary.pageSizeOptions[0];
    pageData.searchForm.filters = filterTags;
    search();
  };

  //全选按钮
  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked;
    if (checked && resultData?.data) {
      setCheckedList([...resultData.data]);
      setIndeterminate(false);
      setCheckAll(true);
    } else {
      resetChecked();
    }
  };

  const handleJump = (link: string) => {
    const params = checkedList.map((item) => ({
      bigImage: item.bigImage,
      feature: item.feature,
      targetType: item.targetType,
      targetImage: item.targetImage,
    }));
    setJumpData({
      to: `${link}?featureList=${encodeURIComponent(JSON.stringify(params))}`,
    });
    logReport({
      type: "image",
      data: {
        desc: `图片【${checkedList.length}】-【批量操作：以图检索】`,
        data: checkedList,
      },
    });
  };

  // 重置选中数据
  const resetChecked = () => {
    setCheckedList([]);
    setIndeterminate(false);
    setCheckAll(false);
  };

  const searchChange = (data: any, isFirst?: boolean) => {
    pageData.searchForm = {
      ...pageData.searchForm,
      ...data,
    };
    setResultData(pageData.defaultResultData)
    if (isFirst) {
      search();
    } else {
      pageData.searchForm.pageNo = 1;
      pageData.searchForm.filters = [];
      run();
    }
    dispatch(clearAll());
  };

  const handleChangePn = (pn: number, pageSize: number) => {
    if (pageData.searchForm.pageNo === pn) {
      pageData.searchForm.pageNo = 1;
      pageData.searchForm.pageSize = pageSize;
    } else {
      pageData.searchForm.pageNo = pn;
    }
    search();
  };

  // 图文列表 - 卡片数据选中
  const handleResultCheckedChange = ({
    cardData,
    checked,
  }: {
    cardData: any;
    checked: boolean;
  }) => {
    const isExist = checkedList.filter(
      (item) => item.infoId === cardData.infoId
    ).length;
    let newCheckedData = [];
    if (isExist) {
      newCheckedData = checkedList.filter(
        (item) => item.infoId !== cardData.infoId
      );
    } else {
      newCheckedData = checkedList.concat([cardData]);
    }
    setCheckedList(newCheckedData);
    setIndeterminate(
      !!newCheckedData.length &&
      newCheckedData.length < (resultData.data ?? []).length
    );
    setCheckAll(newCheckedData.length === (resultData.data ?? []).length);
  };

  //格式化请求参数
  const formFormat = (form: formDataType) => {
    let newForm = { ...form };
    // 格式化日期参数
    newForm["timeRange"] = formatTimeComponentToForm(newForm);
    // 公共参数删减，不必要的删除
    const delKeys = [
      "timeType",
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
      "noplate",
    ];
    delKeys.forEach((key) => delete newForm[key]);
    return newForm;
  };

  const search = () => {
    setSearchForm(pageData.searchForm);
    const _newForm = formFormat(pageData.searchForm);
    getData(_newForm);
  };

  const { run } = useRequest(async () => search(), {
    debounceWait: 200,
    manual: true,
  });

  const getData = (formData: formDataType) => {
    setAjaxLoading(true);
    resetChecked();
    ajax.fakeClone
      .getFakeCloneList<formDataType, ResultDataType[]>(
        formData,
        props.module === 1 ? "fake" : "clone",
        (loading: boolean) => loading ? GlobalMeaasge.showLoading() : GlobalMeaasge.hideLoading()
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          res.data = res.data.map((item) => ({
            ...item,
            bigImage: item.imageUrl,
            targetType: "vehicle",
          }));
          setResultData(res);
        } else {
          setResultData(pageData.defaultResultData);
        }
        setAjaxLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setAjaxLoading(false);
        setResultData(pageData.defaultResultData);
      });
  };

  return (
    <div className="vehicle-fake-clone page-content">
      <div className="page-top">
        <div className="search-box">
          <Search
            module={props.module}
            ajaxLoading={ajaxLoading}
            onChange={searchChange}
          />
          <div className="filter">
            {filterTags.length ? (
              <ResultGroupFilter.Show onChange={handleGroupFilterChange} />
            ) : (
              ""
            )}
          </div>
          <Divider />
        </div>
        <div className="result-box">
          {resultData?.data ? (
            <ResultHeader
              className="result-box-header"
              defaultFilterTypeOptions={dictionary.filterType.filter((item) =>
                ["isFace", "sunVisor", "firstCity"].includes(item.value)
              )}
              targetType="vehicle"
              resultData={resultData}
              rightSlot={
                resultData?.totalRecords ? (
                  <Export
                    total={resultData?.totalRecords || 0}
                    url={`/v1/judgement/counterfeit/vehicle/export`}
                    formData={{
                      ...formFormat(pageData.searchForm),
                      checkedIds: checkedList.map((item) => item.infoId),
                      table: `${props.module === 1 ? "假牌车" : "套牌车"}检索`,
                    }}
                  />
                ) : (
                  ""
                )
              }
              onGroupFilterChange={handleGroupFilterChange}
              groupFilterDisabled={ajaxLoading}
              needgroupchoose={false}
            />
          ) : null}
          <Result
            loading={ajaxLoading}
            resultData={resultData}
            checkedList={checkedList}
            onCheckedChange={handleResultCheckedChange}
          />
        </div>
      </div>
      {resultData?.data?.length ? (
        <div className="page-bottom">
          <div className="left">
            <div className="check-box">
              <Checkbox
                className="card-checked"
                checked={checkAll}
                indeterminate={indeterminate}
                onChange={handleCheckAllChange}
              >
                全选
              </Checkbox>
              已经选择<span className="num">{checkedList.length}</span>项
            </div>
            <Tooltip title="仅可选取5个目标" placement="top">
              <span>
                <Link
                  {...jumpData}
                  target="_blank"
                  onClick={(e) => handleJump("/image")}
                  className={
                    !checkedList.length || checkedList.length > 5
                      ? "disabled btn-link"
                      : "btn-link"
                  }
                >
                  以图检索
                </Link>
              </span>
            </Tooltip>
            <Button
              disabled={!checkedList.length}
              size="small"
              onClick={() => {
                setShowClue(true);
              }}
            >
              加入线索库
            </Button>
            <CreateTrackBtn
              disabled={!checkedList.length}
              checkedList={checkedList}
            />
          </div>
          <Pagination
            disabled={!resultData.totalRecords || ajaxLoading}
            showSizeChanger
            showQuickJumper
            showTotal={() => `共 ${resultData.totalRecords} 条`}
            total={resultData.totalRecords}
            current={searchForm.pageNo}
            pageSize={searchForm.pageSize}
            pageSizeOptions={dictionary.pageSizeOptions}
            onChange={handleChangePn}
          />
        </div>
      ) : (
        ""
      )}
      <JoinClue
        visible={showClue}
        clueDetails={checkedList}
        onOk={() => {
          setShowClue(false);
        }}
        onCancel={() => {
          setShowClue(false);
        }}
      />
    </div>
  );
}
