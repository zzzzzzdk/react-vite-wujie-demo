import React from "react";
import Heading from "../../../components/Heading";
import type { DeploymentBlockProps } from "../../interface";
import InfoCellList from "@/pages/Deploy/components/InfoCell";
import "./index.scss";
import dayjs from "dayjs";
import LocationMap from "@/pages/Deploy/DeployDetail/LocationMap";
import {
  BkType,
  BkTypeTextSetting,
  DeployTime,
  DeployTimeTextSetting,
  Measure,
  MeasureTextSetting,
} from "@/pages/Deploy/DeployDetail/interface";
function Index(props: DeploymentBlockProps) {
  const { id, title, deployItem } = props;

  let dateFmt = "";
  let spanFmt: React.ReactNode = "";
  if (deployItem.deployTimeType === DeployTime.Forever) {
    dateFmt = "永久布控";
    spanFmt = "";
  }
  if (deployItem.deployTimeType === DeployTime.Short) {
    if (deployItem.timeRange?.times) {
      const times = deployItem.timeRange.times.map((t) =>
        dayjs(t).format("YYYY/MM/DD HH:mm:ss")
      );
      dateFmt = `${times[0]} - ${times[1]}`;
    }
    if (deployItem.timeRange?.periods) {
      const periods = deployItem.timeRange.periods;
      const dates =
        periods.dates?.map((t) => dayjs(t).format("YYYY/MM/DD")) || [];
      const times = periods.times?.map((t) => t) || [];
      dateFmt = `${dates[0]} - ${dates[1]}`;

      // spans = [[1, 2], [3, 4]...]
      const spans = times.reduce(
        (gaps, t) => {
          if (gaps[gaps.length - 1].length === 2) {
            return [...gaps, [t]];
          } else {
            gaps[gaps.length - 1].push(t);
            return gaps;
          }
        },
        [[]] as string[][]
      ).filter(Boolean);

      spanFmt = (
        <span className="time-spans text">
          {spans.map((span, idx) => {
            return (
              <span key={idx}>
                {/* {!!idx && <br />} */}
                {`${span[0]} - ${span[1]}`}
              </span>
            );
          })}
        </span>
      );
    }
  }

  const cells = [
    {
      title: "布控类型",
      text: BkTypeTextSetting[BkType[deployItem.bkType]].text,
    },
    {
      title: "布控单号",
      text: deployItem.jobId,
    },
    {
      title: "布控时间",
      text: dateFmt,
    },
    {
      title: "布控时段",
      customText: spanFmt,
    },
    {
      title: "布控区域",
      text: !!deployItem.locationIds.length ? `共${deployItem.locationIds.length}个点位` : '全部点位',
    },
    {
      title: "采取措施",
      text: MeasureTextSetting[Measure[deployItem.measure]]?.text,
    },
    {
      title: "布控原因",
      text: deployItem.reason,
    },
  ];
  return (
    <section className="basic-info">
      <Heading level={2} id={id} round>
        {title}
      </Heading>
      <section className="block-main wrapper">
        <InfoCellList className="info" cells={cells} />
        <div className="map">
          <LocationMap locationIds={deployItem.locationIds} />
        </div>
      </section>
    </section>
  );
}

export default Index;
