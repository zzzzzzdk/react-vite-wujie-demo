import React from "react";
import { ResultRowType } from "../Search/Target/interface";

export interface LoginForm {
  account: string; //用户名
  password: string; //密码
  verify_code:string
}
