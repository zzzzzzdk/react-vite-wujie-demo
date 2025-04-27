
import { Button, Tabs, Form, Space, Checkbox, Input, Select, } from "@yisa/webui"
import { Icon } from '@yisa/webui/es/Icon'
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router'
import Card from "@/components/Card";
import { ResultDataProps } from './interface'
import ajax, { ApiResponse } from '@/services'
import './index.scss'
const LabelLists = (props: any) => {

  const navigate = useNavigate()

  const prefixCls = 'record-list-label'

  const defaultFormData = {
    personName: '',
    idCard: '',
    personLabel: '',
    isSearch: false,
    activeTabKey: '1'
  }
  const [formData, setFormData]: any = useState(defaultFormData)
  const handleSelectChange = (value: any, type: string) => {
    setFormData({
      ...formData,
      [type]: value
    })
  }
  const handleChangeTabKey = (v: string) => {
    setFormData(Object.assign({}, formData, {
      activeTabKey: v
    }))
  }

  // 是否结果页展示
  const [isResult, setIsResult] = useState(false)

  const [ajaxLoading, setAjaxLoading] = useState(false)

  //标签数据 
  const [labelData, setLabelData] = useState({
    data: [{}],
    totalRecords: 1234,
    usedTime: 1.23
  })
  // 获取标签数据列表
  const getLabelData = () => {

  }

  useEffect(() => {
    getLabelData()
  }, [])

  // 点击标签
  const handleClickLabel = () => {
    setIsResult(true)
    handleSearchBtnClick()
  }

  //结果数据 
  const [resultData, setResultData]: any = useState({
    data: [],
    totalRecords: 14,
    usedTime: 0.56
  })

  // 检索结果-卡片
  const handleSearchBtnClick = (key: string = '') => {
    setAjaxLoading(true)
    ajax.record.getRecordLabelDataList<any, ResultDataProps[]>(formData)
      .then(res => {
        console.log(res);
        setAjaxLoading(false)
        setResultData(res)
      })
      .catch(err => console.log(err))
  }
  // 点击卡片
  const handleCardClick = (data: ResultDataProps, index: number) => {
    console.log(data)
    navigate('/record-detail')
  }

  // 结果数据每一行动态渲染数量
  const [listCount, setListCount] = useState(3)
  const handleRenderCard = () => {
    const { data = [] } = resultData
    let template = []
    for (let i = 0; i < data.length; i = i + listCount) {
      let _template = []
      for (let j = i; j < i + listCount; j++) {
        if (j < data.length) {
          _template.push(
            <Card.PersonInfo
              key={data[j].infoId}
              showChecked={false}
              cardData={data[j]}
              // onImgClick={() => handleOpenBigImg(j)}
              onCardClick={() => handleCardClick(data[j], j)}
              // onsimilarityNumberClick={(cardData: any) => handlesimilarityNumberClick(cardData, j)}
              // similarType={similarType == '1' ? '聚类' : '以图'}
              showSimilarity={false}//人员档案&&无图片上传 -不展示相似度
              showCaptureNum={true}
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
  useEffect(() => {
    const calcListCount = () => {
      const itemWidth = 436
      const width = (document.querySelector('.result-content')?.clientWidth || 0) - 126 // 126为总间距
      const count = Math.floor(width / itemWidth)
      if (count >= 3 || count <= 2) {
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

  const handleApproval = () => { }
  const handleAddPerson = () => { }
  return <div className={`${prefixCls}`}>
    <div className={`${prefixCls}-header`}>
      <Form layout="vertical">
        <Form.Item className="person-name" colon={false} label={'人员姓名'}>
          <Input
            value={formData.personName}
            onChange={(e) => { setFormData({ ...formData, personName: e.target.value }) }}
          />
        </Form.Item>
        <Form.Item className="id-card" colon={false} label={'证件号'}>
          <Input
            value={formData.idCard}
            onChange={(e) => { setFormData({ ...formData, idCard: e.target.value }) }}
          />
        </Form.Item>
        <Form.Item
          label="人员标签"
          className="person-label"
          colon={false}
        >
          <Select
            defaultValue={formData.personLabel}
            options={[{ value: 1, 'label': '人员标签' }, { value: 2, 'label': '人员标签1' },]}
            onChange={(value) => handleSelectChange(value, 'personLabel')}
            value={formData.personLabel}
            // renderTag={renderTag}
            showSearch={true}
            mode="multiple"
          />
        </Form.Item>
        <Form.Item colon={false} label={'  '}>
          <Checkbox
            defaultChecked={formData.isSearch}
            checked={formData.isSearch}
            onChange={(e) => {
              setFormData(Object.assign({}, formData, {
                isSearch: e.target.checked
              }))
              console.log(e.target.checked);
            }}
          >在当前结果页中检索
          </Checkbox>
        </Form.Item>
        <Form.Item colon={false} label={' '} style={{ marginLeft: 'auto' }}>
          <Space size={16}>
            <Button
              loading={ajaxLoading}
              onClick={() => { handleSearchBtnClick() }}
              type='primary'
            >
              查询
            </Button>
          </Space>
        </Form.Item>

      </Form>
    </div>
    <div className={`${prefixCls}-content`}>
      <div className="result-header">
        <div className="header-left">
          {
            isResult ? <div className="back" onClick={() => setIsResult(false)}><Icon type="fanhui" />返回</div> : null
          }
          共<span>{isResult ? resultData.totalRecords : labelData.totalRecords}</span>条结果，
          用时<span>{isResult ? resultData.usedTime : labelData.usedTime}</span>秒
        </div>
        <div className="header-right">
          <Button onClick={handleApproval}>权限审批</Button>
          {/* <Button onClick={handleAddLabel}>添加标签</Button> */}
          <Button onClick={handleAddPerson}>导入数据</Button>
        </div>
      </div>
      <div className="result-content">
        {
          isResult ?
            handleRenderCard()
            :
            <>
              <Tabs
                type='line'
                activeKey={formData.activeTabKey}
                onChange={handleChangeTabKey}
                className={`${prefixCls}-tab`}
                data={[
                  { key: '1', name: '全部' },
                  { key: '2', name: '系统分析人员' },
                  { key: '3', name: '重点人员-情报' },
                  { key: '4', name: '重点人员-刑侦' },
                  { key: '5', name: '重点人员' },
                ]}
              />
              <div className="result-data">
                {
                  labelData.data.map((item, index) => {
                    return <div className="label-item" onClick={handleClickLabel} key={index}>
                      <div className="label-header">
                        <div className="label-name">徘徊人员</div>
                        <div className="label-time">2023-01-12更新</div>
                      </div>
                      <div className="label-info">
                        <div className="info-item">
                          <div className="label">人员总数</div>
                          <div className="text">333</div>
                        </div>
                        <div className="info-item">
                          <div className="label">数量(占比)</div>
                          <div className="text">234(78%)</div>
                        </div>
                        <div className="info-item">
                          <div className="label">周期类型</div>
                          <div className="text">长期标签</div>
                        </div>
                        <div className="info-item">
                          <div className="label">更新周期</div>
                          <div className="text">5日</div>
                        </div>
                      </div>
                    </div>
                  })
                }
              </div>
            </>
        }
      </div>
    </div>
  </div>
}
export default LabelLists