import { SharedUsersItem } from "@/pages/Analysis/Offline/interface";
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import React from "react";

export interface ClueFormData {
    key?:any;
    id: string | number;
    title: string;
    caseId?: string;
    caseDetails?: string;
    caseTime: string[];
    caseRegionCode?: string[];
    casePlace?: string;
    caseStatus?: number;
    privilege: number;
    privilegeUser: string[];
    // permission:number;//操作权限
    // sharedUsers:SharedUsersItem[],
    place?:string[],
    caseRegionName?:string[]|string
}

export interface GroupItem extends NodeProps {
    key?:any;
    id: string|number;
    // name?: string | JSX.Element;
    title:string|JSX.Element;
    parentId: string;
    __index?: string;
    __level?: number;
}

export interface SearchTreeProps extends NodeProps {
    onSelect:(selectedNodes: NodeInstance[]) => void;
    onclueTreeDataChange?:(data: any[]) => void;
    // changemodelstatus,
    changemodelstatus?:React.Dispatch<React.SetStateAction<boolean>>;
    ismodel?:boolean,
    modelshow? :boolean
    ontreestatus?:(data: boolean) => void
}

export type appendStatusType = {
    isfirst:boolean
    type: 'add' | 'edit'|'Add'|'Edit';
    status: boolean;
    value: any;
    _index: string[];
    inputError: string;
    parentId:string;
  }
  

export interface ClueTreeItem extends NodeProps,ClueFormData {
    title: string;
    children: GroupItem[];
    // children?: ClueTreeItem[];
    __index?: string;
    __level?: number;
}

export interface LocationItem{
    id?:string,
    parentId?: string,
    name?: string,
    level?: string,
    nodes?:LocationItem[],

    value?:string,
    label?:string,
    children?:LocationItem[]
}