import React, { useEffect, useState, useRef } from "react";
import './index.scss'
import { Card } from "@/components";
import { Slider, Form, Space, Button, Image, Modal, Message } from '@yisa/webui'
import { Icon } from '@yisa/webui/es/Icon'
import ajax, { ApiResponse } from '@/services'
import { Props, RelateData } from '../../interface'
import { ResultBox } from '@yisa/webui_business'
import { useSelector, RootState } from '@/store';
const RelateInfo = (props: Props) => {
  const { data } = props
  const prefixCls = 'record-detail-relateinfo';

  const pageConfig = useSelector((state: RootState) => {
    return state.user.sysConfig['record-detail-person'] || {}
  });
  // 请求loading
  const [ajaxLoading, setAjaxLoading] = useState<boolean>(false)
  const [similarity, setSimilarity] = useState<number | number[]>(pageConfig.threshold?.default)
  const [resultData, setResultData] = useState<ApiResponse<RelateData[]>>({
    data: [],
    totalRecords: 0,
    usedTime: 0,
  })


  // 查询
  const handleSearchBtnClick = () => {
    let maxSimilary = pageConfig.threshold?.max || 100
    if (maxSimilary) {
      if (Number(similarity) > Number(maxSimilary)) {
        Message.warning('请选择阈值范围内的相似度！')
        return
      }
    }
    setAjaxLoading(true)
    ajax.record.getRelateInfoLists<{}, RelateData[]>({
      feature: data?.feature,
      groupId: data?.groupId,
      groupPlateId: data?.groupPlateId,
      similarity,
    })
      .then(res => {
        setAjaxLoading(false)
        if (res.data) {
          setResultData(res)
        }
      })
      .catch(err => {
        console.log(err)
        setAjaxLoading(false)
      })
  }

  const handleChangeSlider = (value: number | number[]) => {
    setSimilarity(value)
  }

  useEffect(() => {
    handleSearchBtnClick()
  }, [])

  //相似度大图
  const [opensimilarityModal, setOpensimilarityModal] = useState(false)
  const currentMatches = useRef<RelateData>()

  const [relateVisible, setRelateVisible] = useState(false)
  const [relatePersonData, setReltePersonData] = useState<RelateData>()
  const [isRelation, setIsRelation] = useState(true)

  // 关联人员
  const handleReletePerson = () => {
    let info = relatePersonData?.personBasicInfo ? relatePersonData?.personBasicInfo : {}
    ajax.record.handleRelateInfo<{ groupId: string[], groupPlateId: string[] }, {}>({
      ...info,
      groupId: data?.groupId || [],
      groupPlateId: data?.groupPlateId || [],
    })
      .then(res => {
        setRelateVisible(false)
        setIsRelation(false)
        Message.success(res.message || '')
        handleSearchBtnClick()
      })
      .catch(err => {
        console.log(err)
        setAjaxLoading(false)
      })
  }

  // 动态展示每行数据
  const [listCount, setListCount] = useState(3)
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 438
      const width = (document.querySelector('.result-data')?.clientWidth || 0) - 64 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 3 || count <= 2) {
        setListCount(count < 0 ? 1 : count)
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
  // 渲染证件照卡片
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          // let item = {
          //   ...data[j],
          //   personTags: data[j].labels.map((ele: {
          //     "name": string,
          //     "color": number,
          //     "id": number
          //   }) => ele.name),
          //   targetImage: data[j].imageUrl,
          //   personBasicInfo: {
          //     name: data[j].name,
          //     sex: data[j].sex,
          //     idcard: data[j].idNumber,
          //     age: data[j].age,
          //     nation: data[j].nation
          //   }
          // }
          _template.push(
            <Card.PersonInfo
              showChecked={false}
              key={data[j].infoId}
              cardData={data[j]}
              onsimilarityNumberClick={() => {
                currentMatches.current = data[j]
                setOpensimilarityModal(true)
              }}
              isRelate={isRelation}
              onRelateClick={() => {
                // debugger
                setReltePersonData(data[j])
                setRelateVisible(true)
              }}
            // onImgDragStart={handledragStart}
            // showImgZoom={false}
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

  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <Form layout="vertical">
        <Form.Item
          label="相似度范围"
          className="target-type"
        >
          <Slider defaultValue={similarity} min={Number(pageConfig.threshold?.min) || 0} value={similarity} showInput={true} onChange={handleChangeSlider} />
        </Form.Item>
        <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
          <Space size={16}>
            <Button
              loading={ajaxLoading}
              onClick={handleSearchBtnClick}
              type='primary'
            >
              查询
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="result-total">共<span>{ajaxLoading ? '···' : resultData.totalRecords}</span>条结果，用时<span>{ajaxLoading ? '···' : resultData.usedTime}</span>秒</div>
      <div className="result-data">
        <ResultBox
          loading={ajaxLoading}
          nodata={!resultData.data || (resultData.data && !resultData.data.length)}
        >
          {
            handleRenderCard()
          }
        </ResultBox>
      </div>
      <Modal
        visible={relateVisible}
        title="确认关联人员"
        onCancel={() => { setRelateVisible(false) }}
        onOk={handleReletePerson}
        className={`${prefixCls}-relate-modal`}
      >
        <div className="relate-introduce">
          <span><Icon type="tishi" /> 关联后不可修改。</span>请确认是否关联人员?
        </div>
      </Modal>
      <Modal
        title={`识别目标（${currentMatches.current?.matches?.length || 0}个结果）`}
        visible={opensimilarityModal}
        footer={null}
        onCancel={() => { setOpensimilarityModal(false) }}
        className="similarity-container-modal"
        width={1050}
      >
        <ul className="similarity-container">
          {
            currentMatches.current?.matches?.map((item, index) => {
              const { similarity } = item
              const calcsimilarity = isNaN(Number(similarity)) ? ["00", "00"] : String(similarity).split(".").length === 2 ? String(similarity).split(".") : [String(similarity), "00"]
              
              return <li key={index} className="similarity-container-item">
                <div className="image" data-text="检索条件"><Image src={data?.photoUrl} /></div>
                <span className="similarity"><em>{calcsimilarity[0]}</em><em>.{calcsimilarity[1]}%</em></span>
                <div
                  className="image"
                  data-text="检索结果"
                // onClick={handleSimilarityTargetClick}
                >
                  <Image src={item.targetImage} />
                  {/* {
                    (type === "person" || currentMatches.current?.targetType === "face" || currentMatches.current?.targetType === "pedestrian") &&
                    <span className="gait-number">
                      <Icon type="butai" />
                      {currentMatches.current?.gaitMaskUrl?.length || 0}
                    </span>
                  } */}
                </div>
              </li>
            })
          }
        </ul>
      </Modal>
    </div>
  </div>
}
export default RelateInfo
