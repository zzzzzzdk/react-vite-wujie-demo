import React, { useState, useEffect } from 'react'
import { Icon, } from '@yisa/webui/es/Icon'
import { Modal, Message, Button, Input, Form, Upload, Radio, Progress } from '@yisa/webui'
import './index.scss'
import services from '@/services'
import ajax from '@/utils/axios.config'
import { FormInput } from '..'
import { RadioChangeEvent } from '@yisa/webui/es/Radio/interface'
import { ModalFeedBackProps } from './interface'
function ModalFeedback(props: ModalFeedBackProps) {

    const { visible, handleFeedBackCancel, uid, maxSize = 100 } = props
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState<File[]>([])
    const [progress, setProgress] = useState<number>(0);
    const [formData, setFormData] = useState({
        feedback_type: '2',
        feedback_describe: ''
    })
    const resetForm = {
        feedback_type: '2',
        feedback_describe: ''
    }
    const resetf=()=>{
        setFileList([])
        setFormData(resetForm)
        setProgress(0)
    }
    const yisaData = [
        {
            label: '问题反馈',
            value: '2'
        },
        {
            label: '功能建议',
            value: '1'
        },
        {
            label: '使用体验',
            value: '3'
        },
        {
            label: '其他',
            value: '4'
        }
    ]

    const onChangeType = (v: string) => {
        setFormData({ ...formData, feedback_type: v })
    }
    const onChangeTextarea = (value: string) => {
        setFormData({ ...formData, feedback_describe: value })
    }

    const onChangeFile = (v:File[]) => {
        setFileList(v)
    }

    const handleOk = () => {
        const fd = new FormData()
        fileList.forEach(file => {
            fd.append('files', file)
        })
        // fd.append('files',fileList)
        fd.append('type', formData.feedback_type)
        fd.append('description', formData.feedback_describe)
        fd.append('uid', uid)
        // fd.append('system_id', window.YISACONF.sys)

        if (!formData.feedback_describe) {
            Message.warning('请填写反馈描述')
            return
        }
        setLoading(true)

        ajax({
            url: window.YISACONF.pdm_host + '/api/pdm/v1/feedback/feedback',
            method: 'post',
            data: fd,
            onUploadProgress: function(progressEvent:ProgressEvent) {
                const percent = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                setProgress(percent);
                // 可以在这里更新用户界面以显示上传进度
              }
        })?.then(res => {
            setLoading(false)
            Message.success('提交成功')
            handleFeedBackCancel()
        }).catch(err => {
            Message.error('提交失败')
            return
        })
    }
    const handleCancel = () => {
        handleFeedBackCancel()
        resetf()
    }

    const handleAfterClose = () => {
        resetf()
    }

    return (
        <Modal
            wrapClassName="modal-feedback"
            visible={visible}
            title="意见反馈"
            onOk={handleOk}
            onCancel={handleCancel}
            afterClose={handleAfterClose}
            unmountOnExit
        ><div>
                <div className='feedback-info'>
                    <Icon type="xiaolian" /><span>请在此留下您的反馈，您的宝贵意见非常重要！</span>
                </div>
                <Form>
                    <Form.Item label='反馈类型' required>
                        <Radio.Group options={yisaData} value={formData.feedback_type} onChange={(e: RadioChangeEvent) => {
                            onChangeType(e.target.value)
                        }} />
                    </Form.Item>
                    <Form.Item label='反馈描述' required>
                        <Input.TextArea
                            maxLength={200}
                            showWordLimit
                            // style={m}
                            value={formData.feedback_describe}
                            onChange={(e, value) => { onChangeTextarea(value) }}
                            autoSize={{ minRows: 4 }}
                            placeholder='请详细描述您的建议或遇到的问题，每条反馈我们都会认真查看呦～'
                        />
                    </Form.Item>
                    <Form.Item label='上传文件'>
                        <FormInput
                            maxText='上传文件过大，请不要超过100M'
                            onChange={onChangeFile}
                            defaultValue={fileList}
                            maxSize={maxSize}
                        ></FormInput>
                    </Form.Item>
                    {progress > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <Progress percent={progress} status="active" className='progress-line'/>
                        </div>
                    )}
                </Form>

            </div></Modal>
    )
}

export default ModalFeedback