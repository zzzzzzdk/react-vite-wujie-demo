import { Space } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import "./index.scss";
import arrowImg from "./arrow.png";
import classnames from "classnames";
import React from "react";
type CardProps = React.PropsWithChildren<{
  header?: React.ReactNode;
  title?: string;
  showMore?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  onClickMore?: () => void;
  iconfont?: string;
  arrorwIcon?: boolean;
}> &
  object;
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    children,
    header,
    className,
    style,
    title,
    showMore = false,
    bodyStyle,
    onClickMore,
    iconfont = "xingming",
    arrorwIcon = false,
  } = props;

  const handleClickMore = () => {
    onClickMore && onClickMore();
  };
  const renderDefaultHeader = () => (
    <div className={classnames("homepage-card-header")}>
      <Space>
        {arrorwIcon ? (
          <img
            alt=""
            style={{
              width: "40px",
              height: "40px",
            }}
            src={arrowImg}
          />
        ) : (
          <Icon key="1" className="homepage-card-icon" type={iconfont} />
        )}
        <span key="2" className="homepage-card-title">
          {title}
        </span>
      </Space>
      {showMore && (
        <span className="homepage-card-more" onClick={handleClickMore}>
          查看更多
        </span>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className={classnames("homepage-card", className)}
      style={style}
    >
      {props.hasOwnProperty("header") ? header : renderDefaultHeader()}
      <div className="homepage-card-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
});

export default Card;
