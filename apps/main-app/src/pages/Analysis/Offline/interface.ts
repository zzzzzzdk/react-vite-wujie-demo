import { NodeInstance, NodeProps } from "@yisa/webui/es/Tree/interface";
import React from "react";

export default interface OfflineProps {

}

export interface OfflineTreeProps {
  prefixCls: string;
  onSelect: (selectedNodes: NodeInstance[]) => void;
  selectedNodes?: NodeInstance[];
}

export type FormDataType = {
  jobId: number;
  fileName: string;
  // pageNo: number;
  // pageSize: number
}

export type SharedUsersItem = {
  id: string;
  permission: number; // 操作权限，0表示只读权限，1表示管理权限
}

export interface OfflineTreeItem extends NodeProps {
  key: any;
  jobId: string;
  name: string | JSX.Element;
  creator: string;
  createTime: string;
  parentId: string;
  children?: OfflineTreeItem[];
  privilege: number; // 是否分享用户，0表示不分享，1表示分享，只有这个字段为1，分享用户才生效
  permission: number; // 操作权限，0表示只读权限，1表示管理权限
  sharedUsers: SharedUsersItem[];
  /**
   * @description 格式化数据之后的索引，通过-间隔
   */
  __index?: string;
  /**
   * @description 当前数据层级
   * @default 0
   */
  __level?: number;
}

export type appendStatusType = {
  type: 'add' | 'edit';
  status: boolean;
  value: string;
  _index: string[];
  isFirst: boolean;
  inputError: string;
}

export type ParsedNumberType = {
  face: number;
  people: number;
  bicycle: number;
  tricycle: number;
  car: number;
  gait: number;
};

export type ResultRowType = {
  /**
   * @description 父级分组id
   */
  jobId?: number;
  /**
   * @description 文件id
   */
  fileId: string;
  /**
   * @description 文件名称
   */
  fileName: string;
  /**
   * @description 文件大小 Byte 为单位
   */
  fileSize: number;
  /**
   * @description 用户显示时间
   */
  userTime: string;
  /**
   * @description 用户是否设置过时间，如果设置过为1，没有则为0（系统时间），默认为0
   * @default 0
   */
  isUserSet?: 0 | 1;
  /**
   * @description 经度
   */
  longitude?: number;
  /**
   * @description 纬度
   */
  latitude?: number;
  /**
   * @description 目标数
   */
  parsedNumber: ParsedNumberType;
  /**
   * @description 上传是否完成，0表示正上传中断，1表示上传完成，2表示上传失败，3表示正在上传（仅前端本地会有此类型）
   */
  uploaded: 0 | 1 | 2 | 3;
  /**
   * @description 上传错误信息,
   */
  uploadError: string;
  uploadStatus?: UploadStatusType;
  /**
   * @description 上传进度，只在前端保存，不入数据库
   * @default 0
   */
  percentage?: number;
  /**
   * @description 文件解析状态,0 进行中、1 已完成, 2 解析失败
   * @default 0
   */
  status: 0 | 1 | 2;
  /**
   * @description status为2解析失败的错误信息
   */
  parseError: string;
  /**
   * @description 文件解析进度
   */
  progress: number;
  /**
   * @description 文件类型，1表示视频，2表示图片压缩包
   */
  fileType?: number;
  /**
   * @description 压缩包图片文件数组
   */
  imgUrl?: string[];
  /**
   * @description 设置的目标类型, face,pedestrian,bicycle,tricycle,vehicle,gait
   */
  targetType?: string;
}

export type GetFileParamsType = {
  jobId: number;
  /**
   * @description 按文件状态进行查询,进行中 0、已完成 1,上传失败 2, 解析失败 3,默认为全部 -1
   */
  status: number;
  fileName?: string;
  // pageSize: number,
  // pageNo: number;
}


/** ---------------------- 文件上传相关 ----------------- */
export enum UploadStatus {
  wait = "wait",
  pause = "pause",
  uploading = "uploading",
  success = "success"
}

export type UploadStatusType = `${UploadStatus}`

export interface fileChunkItem {
  file: Blob;
  fileHash?: string;
  fileName?: string;
  index?: number;
  hash?: string;
  chunk?: Blob;
  chunkIndex?: number;
  size?: number;
  percentage?: number;
}

export interface UploadFileItem extends File {
  jobId?: string;
  targetType?: string[];
  fileId?: string;
  key: string;
  hash?: string;
  status: UploadStatusType;
  fileChunkList?: fileChunkItem[];
  hashPercentage?: number;
}

/** --------------------- 文件上传End --------------------- */