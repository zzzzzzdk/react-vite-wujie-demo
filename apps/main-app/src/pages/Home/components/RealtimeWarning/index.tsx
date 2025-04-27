import { WarningItem } from "@/pages/Deploy/DeployWarning/interface";
import Card from "../Card";
import WarningStatistic from "./WarningStatistic";
import { useEffect, useRef, useState } from "react";
import services from "@/services";
import { WarningCard } from "./WarningCard";
import { getToken } from "@/utils";
import { useHover, useInterval, useWebSocket } from "ahooks";
import "./index.scss";
import ImgResize from "@/components/ImgResize";
import { ResultBox } from "@yisa/webui_business";
import { uniqueId } from "lodash";
import { BigImg } from "@/components";
import { ResultRowType } from "@/pages/Search/Target/interface";
const REMOTE_URL = window.YISACONF.homepageWsUrl || "ws://localhost:3004/ws";

type WarningHistory = {
  alarmCount?: {
    personnelCount: number;
    vehicleCount: number;
    imageCount: number;
  };
  alarmInfo?: WarningItem[];
};

const RealtimeWarning: React.FC = () => {

  // const [topA, setTopA] = useState(0)  // 位移的距离
  // const [transition, setTransition] = useState(1)  //位移动画

  useWebSocket(`${REMOTE_URL}?token=${getToken()}`, {
    reconnectLimit: 3,
    onMessage(message) {
      if (!message.data) {
        console.log("格式错误");
      }
      let data: any = {};
      try {
        data =
          typeof message.data === "string"
            ? JSON.parse(message.data)
            : (message.data as WarningHistory);
      } catch (error) {
        console.error("实时消息格式错误");
      }
      if (data.alarmCount) {
        setCounter(data.alarmCount);
      }
      if (data.alarmInfo && Array.isArray(data.alarmInfo)) {
        // if (!hovering) {
        //   setTopA(data.alarmInfo.length)
        //   setTransition(0)
        // }

        setBuffer((previous) => {
          // 显示10条信息
          const newWarningList = [
            ...data.alarmInfo.map((a: WarningItem) => {
              return {
                ...a,
                // 生成一个id
                uniqueId: uniqueId("@warning-item@"),
              };
            }),
            ...previous,
          ].slice(0, 10);
          return newWarningList;
        });
      }
    },
  });
  /* 卡片数据 */
  // 缓冲
  const [buffer, setBuffer] = useState<WarningItem[]>([]);
  // 展示的数据，TODO:改成计算属性或者ref
  const [warningItems, setWarningItems] = useState<WarningItem[]>([]);

  /* 统计数据 */
  const [counter, setCounter] = useState<
    NonNullable<WarningHistory["alarmCount"]>
  >({
    vehicleCount: 0,
    imageCount: 0,
    personnelCount: 0,
  });

  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  const [currentData, setCurrentData] = useState<WarningItem[]>([])

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  // 点击卡片
  const handleClick = (link: string, item?: WarningItem) => {
    // window.open(link);
    if (item) {
      setCurrentData([item])
      setBigImgModal({
        visible: true,
        currentIndex: 0
      })
    }
  };

  const ref = useRef<HTMLDivElement | null>(null);
  const hovering = useHover(ref);
  useEffect(() => {
    // 当悬浮在布控告警区域，数据不再同步
    if (hovering) return;
    // 将buffer同步
    setWarningItems(buffer);
    // setTimeout(() => {
    //   setTopA(0)
    //   setTransition(1)
    // }, 0);
  }, [hovering, buffer]);

  return (
    <>
      <Card
        iconfont="bukonggaojing1"
        title="布控告警"
        showMore
        onClickMore={() => {
          window.open("#/deploy-warning")
        }
        }
      >
        <ResultBox
          loading={false}
          nodata={warningItems.length <= 0}
          nodataTip="暂无告警数据"
        >
          <div
            ref={ref}
          // style={{ transform: `translateY(-${topA * 160}px)`, transition: `${transition}s ease` }}
          >
            {warningItems.map((item, idx) => (
              <WarningCard
                key={item.uniqueId ?? idx}
                item={item}
                onClick={() => {
                  handleClick(`#/warning-detail/${item.infoId}`, item);
                }}
              />
            ))}
          </div>
        </ResultBox>
      </Card>
      <WarningStatistic counter={counter} />

      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: handleCloseBigImg
        }}
        currentIndex={bigImgModal.currentIndex}
        // onIndexChange={(index) => {
        //   setBigImgModal({
        //     visible: true,
        //     currentIndex: index
        //   })
        // }}
        data={currentData}
      />
    </>
  );
};
export default RealtimeWarning;
