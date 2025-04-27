import { ResultRowType } from "@/pages/Search/Target/interface";
import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import React, { ReactNode } from "react";
// export interface AddModelProps {
//     visible:boolean,
//     onCancel:() => void,
//     onOk:(e?: MouseEvent) => Promise<any> | void,
//     formdata:ClueFormData,
//     setFormdata:React.Dispatch<React.SetStateAction<ClueFormData>>,
//     title:ReactNode,
//     statusoptions:{
//         label: string;
//         value: number;
//     }[],
//     options:any[],
//     // options2:any[]
// }
export interface VectorProps{
    scaleZoom?:number,
    fitBounds?:boolean,
    vectorData:VectorArr[],
    contentCb:(elem: VectorContentCbType) => JSX.Element,
    selectindex:number,
    selected?:boolean
    // __map__:L.Map
}
export interface VectorContentCbType{
    text:string,
    targetImage:string,
    captureTime:string,
    infoId:string
}
export interface Markers extends VectorContentCbType{
    lat:number,
    lng:number,
//     text:string,
//     targetImage:string,
//     captureTime:string
}
export interface VectorArr {
    markers:Markers[],
    type:string,
    clickindex?:any
}