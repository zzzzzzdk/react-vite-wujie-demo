import Title from '../Title'
import { Card } from '@/components'
import { useEffect, useState } from 'react'
import ajax, { ApiResponse } from '@/services'
import { CaseData, BaseInfoProps } from '../interface'
import { Modal, Row, Col, Popover } from '@yisa/webui'
import { LeftOutlined, RightOutlined } from '@yisa/webui/es/Icon'
import './index.scss'
import CaseModal from './CaseModal'
const CaseList = (props: BaseInfoProps) => {
  const {
    title = '基本信息',
    type = 'case',
    hasEditBtn = true,
    data = { idNumber: '', groupId: [] }
  } = props

  const prefixCls = 'baseinfo-caselist'

  const [caseData, setCaseData] = useState<CaseData[]>([])

  const handleSearch = () => {
    ajax.record.getCaseLists<{ idNumber: string, groupId: string[] }, CaseData[]>(data)
      .then(res => {
        if (res.data) {
          setCaseData(res.data)
        }
      })
  }

  useEffect(() => {
    if (data.idNumber || data.groupId) {
      handleSearch()
    }
  }, [data.idNumber])

  const [caseVisible, setCaseVisible] = useState(false)
  // 弹窗案件详情数据
  const [caseDetailData, setCaseDetailData] = useState<CaseData>({
    "id": "",
    "caseName": "",
    "caseNumber": "",
    "caseType": "",
    caseTypeText: '',
    "caseClassify": "",
    "caseStatus": "",
    "caseStatusText": "",
    "caseRegionName": "",
    "caseTimes": [],
    "casePlace": "",
    "lngLat": {
      "lat": "",
      "lng": ""
    },
    "caseLabels": [],
    "imformantName": "",
    "handleName": [],
    "involvePerson": [],
    "caseDetails": ""
  })

  const handleOpenCaseModal = (data: CaseData) => {
    setCaseVisible(true)
    setCaseDetailData(data)
  }

  if (!hasEditBtn && !caseData?.length) {
    return null
  }
  return <div className={`${prefixCls}`}>
    <Title
      title={title}
      hasEditBtn={hasEditBtn}
    />
    <div className="case-lists">
      {
        caseData.map(item => {
          return <div
            onClick={() => { handleOpenCaseModal(item) }}
            key={item.caseNumber}
          >
            <Card.CaseInfo
              data={item}
            />
          </div>
        })
      }
    </div>
    <CaseModal
      key={caseDetailData.caseNumber}
      caseData={caseDetailData}
      onCancel={() => setCaseVisible(false)}
      caseVisible={caseVisible}
    />
  </div>
}
export default CaseList