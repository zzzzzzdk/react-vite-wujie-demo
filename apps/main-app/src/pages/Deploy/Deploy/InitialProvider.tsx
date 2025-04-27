import { PlateColorTypeId, TargetFeatureItem } from "@/config/CommonType";
import React, { useContext, useMemo, useState } from "react";
import { AddDeployModalType } from "./AddDeployModal";
import { useSearchParams } from "react-router-dom";
import { TargetType2Anything } from "./AddDeployModal/usePictureForm";
export type Initial = {
  labelType: "1" | "2" | undefined; // 1: 人员 2：车辆
  labelList: string[];
  featureList: TargetFeatureItem[];
  thresholds?: TargetType2Anything<number>;
  bigImage: string;
  activeModal?: AddDeployModalType | undefined;
  plateColorTypeId: PlateColorTypeId;
  licensePlate: string; // 单车牌
  brandId: string; // 品牌: 长安 比亚迪
  modelId: string[]; // 型号: X1 X2
  yearId: string[]; // 年份: 2023
  vehicleTypeId: number; // 越野车 轿车
};
const InitialContext = React.createContext<{ value: Initial, updateInitial: (data: Initial) => void }>({
  value: {
    activeModal: undefined,
    labelType: undefined,
    labelList: [],
    featureList: [],
    thresholds: {},
    bigImage: "",
    // 车辆跳转相关
    plateColorTypeId: 5,
    licensePlate: "",
    brandId: "",
    modelId: [],
    yearId: [],
    vehicleTypeId: -1, // 默认不限制
  },
  updateInitial: () => { }
});

export function useInitialContext() {
  return useContext(InitialContext);
}

