import { ResultRowType } from "@/pages/Search/Target/interface";
import { NodeProps } from "@yisa/webui/es/Tree/interface";
import React from "react";

export interface clueDetails extends ResultRowType {
    // sysModel:string//模块名称
}
export interface JoinClueProps extends NodeProps {
    visible?: boolean;//显示 隐藏
    // clueDetails:clueDetails[];
    clueDetails: ResultRowType[];
    onOk?: () => void;
    onCancel?: () => void;
    isbutton?: boolean; //是否只是按钮
    cardData?: any;
}
