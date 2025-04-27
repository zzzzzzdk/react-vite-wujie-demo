import { TargetFeatureItem } from "@/config/CommonType";
import ajax from "@/utils/axios.config";

const getFeatureList = () => {
  return ajax<{
    "big-pic": string;
    data: TargetFeatureItem[];
  }>({
    method: "get",
    url: "/one2one/id-card",
  });
};


const getSimilarity = <T, U> (data: T) => {
  // debugger;
  return ajax<U>({
    method: "post",
    url: "v1/comparison/onevsone",
    data
  });
};

export default { getFeatureList, getSimilarity };
