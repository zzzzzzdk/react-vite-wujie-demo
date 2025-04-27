import React, { createContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import useMergeProps from "@/hooks/useMergeProps"
import { STATUS, ResultDataType, FormDataType } from "./interface";
import { ApiResponse } from "@/services";


export const DataContext = createContext<{
  url: string;
  status: STATUS,
  changeStatus: (status: STATUS) => void,
  onCancel?: () => void,
  resultData: ResultDataType;
  changeResultData: (result: ResultDataType) => void;
  formData: FormDataType;
  changeFormData: (form: FormDataType) => void;
  resultFormData: any;
  recordData: ApiResponse<{ person: any[], car: any[], select: any[], selectId: string }>
  type?:"target" | "record";
  searchInfo?: string;
} | null>(null);
