import React, { useState, useId } from "react";
import { Checkbox, Image } from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { PersonInfoCard } from "@/pages/Analysis/N2N/TaskResult/ComparativeCard";
import classnames from "classnames";
import type { Profile } from "../useIdentityForm";
import "./index.scss";
import { TargetFeatureItem } from "@/config/CommonType";
import { useEditableContext } from "../../EditableProvider";
/**
 *
 * @description 布控人像
 */

export interface PersonProfileProps {
  profile: Profile;
  selected?: TargetFeatureItem[];
  onSelectedChange?: (selected: TargetFeatureItem[]) => void;
  onDelete?: () => void;
}
function PersonProfile(props: PersonProfileProps) {
  const {
    profile,
    selected: externalSelected,
    onSelectedChange,
    onDelete,
  } = props;
  const editable = useEditableContext();

  const profileImgs = profile.featureList || [];
  // 是否展示所有图片
  const [showAll, setShowAll] = useState(false);
  const [internalSelected, setInternalSelected] = useState<TargetFeatureItem[]>(
    []
  );
  const selected = externalSelected ?? internalSelected;
  // 展示几张图片,默认四张
  let displayItems: (TargetFeatureItem & { isPlaceholder?: boolean })[] =
    showAll ? profileImgs : profileImgs.slice(0, 4);
  // 当没有图片时后，显示一张占位符
  if (displayItems.length <= 0) {
    displayItems = [
      {
        isPlaceholder: true, // 表示这是一张占位符
        targetType: "face",
        feature: "",
        targetImage: "",
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
    ];
  }

  return (
    <div className="deploy-profile">
      <PersonInfoCard
        className="profile"
        items={[
          {
            iconfont: "xingming",
            text: profile.personName || "-",
          },
          {
            iconfont: "shenfenzheng",
            text: profile.license || "-",
            onClick() {
              console.log("click id number");
            },
          },
          // {
          //   iconfont: "renyuanku1",
          //   text: (profile.tags || []).join("、"),
          // },
        ]}
      />
      {displayItems.map((item, idx) => (
        <div
          className="img-container"
          key={item.infoId}
          onClick={() => {
            const checked = selected.find((f) => f.infoId === item.infoId);
            const newSelected = checked
              ? selected.filter((s) => s.infoId !== item.infoId)
              : [...selected, item];
            setInternalSelected(newSelected);
            onSelectedChange?.(newSelected);
            console.log(newSelected);
          }}
        >
          {idx === 0 && editable && (
            <span
              className="delete"
              onClick={(e: React.MouseEvent) => {
                onDelete?.();
                e.stopPropagation();
              }}
            >
              <Icon type="lajitong" />
            </span>
          )}
          <Checkbox
            className="checkbox"
            /* TODO 确定infoID类型 */
            disabled={item.isPlaceholder || !editable}
            checked={selected.map((s) => s.infoId).includes(item.infoId)}
          />
          <Image src={item.targetImage} />
        </div>
      ))}
      {profileImgs.length > 4 && (
        <span
          className={classnames("load", {
            "load-more": !showAll,
            "load-less": showAll,
          })}
          onClick={() => setShowAll((show) => !show)}
        >
          {showAll ? "收起" : "展开更多"}
        </span>
      )}
    </div>
  );
}

export default PersonProfile;
