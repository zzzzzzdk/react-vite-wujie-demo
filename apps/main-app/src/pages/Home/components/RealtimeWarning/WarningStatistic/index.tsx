import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import Card from "../../Card";
import "./index.scss";
import services from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ResizeObserver from "rc-resize-observer";
import { ResultBox } from "@yisa/webui_business";
import { numberFormat } from "@/utils";

const WarningStatistic: React.FC<{
  counter: {
    personnelCount: number;
    vehicleCount: number;
    imageCount: number;
  };
}> = (props) => {
  const counter = props.counter;
  const { skin } = useSelector((state: RootState) => {
    return state.comment;
  });

  const [isSmall, setIsSmall] = useState(false);

  const option = {
    legend: {
      top: isSmall ? "" : "25%",
      right: isSmall ? 20 : "right",
      textStyle: {
        color: skin !== "dark" ? "black" : "white",
      }
    },
    grid: {
      right: "10%",
    },
    label: {
      show: false,
      position: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["60%", "80%"],
        left: "-20%",
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        itemStyle: {
          //   borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        color: ["#1D509D", "#09A3DC", "#04BFB7"],
        data: [
          {
            value: counter.personnelCount,
            name: `人员布控  (${numberFormat(counter.personnelCount, 1)})`,
          },
          {
            value: counter.vehicleCount,
            name: `车辆布控  (${numberFormat(counter.vehicleCount, 1)})`,
          },
          {
            value: counter.imageCount,
            name: `人脸布控  (${numberFormat(counter.imageCount, 1)})`,
          },
        ].filter((item) => item.value),
      },
    ],
  };

  return (
    <ResizeObserver
      onResize={({ width }) => {
        if (width < 400) {
          setIsSmall(true);
          return;
        }
        setIsSmall(false);
      }}
    >
      <Card
        iconfont="yujingtongji"
        className="warning-statistic"
        title="今日预警统计"
        bodyStyle={{
          position: "relative",
          // transform:
          //   counter.imageCount + counter.personnelCount + counter.vehicleCount === 0
          //     ? "translateX(0px)"
          //     : "translateX(-50px)",
        }}
      >
        <ResultBox
          nodataClass="nodata"
          nodataTip="暂无告警数据"
          loading={false}
          nodata={
            counter.imageCount + counter.personnelCount + counter.vehicleCount === 0
          }
        >
          <div className="warning-statistic-title">
            <div className="text">预警总数</div>
            <div className="count">
              {numberFormat(counter.imageCount +
                counter.personnelCount +
                counter.vehicleCount, 1)}
            </div>
            <div className="cornel">
              <div></div>
              <div></div>
            </div>
          </div>
          <ReactECharts
            style={{
              width: "100%",
              height: "100%",
            }}
            option={option}
          />
        </ResultBox>
      </Card>
    </ResizeObserver>
  );
};
export default WarningStatistic;
