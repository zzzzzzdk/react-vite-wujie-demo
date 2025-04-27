import { ResultRowType } from "@/pages/Search/Target/interface";

export interface ErrorSubmitPropsType{
    carryData:ResultRowType,
    modalVisible:boolean,
    errorTypes?:{
        value:string,
        label:string
    }[],
    onOk:()=>void,
    onCancel:()=>void
}