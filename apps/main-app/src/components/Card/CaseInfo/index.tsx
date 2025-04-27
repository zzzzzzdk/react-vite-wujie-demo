import './index.scss'
const CaseInfo = (props: any) => {
  const { data } = props
  const prefixCls = 'caselist-item'
  return <div className={`${prefixCls}`}>
    <div className="case-title">
      <div className="case-type">{data.caseTypeText}</div>
      <div className="case-info">
        <span>{data.caseName}</span>
        <span>{data.caseNumber}</span>
      </div>
    </div>
    <div className="case-content">
      <div className="time-location">
        <div className="case-time">案发时间：{data.caseTimes[0] || '-'} </div>
        <div className="case-location">案发地点：{data.casePlace}</div>
      </div>
      <div className="info">
        <div style={{ width: '70px' }}>案发内容：</div>
        <span className="info-info">{data.caseDetails}</span>
      </div>
    </div>
  </div>
}
export default CaseInfo