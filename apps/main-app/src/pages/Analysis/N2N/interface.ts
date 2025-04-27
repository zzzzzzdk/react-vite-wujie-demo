// TODO 待优化
export enum TaskStatus {
  // All = 0, // 不限, 仅前端使用
  Processing = 1, // 解析中
  Comparing = 2, // 对比中
  Failed = 3, // 已失败
  Done = 4, // 已完成
}

// 库的信息 database

// prettier-ignore
export enum DBType {
  OfflineFile = 1, // 离线任务中的文件
  OfflineTask = 2, // 离线任务
  Label = 3,    // 标签
}

// prettier-ignore
export type BaseTask = {
  taskId: string | number;   // 任务id
  taskName: string;          // 任务名称
  similarity: number;        // 创建时设置的相似度
  outCome: number;           // 结果条数
  uname: string;             // 创建人姓名
  organizationName: string   // 创建人部门
  createTime: string;        // 创建时间
  taskStatus: TaskStatus;    // 任务状态
  errMsg?:string
};

export type DB = {
  id: React.Key;
  name: string;
  type: DBType;
  deleted?: boolean;
};

export type DBName = "baseDB" | "compareDB";

// RawTask是后端传过来的原始数据
export type RawTask = BaseTask & {
  baseDb: number; // 基准库id
  baseDbName: string;
  baseDbType: DBType;
  baseDbIsDeleted: boolean;
  compareDb: number;
  compareDbName: string;
  compareDbType: DBType;
  compareDbIsDeleted: boolean;
};

// Task对RawTask进行了简单的变换
export type Task = BaseTask & Record<DBName, DB>;

// 搜索表单
export type SearchForm = {
  taskName?: string;
  dbName?: string;
  taskStatus?: TaskStatus[];
  uname?: string;
  // 必选参数
  minCreateTime: string;
  maxCreateTime: string;
  page: number;
  pageSize: number;
};
