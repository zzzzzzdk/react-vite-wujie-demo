import React from "react";
import { useLayoutEffect, useRef } from "react";
import { Link, Popover, Tag, Statistic, Divider } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { DB, DBType } from "../interface";
import type { RawTaskResultItem } from "../TaskResult";
import classnames from "classnames";
import "./index.scss";
import useHandleDbClick from "../useHandleDbClick";
type InfoCardProps = {
  name: string;
  idCard: string;
  tags: DB[];
};
// 标签间隔
const GAP = 8;
const InfoCard = (props: InfoCardProps) => {
  const { name, idCard, tags } = props;
  const tagsContainerRef = useRef<HTMLDivElement>(null!);
  useLayoutEffect(() => {
    const container = tagsContainerRef.current;
    if (!container) return;
    const { width } = getComputedStyle(container);
    const containerWidth = Number(width.slice(0, -2));
    const children = [...container.children];
    const childrenWidth = children.map((child) =>
      Number(getComputedStyle(child).width.slice(0, -2))
    );

    let len = 0;
    childrenWidth.forEach((w, idx) => {
      len += w;
      if (len > containerWidth) {
        const child = children[idx];
        if (idx === 0) {
          const span = child.querySelector("span");
          if (span) {
            span.style.width = `${containerWidth - 10}px`;
          }
        } else {
          (child as HTMLDivElement).style.display = "none";
        }
      }
      len += GAP;
    });
  });
  const handleDbClick = useHandleDbClick();
  // 是否为离线数据
  const isOffline = [DBType.OfflineFile, DBType.OfflineTask].includes(
    tags[0]?.type
  );
  return (
    <div className="info-card">
      <div className="name">
        <Icon type="xingming" />
        {name || "-"}
      </div>
      <div className="id">
        <Icon type="shenfenzheng" />
        <span className="id-num">{idCard || "-"}</span>
      </div>
      <div className="tag-wrapper">
        <Icon type="renyuanku1" />

        {isOffline && (
          <span
            title={tags[0]?.name}
            className="db"
            onClick={() => {
              handleDbClick(tags[0]);
            }}
          >
            {tags[0]?.name}
          </span>
        )}
        {!isOffline && (
          <Popover
            placement="bottomRight"
            content={
              <div className="info-card-popover-tags">
                {tags.length === 0
                  ? "-"
                  : tags.map((tag) => (
                      <Tag
                        key={tag.id}
                        onClick={() => handleDbClick(tag)}
                        color="#FF5B4D"
                        type="weaken"
                      >
                        {tag.name}
                      </Tag>
                    ))}
              </div>
            }
          >
            <div className="tags" ref={tagsContainerRef}>
              {tags.map((tag) => (
                <Tag
                  key={tag.id}
                  onClick={() => handleDbClick(tag)}
                  color="#FF5B4D"
                  type="weaken"
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tag.name}
                  </span>
                </Tag>
              ))}
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
};

/**
 * @description 带图标的卡片
 * @param props
 */
interface PersonInfoCardProps {
  items: {
    icontfont: string;
    text: string;
    onClick?: (...args: any[]) => void;
  }[];
  className?: string;
  wrap?: boolean; // 文字是否换行，默认不换行
}
export const PersonInfoCard = (props: PersonInfoCardProps) => {
  const { items, wrap, className } = props;
  return (
    <div className={classnames("person-info-card", className)}>
      {items.map((item, idx) => {
        const { icontfont, text, onClick } = item;
        // 文本长度大于零并且给了回调函数时可点击
        const clickable = text.length && onClick;
        return (
          <div
            key={idx}
            className={classnames("item", {
              click: clickable,
            })}
            title={text}
            onClick={clickable ? onClick : undefined}
          >
            <Icon className="icon" type={icontfont} />
            <span
              className={classnames("text", {
                "text-wrap": wrap,
              })}
            >
              {text || "-"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ComparativeCard = (props: { item: RawTaskResultItem }) => {
  const { item } = props;

  const baseTags: DB[] = item.baseExtraDbId.map((id, idx) => {
    return {
      id,
      name: item.baseExtraDbName[idx],
      type: item.baseDbType,
    };
  });

  // 对后端的数据进行转换
  baseTags.unshift({
    id: item.baseDbId,
    name: item.baseDbName,
    type: item.baseDbType,
  });

  const compareTags: DB[] = item.compareExtraDbId.map((id, idx) => {
    return {
      id,
      name: item.compareExtraDbName[idx],
      type: item.compareDbType,
    };
  });

  compareTags.unshift({
    id: item.compareDbId,
    name: item.compareDbName,
    type: item.compareDbType,
  });
  const handleDbClick = useHandleDbClick();
  return (
    <section className="n2n-comparative-card">
      <div className="images">
        <div className="image">
          <img src={item.baseImage} />
          <span>基准库</span>
        </div>
        <div className="image">
          <span>比对库</span>
          <img src={item.compareImage} />
        </div>
      </div>
      <Divider className="divider" orientation="center" style={{}}>
        <Statistic value={item.similarity} precision={2} suffix="%" />
      </Divider>
      <div className="info">
        <PersonInfoCard
          items={[
            {
              icontfont: "xingming",
              text: item.baseName,
            },
            {
              icontfont: "shenfenzheng",
              text: item.baseIdNumber,
              onClick() {},
            },
            {
              icontfont: "renyuanku1",
              text: item.baseDbName,
              onClick: () =>
                handleDbClick({
                  id: item.baseDbId,
                  name: item.baseDbName,
                  type: item.baseDbType,
                }),
            },
          ]}
        />
        <PersonInfoCard
          items={[
            {
              icontfont: "xingming",
              text: item.compareName,
            },
            {
              icontfont: "shenfenzheng",
              text: item.compareIdNumber,
              onClick() {},
            },
            {
              icontfont: "renyuanku1",
              text: item.compareDbName,
              onClick: () =>
                handleDbClick({
                  id: item.compareDbId,
                  name: item.compareDbName,
                  type: item.compareDbType,
                }),
            },
          ]}
        />
        {/* <InfoCard
          name={item.baseName}
          idCard={item.baseIdNumber}
          tags={baseTags}
        />
        <InfoCard
          name={item.compareName}
          idCard={item.compareIdNumber}
          tags={compareTags}
        /> */}
      </div>
    </section>
  );
};
const ComparativeCardList = React.memo(
  (props: { items: RawTaskResultItem[] }) => {
    const { items } = props;

    return items.map((t) => {
      return <ComparativeCard key={t.infoId} item={t} />;
    });
  }
);

export default ComparativeCardList;
