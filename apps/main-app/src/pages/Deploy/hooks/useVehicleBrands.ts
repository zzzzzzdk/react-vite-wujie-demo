import services from "@/services";
import { useEffect, useState } from "react";
/**
 *
 * @returns 返回所有车辆品牌
 */
function useVehicleBrands() {
  const [vehicleBrands, setBrand] = useState<{
    [index: number | string]: { k: number; v: string };
  }>({});
  /* 获取车辆品牌 */
  useEffect(() => {
    services.getBMY().then((res) => {
      let { brand, model, year } = res.data as any;
      setBrand(brand);
    });
  }, []);
  return vehicleBrands;
}
export default useVehicleBrands;
