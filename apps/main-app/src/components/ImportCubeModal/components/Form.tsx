import React, { useContext, useState } from "react"
import { DataContext } from "../context"
import { Form, Input, Message, Radio } from "@yisa/webui"
import { RadioChangeEvent } from '@yisa/webui/es/Radio'
const { InputNumber } = Input
export const radioGroup = [
  {
    label: "全部档案",
    value: 1,
    name: "totalRecords"
  },
  {
    label: "仅实名档案",
    value: 2,
    name: "realNameRecords"
  },
  {
    label: "仅未实名档案",
    value: 3,
    name: "unrealNameRecords"
  },
]

const ImportCubeForm = () => {
  const { status, formData, changeFormData, recordData, type, searchInfo } = useContext(DataContext)!

  const [tableErrorText, setTableErrorText] = useState("")

  const handleChange = (value: string | number, field: string) => {
    changeFormData({
      ...formData,
      [field]: value
    })
  }

  const calcRadioGroup = radioGroup.map(item => {
    return {
      label: <div className="record-label"><span>{item.label}</span><span>{recordData[item.name] || 0}条档案</span></div>,
      value: item.value
    }
  })

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

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (!value) {
      setTableErrorText("")
      return;
    }

    if (validateString(value)) {
      setTableErrorText("")
    } else {
      setTableErrorText("不含特殊字符且首字不能为数字")

      if (event.relatedTarget?.classList.contains("start-import")) {
        return
      }
      Message.warning("结果表名不能含特殊字符且首字不能为数字, 请修改表名")
    }
  }

  return (
    <div className={`import-cube-form ${type === "record" ? "record-margin" : ""}`}>
      <Form >
        {
          type === "record" && <>
            <Form.Item label="">
              <div className="cube-describe">
                <p>基于检索条件 {searchInfo ? `【${searchInfo}】` : '【检索条件：值】'}，共检索到<em>{recordData.totalRecords}</em>个档案。</p>
                <p>请选择需导入的档案类型，导入数据条数上限100万条。</p>
              </div>
            </Form.Item>
            <Form.Item label="">
              <>
                <div className="export-type">
                  <Radio.Group buttonGap optionType="button" options={calcRadioGroup} onChange={(e) => { handleChange(e.target.value, "exportType") }} value={formData.exportType} />
                </div>
              </>

            </Form.Item>
          </>
        }
        <Form.Item label="结果表名" required>
          <div>
            <Input
              value={formData.table}
              onChange={(e) => handleChange(e.target.value, 'table')}
              placeholder="请输入表名"
              error={tableErrorText}
              onBlur={handleBlur}
              allowClear={true}
              maxLength={20}
            />
            <div className="tip">（命名要求：限20字，不含特殊字符且首字不能为数字）</div>
          </div>
        </Form.Item>
        {
          type === "target" && <Form.Item label="导入" required>
            <div>
              <InputNumber
                min={0}
                value={formData.size}
                onChange={(val) => handleChange((val || 0), 'size')}
                max={1000000}
              />
              &nbsp;&nbsp;条
              <div className="tip">（基于检索结果最近时间向前回溯导入，最多支持100万条数据导入）</div>
            </div>
          </Form.Item>
        }
      </Form>
    </div>
  )
}

export default ImportCubeForm
