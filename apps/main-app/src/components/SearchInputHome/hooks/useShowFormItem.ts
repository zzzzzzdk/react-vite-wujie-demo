//所有的表单项
const permanentPopulation = ["personName", "idcard", "personTags", "tel", "domicileAddress", "address", "age"]
const allSearchInputFormItem = {
  permanentPopulation,
  captureGroup: [...permanentPopulation, "captureFace"],
  driverGroup: [...permanentPopulation, "driverFace"],
  vehicleRecord: ["plateNumber", "ownerName", "ownerIdcard"],
}
//展示哪些表单项
export default function useShowFormItem(type = "permanentPopulation"): string[] {
  return allSearchInputFormItem[type]
}
