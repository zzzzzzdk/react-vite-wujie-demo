import React, { useState, useMemo, useContext } from "react";
import { Radio, Input } from "@yisa/webui";
import { DataContext, SettingContext } from "../store";
import { RANGETYPE, STATUS } from "../hooks";

const { InputNumber } = Input;

export default function Range() {
  const setting = useContext(SettingContext);
  const exportData = useContext(DataContext);
  const { exportType, prefixCls, rangeData, changeRange, status } = exportData!;
  const { type, start, end } = rangeData;
  const { total, formData, hasAll = true } = setting!;

  const changeStart = (v: number | undefined) => {
    const _range = {
      ...rangeData,
      type: RANGETYPE.CUSTOM,
      start: v,
    };
    changeRange(_range);
  };

  const changeEnd = (v: number | undefined) => {
    const _range = {
      ...rangeData,
      type: RANGETYPE.CUSTOM,
      end: v,
    };
    changeRange(_range);
  };

  const changeType = (_type: RANGETYPE) => {
    const _range = {
      start: undefined,
      end: undefined,
      type: _type,
    };
    changeRange(_range);
  };

  const showAll = useMemo(() => {
    return exportType !== "image";
  }, [exportType]);

  const isCheck = status === STATUS.CHECK;
  if (!isCheck) return null

  return (
    <div className={`${prefixCls}-range`}>
      <Radio
        className={`${prefixCls}-range-item`}
        checked={type == RANGETYPE.CURRENT}
        onChange={(e) => {
          changeType(RANGETYPE.CURRENT);
        }}
      >
        <span className="primary-checked">导出当前页</span>
      </Radio>
      <Radio
        className={`${prefixCls}-range-item`}
        checked={type == RANGETYPE.CUSTOM}
        onChange={() => {
          changeType(RANGETYPE.CUSTOM);
        }}
      >
        <span className={`${prefixCls}-range-item-wrap`}>
          <span className="primary-checked">导出</span>
          <InputNumber
            className="group-item"
            value={start}
            placeholder="请输入"
            onChange={changeStart}
            min={1}
            max={end || total}
            disabled={!total}
            hideControl
          />
          <span className={`${prefixCls}-separator`}>~</span>
          <InputNumber
            className="group-item"
            min={start || 1}
            max={total}
            disabled={!total}
            value={end}
            placeholder="请输入"
            onChange={changeEnd}
            hideControl
          />
          <span>条</span>
          {type == RANGETYPE.CUSTOM && !!total && (
            <span className="checked-total">{total}条</span>
          )}
        </span>
      </Radio>
      {(showAll && hasAll) && (
        <Radio
          className={`${prefixCls}-range-item`}
          checked={type == RANGETYPE.ALL}
          onChange={() => {
            changeType(RANGETYPE.ALL);
          }}
        >
          <span className="primary-checked">导出全部(全部导出需等待较长时间，请耐心等待)</span>
        </Radio>
      )}
      {
        (!showAll && !!formData?.checkedIds && !!formData.checkedIds.length) && (
          <Radio
            className={`${prefixCls}-range-item`}
            checked={type == RANGETYPE.CHECKED}
            onChange={(e) => {
              changeType(RANGETYPE.CHECKED);
            }}
          >
            <span className="primary-checked">导出已选择目标</span>
          </Radio>
        )
      }

    </div>
  );
}
