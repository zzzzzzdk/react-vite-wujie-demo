import { BasicFormDataType } from "@/pages/VehicleAnalysis/Initial/interface"
import { PlateTypeId } from "../FormPlate/interface"

export type MoreFilterFormDataType = Pick<BasicFormDataType, "licensePlate" | "plateColorTypeId" | "noplate" | "brandId" | "modelId" | "yearId" | "vehicleTypeId" | "vehicleFuncId" | "colorTypeId" | "objectTypeId">
  & {
    excludeLicensePlate: {
      licensePlate: string
      plateColorTypeId: PlateTypeId
      noplate: "" | "noplate"
    }
  }

export type MoreFilterType = {
  showLicensePlate?: boolean       // 车牌号码
  showFormVehicleModel?: boolean   // 车辆型号
  showVehicleType?: boolean        // 车辆类别
  showVehicleFunc?: boolean       // 使用性质
  showVehicleColor?: boolean        // 车辆颜色
  showVehicleObjectType?: boolean        // 抓拍角度
  showExcludeLicensePlate?: boolean       // 排除车牌
  onChange?: (data: MoreFilterFormDataType) => void,  // 表单中的所有数据
  labelLeftGap?:number //label左边距
  formData?:MoreFilterFormDataType
}
