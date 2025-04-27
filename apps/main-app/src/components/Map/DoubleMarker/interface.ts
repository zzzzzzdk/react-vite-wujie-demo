// import { ResultRowType } from "@/pages/Search/Target/interface";
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
export interface FootholdVectorProps{
    // scaleZoom?:number,
    // fitBounds?:boolean,
    // vectorData:VectorArr[],
    // contentCb:(elem?: ResultRowType) => JSX.Element,
    // selectindex:number,
    // selected?:boolean
    // __map__:L.Map
    footholdarr:{
        data: {
            lat: string;
            lng: string;
            locationName: string;
        }[];
        type: "foothold" | "doublecar";
    }
    lat:string,
    lng:string
}
export interface Markers{
    lat:number,
    lng:number,
    // text:string
}
export interface VectorArr {
    markers:Markers[],
    type:string,
    // clickindex?:any
}