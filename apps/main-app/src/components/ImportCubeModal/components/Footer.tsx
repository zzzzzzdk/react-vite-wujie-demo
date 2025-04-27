import { useContext, useState } from "react"
import { DataContext } from "../context"
import { Button, Message } from '@yisa/webui'
import { STATUS, ResultDataType } from "../interface"
import services from "@/services"
import { radioGroup } from "./Form"

const ImportCubeFooter = () => {
  const {
    url,
    status,
    onCancel,
    resultData,
    formData,
    changeFormData,
    resultFormData = {},
    changeStatus,
    changeResultData,
    type
  } = useContext(DataContext)!

  const [loading, setLoading] = useState(false)

  function validateString(str: string) {
    // 检查首字是否不是数字
    if (/\D/.test(str.charAt(0))) {
      // 检查整个字符串是否只包含字母、数字、中文
      if (/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(str)) {
        return true;
      }
    }
    return false;
  }

  const startImport = () => {
    if (!formData.table) {
      Message.warning("请输入结果表名！")
      return
    }

    if (!validateString(formData.table)) {
      Message.warning("结果表名不能含特殊字符且首字不能为数字, 请修改表名")
      return
    }

    if (!formData.size && type === "target") {
      Message.warning('导入条数应大于0！')
      return
    }

    setLoading(true)

    services.importCube<any, ResultDataType>(url, {
      ...resultFormData,
      ...formData
    }).then(res => {
      console.log(res)
      const { data = { size: 0, url: '', archivesCount: 0, captureCount: 0 } } = res
      setLoading(false)
      changeStatus(STATUS.RESULT)
      changeResultData({
        status: 'success',
        size: data.size,
        url: data.url,
        archivesCount: data.archivesCount,
        captureCount: data.captureCount
      })
    }).catch(err => {
      let response = err.response || {}
      const msg = response.data ? response.data.message : response.statusText
      setLoading(false)
      changeStatus(STATUS.RESULT)
      changeResultData({
        status: 'error',
        errorReason: msg
      })
      console.log(msg)
    })
  }

  const handleCancel = () => {
    onCancel?.()
    changeStatus(STATUS.FORM)
    changeFormData({
      table: '',
      size: 0,
      exportType: radioGroup[0].value
    })
  }

  const handleNext = () => {
    if (resultData.status === 'success') {
      // window.open(window.YISACONF.das_url)
      window.open(resultData.url)
    } else {
      changeStatus(STATUS.FORM)
    }
  }

  const isForm = status === STATUS.FORM
  const isResult = status === STATUS.RESULT

  const FormFooter = (
    <>
      <Button onClick={handleCancel}>取消</Button>
      <Button type="primary" onClick={startImport} loading={loading} className="start-import">
        确认
      </Button>
    </>
  );

  const ResultFooter = (
    <>
      <Button onClick={handleCancel}>关闭</Button>
      <Button type="primary" onClick={handleNext}>
        {resultData.status === 'success' ? '前往数智万象' : '重新导入'}
      </Button>
    </>
  );

  return (
    <div className="import-cube-footer">
      {isForm && FormFooter}
      {isResult && ResultFooter}
    </div>
  )
}

export default ImportCubeFooter
