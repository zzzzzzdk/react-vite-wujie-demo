import React from "react";
import ResultHeaderProps from "./interface";
import classNames from 'classnames'
import ResultGroupFilter from "../ResultGroupFilter";
import './index.scss'

const ResultHeader = (props: ResultHeaderProps) => {
  const {
    pageType = "target",
    className = '',
    style,
    resultData = {
      totalRecords: 0,
      usedTime: 0,
    },
    leftSlot = null,
    rightSlot = null,
    onGroupFilterChange,
    groupFilterDisabled,
    targetType = 'face',
    defaultFilterTypeOptions,
    needgroupchoose = true,
    needFilterChoose = true,
    resultShowType = 'image'
  } = props
  const prefixCls = 'result-header'

  return (
    <div
      style={style}
      className={classNames(prefixCls, className)}
    >
      <div className={`${prefixCls}-left`}>
        <div className={`${prefixCls}-left-total`}>
          {
            leftSlot ? leftSlot
              :
              pageType === "record" ? <>
                共<span>{resultData?.personInfoDataRecords || 0}</span>条档案信息，
                用时<span>{resultData.personUsedTime?.toFixed(2) || 0}</span>秒
              </>
                :
                <>
                  共<span>{resultData?.totalRecords || 0}</span>条{resultShowType === 'group' ? '' : "抓拍"}信息，
                  用时<span>{resultData.usedTime?.toFixed(2) || 0}</span>秒
                </>
            // :
            // <>共 <span>{resultData.totalRecords}</span> 条结果，</>
          }
        </div>
        {
          resultData.data && resultData?.data?.length ?
            <ResultGroupFilter
              targetType={targetType}
              onChange={onGroupFilterChange}
              // disabled={groupFilterDisabled}
              defaultFilterTypeOptions={defaultFilterTypeOptions}
              needgroupchoose={needgroupchoose}
              needFilterChoose={needFilterChoose}
            />
            : ''
        }
      </div>
      {
        rightSlot &&
        <div className={`${prefixCls}-right`}>{rightSlot}</div>
      }
    </div>
  )
}

export default ResultHeader
