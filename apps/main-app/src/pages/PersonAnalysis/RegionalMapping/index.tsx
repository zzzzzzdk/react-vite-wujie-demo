import React, { useMemo, useState, useRef, useEffect } from "react";
import { Form, Button, Message, Image, Select, Tabs, Popover } from "@yisa/webui";
import {
  CityMassMarker,
  BoxDrawer,
  LocationMapList,
  TimeRangePicker,
  DoubleDrawer,
  BigImg,
  MultipointVector,
  FormLabelSelect,
  Export as ExportBtn,
  Track,
  Panel,
} from "@/components";
import { Icon } from "@yisa/webui/es/Icon";
import { ResultBox, ErrorImage } from "@yisa/webui_business";
import {
  DrawType,
  LocationMapListCallBack,
} from "@/components/LocationMapList/interface";
import { DatesParamsType } from "@/components/TimeRangePicker/interface";
import { SelectCommonProps } from "@yisa/webui/es/Select/interface";
import { ResultRowType } from "@/pages/Search/Target/interface";
import ajax, { ApiResponse } from "@/services";
import { getMapProps, isNumber, formatTimeComponentToForm } from "@/utils";
import { BaseMap, TileLayer } from "@yisa/yisa-map";
import { LeafletEvent } from "leaflet";
import dayjs from "dayjs";
import "./index.scss";
import {
  DetailDataType,
  FormDataType,
  PeerDetailFormType,
  PeerFormType,
  ResultDataType,
  TargetDetailFormType,
  TargetFormType,
  TrackParamsType,
  VectorType,
  sortFunc,
} from "./interface";
import PersonAttributeModal from "./PersonAttributeModal";
import { useRequest } from "ahooks";
import InfoCard from "./InfoCard";
import DetailCard from "./DetailCard";
import type { RefTrack } from "@/components/Map/Track/interface";
import type { ImgListDataType } from "@yisa/webui_business/es/ImgPreview";
import { useSelector, RootState } from "@/store";

const resSortOptions = [
  { value: "DESC-stayTime", label: "按停留时间降序" },
  { value: "ASC-stayTime", label: "按停留时间升序" },
  { value: "DESC-firstCaptureTime", label: "按出现时间降序" },
  { value: "ASC-firstCaptureTime", label: "按出现时间升序" },
];

const trackTypeOptions = [
  { value: "1", label: "全部轨迹" },
  { value: "2", label: "仅区域内轨迹" },
];

