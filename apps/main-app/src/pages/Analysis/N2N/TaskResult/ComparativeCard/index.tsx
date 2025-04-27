import React from "react";
import {
  Checkbox,
  Image,
  Link,
  Popover,
  Tag,
  Statistic,
  Divider,
} from "@yisa/webui";
import { Icon } from "@yisa/webui/es/Icon";
import { DB, DBType } from "../../interface";
import type { RawTaskResultItem } from "..";
import classnames from "classnames";
import "./index.scss";
import useHandleDbClick from "../../useHandleDbClick";
import { ColorfulLabelList } from "@/pages/Deploy/components/ColorfulLabel";
import { useControllableValue } from "ahooks";
type IconText = {
  iconfont: string;
  text?: string;
  customText?: React.ReactNode;
  onClick?: (...args: any[]) => void;
};
/**
 * @description 带图标的卡片
 * @param props
 */
interface PersonInfoCardProps {
  items: IconText[];
  className?: string;
  wrap?: boolean; // 文字是否换行，默认不换行
}
export const PersonInfoCard = (props: PersonInfoCardProps) => {
  const { items, wrap, className } = props;
  return (
    <div className={classnames("person-info-card", className)}>
      {items.map((item, idx) => {
        return (
          <div key={idx} className="item">
            <Icon type={item.iconfont} />
            {item.customText ? (
              item.customText
            ) : (
              <span
                className={classnames("text", {
                  click: !!item.onClick,
                })}
                title={item.text}
                onClick={item.onClick}
              >
                {item.text || "-"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ComparativeCard = (props: {
  item: RawTaskResultItem;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
  onImgClick: () => void;
}) => {
  const { item, checked, onChecked, onImgClick } = props;

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

  // 跳转详情页
  const handleIdCardClick = (data: any) => {
    window.open(`#/record-detail-person?${encodeURIComponent(JSON.stringify({
      idNumber: data.idNumber === '未知' ? '' : data.idNumber,
      idType: data.idType || '111',
      groupId: data.groupId || [],
      groupPlateId: data.groupPlateId || [],
      key: data.key || '',
      feature: data.feature || ''
    }))}`)
  }

  return (
    <section
      className={classnames("n2n-comparative-card", {
        checked,
      })}
    >
      <Checkbox
        className="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (onChecked) onChecked(e.target.checked);
        }}
      />
      <div className="images">
        <div className="image" onClick={onImgClick}>
          <Image src={item.baseImage} />
          <span>基准库</span>
        </div>
        <div className="image"  onClick={onImgClick}>
          <span>比对库</span>
          <Image src={item.compareImage} />
        </div>
      </div>
      <Divider className="divider" orientation="center" style={{}}>
        <Statistic value={item.similarity} precision={2} suffix="%" />
      </Divider>
      <div className="info">
        <PersonInfoCard
          items={[
            {
              iconfont: "xingming",
              text: item.baseName,
            },
            {
              iconfont: "shenfenzheng",
              text: item.baseIdNumber,
              onClick: () => handleIdCardClick({
                idNumber: item.baseIdNumber,
                idType: item.baseIdType,
                // groupId: item.groupId,
                // groupPlateId: item.groupPlateId,
                // key: item.key,
                // feature: item.feature
              }),
            },
            {
              iconfont: "renyuanku1",
              text: item.baseDbName,
              customText: item.baseDbType === DBType.Label && (
                <ColorfulLabelList labels={baseTags as any} />
              ),
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
              iconfont: "xingming",
              text: item.compareName,
            },
            {
              iconfont: "shenfenzheng",
              text: item.compareIdNumber,
              onClick: () => handleIdCardClick({
                idNumber: item.compareIdNumber,
                idType: item.caseIdType,
                // groupId: item.groupId,
                // groupPlateId: item.groupPlateId,
                // key: item.key,
                // feature: item.feature
              }),
            },
            {
              iconfont: "renyuanku1",
              text: item.compareDbName,
              customText: item.compareDbType === DBType.Label && (
                <ColorfulLabelList labels={compareTags as any} />
              ),
              onClick: () =>
                handleDbClick({
                  id: item.compareDbId,
                  name: item.compareDbName,
                  type: item.compareDbType,
                }),
            },
          ]}
        />
      </div>
    </section>
  );
};
const ComparativeCardList = React.memo(
  (props: {
    items: RawTaskResultItem[];
    value?: (string | number)[];
    onChange?: (selectedIds: (string | number)[]) => void;
    onShowBigImg: (index: number) => void;
  }) => {
    const { items } = props;
    const [selecteIds, setSelectedIds] = useControllableValue<
      (string | number)[]
    >(props, { defaultValue: [] });

    return items.map((t, i) => {
      return (
        <ComparativeCard
          key={t.infoId}
          item={t}
          checked={selecteIds.includes(t.infoId)}
          onChecked={(checked) => {
            const newSelectedIds = checked
              ? [...selecteIds, t.infoId]
              : selecteIds.filter((i) => i !== t.infoId);

            setSelectedIds(newSelectedIds);
          }}
          onImgClick={() => props.onShowBigImg(i)}
        />
      );
    });
  }
);
ComparativeCardList.displayName = "ComparativeCardList";
export default ComparativeCardList;
