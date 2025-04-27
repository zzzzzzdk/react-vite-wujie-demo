import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Tag, PopConfirm, Popover, Button } from "@yisa/webui";
// import { RawLabelTreeNode } from "@/components/FormLabelSelect";
import classnames from "classnames";
import { sum } from "lodash";
import "./index.scss";
import { isString } from "@/utils/is";

export type RawLabelTreeNode = {
  id: string | number;
  name: string;
  color?:number|string
};

export function ColorfulLabel(props: { label: string; className?: string,idc?:string|number }) {
  const { label,idc} = props;
  return (
    <span
      className={classnames(`colorful-label1 label-item-${idc||1}`, props.className)}
      // color="#FF5B4D"
      // type="weaken"
      title={label}
    >
      {label}
    </span>
  );
}


// export default ColorfulLabel;


const labelGap = 2;
export default function ColorfulLabelList(props: {
  labels: RawLabelTreeNode[];
  width?: string;
}) {
  const { labels, width = "100%" } = props;
  const containerRef = useRef<HTMLDivElement>(null!);
  const placeholderRef = useRef<HTMLDivElement>(null!);



  const [suitable, setSuitable] = useState(false);
  const [firstUnVisible, setFisrtUnVisible] = useState(labels.length);
  const needRenderLabels = labels.slice(0, firstUnVisible);
  //   function isClueTreeItem(arr: string[] | RawLabelTreeNode[]): arr is RawLabelTreeNode[] {
  //     return
  // }
  const content = useMemo(() => {
    return labels.slice(firstUnVisible).map((label, idx) => {
      if (isString(label))
        return <ColorfulLabel key={idx} label={label} idc={label.color}/>;
      else
        return <ColorfulLabel key={idx} label={label.name} idc={label.color} />;
    });
  }, [firstUnVisible, labels])

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();
    const children = [...containerRef.current.children];
    const childrenWidthList = children.map(
      (c) => c.getBoundingClientRect().width
    );
    console.log("ok");
    // 可以全部显示
    if (
      sum(childrenWidthList) + (children.length - 1) * labelGap <=
      containerWidth
    ) {
      // setSuitable(true);
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


  }, [labels.length]);


  const maxEllipsisNum = Math.min(99, labels.length);


  return (
    <div
      ref={containerRef}
      className={classnames("colorful-container1 label-item", {
        // "colorful-container-center": suitable,
      })}
      style={{ width }}
    >
      <>
        {needRenderLabels.map((label, idx) => {
          return (
            <ColorfulLabel
              className={classnames({
                "colorful-label-ellipsis": (idx === needRenderLabels.length - 1),
              })}
              key={idx}
              label={(isString(label)) ? label : label.name}
              idc={label.color}
            />
          );
        })}

        {needRenderLabels.length !== labels.length && (
          <Popover content={content} overlayClassName={'popover-card label-item'} destroyTooltipOnHide autoAdjustOverflow placement='topLeft'>
            <span className="ellipsis label-item more">
              +{labels.length - needRenderLabels.length}
            </span>
          </Popover>

        )}
      </>
      <span className="placeholder" ref={placeholderRef}>
        +{maxEllipsisNum}
      </span>
    </div>
  );
}
