import { Timeline } from "@yisa/webui";
import NotifyTemplate from "../../NotifyTemplate";
import { MessageRecord } from "../../interface";
import BigImg from "@/components/BigImg";
import "./index.scss";
import { useState } from "react";
import { ResultRowType } from "@/pages/Search/Target/interface";
const HistoryStack: React.FC<{
  visible: boolean;
  recordList: MessageRecord[];
}> = (props) => {
  const { recordList } = props;
  const [item, setSelected] = useState<MessageRecord | null>(null);
  const [showBigImage, setShowBigImage] = useState(false);

  return (
    <>
      <BigImg
        // showInfoMap={false}
        // showRightInfo={false}
        modalProps={{
          visible: showBigImage,
          maskStyle: {zIndex: 2024},
          onCancel: () => {
            setShowBigImage(false);
            // setSelected(null);
          },
        }}
        currentIndex={0}
        data={[
          {
            // targetImage: item?.image_url,
            // bigImage: item?.image_url,
            ...(item || {}),
          },
        ]}
        wrapClassName={"notify-big-img"}
      />
      <Timeline className="message-stack">
        {recordList.map((record, index) => {
          return (
            <Timeline.Item
              // 注意：这里的id目前是前端生成的
              key={record.id ?? index}
              dotType="solid"
              lineType="dashed"
              lineColor="var(--base-color1-10)"
              labelPosition="same"
            >
              <NotifyTemplate
                item={record}
                onImageClick={() => {
                  setShowBigImage(true);
                  setSelected(record);
                }}
              />
            </Timeline.Item>
          );
        })}
      </Timeline>
    </>
  );
};
export default HistoryStack;
