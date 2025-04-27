import { PlateTypeId } from "@/components/FormPlate/interface";
import { raw } from "express";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * @description 解析车辆跳转参数
 */
type VehilceSearchParams = {
  // 车辆跳转相关
  plateColorTypeId: PlateTypeId; // 车辆颜色
  licensePlate: string; // 单车牌
  brandId: string; // 品牌: 长安 比亚迪
  modelId: string[]; // 型号: X1 X2
  yearId: string[]; // 年份: 2023
  vehicleTypeId: number; // 越野车 轿车
};

const useVehicleSearchParams = () => {
  const [searchParams, _] = useSearchParams();
  // 车辆相关
  const rawLicensePlate = searchParams.get("licensePlate");
  const rawPlateColor = searchParams.get("plateColorTypeId");
  const rawBrandId = searchParams.get("brandId");
  const rawModelId = searchParams.get("modelId");
  const rawYearId = searchParams.get("yearId");
  const rawVechicleTypeId = searchParams.get("vehicleTypeId");

  return useMemo(() => {
    const query: VehilceSearchParams = {
      plateColorTypeId: 5,
      licensePlate: "",
      brandId: "",
      modelId: [],
      yearId: [],
      vehicleTypeId: -1,
    };

    query.licensePlate = rawLicensePlate ?? "";

    if (rawPlateColor) {
      const plateColorId = Number(rawPlateColor) as PlateTypeId;
      query.plateColorTypeId = Number.isNaN(plateColorId) ? 5 : plateColorId;
    }

    if (rawVechicleTypeId) {
      const typeId = Number(rawVechicleTypeId);
      query.vehicleTypeId = Number.isNaN(typeId) ? -1 : typeId;
    }

    if (rawBrandId) {
      query.brandId = rawBrandId;
      try {
        if (rawModelId) {
          query.modelId = JSON.parse(rawModelId);
        }
      } catch (error) {
        console.error("model需要字符串数组");
      }

      try {
        if (rawYearId) {
          query.yearId = JSON.parse(rawYearId);
        }
      } catch (error) {
        console.error("yearId需要字符串数组");
      }
    }
    return query;
  }, [searchParams]);
};
export default useVehicleSearchParams;
