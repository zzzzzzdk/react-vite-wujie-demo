import React, { useLayoutEffect, useRef, useState } from "react";
import { Tag, PopConfirm, Popover, Button, Link } from "@yisa/webui";
import { RawLabelTreeNode } from "@/components/FormLabelSelect";
import classnames from "classnames";
import { sum } from "lodash";
import "./index.scss";
import { labelColorOptions } from "./interface";
function ColorfulLabel(props: {
  label: RawLabelTreeNode;
  ellipsis?: boolean;
  className?: string;
}) {
  const { label, ellipsis = false } = props;
  const prefixCls = "colorful-label";
  const colorOption = labelColorOptions.find((l) => l.value == label.color);

  const params = {
    text: '人员标签(1个)',//写死就行 
    searchType: '1',//精确检索类型
    data: {
      label: [label.id.toString()],//标签id
      profileType: "3",
      age: ["", ""],
      captureCount: ["", ""]
    }
  }
  const queryStr = encodeURIComponent(JSON.stringify(params));

  return (
    <Link
      href={`#/record-list?${queryStr}`}
      target="_blank"
      className={classnames(prefixCls, `${prefixCls}-link`, props.className, {
        [`${prefixCls}-ellipsis`]: ellipsis,
      })}
    >
      <Tag
        title={label.name}
        color={colorOption?.background ?? "#ff5b4d"}
        type={colorOption ? "emphasize" : "weaken"}
      >
        <span
          style={{
            color: colorOption?.color ?? 'none'
          }}
        >{label.name}</span>
      </Tag>
    </Link>
  );
}

export default ColorfulLabel;

const labelGap = 2;
export function ColorfulLabelList(props: {
  labels: RawLabelTreeNode[];
  width?: string;
  center?: boolean;
}) {
  const { labels, width = "100%", center = false } = props;
  const containerRef = useRef<HTMLDivElement>(null!);
  const placeholderRef = useRef<HTMLDivElement>(null!);

  const [firstUnVisible, setFisrtUnVisible] = useState(labels.length);
  const needRenderLabels = labels.slice(0, firstUnVisible);

  const content = labels.slice(firstUnVisible).map((label) => {
    return <ColorfulLabel key={label.id} label={label} ellipsis />;
  });
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();
    const children = [...containerRef.current.children];
    const childrenWidthList = children.map(
      (c) => c.getBoundingClientRect().width
    );
    // 可以全部显示
    if (
      sum(childrenWidthList) + (children.length - 1) * labelGap <=
      containerWidth
    ) {
      return;
    }
    // 不能全部显示
    let remainWidth =
      containerWidth - placeholderRef.current.getBoundingClientRect().width;
    let idx = 0;
    while (remainWidth - labelGap >= 0) {
      remainWidth -= childrenWidthList[idx];
      remainWidth -= labelGap;
      if (remainWidth < 0) break;
      idx++;
    }
    setFisrtUnVisible(Math.max(1, idx));
  }, []);

  const maxEllipsisNum = Math.min(99, labels.length);

  return (
    <div
      ref={containerRef}
      className={classnames("colorful-container", {
        "colorful-container-center": props.center,
      })}
      style={{ width, 
        gap: labelGap, // 80版本以前浏览器flex-gap不兼容，请同步修改css里面的sfp.flex-gap()
      }}
    >
      <>
        {needRenderLabels.map((label, idx) => {
          return (
            <ColorfulLabel
              className={classnames({
                "colorful-label-ellipsis": idx === needRenderLabels.length - 1,
              })}
              key={label.id}
              label={label}
            />
          );
        })}
        {needRenderLabels.length !== labels.length && (
          <Popover
            content={content}
            overlayClassName="colorful-label-popover"
            destroyTooltipOnHide
            trigger={"hover"}
          >
            <Tag className="ellipsis" color="#FF5B4D" type="weaken">
              +{labels.length - needRenderLabels.length}
            </Tag>
          </Popover>
        )}
      </>
      <Tag className="placeholder" ref={placeholderRef}>
        +{maxEllipsisNum}
      </Tag>
    </div>
  );
}
