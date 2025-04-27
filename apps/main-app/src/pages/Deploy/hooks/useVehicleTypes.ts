import featureData from "@/config/feature.json";
const vehicleTypes = featureData["car"]["vehicleTypeId"]["value"];
/**
 *
 * @returns  返回所有车辆型号
 */
function useVehicleTypes() {
  return vehicleTypes;
}
export default useVehicleTypes;
