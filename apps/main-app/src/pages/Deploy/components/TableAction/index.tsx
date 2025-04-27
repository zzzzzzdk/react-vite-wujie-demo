import { useState } from "react";
import { UserInfoState } from "@/store/slices/user";
import { DeployItem } from "../../DeployDetail/interface";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Button, Modal, PopConfirm } from "@yisa/webui";
import { ButtonProps } from "@yisa/webui/es/Button";
import classnames from "classnames";
import "./index.scss";
export type TableActionProps<T> = Omit<ButtonProps, "onClick"> & {
  children: string;
  item?: T;
  show?: boolean | ((user: UserInfoState, item: T) => boolean);
  dangerous?: boolean;
  onClick?: (item: T) => void;
};
function TableAction<T>(props: TableActionProps<T>) {
  // 查询用户信息
  const user = useSelector<RootState, UserInfoState>(
    (state) => state.user.userInfo
  );
  const {
    item,
    onClick: handleClick,
    dangerous = false,
    show = true,
    className,
    ...btnProps
  } = props;

  // 根据user 布控单状态决定是否显示该按钮
  const showAction =
    item && (typeof show === "function" ? show(user, item) : show);
  // console.log('showAction',showAction)
  if (!showAction) return null;

  if (dangerous) {
    return (
      <>
        <span
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PopConfirm
            title="确认执行此操作？"
            onConfirm={(e) => {
              e?.stopPropagation();
              if (handleClick) {
                handleClick(item);
              }
            }}
            onCancel={(e) => {
              e?.stopPropagation();
            }}
          >
            <Button
              onClick={(e) => {
                e?.stopPropagation();
              }}
              className={classnames(
                "fusion3-table-dangerous-action",
                className
              )}
              size="mini"
              type="danger"
              {...btnProps}
            />
          </PopConfirm>
        </span>
      </>
    );
  }
  return (
    <Button
      size="mini"
      className={className}
      {...btnProps}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (handleClick) {
          handleClick(item);
        }
      }}
    />
  );
}
export default TableAction;
