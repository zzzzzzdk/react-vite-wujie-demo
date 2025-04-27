import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import dayjs from "dayjs";
import { getMapProps } from "@/utils";
import classnames from "classnames";
import { Select } from "@yisa/webui";
import { BaseMap, TileLayer } from "@yisa/yisa-map";
import { DoubleDrawer, Track, Export as ExportBtn } from "@/components";
import TrackProps from "@/components/Map/Track/interface";
import { useToggle, useUpdate } from "ahooks";
import { RefTrack } from "@/components/Map/Track/interface";
import services from "@/services";
import { WarningItem } from "../DeployWarning/interface";
import { AlarmCard } from "./AlarmCard";
import { LeftOutlined, RightOutlined } from "@yisa/webui/es/Icon";
import { ResultBox } from "@yisa/webui_business";
import CapatureInfoCard from "./CaptureCard";
import TargetCard from "./TargetCard";
import { isNull, uniqueId } from "lodash";
import { useParams } from "react-router-dom";

function WarningDetail() {
  const { mapProps, tileLayerProps } = useMemo(() => {
    return getMapProps("locationMap");
  }, []);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<RefTrack>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [drawerVisible, { toggle: toggleDrawer }] = useToggle(true);

  const [alarmList, setAlarmList] = useState<WarningItem[]>([]);

  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const sortedList = sort == "asc" ? [...alarmList] : [...alarmList].reverse();

  const [selectedId, setSelectedId] = useState<number | string>(0);
  const selectedItem = alarmList.find((item, idx) => {
    return item.uniqueId === selectedId;
  });
  const trackData: TrackProps["data"] = alarmList.map((item, idx) => {
    return {
      ...item,
      index: idx + 1,
      // index:  sortedList.length - idx,
      maxCaptureTime: "",
      minCaptureTime: "",
    };
  }) as TrackProps["data"];
  const trackParams: TrackProps = {
    data: trackData,
    startTime: alarmList[0]?.captureTime || "",
    endTime: alarmList[alarmList.length - 1]?.captureTime || "",
  };
  const trackContentCb = (data: any) => {
    // console.log(data);
    if (!selectedItem) return;

    return (
      <div className="float-card">
        <span
          className={classnames("prev", {
            disabled: selectedId == sortedList[0]?.uniqueId,
          })}
          onClick={() => {
            if (selectedId == sortedList[0]?.uniqueId) {
              return;
            }
            // 当前选中元素的在已经排序列表中的索引
            const idx = sortedList.findIndex(
              (item) => item.uniqueId === selectedId
            );
            // 下一个选中的元素id
            setSelectedId(sortedList[Math.max(0, idx - 1)]?.uniqueId!);
          }}
        >
          <LeftOutlined />
        </span>
        <span
          className={classnames("next", {
            disabled:
              selectedId === sortedList[sortedList.length - 1]?.uniqueId,
          })}
          onClick={() => {
            if (selectedId == sortedList[sortedList.length - 1]?.uniqueId) {
              return;
            }
            // 当前选中元素的在已经排序列表中的索引
            const idx = sortedList.findIndex(
              (item) => item.uniqueId === selectedId
            );
            const nextIdx = Math.max(
              0,
              Math.min(sortedList.length - 1, idx + 1)
            );
            // 下一个选中的元素id
            setSelectedId(sortedList[nextIdx]?.uniqueId!);
          }}
        >
          <RightOutlined />
        </span>
        {/* <span className="close" onClick={() => {
            console.log("close");
          }}
        >
          <CloseOutlined />
        </span> */}
        <AlarmCard item={selectedItem} checked />
      </div>
    );
  };
  const renderDrawerContent = () => {
    return (
      <ResultBox loading={loading} nodata={alarmList.length <= 0}>
        <TargetCard item={selectedItem} />
        <div className="total-record">
          <span>
            共<em>{alarmList.length}</em>条信息
          </span>
          <ExportBtn
            total={alarmList.length}
            url={`/v1/monitor/result/detail/export`}
            formData={Object.assign({},
              {
                infoId,
                pageNo: 1,
                pageSize: alarmList.length
              })
            }
          />
          <Select
            value={sort}
            options={[
              {
                value: "desc",
                label: "按告警时间降序",
              },
              {
                value: "asc",
                label: "按告警时间升序",
              },
            ]}
            onChange={() => {
              if (sort == "asc") {
                setSort("desc");
              } else {
                setSort("asc");
              }
              setSelectedId([...sortedList].reverse()[0]?.uniqueId!);
            }}
          />
        </div>
        <main>
          <div className="capture-list">
            {sortedList.map((item, idx) => {
              const index = sort === "desc" ? sortedList.length - idx : idx + 1;
              return (
                <CapatureInfoCard
                  key={item.uniqueId}
                  active={selectedId === item.uniqueId}
                  item={item}
                  index={index}
                  onClick={() => {
                    setSelectedId(item.uniqueId!);
                  }}
                />
              );
            })}
          </div>
        </main>
      </ResultBox>
    );
  };

  const { infoId } = useParams();
  console.log(useParams())

  useEffect(() => {
    services.deploy
      .getAlarmDetail<any, WarningItem[]>({ infoId })
      .then((res) => {
        if (res.data) {
          const temp = res.data.map((w, idx) => {
            return {
              ...w,
              uniqueId: idx + 1,
            };
          });
          setAlarmList(temp ?? []);
          setSelectedId(1);
        }
      })
      .catch((e) => {
        console.log("error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const forceUpdate = useUpdate();
  useEffect(() => {
    forceUpdate();
  }, []);

  return (
    <div className="warning-detail" ref={divRef}>
      <BaseMap {...mapProps}>
        <TileLayer {...tileLayerProps} />
        <Track
          ref={trackRef}
          // key={sort}
          {...trackParams}
          contentCb={trackContentCb}
          // clickIndex={sortedList.findIndex(
          //   (item) => item.uniqueId === selectedId
          // )}
          clickIndex={selectedId as number}
          markerClickCb={(index) => {
            // TODO调整
            console.log("markerClick", index);
            if (isNull(index)) return;
            // console.log("marker", index, trackData);
            // const item = sortedList[index];
            // setSelectedId(item?.uniqueId!);
            setSelectedId(index);
          }}
        />
      </BaseMap>
      {!!divRef.current && (
        <DoubleDrawer
          titles={["布控目标", ""]}
          placement="right"
          visibles={[drawerVisible, false]}
          onChange={toggleDrawer}
          getContainer={() => divRef.current as HTMLDivElement}
          contents={[renderDrawerContent(), null]}
        />
      )}
    </div>
  );
}

export default WarningDetail;