export default function InitialProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  /* ===========================处理跳转数据=============================== */
  const [searchParams, _] = useSearchParams();
  // 标签相关
  const rawLabelList = searchParams.get("labelList");
  const rawLabelType = searchParams.get("labelType");
  // 图片相关
  const rawBigImage = searchParams.get("bigImage");
  const rawFeatureList = searchParams.get("featureList");
  // 车辆相关
  const rawLicensePlate = searchParams.get("licensePlate");
  const rawPlateColor = searchParams.get("plateColorTypeId");
  const rawBrandId = searchParams.get("brandId");
  const rawModelId = Array.isArray(searchParams.get("modelId")) ? searchParams.get("modelId") : searchParams.get("modelId")?.split(",");
  const rawYearId = Array.isArray(searchParams.get("yearId")) ? searchParams.get("yearId") : searchParams.get("yearId")?.split(",");
  const rawVechicleTypeId = searchParams.get("vehicleTypeId");

  // const initial = useMemo<Initial>(() => {
  //   let temp: Initial = {
  //     bigImage: "",
  //     featureList: [],
  //     labelList: [],
  //     labelType: undefined,
  //     activeModal: undefined,
  //     plateColorTypeId: -1,
  //     licensePlate: "",
  //     brandId: "",
  //     modelId: [],
  //     yearId: [],
  //     vehicleTypeId: -1,
  //   };
  //   /* 解析大图 */
  //   if (rawBigImage) {
  //     temp.bigImage = decodeURIComponent(rawBigImage);
  //     return { ...temp, activeModal: "Picture" };
  //   }
  //   /* 解析特征列表 */
  //   if (rawFeatureList) {
  //     let feature = [];
  //     try {
  //       feature = JSON.parse(decodeURIComponent(rawFeatureList));
  //       if (!Array.isArray(feature)) {
  //         throw new Error("featureList需要Array");
  //       }
  //     } catch (error) {
  //       console.log("featureList解析错误", error);
  //     }
  //     temp.featureList = feature;
  //     return { ...temp, activeModal: "Picture" };
  //   }
  //   /* 解析标签 */
  //   if (rawLabelType) {
  //     temp.labelType = rawLabelType as "1" | "2";
  //     try {
  //       if (Array.isArray(JSON.parse(rawLabelList || ""))) {
  //         temp.labelList = (JSON.parse(rawLabelList || "") as string[]).map(
  //           String
  //         );
  //       } else throw new Error("labelList需要传递数组");
  //     } catch (error) {
  //       console.error("labelList解析错误", error);
  //       return { ...temp, activeModal: undefined };
  //     }
  //     /* 以下控制弹窗 */
  //     if (rawLabelType === "2") {
  //       return { ...temp, activeModal: "Vehicle" };
  //     }
  //     if (rawLabelType === "1") {
  //       return { ...temp, activeModal: "Picture" };
  //     }
  //   }
  //   /* 解析车辆相关 */
  //   if (rawLicensePlate || rawVechicleTypeId || rawBrandId) {
  //     if (rawLicensePlate) {
  //       temp.licensePlate = rawLicensePlate ?? "";
  //       const colorId = Number(rawPlateColor) as PlateColorTypeId;
  //       temp.plateColorTypeId = Number.isNaN(colorId) ? -1 : colorId;
  //     }
  //     if (rawVechicleTypeId) {
  //       const typeId = Number(rawVechicleTypeId);
  //       temp.vehicleTypeId = Number.isNaN(typeId) ? -1 : typeId;
  //     }
  //     if (rawBrandId) {
  //       temp.brandId = rawBrandId;
  //       try {
  //         if (rawModelId) {
  //           temp.modelId = rawModelId as string[];
  //         }
  //         if (rawYearId) {
  //           temp.yearId = rawYearId as string[];
  //         }
  //       } catch (error) {
  //         console.error("modelId yearId需要字符串数组");
  //       }
  //     }
  //     return {
  //       ...temp,
  //       activeModal: "Vehicle",
  //     };
  //   }
  //   return temp;
  // }, []);

  const [initial, setInitial] = useState<Initial>(() => {
    let temp: Initial = {
      bigImage: "",
      featureList: [],
      labelList: [],
      labelType: undefined,
      activeModal: undefined,
      plateColorTypeId: 5,
      licensePlate: "",
      brandId: "",
      modelId: [],
      yearId: [],
      vehicleTypeId: -1,
    };
    /* 解析大图 */
    if (rawBigImage) {
      temp.bigImage = decodeURIComponent(rawBigImage);
      return { ...temp, activeModal: "Picture" };
    }
    /* 解析特征列表 */
    if (rawFeatureList) {
      let feature = [];
      try {
        feature = JSON.parse(decodeURIComponent(rawFeatureList));
        if (!Array.isArray(feature)) {
          throw new Error("featureList需要Array");
        }
      } catch (error) {
        console.log("featureList解析错误", error);
      }
      temp.featureList = feature;
      return { ...temp, activeModal: "Picture" };
    }
    /* 解析标签 */
    if (rawLabelType) {
      temp.labelType = rawLabelType as "1" | "2";
      try {
        if (Array.isArray(JSON.parse(rawLabelList || ""))) {
          temp.labelList = (JSON.parse(rawLabelList || "") as string[]).map(
            String
          );
        } else throw new Error("labelList需要传递数组");
      } catch (error) {
        console.error("labelList解析错误", error);
        return { ...temp, activeModal: undefined };
      }
      /* 以下控制弹窗 */
      if (rawLabelType === "2") {
        return { ...temp, activeModal: "Vehicle" };
      }
      if (rawLabelType === "1") {
        return { ...temp, activeModal: "Picture" };
      }
    }
    /* 解析车辆相关 */
    if (rawLicensePlate || rawVechicleTypeId || rawBrandId) {
      if (rawLicensePlate) {
        temp.licensePlate = rawLicensePlate ?? "";
        const colorId = Number(rawPlateColor) as PlateColorTypeId;
        temp.plateColorTypeId = Number.isNaN(colorId) ? 5 : colorId;
      }
      if (rawVechicleTypeId) {
        const typeId = Number(rawVechicleTypeId);
        temp.vehicleTypeId = Number.isNaN(typeId) || typeId == 0 ? -1 : typeId;
      }
      if (rawBrandId) {
        temp.brandId = rawBrandId;
        try {
          if (rawModelId) {
            temp.modelId = rawModelId as string[];
          }
          if (rawYearId) {
            temp.yearId = rawYearId as string[];
          }
        } catch (error) {
          console.error("modelId yearId需要字符串数组");
        }
      }
      return {
        ...temp,
        activeModal: "Vehicle",
      };
    }
    return temp;
  });

  const upInitialState = (data: Initial) => {
    setInitial({ ...initial, ...data })
  }


  return (
    <InitialContext.Provider value={{ value: initial, updateInitial: upInitialState }}>
      {children}
    </InitialContext.Provider>
  );
}
