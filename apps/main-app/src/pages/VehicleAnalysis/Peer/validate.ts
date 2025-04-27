import { catagoryConfig, SystemCommonConfig } from "@/store/slices/user"
import { regular, validatePlate } from "@/utils"
import { Message } from "@yisa/webui"
import dayjs from 'dayjs'
import { PersonFormDataType, VehicleFormDataType } from "./components/LeftSearchForm/interface"
import { PeerFormDataType } from "./interface"

export const validateFormData = (formData: PeerFormDataType, type: "vehicle" | "face", pageConfig: Record<catagoryConfig, SystemCommonConfig>) => {
  if (type === "vehicle") {
    const { licensePlate, interval, peerSpot, minCount, plateColorTypeId, excludeLicensePlate, beginDate, endDate } = formData as VehicleFormDataType
    if (!validatePlate(licensePlate.trim(), true)) {
      Message.warning("请设置精确车牌号码")
      return false
    }
    if (!interval || !regular.isNum.test(interval.trim())) {
      Message.warning("请设置正确跟车时间")
      return false
    }
    if (interval.trim() === "0") {
      Message.warning("跟车时间不能为0")
      return false
    }
    if (!peerSpot || !regular.isNum.test(peerSpot.trim())) {
      Message.warning("请设置正确同行次数")
      return false
    }
    if (peerSpot.trim() === "0") {
      Message.warning("同行次数不能为0")
      return false
    }
    if (!minCount || !regular.isNum.test(minCount.trim())) {
      Message.warning("请设置正确同行点位")
      return false
    }
    if (minCount.trim() === "0") {
      Message.warning("同行点位不能为0")
      return false
    }
    if (dayjs(endDate).diff(dayjs(beginDate), "day") + 1 > Number(pageConfig?.timeRange?.max)) {
      Message.warning(`时间范围不可以超过${pageConfig?.timeRange?.max || 0}天！`);
      return false
    }
    if (Number(interval) > Number(pageConfig?.interval?.max)) {
      Message.warning(`跟车时间不可以超过${pageConfig?.interval?.max || 0}秒！`);
      return false
    }
    if (Number(peerSpot) > Number(pageConfig?.peerSpot?.max)) {
      Message.warning(`同行次数不可以超过${pageConfig?.peerSpot?.max || 0}次！`);
      return false
    }
    if (Number(minCount) > Number(pageConfig?.minCount?.max)) {
      Message.warning(`同行点位不可以超过${pageConfig?.minCount?.max || 0}个！`);
      return false
    }
    if (excludeLicensePlate.plateColorTypeId === plateColorTypeId && excludeLicensePlate.licensePlate === licensePlate) {
      Message.warning("精确车牌和排除车牌不能相同")
      return false
    }
  } else if (type === "face") {
    const { interval, peerSpot, clusterData, beginDate, endDate } = formData as PersonFormDataType
    if (!clusterData?.length) {
      Message.warning("请设置正确身份信息")
      return false
    }
    if (!interval || !regular.isNum.test(interval.trim())) {
      Message.warning("请设置正确跟随间隔")
      return false
    }
    if (interval.trim() === "0") {
      Message.warning("跟随间隔不能为0")
      return false
    }
    if (!peerSpot || !regular.isNum.test(peerSpot.trim())) {
      Message.warning("请设置正确同行次数")
      return false
    }
    if (peerSpot.trim() === "0") {
      Message.warning("同行次数不能为0")
      return false
    }
    if (dayjs(endDate).diff(dayjs(beginDate), "day") + 1 > Number(pageConfig?.timeRange?.max)) {
      Message.warning(`时间范围不可以超过${pageConfig?.timeRange?.max || 0}天！`)
      return false
    }
    if (Number(interval) > Number(pageConfig?.interval?.max)) {
      Message.warning(`跟随间隔不可以超过${pageConfig?.interval?.max || 0}秒！`)
      return false
    }
    if (Number(peerSpot) > Number(pageConfig?.peerSpot?.max)) {
      Message.warning(`同行次数不可以超过${pageConfig?.peerSpot?.max || 0}次！`)
      return false
    }
  }
  return true
}
