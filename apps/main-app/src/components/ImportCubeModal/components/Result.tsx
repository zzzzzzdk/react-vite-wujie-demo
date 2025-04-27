import { useContext } from "react"
import { DataContext } from "../context"
import { } from '@yisa/webui'
import { CheckOutlined, ExclamationOutlined } from '@yisa/webui/es/Icon'

const ImportCubeResult = () => {
  const { status, resultData, formData, type } = useContext(DataContext)!

  const isSuccess = resultData.status === 'success'
  const isError = resultData.status === 'error'

  if (isSuccess) {
    const successResult = (
      <div className='import-cube-result success'>
        <div className="icon-wrap"><CheckOutlined /></div>
        <p className="text">导入成功</p>
        {
          type === "target" ?
            <div className="success-text">{formData.table}已导入成功 <span className="total">{resultData.size}</span> 条，请前往数智万象查看。</div>
            :
            <div className="success-text">{formData.table}已导入成功 <span className="total">{resultData.archivesCount || 0}</span> 个档案，共<span className="total">{resultData.captureCount || 0}</span>条数据，请前往数智万象查看。</div>
        }
      </div>
    )
    return successResult
  }

  if (isError) {
    const errorResult = (
      <div className='import-cube-result error'>
        <div className="icon-wrap"><ExclamationOutlined /></div>
        <p className="text">导入失败</p>
        <div className="error-text">{resultData.errorReason || '--'}</div>
      </div>
    )
    return errorResult
  }

  return null
}

export default ImportCubeResult
