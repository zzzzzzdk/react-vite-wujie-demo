import React, { useState, useRef, useMemo } from 'react'
import { Input, Modal, Form, DatePicker, Select,Cascader} from '@yisa/webui'
// import { Input, Cascader } from '@yisa/webui'
import './index.scss'
import dayjs from 'dayjs'
const { TextArea } = Input
const { RangePicker } = DatePicker

const placeoptions = [
    {
        label: '地点一',
        value: '1'
    },
    {
        label: '地点二',
        value: '2'
    },
    {
        label: '地点三',
        value: '3'
    }
]
const poweroptions = [
    {
        label: '权限一',
        value: '1'
    },
    {
        label: '权限二',
        value: '2'
    }
]
function AddModal(props: any) {
    const { visible, onCancel, onOk, formdata, setFormdata, title,statusoptions } = props
    const inputRef = useRef<any>(null)
    const [inputError, setInputError] = useState('')
    const updateInputError = (e: any) => {
        let flag = (e.target.value.indexOf('-') !== -1)
        // inputerrortitle(e)
        if (flag) {
            setTimeout(() => {
                if (inputRef.current && inputRef.current.dom) {
                    inputRef.current.dom.classList.add('ysd-input-error')
                    inputRef.current.dom.parentNode.classList.add('ysd-input-inner-error')
                }
            }, 100)
        } else {
            setTimeout(() => {
                if (inputRef.current && inputRef.current.dom) {
                    inputRef.current.dom.classList.remove('ysd-input-error')
                    inputRef.current.dom.parentNode.classList.remove('ysd-input-inner-error')
                }
            }, 100);
        }
    }
    const inputerrortitle = (e: any, message: string = '不可输入字符【-】') => {
        let value = e.target.value
        if (value.indexOf('-') !== -1) {
            setInputError(message)
        } else {
            setInputError('')
        }
    }
    const onchangetitle = (e: any) => {
        // let value=e.target.value
        inputerrortitle(e)
        setFormdata({ ...formdata, name: e.target.value })
        updateInputError(e)
    }
    const onchangeid = (e: any) => {
        setFormdata({ ...formdata, casenum: e.target.value })
    }
    const onchangetime = (date: any, datestring: string[]) => {
        // console.log(datestring);
        setFormdata({ ...formdata, time: datestring })
    }
    const onchangebrief = (e: any) => {
        // console.log(e);
        setFormdata({ ...formdata, brief: e.target.value })
    }
    const onchangeplace = (e: any) => {
        // console.log(e);
        setFormdata({ ...formdata, place: e })
    }
    const onchangedetails = (e: any) => {
        setFormdata({ ...formdata, details: e.target.value })
    }
    const onchangestatus = (e: any) => {
        setFormdata({ ...formdata, status: e })
    }
    const onchangepower = (e: any) => {
        setFormdata({ ...formdata, power: e })
    }
    return (
        <Modal
            title={title}
            className='addcluemodel'
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
        >
            <Form>
                <Form.Item required label='案件名称'>
                    <div>
                        <Input
                            ref={inputRef}
                            value={formdata.name}
                            onChange={(e) => { onchangetitle(e) }}
                            onFocus={(e) => {
                                inputerrortitle(e)
                                updateInputError(e)
                            }}
                            onBlur={(e) => {
                                updateInputError(e)
                            }}
                            onMouseOver={(e) => updateInputError(e)}
                            onMouseLeave={(e) => updateInputError(e)}
                            maxLength={30} showWordLimit
                        />
                        {
                            inputError ? <p>{inputError}</p> : ''
                        }
                    </div>
                </Form.Item>
                <Form.Item label='案件编号'>
                    <Input value={formdata.casenum} onChange={(e) => { onchangeid(e) }} maxLength={50} showWordLimit />
                </Form.Item>
                <Form.Item label='简要案情'>
                    <TextArea value={formdata.brief} autoSize={{ minRows: 3, maxRows: 10 }} onChange={(e) => { onchangebrief(e) }} maxLength={200} showWordLimit></TextArea>
                </Form.Item>
                <Form.Item label='事发时间'>
                    <RangePicker  showTime value={[dayjs(formdata.time[0]), dayjs(formdata.time[1])]} onChange={(e, h) => { onchangetime(e, h) }} allowClear={false}/>
                </Form.Item>
                <Form.Item label='事发地点'>
                    <Select options={placeoptions} value={formdata.place} onChange={(e) => { onchangeplace(e) }} />
                </Form.Item>
                <Form.Item label='详细地址'>
                    <Input value={formdata.details} onChange={(e) => { onchangedetails(e) }} maxLength={50} showWordLimit />
                </Form.Item>
                <Form.Item label='案件状态'>
                    <Select options={statusoptions} value={formdata.status} onChange={(e) => { onchangestatus(e) }} listHeight={150}/>
                </Form.Item>
                <Form.Item label='权限配置'>
                    <Select options={poweroptions} value={formdata.power} onChange={(e) => { onchangepower(e) }} />
                </Form.Item>
                {/* <Form.Item label='ces配置'>
                <Cascader options={options}></Cascader>
                </Form.Item> */}
            </Form>
        </Modal>
    )
}

export default AddModal
