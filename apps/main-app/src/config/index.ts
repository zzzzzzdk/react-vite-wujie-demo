export const prefixCls = 'fusion3'
export const getPrefixCls = (componentName: string): string => componentName ? `${prefixCls}-${componentName}` : prefixCls

//下拉类型
export enum selectType {
  /**点位状态 */
  locationStatus = 1,
  /**设备状态 */
  deviceStatus = 1,
  /**点位类型 */
  locationType,
  /**卡口类型 */
  locationLevel,
  /**点位卡口类型 */
  vehicleType,
  /**拼接类型 */
  joinType,
  /**卡口用途 */
  Tollgate,
  /**监视方向 */
  monitorDirection,
  /**抓拍方向 */
  capDirection,
  /**设备类型 */
  deviceType,
  /**点位组 */
  labels,
  /**管辖单位 */
  depart,
  /**所属地区 */
  region,
  /**操作日志-类型 */
  logType,
  /**应用算法 */
  computType,
  // 15：围栏点位类型
  // 16：围栏点位是否关联卡口
  /**反馈类型 */
  feedbackType = 17,
  /**导出状态 */
  replyStatus,
  /**设备异常类型 */
  deviceAbnormalType,
  /**点位异常类型下拉 */
  locationAbnormalType,
  /**系统名称 */
  sourceSystem,
  /**意见反馈错误类型 */
  errorType

}


// 配置信息默认设置 接口挂了会用默认的
export const settingConfig = {
  "cross": {
    "timeRange": {
      "min": "0",
      "default": "7",
      "max": "30",
    },
    threshold: {
      default: "80",
      max: "100",
      min: "60"
    }
  },
}
