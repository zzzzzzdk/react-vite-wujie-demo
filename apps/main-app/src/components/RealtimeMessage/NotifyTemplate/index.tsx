import { MessageProtocol, MessageRecord, MessageType } from "../interface";
import { Link, Image, Message, Space, Typography } from "@yisa/webui";
import classnames from "classnames";
import "./index.scss";
import BigImg from "@/components/BigImg";
import { useToggle } from "ahooks";
import { MessageTypeSetting } from "../interface";
type NotifyTemplateProps = {
  item: MessageRecord;
  compact?: boolean;
  onImageClick?:()=>void
};

/**
 * @file 展示消息
 */
const NotifyTemplate: React.FC<NotifyTemplateProps> = (props) => {
  const { item, compact = false, onImageClick } = props;
  const [showBigImage, { toggle: toggleShowBigImage }] = useToggle(false);
  const handleView = () => {
    if (item.link_url) window.open(item.link_url);
    return;
  };

  return (
    <>
      {/* {showBigImage && (
        <BigImg
          showInfoMap={false}
          showRightInfo={false}
          modalProps={{
            visible: showBigImage,
            onCancel: toggleShowBigImage,
          }}
          data={[
            {
              targetImage: item?.image_url,
              bigImage: item?.image_url,
            },
          ]}
        />
      )} */}
      <div
        className={classnames("notify-template", {
          "notify-template--compact": compact,
        })}
        onClick={handleView}
      >
        <div
          className="notify-template__text"
          style={
            {
              // marginTop: compact ? "none" : "1em",
            }
          }
        >
          <Space>
            <span
              className="notify-template__type"
              style={{
                backgroundColor:
                  MessageTypeSetting[item?.type as MessageType]
                    ?.backgroundColor,
              }}
            >
              {MessageTypeSetting[item?.type as MessageType]?.text}
            </span>
            {item.type === "feedback" && (
              <>
                <Space>
                  <span>反馈类型:</span>
                  <span>{item.feedback_message?.feedbackType}</span>
                </Space>
              </>
            )}
          </Space>

          {item?.type === "feedback" ? (
            <div className="notify-template__feedback">
              <p>
                <span>反馈描述:</span>
                {item.feedback_message?.description}
              </p>
              <p>
                <span>回复内容:</span>
                {item.content}
              </p>
            </div>
          ) : (
            <span>{item.content}</span>
          )}
        </div>
        <div className="notify-template__extra">
          {/* 额外信息，图片 链接等 */}
          {!!item.image_url && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleShowBigImage();
                onImageClick?.()
              }}
            >
              <Image src={item.image_url} />
            </span>
          )}
        </div>
        {!compact && (
          <span className="notify-template__time">{item.create_time}</span>
        )}
        {item.type !== "feedback" && (
          <>
            <span
              className={classnames("notify-template__btn", {
                "notify-template__btn--compact": compact,
              })}
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
            >
              <Link>查看</Link>
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default NotifyTemplate;
