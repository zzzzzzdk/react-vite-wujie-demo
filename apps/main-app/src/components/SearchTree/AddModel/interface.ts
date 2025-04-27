import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import React, { ReactNode } from "react";
import {ClueFormData} from '../interface'
export interface AddModelProps {
    visible:boolean,
    onCancel:() => void,
    onOk:(e?: MouseEvent) => Promise<any> | void,
    formdata:ClueFormData,
    setFormdata:React.Dispatch<React.SetStateAction<ClueFormData>>,
    title:ReactNode,
    statusoptions:{
        label: string;
        value: number;
    }[],
    options:any[],
    // options2:any[]
}
