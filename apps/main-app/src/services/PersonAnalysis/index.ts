import ajax from '@/utils/axios.config'
import RegionalMapping from "./RegionalMapping";
import personTrack from "./personTrack";
const personfoothold = {

    // 获取落脚点分析数据
    getFootholdList: function <U, T>(data?: U) {
        return ajax<T, U>({
            method: "post",
            url: `/v1/judgement/parking/person/locations`,
            data
        });
    },
    getFootholdDetailList: function <U, T>(data?: U) {
        return ajax<T, U>({
            method: "post",
            url: `/v1/judgement/parking/person/info`,
            data
        });
    },
}

export default {
    personfoothold,
    RegionalMapping,
    personTrack
}
