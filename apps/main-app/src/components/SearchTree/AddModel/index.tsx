import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Input, Modal, Form, DatePicker, Select, Cascader, TreeSelect,Message } from '@yisa/webui'
import './index.scss'
// import services from "@/services";
import { AddModelProps } from './interface'
import dayjs from 'dayjs'
import services from '@/services'
import { ClueTreeItem, LocationItem } from '../interface'
import { SharePermissions } from '@/components'
import { Receiver } from '@/pages/Deploy/Deploy/interface'
// import { TimeRangePicker } from '@/components'
const { TextArea } = Input
const { RangePicker } = DatePicker

function AddModal(props: AddModelProps) {
    const { visible, onCancel, onOk, formdata, setFormdata, title, statusoptions, options } = props
    const inputRef = useRef<any>(null)
    const [sharePermissionsVisible, setSharePermissionsVisible] = useState(false)
    const [inputError, setInputError] = useState('')
    // const [locationdata,setLocationdata]=useState([''])
    const locationref = useRef([''])
    const updateInputError = (e: any) => {
        let flag = (e.target.value.indexOf('-') !== -1)
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
    const handleSharePermissionCancel = () => {
        setSharePermissionsVisible(false)
    }
    const handleSharePermissionOk = (data: { privilege: number, sharedUsers: Receiver[] }) => {
        // console.log(data)
        if(data.privilege===1&&data.sharedUsers.length===0){
            Message.warning('未选择共享对象')
            return
        }
        setFormdata({...formdata,privilege:data.privilege,privilegeUser: data.sharedUsers.map((item) => item.id)})
        setSharePermissionsVisible(false)
    }
    const handleItemAuth =()=>{
        setSharePermissionsVisible(true)
    }

    return (
        <Modal
            title={title}
            className='addcluemodel'
            visible={visible}
            onCancel={onCancel}
            onOk={onOk}
            unmountOnExit
        >{
                <Form>
                    <Form.Item required label='案件名称'>
                        <div className='nameinput'>
                            <Input
                                ref={inputRef}
                                value={formdata.title}
                                onChange={(e) => {
                                    inputerrortitle(e)
                                    setFormdata({ ...formdata, title: e.target.value })
                                    updateInputError(e)
                                }}
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
                        <Input value={formdata.caseId} onChange={(e) => { setFormdata({ ...formdata, caseId: e.target.value }) }} maxLength={50} showWordLimit />
                    </Form.Item>
                    <Form.Item label='简要案情'>
                        <TextArea value={formdata.caseDetails} autoSize={{ minRows: 3, maxRows: 10 }} onChange={(e) => { setFormdata({ ...formdata, caseDetails: e.target.value }) }} maxLength={200} showWordLimit></TextArea>
                    </Form.Item>
                    <Form.Item label='事发时间'>
                        <RangePicker showTime value={formdata.caseTime.length > 0 ? [dayjs(formdata.caseTime[0]), dayjs(formdata.caseTime[1])] : [null, null]} onChange={(e, datestring) => { setFormdata({ ...formdata, caseTime: datestring }) }} allowClear={false} />
                    </Form.Item>
                    <Form.Item label='事发地点'>
                        <Cascader options={options} defaultValue={formdata.caseRegionName as string[]} onChange={
                            (e) => {
                                setFormdata({ ...formdata, caseRegionCode: e as string[], caseRegionName: e as string[] })
                                // setFormdata({ ...formdata, caseRegionName: e as string[]})
                            }}></Cascader>
                        {/* <Cascader options={options} value={formdata.caseRegionCode} onChange={(e) => { setFormdata({ ...formdata, caseRegionCode: e as string[]}) }}></Cascader> */}
                        {/* <TreeSelect treeData={options} value={formdata.caseRegionCode} onChange={(e) => { setFormdata({ ...formdata, caseRegionCode: e}) }}></TreeSelect> */}
                    </Form.Item>
                    <Form.Item label='详细地址'>
                        <Input value={formdata.casePlace} onChange={(e) => { setFormdata({ ...formdata, casePlace: e.target.value }) }} maxLength={50} showWordLimit />
                    </Form.Item>
                    <Form.Item label='案件状态'>
                        <Select
                            options={statusoptions}
                            value={formdata.caseStatus}
                            onChange={(e) => { setFormdata({ ...formdata, caseStatus: e as number }) }}
                            listHeight={150}
                            // @ts-ignore
                            getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                        />
                    </Form.Item>
                    {/* <Form.Item label='权限配置'>
                        <Select
                            options={poweroptions}
                            value={formdata.privilege==0?"私有":"共享"}
                            onChange={(e) => { setFormdata({ ...formdata, privilege: e as number }) }}
                            disabled
                            // getTriggerContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                        />
                    </Form.Item> */}
                    <Form.Item label='权限配置'>
                        <Input readOnly onClick={()=>handleItemAuth()} value={formdata.privilege===0?'私密':'共享'}></Input>
                    </Form.Item>
                </Form>
            }
            <SharePermissions
                modalProps={{
                    visible: sharePermissionsVisible,
                    onCancel: handleSharePermissionCancel
                }}
                onOk={handleSharePermissionOk}
                data={formdata}
            />
        </Modal>
    )
}

export default AddModal
