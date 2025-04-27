import React from "react";
import {TooltipPlacement} from '@yisa/webui/es/Tooltip'
import { ResultRowType } from "@/pages/Search/Target/interface";

export type LinkType = {
  // 单项类名
  className?: string;

  // 是否是点击触发
  isClick?: boolean;

  // 跳转链接
  link?: string;
  // 文字描述
  text?: string;
  // 系统名称
  sysText?: string;
  // more更多链接
  children?: LinkType[];
  disabled?: boolean;
}

export interface FooterLinksProps {
  className?: string;
  style?: React.CSSProperties;
  // 更多链接，单个点击事件回调
  eleClick?: (childElem: LinkType, cardData: ResultRowType) => void;
  cardData?: ResultRowType;
}

export interface FooterLinksMoreProps {
  className?: string;
  style?: React.CSSProperties;
  // 卡片数据
  cardData?: any;
  // 点击回调
  eleClick?: (childElem: LinkType, cardData: any) => void;
  // popover位置
  placement?: TooltipPlacement;
  moreData?: LinkType[];
  // 触发按钮渲染
  triggerRender?: () => React.ReactNode;
}
