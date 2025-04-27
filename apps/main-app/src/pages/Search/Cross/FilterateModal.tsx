import React, { useState, useEffect, useRef } from "react";
import { FilterateModalProps } from "./interface";
import { Modal, Space, Button, PopConfirm, Checkbox, Message } from '@yisa/webui'
import { ResultBox, } from "@yisa/webui_business";
import { Card, BigImg, BottomRight, Portal } from "@/components";
import { isFunction } from "@/utils";
import classNames from 'classnames'
import { CheckboxChangeEvent } from '@yisa/webui/es/Checkbox'
import { ResultRowType as TargetResultItemType } from "@/pages/Search/Target/interface";
import services, { ApiResponse } from "@/services";
import { flushSync } from 'react-dom';

const FilterateModal = (props: FilterateModalProps) => {
  const {
    modalProps,
    taskId = '',
    trackId = '',
    onDelChange
  } = props

  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [resultData, setResultData] = useState<TargetResultItemType[]>([])
  // 结果选中
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<TargetResultItemType[]>([])

  const contentRef = useRef<HTMLDivElement>(null)
  const previousScrollY = useRef(contentRef.current?.scrollTop || 0)
  function scrollOffset() {
    // console.log(contentRef.current)
    // 获取当前滚动的垂直位置
    const currentScrollY = contentRef.current?.scrollTop || 0;
    const scrollDifference = Math.abs(currentScrollY - previousScrollY.current);
    // console.log(scrollDifference)
    // 更新之前的滚动位置
    previousScrollY.current = currentScrollY;
    if (scrollDifference > 50) {
      setBottomRightMapVisible(false)
    } else {
    }
  }

  useEffect(() => {
    if (modalProps?.visible) {
      getFilterateData()
    }
  }, [modalProps?.visible])

  const getFilterateData = () => {
    setAjaxLoading(true)
    services.cross.getFilterate<{ taskId: string, trackId: string }, TargetResultItemType[]>({
      taskId: taskId,
      trackId: trackId
    }).then((res) => {
      setAjaxLoading(false)
      console.log(res)
      const result = (res.data || []).map(item => ({
        ...item,
        // similarity: 0, // 不显示相似度
        // gaitFeature: '', // 不显示步态数量
        captureTime: item.captureTime || '--', // 显示抓拍时间
      }))
      setResultData(result)
      // 初始化默认全选
      setCheckedList(result)
      setIndeterminate(false)
      setCheckAll(true)
    }).catch(err => {
      console.log(err)
      setAjaxLoading(false)
    })
  }

  const handleCancel = () => {
    if (modalProps && modalProps.onCancel && isFunction(modalProps.onCancel)) {
      modalProps.onCancel()
    }
  }

  const handleCheckAllChange = (event: CheckboxChangeEvent) => {
    const checked = event.target.checked
    if (checked) {
      setCheckedList(resultData)
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      resetChecked()
    }
  }

  // 重置选中状态
  const resetChecked = () => {
    setCheckedList([])
    setIndeterminate(false)
    setCheckAll(false)
  }

  // 图文列表 - 卡片数据选中
  const handleResultCheckedChange = ({ cardData, checked }: { cardData: any, checked: boolean }) => {
    let newCheckedData = []
    if (!checked) {
      newCheckedData = checkedList.filter(item => item.infoId !== cardData.infoId)
    } else {
      newCheckedData = checkedList.concat([cardData])
    }
    setCheckedList(newCheckedData)
    setIndeterminate(!!newCheckedData.length && newCheckedData.length < (resultData ?? []).length);
    setCheckAll(newCheckedData.length === (resultData ?? []).length);
  }


  // 大图
  const [bigImgVisible, setBigImgVisible] = useState(false)
  const [bigImgIndex, setBigImgIndex] = useState(0)
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)
  const [currentData, setCurrentData] = useState<TargetResultItemType | null>(null)

  const handleOpenBigImg = (event: React.MouseEvent, item: TargetResultItemType, index: number) => {
    setBigImgIndex(index)
    setBigImgVisible(true)
  }

  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true)
    setCurrentData(resultData[index])
  }

  const handleBatchDel = () => {
    const infoIds = checkedList.map(item => item.infoId)
    handleDel(infoIds)
  }

  const handleDel = (infoIds: string[]) => {
    services.cross.delFilterate({
      taskId: taskId,
      trackId: trackId,
      infoIds: infoIds
    }).then(res => {
      Message.success("删除成功")

      // 将删除的数据回调到 外部组件，看看能否根据数据中filterId还原到列表中
      if (onDelChange && isFunction(onDelChange)) {
        const delData = resultData.filter(item => infoIds.includes(item.infoId))
        onDelChange(delData)
      }

      // 从结果数据中删除
      const newResultData = resultData.filter(item => !infoIds.includes(item.infoId))
      setResultData(newResultData)

      // 从选中数据中删除
      const newCheckedList = checkedList.filter(item => !infoIds.includes(item.infoId))
      setCheckedList(newCheckedList)
      setIndeterminate(!!newCheckedList.length && newCheckedList.length < newResultData.length);
      setCheckAll(!!newCheckedList.length && (newCheckedList.length === newResultData.length));
    }).catch(err => console.log(err))
  }

  useEffect(() => {

    return () => {
    }
  }, [])


  const renderFooter = (
    <div className="page-bottom">
      <div className='left'>
        <div className={classNames("check-box")}>
          <Checkbox
            className="card-checked"
            checked={checkAll}
            indeterminate={indeterminate}
            onChange={handleCheckAllChange}
            disabled={!resultData.length}
          >
            全选
          </Checkbox>
          已经选择<span className="num">{checkedList.length}</span>项
        </div>
        <PopConfirm
          title={<span>确认把此目标对象移除吗？</span>}
          onConfirm={handleBatchDel}
        >
          <Button disabled={!checkedList.length} size='small' type="danger">删除</Button>

        </PopConfirm>
      </div>
    </div>
  )

  return (
    <>
      <Modal
        title="过滤名单"
        {...(modalProps || {})}
        className="filterate-modal"
        onCancel={handleCancel}
        footer={renderFooter}
      >
        <div className="filterate-modal-content" ref={contentRef} onScroll={scrollOffset}>
          <ResultBox
            loading={ajaxLoading}
            nodata={!resultData || (resultData && !resultData.length)}
          >
            {
              resultData.map((item, index) => {
                return (
                  <Card.IdentifySingle
                    key={item.infoId}
                    cardData={item}
                    checked={checkedList.filter(o => o.infoId === item.infoId).length > 0}
                    onCheck={handleResultCheckedChange}
                    showChecked
                    showFooterLinks={false}
                    showAddFilterate={false}
                    showDelBtn
                    onImgClick={(e, data) => handleOpenBigImg(e, data, index)}
                    onLocationClick={() => handleLocationClick(index)}
                    onDelClick={() => handleDel([item.infoId])}
                    showSimilarity={false}
                    showGaitFeature={false}
                  />
                )
              })
            }
          </ResultBox>
        </div>
        <BigImg
          modalProps={{
            visible: bigImgVisible,
            onCancel: () => setBigImgVisible(false)
          }}
          currentIndex={bigImgIndex}
          data={resultData}
          onIndexChange={(index) => {
            setBigImgIndex(index)
          }}
        />
      </Modal>
      <Portal visible={bottomRightMapVisible} getContainer={() => document.body} >
        {
          bottomRightMapVisible ?
            <BottomRight
              name={currentData?.locationName || '--'}
              lat={currentData?.lngLat?.lat || null}
              lng={currentData?.lngLat?.lng || null}
              onClose={() => {
                setBottomRightMapVisible(false)
              }}
            />
            :
            ''
        }
      </Portal>
    </>
  )
}

export default FilterateModal