export default function RegionalMapping() {
  const { scaleZoom, zoom } = window.YISACONF.map;

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig["regional-mapping"] || {};
  });

  //缩放比例
  const [mapZoom, setMapZoom] = useState(zoom || 13);

  //地图配置
  const { mapProps, tileLayerProps } = useMemo(() => {
    const { mapProps, tileLayerProps } = getMapProps("VehicleAnalisisMap");
    return {
      mapProps: {
        ...mapProps,
        onZoomStart: (e: LeafletEvent) => { },
        onZoomEnd: (e: LeafletEvent) => {
          const afterZoom = e.target.getZoom();
          if (afterZoom < scaleZoom - 4) {
            setCityMassMarker({ showCityMarker: true, showMassMarker: false });
          } else {
            setCityMassMarker({ showCityMarker: false, showMassMarker: true });
          }
          setMapZoom(afterZoom);
        },
      },
      tileLayerProps,
    };
  }, []);

  //区县与海量点切换
  const [cityMassMarker, setCityMassMarker] = useState({
    showCityMarker: true,
    showMassMarker: false,
  });

  // 左侧检索抽屉open
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(true);

  // 右侧检索结果抽屉open
  const [doubleDrawerVisible, setDoubleDrawerVisible] = useState<
    [boolean, boolean]
  >([false, false]);

  //抽屉挂载节点
  const boxRef = useRef<HTMLDivElement>(null);

  // 搜索表单默认值
  const defaulFormtData: FormDataType = {
    tab: "1",
    timeType: "time",
    beginDate: dayjs()
      .subtract(Number(pageConfig.timeRange?.default || 6) - 1, "days")
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    beginTime: "",
    endTime: "",
    locationIds: [],
    personTags: [],
    timeSort: "DESC-stayTime",
    trackSort: "1",
    attributes: {},
  };

  // 搜索表单
  const [formData, setFormData] = useState<FormDataType>(defaulFormtData);

  const searchFormDataRef = useRef({
    ...formData,
  });

  // const [searchFormData, setSearchFormData] = useState<
  //   TargetFormType | PeerFormType
  // >();

  // 人员属性弹窗open
  const [personAttributeModalOpen, setPersonAttributeModalOpen] =
    useState<boolean>(false);

  // 人员属性弹窗选中数量
  const [selectedNum, setSelectednum] = useState<number>(0);

  // 绘制类型
  const [drawType, setDrawType] = useState<DrawType>("default");

  // 当前图形数据
  const [vectorArr, setVectorArr] = useState<VectorType[]>([]);

  // 搜索Loading
  const [searchLoad, setSearchLoad] = useState<boolean>(false);

  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  // 搜索结果左侧loading
  const [leftLoading, setLeftLoading] = useState<boolean>(false);

  // 搜索结果右侧loding
  const [rightLoading, setRightLoading] = useState<boolean>(false);

  const defaultResData = {
    totalRecords: 0,
    data: [],
  };

  // 检索结果
  const [resData, setResData] =
    useState<ApiResponse<ResultDataType[]>>(defaultResData);

  // 检索结果轨迹数据
  const [detailData, setDetailData] = useState<ApiResponse<DetailDataType[]>>({
    totalRecords: 100,
    data: [],
  });

  // 搜索结果tab 数据
  const resTabOption = [
    {
      key: "1",
      name: "可疑人员信息",
      disabled: leftLoading || rightLoading,
    },
    {
      key: "2",
      name: "同行人信息",
      disabled:
        leftLoading || rightLoading || !(resData.data && resData.data.length),
    },
  ];

  // const [checkedList, setCheckedList] = useState<ResultDataType[]>([]);

  // 当前左侧选中数据
  const [currentLeftIndex, setCurrentLeftIndex] = useState<number | null>(0);

  // 当前右侧选中的数据
  const [currentRightData, setCurrentRightData] = useState<
    ResultDataType | { index: number }
  >({ index: 0 });

  //地图轨迹
  const trackRef = useRef<RefTrack>(null);

  const defaultTrackParams: TrackParamsType = {
    data: [],
    startTime: "",
    endTime: "",
  };

  const [trackParams, setTrackParams] = useState(defaultTrackParams);

  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0,
  });

  //根据详情数据计算出大图数据
  const bigImgData = detailData.data
    ?.map((item) => ({ ...item, htmlIndex: item.index }))
    .flat();

  // 渲染检索弹窗
  const renderSearchEle = () => {
    return (
      <div className="left-search">
        <div className="left-search-wrapper">
          <Form colon={false} layout="vertical">
            <TimeRangePicker
              timeLayout="vertical"
              formItemProps={{ label: "时间范围" }}
              beginDate={formData.beginDate}
              endDate={formData.endDate}
              beginTime={formData.beginTime}
              endTime={formData.endTime}
              timeType={formData.timeType}
              onChange={handleDateChange}
            />
          </Form>
          <Form colon={false} labelAlign="left">
            <LocationMapList
              title="请在右侧地图中选择"
              formItemProps={{
                label: "数据源",
                required: true,
              }}
              locationIds={formData.locationIds}
              showDrawTools={true}
              showMap={false}
              defaultDrawType={drawType}
              isPermitModal={false}
              onChangeDrawTools={(type) => {
                setDrawType(type);
                setFormData({ ...formData, locationIds: [] });
                setVectorArr([]);
              }}
              onChange={handleLocationChange}
            />
          </Form>
          <Form layout="horizontal" colon={false} labelAlign="left">
            <Form.Item label="人员标签">
              <FormLabelSelect
                multiple
                value={formData.personTags}
                onChange={(value) =>
                  setFormData({ ...formData, personTags: value as string[] })
                }
              />
            </Form.Item>
            <Form.Item label="人员属性">
              <div
                className="btn-person-arrtibute"
                onClick={hanldePersonAttributeBtn}
              >
                {!selectedNum ? "点击选择属性" : `已选择${selectedNum}个属性`}
              </div>
            </Form.Item>
          </Form>
        </div>
        <Button
          className="left-search-btn"
          type="primary"
          onClick={handleSearch}
          loading={searchLoad}
        >
          开始检索
        </Button>
      </div>
    );
  };

  // 检索结果左侧
  const leftContent = () => {
    const commonClass = "left-content";

    const {
      infoId = "",
      name = "",
      group = "",
      idcard = "",
      age = 0,
      targetImage = "",
      peerName = "",
      peerImage = "",
      peerAge = 0,
      peerIdcard = "",
      peerGroup = "",
      personTags = [
        // {color: 1, name: "徘徊人员"},
        // {color: 2, name: "地道人员"},
        // {color: 3, name: "徘徊人员"}
      ]
    } = currentRightData as ResultDataType;

    const tagNum = 1

    const idCardUrl =
      formData.tab === "1"
        ? idcard && group
          ? `#/record-detail-person?${encodeURIComponent(
            JSON.stringify({
              idNumber: idcard === '未知' ? '' : idcard,
              groupId: group ? [group] : [],
              groupPlateId: [],
              idType: "111",
            })
          )}`
          : ""
        : peerIdcard && peerGroup
          ? `#/record-detail-person?${encodeURIComponent(
            JSON.stringify({
              idNumber: peerIdcard === '未知' ? '' : peerIdcard,
              groupId: peerGroup ? [peerGroup] : [],
              groupPlateId: [],
              idType: "111",
            })
          )}`
          : "";

    return (
      <div className={commonClass}>
        <div className={`${commonClass}-target`}>
          <ResultBox
            loading={leftLoading}
            // nodata={!infoId}
            nodata={false}
            nodataTip="人员信息为空"
          >
            <div className="target-img" onClick={() => window.open(idCardUrl)}>
              <Image src={formData.tab === "1" ? targetImage : peerImage} />
            </div>
            <div className="target-info">
              {
                idcard || peerIdcard ?
                  <>
                    <div className="name-age">
                      <Icon type="xingming" />
                      <span>{(formData.tab === "1" ? name : peerName) || "未知"}</span>
                      <span>
                        {formData.tab === "1"
                          ? isNumber(age) && age !== 0
                            ? age
                            : "未知"
                          : isNumber(peerAge) && peerAge !== 0
                            ? peerAge
                            : "未知"}
                      </span>
                    </div>
                    <div className="id-card">
                      <Icon type="shenfenzheng" />
                      {idCardUrl ? (
                        <a
                          href={idCardUrl}
                          target="_blank"
                          title={idcard || peerIdcard || ""}
                        >
                          {(formData.tab === "1" ? idcard : peerIdcard) || "未知"}
                        </a>
                      ) : (
                        <span title={(formData.tab === "1" ? idcard : peerIdcard) || ""}>
                          {(formData.tab === "1" ? idcard : peerIdcard) || "未知"}
                        </span>
                      )}
                    </div>
                    <div className="card-info">
                      <Icon type="renyuanku1" />
                      <div className="card-info-content">
                        {
                          personTags?.length ?
                            <div className="tags">
                              {
                                personTags.slice(0, tagNum).map((item, index: number) => <div
                                  key={index} className={`label-item label-item-${item.color}`} title={item.name}>{item.name}</div>)
                              }
                              {
                                personTags.length > tagNum ?
                                  <Popover
                                    placement="topRight"
                                    // visible={true}
                                    content={<div className="cluster-tag-more">
                                      {
                                        personTags?.map((elem, index: number) => <span key={index} title={elem.name} className={`label-item label-item-${elem.color}`}>{elem.name}</span>)
                                      }
                                    </div>}
                                    overlayClassName="cluster-tag-popover"
                                  >
                                    <div key='...' className={`label-item`}>+{personTags.length - tagNum}</div>
                                  </Popover>
                                  : null
                              }
                            </div>
                            : "-"
                        }
                      </div>
                    </div>
                  </>
                  :
                  <div className="no-name">暂未实名</div>
              }
            </div>
          </ResultBox>
        </div>
        <div className={`${commonClass}-tools`}>
          {!leftLoading ? (
            <span>
              共<em>{detailData.totalRecords || 0}</em>条轨迹信息
            </span>
          ) : null}
          <Select
            bordered={false}
            disabled={leftLoading || rightLoading || !detailData?.data?.length}
            options={trackTypeOptions}
            value={formData.trackSort}
            onChange={handleChangeTrackType}
          />
        </div>
        <div className={`${commonClass}-list`}>
          <ResultBox
            loading={leftLoading}
            nodata={!detailData?.data?.length}
            nodataTip="轨迹信息为空"
          >
            {detailData?.data?.map((item, index) => {
              return (
                <DetailCard
                  key={item.infoId}
                  index={item.index}
                  tab={formData.tab}
                  data={item}
                  active={item.index === currentLeftIndex}
                  onHandleCard={() => handleLeftCard(item, item.index)}
                  onHandleCardImg={() => handleLeftCardImg(index)}
                />
              );
            })}
          </ResultBox>
        </div>
      </div>
    );
  };

  // 检索结果右侧
  const rightContent = () => {
    const commonClass = "right-content";
    return (
      <div className={commonClass}>
        <Tabs
          className={`${commonClass}-tabs`}
          data={resTabOption}
          activeKey={formData.tab}
          onChange={handleTab}
        />
        <div className={`${commonClass}-tools`}>
          {!rightLoading ? (
            <span>
              共<em>{resData.totalRecords || 0}</em>条信息
            </span>
          ) : null}
          {resData.totalRecords && !rightLoading ? renderExportBtn() : null}
          <Select
            bordered={false}
            disabled={leftLoading || rightLoading || !resData?.data?.length}
            options={resSortOptions}
            value={formData.timeSort}
            onChange={handleChangeRightTabSort}
          />
        </div>
        <div className={`${commonClass}-list`}>
          <ResultBox loading={rightLoading} nodata={!resData?.data?.length}>
            {resData?.data?.map((item, index) => (
              <InfoCard
                key={item.infoId}
                tab={formData.tab}
                data={item}
                // checked={
                //   checkedList.findIndex((elem) => elem.infoId === item.infoId) >
                //   -1
                // }
                active={index === currentRightData.index}
                onHandleCard={() => handleRightCard(item, index)}
              // onChange={(checked) => handleChangeChecked(item, checked)}
              />
            ))}
          </ResultBox>
        </div>
      </div>
    );
  };

  const renderExportBtn = () => {
    const url =
      formData.tab === "1"
        ? `/v1/judgement/regional/suspicious/export`
        : "/v1/judgement/regional/accomplices/export";

    let form: any = {
      sort: formData.timeSort,
      pageNo: 1,
      pageSize: resData.totalRecords || 0,
      timeRange: searchFormDataRef.current.timeRange || {},
      locationIds: searchFormDataRef.current.locationIds,
      area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
    };
    if (formData.tab === "1") {
      form = {
        ...form,
        listExportCacheId: resData.exportCacheId,
      };
    } else {
      form = {
        ...form,
        listCacheId: resData.exportCacheId,
        detailCacheId: resData.cacheId,
      };
    }
    return (
      <ExportBtn
        hasAll={false}
        total={resData.totalRecords || 0}
        url={url}
        formData={form}
      />
    );
  };

  const trackContentCb = (elem: ResultRowType) => {
    return (
      <div className="track-popver-content">
        <div className="track-popver-content-card">
          <div className="card-img">
            <Image src={elem.targetImage} />
          </div>
          <div className="card-info">
            <Icon type="shijian" />
            {elem.captureTime}
          </div>
          <div className="card-info" title={elem.locationName}>
            <Icon type="didian" />
            {elem.locationName}
          </div>
        </div>
      </div>
    );
  };

  const BigImgInfoRender = (data: DetailDataType, currentIndex: number) => {
    const { name = "未知", stayTime = 0, peerName = '未知' } = currentRightData as any;
    console.log(currentRightData)

    return (
      <div className="regional-mapping-big-img">
        <Panel className="regional-mapping-big-img-info" title="查询信息">
          <div className="name">
            <label>{formData.tab === "1" ? "可疑人员" : "同行人员"}:</label>
            <span>{(formData.tab === "1" ? name : peerName) || "未知"}</span>
          </div>
          <div className="duration">
            <label>停留时长:</label>
            <span>{stayTime || 0}h</span>
          </div>
        </Panel>
        <Panel title="轨迹列表" className="regional-mapping-big-img-list">
          {Array.isArray(detailData.data)
            ? detailData.data.map((item, index) => (
              <div
                key={item.infoId}
                className={`regional-mapping-big-img-list-item ${currentIndex === index ? "active" : ""
                  }`}
                onClick={() => handleBigImgTrack(index)}
              >
                <div>
                  <Icon type="shijian" />
                  <span>{item.captureTime}</span>
                </div>
                <div className="location">
                  <Icon type="didian" />
                  <span>{item.locationName}</span>
                  {item.status ? (
                    <span
                      className={`status ${item.status === -1 ? "go" : "out"
                        }`}
                    >
                      {item.status === -1 ? "进入" : "离开"}
                    </span>
                  ) : null}
                </div>
                <div className="index">{item.index}</div>
              </div>
            ))
            : null}
        </Panel>
      </div>
    );
  };

  const listItemRender = (data: ImgListDataType, index: number) => {
    const { targetImage } = data;
    return <ErrorImage src={targetImage} />;
  };

  // 保存绘图数据
  const changeVectorArr = (data: { type: string; radius: number }) => {
    let arr = [];
    arr.push(
      Object.assign({}, data, {
        color: "#3377ff",
      })
    );
    setVectorArr(arr);
  };

  // 处理时间变化
  const handleDateChange = (dates: DatesParamsType) => {
    setFormData({
      ...formData,
      timeType: dates.timeType,
      beginDate: dates.beginDate,
      endDate: dates.endDate,
      beginTime: dates.beginTime,
      endTime: dates.endTime,
    });
  };

  // 处理点位变化
  const handleLocationChange = (data: LocationMapListCallBack) => {
    setFormData({
      ...formData,
      locationIds: data.locationIds,
    });
  };

  // 打开人员属性弹窗
  const hanldePersonAttributeBtn = () => {
    setPersonAttributeModalOpen(true);
  };

  // 人员属性confirm回调
  const personAttributeModalConfirm = (data: any, num: number, form?: any) => {
    if (form) {
      setFormData(
        Object.assign(
          {},
          {
            tab: formData.tab,
            timeType: form.timeType,
            beginDate: form.beginDate,
            endDate: form.endDate,
            beginTime: form.beginTime,
            endTime: form.endTime,
            locationIds: form.locationIds,
            personTags: form.personTags,
            timeSort: formData.timeSort,
            trackSort: formData.trackSort,
            attributes: data,
          }
        )
      );
    } else {
      setFormData(
        Object.assign(
          {},
          {
            tab: formData.tab,
            timeType: formData.timeType,
            beginDate: formData.beginDate,
            endDate: formData.endDate,
            beginTime: formData.beginTime,
            endTime: formData.endTime,
            locationIds: formData.locationIds,
            personTags: formData.personTags,
            timeSort: formData.timeSort,
            trackSort: formData.trackSort,
            attributes: data,
          }
        )
      );
    }
    setPersonAttributeModalOpen(false);
    setSelectednum(num);
  };

  // 人员属性cancel回调
  const personAttributeModalCancel = () => {
    setPersonAttributeModalOpen(false);
  };

  // 检索结果点击收起
  const handleDrawerChange = () => {
    const visible = doubleDrawerVisible.every(Boolean),
      hidden = doubleDrawerVisible.every((item) => item === false),
      leftVisible = doubleDrawerVisible[0] && !visible[1];
    if (visible) {
      setDoubleDrawerVisible([false, true]);
    } else if (hidden) {
      setDoubleDrawerVisible([true, true]);
      setLeftDrawerVisible(false);
    } else if (!leftVisible) {
      setDoubleDrawerVisible([false, false]);
    }
  };

  // 格式化formData，为提交检索做准备
  const formFormat = (form: FormDataType) => {
    let newForm = {
      ...form,
    };
    const timeRange = formatTimeComponentToForm(newForm);
    newForm["timeRange"] = timeRange;
    searchFormDataRef.current = { ...form, timeRange: timeRange };
    // 公共参数删减，不必要的删除
    let delKeys = [
      "beginDate",
      "endDate",
      "beginTime",
      "endTime",
      "timeType",
      "timeSort",
      "trackSort",
      "tab",
    ];
    delKeys.forEach((key) => {
      delete newForm[key];
    });
    return newForm;
  };

  // 点击检索
  const handleSearch = () => {
    if (!(formData.locationIds && formData.locationIds.length)) {
      Message.warning("请选择数据源");
      return;
    }
    const dateRangeMax = Number(pageConfig.timeRange?.max || 0);
    if (dateRangeMax) {
      let timeDiff = dayjs(formData.endDate).diff(
        dayjs(formData.beginDate),
        "days"
      );
      if (timeDiff > dateRangeMax) {
        Message.warning(`请选择时间范围在${dateRangeMax}日内！`);
        return;
      }
    }
    setLeftDrawerVisible(false);
    firstLoading && setFirstLoading(false);
    let _fotmData = {
      ...formData,
      tab: "1",
      timeSort: "DESC-stayTime",
      trackSort: "1",
    };
    setFormData(_fotmData);
    const newForm = formFormat({ ..._fotmData, areaData: vectorArr });
    run(newForm);
  };

  // 搜索结果tab变化
  const handleTab = (key: string) => {
    let _fotmData = {
      ...searchFormDataRef.current,
      timeSort: "DESC-stayTime",
      trackSort: "1",
      tab: key,
    };
    setFormData(_fotmData);
    search(formFormat(_fotmData));
  };

  // 检索结果右侧排序
  const handleChangeRightTabSort = (data: SelectCommonProps["value"]) => {
    // 改变表单数据
    const _fotmData = {
      ...searchFormDataRef.current,
      trackSort: "1",
      timeSort: data as string,
    };
    setFormData(_fotmData);
    searchFormDataRef.current = _fotmData;
    // 排序
    const sortArr = (data as string).split("-");
    const sortTFIeld = sortArr[1];
    const sortOrder = sortArr[0] === "ASC" ? "ASC" : "DESC";
    const arr = sortFunc(
      resData.data || [],
      sortOrder,
      sortTFIeld,
      sortTFIeld === "stayTIme" ? undefined : "time"
    );
    setResData({ ...resData, data: arr });
    // setCheckedList([]);
    setDoubleDrawerVisible([true, true]);
    // 请求详情数据
    const leftForm: TargetDetailFormType | PeerDetailFormType =
      searchFormDataRef.current.tab === "1"
        ? {
          group: [arr[0].group],
          timeRange: searchFormDataRef.current.timeRange || {},
          locationIds: searchFormDataRef.current.locationIds,
          area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
        }
        : {
          cacheId: resData.cacheId,
          elementId: arr[0].infoId,
          locationIds: searchFormDataRef.current.locationIds,
          area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
        };
    getLefteData(leftForm);
    setCurrentRightData({ ...arr[0], index: 0 });
  };

  // 点击搜索结果
  const handleRightCard = (item: ResultDataType, index: number) => {
    if (currentRightData.index === index) return;
    if (leftLoading) {
      Message.warning("正在获取轨迹数据，请稍后再试");
      return;
    }
    const _fotmData = {
      ...searchFormDataRef.current,
      trackSort: "1",
    };
    setFormData(_fotmData);
    searchFormDataRef.current = _fotmData;
    setCurrentRightData({ ...item, index: index });
    const leftForm: TargetDetailFormType | PeerDetailFormType =
      searchFormDataRef.current.tab === "1"
        ? {
          group: [item.group],
          timeRange: searchFormDataRef.current.timeRange || {},
          locationIds: searchFormDataRef.current.locationIds,
          area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
        }
        : {
          cacheId: resData.cacheId,
          elementId: item.infoId,
          locationIds: searchFormDataRef.current.locationIds,
          area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
        };
    getLefteData(leftForm);
  };

  // //右侧多选框被点击
  // const handleChangeChecked = (cardData: ResultDataType, checked: boolean) => {
  //   const isExist = checkedList.filter(
  //     (item) => item.infoId === cardData.infoId
  //   ).length;
  //   let newCheckedData = [];
  //   if (isExist) {
  //     newCheckedData = checkedList.filter(
  //       (item) => item.infoId !== cardData.infoId
  //     );
  //   } else {
  //     newCheckedData = checkedList.concat([cardData]);
  //   }
  //   setCheckedList(newCheckedData);
  // };

  const handleChangeTrackType = (data: SelectCommonProps["value"]) => {
    let _fotmData = {
      ...searchFormDataRef.current,
      trackSort: data as string,
    };
    searchFormDataRef.current = _fotmData;
    setFormData(_fotmData);
    const { group = 0, infoId = "" } = currentRightData as any;
    const leftForm: TargetDetailFormType | PeerDetailFormType =
      searchFormDataRef.current.tab === "1"
        ? {
          group: [group],
          timeRange: searchFormDataRef.current.timeRange || {},
          locationIds: searchFormDataRef.current.locationIds,
          area: data === "1" ? 1 : 0,
        }
        : {
          cacheId: resData.cacheId,
          elementId: infoId,
          locationIds: searchFormDataRef.current.locationIds,
          area: data === "1" ? 1 : 0,
        };
    getLefteData(leftForm);
  };

  const handleLeftCard = (item: DetailDataType, index: number) => {
    setCurrentLeftIndex(index);
  };

  const handleLeftCardImg = (index: number) => {
    setBigImgModal({ visible: true, currentIndex: index });
  };

  const handleMapMarkerChange = (index: number | null) => {
    setCurrentLeftIndex(index);
  };

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0,
    });
  };

  const handleBigImgTrack = (index: number) => {
    setBigImgModal({
      ...bigImgModal,
      currentIndex: index,
    });
  };

  const changevectorData = (data: VectorType[]) => {
    setCityMassMarker({ showCityMarker: false, showMassMarker: true });
    setVectorArr(data);
  };

  const errorRule = (err?: any) => {
    setLeftLoading(false);
    setRightLoading(false);
    setSearchLoad(false);
    setResData(defaultResData);
    setCurrentRightData({ index: 0 });
    setDetailData({});
    setCurrentLeftIndex(null);
    err && console.log(err);
  };

  const getTargetData = (form: TargetFormType) => {
    ajax.RegionalMapping.getRegionalMappingList<
      TargetFormType,
      ResultDataType[]
    >(form)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          res.data = sortFunc(res.data, "DESC", "stayTime");
          const leftForm: TargetDetailFormType = {
            group: [res.data[0].group],
            timeRange: form.timeRange || {},
            locationIds: form.locationIds,
            area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
          };
          setResData(res);
          getLefteData(leftForm);
          setSearchLoad(false);
          setRightLoading(false);
          setCurrentRightData({ ...res.data[0], index: 0 });
        } else {
          errorRule();
        }
      })
      .catch((err) => {
        errorRule(err);
      });
  };

  const getPeerData = (form: PeerFormType) => {
    ajax.RegionalMapping.getRegionalMappingPeerList<
      PeerFormType,
      ResultDataType[]
    >(form)
      .then((res) => {
        let { data = [] } = res;
        if (Array.isArray(data) && data.length > 0) {
          const leftForm: PeerDetailFormType = {
            cacheId: res.cacheId,
            elementId: data[0].elementId,
            locationIds: form.locationIds,
            area: searchFormDataRef.current.trackSort === "1" ? 1 : 0,
          };
          data.forEach((item) => (item.infoId = (item.elementId || "1")));
          data = sortFunc(data, "DESC", "stayTime");
          const newRes = {
            ...res,
            data: data
          }
          getLefteData(leftForm);
          setResData(newRes);
          setSearchLoad(false);
          setRightLoading(false);
          setCurrentRightData({ ...data[0], index: 0 });
        } else {
          errorRule();
        }
      })
      .catch((err) => {
        errorRule(err);
      });
  };

  // 检索api
  const search = (form: FormDataType) => {
    setSearchLoad(true);
    setRightLoading(true);
    setLeftLoading(true);
    // setCheckedList([]);
    setDoubleDrawerVisible([true, true]);
    setTrackParams(defaultTrackParams);
    if (searchFormDataRef.current.tab === "1") {
      const targetForm = {
        ...form,
        timeRange: form.timeRange || {},
        personTags: form.personTags.map((item) => Number(item)),
        areaData: form.areaData || [],
      };
      getTargetData(targetForm);
    } else {
      const peerForm = {
        group: Array.isArray(resData.data)
          ? resData.data.map((item) => item.group)
          : [],
        timeRange: form.timeRange || {},
        locationIds: form.locationIds,
      };
      getPeerData(peerForm);
    }
  };

  // 检索防抖
  const { run } = useRequest(async (form) => search(form), {
    debounceWait: 200,
    manual: true,
  });

  //格式化详情结果数据
  const detailDataFormat = (res: ApiResponse<DetailDataType[]>) => {
    let { data = [] } = res;
    if (Array.isArray(data) && data.length) {
      data = sortFunc(data, "DESC", "captureTime", "time");
      if (searchFormDataRef.current.tab === "1") {
        data = data
          .filter((item) => item?.lngLat?.lat && item?.lngLat?.lng)
          .map((item, index) => ({
            ...item,
            index: data.length - index,
          }));
      } else {
        data = data = data
          .filter((item) => item.longitude && item.latitude)
          .map((item, index) => ({
            ...item,
            lngLat: { lng: item.longitude + "", lat: item.latitude + "" },
            index: data.length - index,
          }));
      }
      setDetailData({
        ...res,
        data: data,
      });
      let trackData = [...data];
      trackData.reverse();
      setTrackParams({
        data: trackData,
        startTime: trackData[0].captureTime,
        endTime: trackData[data.length - 1].captureTime,
      });
    } else {
      setDetailData({});
      setTrackParams(defaultTrackParams);
    }
  };

  // 获取左侧轨迹数据api
  const getLefteData = (form: TargetDetailFormType | PeerDetailFormType) => {
    setLeftLoading(true);
    !leftLoading && setLeftLoading(true);
    setCurrentLeftIndex(null);
    const api = () =>
      searchFormDataRef.current.tab === "1"
        ? ajax.RegionalMapping.getRegionalMappingDetail<
          TargetDetailFormType,
          DetailDataType[]
        >(form as TargetDetailFormType)
        : ajax.RegionalMapping.getRegionalMappingPeerDetail<
          PeerDetailFormType,
          DetailDataType[]
        >(form as PeerDetailFormType);
    api()
      .then((res) => {
        detailDataFormat(res);
        setLeftLoading(false);
      })
      .catch((err) => {
        setDetailData({});
        setTrackParams(defaultTrackParams);
        setLeftLoading(false);
      });
  };

  useEffect(() => {
    if (bigImgModal.currentIndex) {
      document
        .querySelector(".regional-mapping-big-img-list-item.active")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  }, [bigImgModal.currentIndex]);

  return (
    <div className="person-regional-mapping page-content">
      <div className="person-regional-mapping-content" ref={boxRef}>
        <BaseMap {...mapProps}>
          <TileLayer {...tileLayerProps} />
          <CityMassMarker
            showCityMassMarker
            showCityMarker={cityMassMarker.showCityMarker}
            showMassMarker={cityMassMarker.showMassMarker}
            mapZoom={mapZoom}
            drawType={drawType}
            onChangeDrawType={setDrawType}
            locationIds={formData.locationIds}
            onChangeLocationIds={(ids: string[]) => {
              setFormData({ ...formData, locationIds: ids });
            }}
            getVectorData={(e) => {
              changeVectorArr(e);
            }}
          />
          <Track
            ref={trackRef}
            {...trackParams}
            contentCb={trackContentCb}
            clickIndex={currentLeftIndex}
            markerClickCb={handleMapMarkerChange}
          />
          <MultipointVector
            vectorData={vectorArr}
            activeIndex={0}
            scaleZoom={scaleZoom - 4}
          />
        </BaseMap>
        <BoxDrawer
          title="区域摸排"
          placement="left"
          onOpen={() => {
            setLeftDrawerVisible(true);
            setDoubleDrawerVisible([false, false]);
          }}
          onClose={() => setLeftDrawerVisible(false)}
          visible={leftDrawerVisible}
          getContainer={() => boxRef.current as HTMLDivElement}
        >
          {renderSearchEle()}
        </BoxDrawer>
        {!firstLoading ? (
          <DoubleDrawer
            placement="right"
            titles={[
              formData.tab === "1" ? "可疑人员轨迹列表" : "同行人员轨迹列表",
              "区域摸排信息",
            ]}
            widths={[378, 388]}
            visibles={doubleDrawerVisible}
            contents={[leftContent(), rightContent()]}
            onChange={handleDrawerChange}
            getContainer={() =>
              document.querySelector(".person-regional-mapping-content") ||
              document.body
            }
          ></DoubleDrawer>
        ) : null}
        <PersonAttributeModal
          open={personAttributeModalOpen}
          cancel={personAttributeModalCancel}
          confirm={personAttributeModalConfirm}
          changevectorData={changevectorData}
        />
        <BigImg
          calssName="regional-mapping-big-img"
          modalProps={{
            visible: bigImgModal.visible,
            onCancel: handleCloseBigImg,
          }}
          currentIndex={bigImgModal.currentIndex}
          onIndexChange={(index) => {
            setBigImgModal({
              visible: true,
              currentIndex: index,
            });
          }}
          data={bigImgData || []}
          imgInfoRender={BigImgInfoRender}
          listItemRender={listItemRender}
        />
      </div>
    </div>
  );
}
