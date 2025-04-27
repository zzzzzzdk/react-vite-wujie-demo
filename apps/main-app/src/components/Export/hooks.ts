import React, { useState, useMemo } from "react";
import { getPrefixCls } from "@/config";

export enum STATUS {
  CHECK = "CHECK",
  PROGRESS = "PROGRESS",
  RESULT = "RESULT",
}

export enum RANGETYPE {
  ALL = "all",
  CURRENT = "current",
  CUSTOM = "custom",
  CHECKED = 'checked'
}

export enum EXPORTTYPE {
  IMAGE = "image",
  NORMAL = "normal",
}

type RangeData = {
  type: RANGETYPE;
  start?: number | undefined;
  end?: number | undefined;
};

export type ResultData = {
  jobId: string;
  status?: 'success' | 'error';
  errorText?: string;
  progress?: number;
  successUrl?: string;
  successNum?: number;
  failUrl?: string;
  failNum?: number;
}

const prefixCls = getPrefixCls("export");

export const useData = () => {
  const [status, setStatus] = useState<STATUS>(STATUS.CHECK);
  const [exportType, setExportType] = useState<EXPORTTYPE>(EXPORTTYPE.IMAGE);
  const [visible, setVisible] = useState<boolean>(false);
  const [rangeData, setRangeData] = useState<RangeData>({
    type: RANGETYPE.CURRENT,
  });

  const [progress, setProgress] = useState(0)

  const defaultResultData: ResultData = {
    status: 'success',
    errorText: '',
    jobId: '',
    progress: 0,
    successUrl: '',
    successNum: 0,
    failUrl: '',
    failNum: 0
  }
  const [resultData, setResultData] = useState<ResultData>(defaultResultData)

  const changeStatus = (st: STATUS) => {
    setStatus(st);
  };

  const changeType = (type: EXPORTTYPE) => {
    setExportType(type);
    // if (type == EXPORTTYPE.IMAGE) {
    changeRange({
      type: RANGETYPE.CURRENT,
    });
    // } else {
    //   changeRange({
    //     type: RANGETYPE.ALL,
    //   });
    // }
  };

  const modalAction = (open: boolean) => {
    setVisible(open);
    setTimeout(() => {
      changeRange({
        type: RANGETYPE.CURRENT
      })
    }, 200)
  };

  const changeRange = (data: RangeData) => {
    setRangeData(data);
  };

  const closeModal = () => {
    changeStatus(STATUS.CHECK)
    changeResult(defaultResultData)

    modalAction(false);
  };

  const changeResult = (data: ResultData) => {
    setResultData(data)
  }

  return {
    prefixCls,
    status,
    changeStatus,
    exportType,
    changeType,
    visible,
    closeModal,
    modalAction,
    rangeData,
    changeRange,
    resultData,
    changeResult,
    progress,
    setProgress
  };
};

export const useProgress = () => {
  const [progress, setProgress] = useState(0);

  return {
    progress,
  };
};
