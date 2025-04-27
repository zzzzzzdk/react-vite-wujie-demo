import {NodeProps,NodeInstance} from "@yisa/webui/es/Tree/interface";
import React from "react";
import { ResultRowType } from "../Search/Target/interface";

export interface CardDataItem extends ResultRowType{
    id:number,
    caseId:number,
    createTime: string,
    userUuid: string,
    userName: string,
    organizationUuid: string,
    organizationName:string,
    sysModel: string,
}

export interface LeftTreeProps{
    prefixCls:string,
    onSelect:(selectedNodes: NodeInstance[]) => void;
}

export interface SearchCondition{
  caseId:string,
  targetType:string,
  pageNo:number,
  pageSize:number
}