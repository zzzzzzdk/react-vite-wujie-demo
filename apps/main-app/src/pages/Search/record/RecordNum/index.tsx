import './index.scss'
import { Icon } from '@yisa/webui/es/Icon'
import React, { useEffect, useState } from 'react'
import ActiveIcon from '@/assets/images/record/active-icon.png'
import ajax from '@/services'
import ImportCarBigIcon from '@/assets/images/record/car-big-icon.png'
import ImportPersonBigIcon from '@/assets/images/record/person-big-icon.png'
interface RecordNUmType {
  carNum: number,
  carLabel: number,
  personNum: number,
  personLabel: number,
  noPersonInfo: number,
  noCaptureInfo: number,
  activePerson: number,
  activeLabel: number,
  personInfo: number,
}

const RecordNum = (props: any) => {
  const {
    handleGoBack
  } = props
  const prefixClsNum = 'record-num-body'
  const recordNumList = [
    {
      title: '车辆档案',
      icon: ImportCarBigIcon,
      key: 'carNum',
      info: '',
      childrens: [
        {
          title: '全部档案',
          key: 'carNum'
        },
        {
          title: '具备标签车辆',
          key: 'carLabel'
        }
      ]
    },
    {
      title: '人员档案',
      icon: ImportPersonBigIcon,
      key: 'personNum',
      // info: '含未实名档案',
      childrens: [
        {
          title: '全部档案（含未实名）',
          key: 'personNum'
        },
        {
          title: '无聚类人员',
          key: 'noCaptureInfo'
        },
        {
          title: '具备标签人员',
          key: 'personLabel'
        }
      ]
    },
    {
      title: '聚类档案',
      icon: ActiveIcon,
      key: 'activePerson',
      // info: '存在抓拍信息',
      childrens: [
        {
          title: '全部档案',
          key: 'activePerson'
        },
        {
          title: '实名档案',
          key: 'personInfo'
        },
        {
          title: '未实名档案',
          key: 'noPersonInfo'
        },
      ]
    },
  ]
  // 档案统计数量
  const [recordNum, setRecordNum] = useState<RecordNUmType>({
    carNum: 0,
    carLabel: 0,
    personNum: 0,
    personLabel: 0,
    noPersonInfo: 0,
    noCaptureInfo: 0,
    activePerson: 0,
    activeLabel: 0,
    personInfo: 0,
  })

  // 获取档案统计数量
  const getRecordNum = () => {
    ajax.record.getReordNum<null, RecordNUmType>()
      .then(res => {
        console.log(res);
        if (res.data) setRecordNum(res.data)
      })
  }

  useEffect(() => {
    getRecordNum()
  }, [])

  return <div className={`${prefixClsNum}`}>
    <div className="total-data">
      {
        recordNumList.map(item => {
          return <div className={`total-item total-${item.key}`} key={item.key}>
            <div className="total-img"></div>
            {/* <img src={item.icon} alt={item.title} /> */}
            <div className="total-type">{item.title}<div className="type-info">{item.info}</div></div>
            {/* <div className="total-num"><span className="num">{recordNum[item.key]}</span> 个</div> */}
            <div className="bottom-num">
              {
                item.childrens.map(ele => {
                  return <div className="num-item" key={ele.key}>
                    <div className="label">{ele.title}：</div>
                    <div className="value">{Number(recordNum[ele.key]).toLocaleString()}</div>
                  </div>
                })
              }
            </div>
          </div>
        })
      }
    </div>
  </div>
}
export default RecordNum
