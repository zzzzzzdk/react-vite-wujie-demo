import React, { useState, useEffect } from "react";
import { Table, Image, Link, Button, Space, Popover } from '@yisa/webui'
import { ResultBox } from '@yisa/webui_business'
import { Card, BottomRight, GroupTable, BigImg, ListMoreBtn } from "@/components";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { GroupFilterCallBackType } from "@/components/Card/Normal/interface";
import { isFunction, jumpRecordVehicle } from "@/utils";
import { ColumnProps } from '@yisa/webui/es/Table/interface'
import { useDispatch, useSelector, RootState } from '@/store';
import { changeFilterTags } from '@/store/slices/groupFilter';
import { ResultProps } from './interface'

const TargetResult = (props: ResultProps) => {
  const {
    loading = false,
    resultData,
    onCheckedChange,
    onTableCheckedChange,
    checkedList = [],
    resultShowType = "image",
    ajaxFormData,
    pageSize,
    onGroupFilterChange
  } = props

  const dispatch = useDispatch()
  const { filterTags } = useSelector((state: RootState) => {
    return state.groupFilter
  })

  const [listCount, setListCount] = useState(8)
  // 大图
  const [bigImgModal, setBigImgModal] = useState({
    visible: false,
    currentIndex: 0
  })

  // 地图
  const [bottomRightMapVisible, setBottomRightMapVisible] = useState(false)

  const handleCheckedChange = (data: { cardData: ResultRowType, checked: boolean }) => {
    if (onCheckedChange && isFunction(onCheckedChange)) {
      onCheckedChange(data)
    }
  }

  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 208
      const width = (document.querySelector('.result-group')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 8 || count <= 2) {
        setListCount(count)
      } else {
        const diff = width - itemWidth * count + 18 * (count - 1)
        if (diff >= itemWidth * (count / (count + 1))) {
          setListCount(count + 1)
        } else {
          setListCount(count)
        }
      }
    }
    calcListCount()
    window.addEventListener('resize', calcListCount)

    return () => {
      window.removeEventListener('resize', calcListCount)
    }
  }, [])

  const handleLocationClick = (index: number) => {
    setBottomRightMapVisible(true)
    setBigImgModal({
      visible: false,
      currentIndex: index
    })
  }

  const handleGroupTableFilter = (groupId: string, group: string) => {
    console.log('selected id, text:', groupId, group)

    const newFilterTags = filterTags.concat({
      type: 'id',
      text: group,
      value: groupId
    })
    dispatch(changeFilterTags(newFilterTags))
    onGroupFilterChange?.({ filterTags: newFilterTags })
  }

  const handleCardFilter = ({ text, value, type, cardData }: GroupFilterCallBackType) => {
    const groupType = filterTags.length ? filterTags[filterTags.length - 1].value : 'licensePlate2'
    // 判断当前是一次识别车牌还是二次识别车牌分组
    const newFilterTags = filterTags.concat({
      type: 'id',
      text: cardData && cardData[groupType],
      value: cardData && cardData[groupType]
    })
    dispatch(changeFilterTags(newFilterTags))
    onGroupFilterChange?.({ filterTags: newFilterTags })
  }

  const columns: ColumnProps<ResultRowType>[] = [
    {
      title: '序号',
      dataIndex: 'number',
      render: (_, __, index) => {
        return <span>{((ajaxFormData?.pageNo || 0) - 1) * (ajaxFormData?.pageSize || 0) + index + 1}</span>
      }
    },
    {
      title: '抓拍车牌',
      dataIndex: 'plateImage',
      render: (text, record, index) => (
        text ?
          <Image src={text} className="plate-img" />
          :
          (text || '未识别')
      )
    },
    {
      title: '前端识别车牌',
      dataIndex: 'licensePlate1',
      render: (text, record, index) => (
        record.licensePlate1Url ?
          <Link href={record.licensePlate1Url}>{text}</Link>
          : <span>{text}</span>
      )
    },
    {
      title: '二次识别车牌',
      dataIndex: 'licensePlate2',
      render: (text, record, index) => (
        text && text === '未识别' ?
          <span className={`plate2-text plate-bg plate-color-8`}></span>
          :
          <a
            target="_blank"
            href={jumpRecordVehicle(record.licensePlate2, record.plateColorTypeId2)}
            className={`plate2-text plate-bg plate-color-${record.plateColorTypeId2}`}
          >
            {text}
          </a>
      )
    },
    {
      title: '车辆型号',
      dataIndex: 'carInfo',
    },
    {
      title: '初次入城时间',
      dataIndex: 'captureTime',
    },
    {
      title: '初次入城位置',
      dataIndex: 'locationName',
    },
    {
      title: '方向',
      dataIndex: 'direction',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => (
        <Space size={10}>
          <ListMoreBtn data={record} />
          <Button onClick={() => handleOpenBigImg(index)} size="mini">查看大图</Button>
        </Space>
      ),
    },
  ];

  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          const showZoom = data[j].targetType === 'vehicle' || data[j].targetType === 'bicycle' || data[j].targetType === 'tricycle'
          _template.push(
            <Card.Normal
              captureTimeTitle="初次入城抓拍"
              checked={checkedList.filter(item => item.infoId === data[j].infoId).length > 0}
              key={data[j].infoId}
              cardData={data[j]}
              onImgClick={() => handleOpenBigImg(j)}
              onChange={handleCheckedChange}
              onLocationClick={() => handleLocationClick(j)}
              showImgZoom={showZoom}
              onFilterChange={handleCardFilter}
            />
          )
        } else {
          _template.push(<div className="card-item-flex" key={j + 'flex'} />)
        }
      }
      template.push(<div className="result-card-list-row" key={i}>{_template}</div>)
    }
    return template
  }

  const handleRenderList = () => {
    return (
      <Table
        stripe={true}
        rowKey={"feature"}
        className={"target-table"}
        data={resultData.data}
        columns={columns}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: checkedList.map(item => item.feature),
          onChange: (selectedRowKeys, selectedRows) => {
            // console.log(selectedRowKeys, selectedRows)
            // setSelectedRowKeys(selectedRowKeys)
            onTableCheckedChange?.(selectedRows)
          },
          onSelect: (selected, record, selectedRows) => {
            // console.log("onSelect:", selected, record, selectedRows)
          },
        }}
      />
    )
  }

  const handleRenderGroup = () => {
    return (
      <GroupTable
        data={resultData.data}
        pageSize={pageSize}
        tableConfig={{
          name: filterTags[filterTags.length - 1]?.tableName,
          countTitle: '过车数量'
        }}
        onSelect={handleGroupTableFilter}
      />
    )
  }

  // 大图
  const handleOpenBigImg = (index: number) => {
    setBigImgModal({
      visible: true,
      currentIndex: index
    })
  }

  const handleCloseBigImg = () => {
    setBigImgModal({
      visible: false,
      currentIndex: 0
    })
  }

  const currentData: ResultRowType = Array.isArray(resultData.data) && resultData.data[bigImgModal.currentIndex] ? resultData.data[bigImgModal.currentIndex] : ({} as ResultRowType)

  return (
    <div className="result-group">
      <ResultBox
        loading={loading}
        nodata={!resultData.data || (resultData.data && !resultData.data.length)}
      >
        {
          resultShowType === 'image' ?
            handleRenderCard()
            :
            resultShowType === 'list' ?
              handleRenderList()
              :
              handleRenderGroup()
        }
      </ResultBox>
      <BigImg
        modalProps={{
          visible: bigImgModal.visible,
          onCancel: handleCloseBigImg
        }}
        currentIndex={bigImgModal.currentIndex}
        onIndexChange={(index) => {
          setBigImgModal({
            visible: true,
            currentIndex: index
          })
        }}
        data={resultData.data}
      />
      {
        bottomRightMapVisible &&
        <BottomRight
          name={currentData.locationName || '--'}
          lat={currentData.lngLat?.lat || null}
          lng={currentData.lngLat?.lng || null}
          onClose={() => { setBottomRightMapVisible(false) }}
        />
      }
    </div>
  )
}

export default TargetResult
