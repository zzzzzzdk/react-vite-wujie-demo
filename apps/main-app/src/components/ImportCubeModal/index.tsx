import React, { useContext, createContext, useState } from 'react'
import { Modal } from '@yisa/webui'
import { ImportCubeModalProps, STATUS, FormDataType, ResultDataType } from './interface'
import { DataContext } from './context'
import Footer from './components/Footer'
import ImportCubeForm, { radioGroup } from './components/Form'
import ImportCubeResult from './components/Result'
import classNames from 'classnames'
import './index.scss'

const ImportCubeModal = (props: ImportCubeModalProps) => {
  const {
    className,
    modalProps,
    resultFormData = {},
    url = '',
    recordData = {},
    type = "target",
    searchInfo
  } = props

  const [status, setStatus] = useState(STATUS.FORM)
  const [formData, setFormData] = useState<FormDataType>({
    table: '',
    size: 0,
    exportType: radioGroup[0].value
  })
  const [resultData, setResultData] = useState<ResultDataType>({
    status: 'success',
    url: '',
    size: 0,
    errorReason: '',
  })

  const changeStatus = (status: STATUS) => {
    setStatus(status)
  }

  const changeFormData = (form: FormDataType) => {
    setFormData(form)
  }

  const changeResultData = (result: ResultDataType) => {
    setResultData(result)
  }

  return (
    <DataContext.Provider value={{
      url,
      status,
      changeStatus,
      onCancel: modalProps?.onCancel,
      resultData,
      changeResultData,
      formData,
      changeFormData,
      resultFormData,
      recordData,
      type,
      searchInfo
    }}>
      <Modal
        title={status === STATUS.RESULT ? null : "导入检索结果至数智万象"}
        className={classNames('import-cube', className)}
        footer={null}
        {...modalProps}
      >
        {status === STATUS.FORM && <ImportCubeForm />}
        {status === STATUS.RESULT && <ImportCubeResult />}
        <Footer />
      </Modal>
    </DataContext.Provider>
  )
}

export default ImportCubeModal
