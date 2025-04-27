import React, { useState, useEffect } from 'react'
import { Icon} from '@yisa/webui/es/Icon'
import { Row, Col, Message,Upload } from '@yisa/webui'
import './index.scss'
import { FormInputProps } from './interface'

function FormInput(props: FormInputProps) {
    const {
        maxSize = 100,
        maxText = '文件过大，请重新上传！',
        placeholder = `单个文件不大于${maxSize}M`,
        defaultValue = [],
        onChange,
    } = props

    // const [value, setValue] = useState(defaultValue)
    const [fileList, setFileList] = useState<File[]>(defaultValue)
    const beforeUpload = (file: File) => {

        const isLt2M = file.size / 1024 / 1024 < maxSize
        if (!isLt2M) {
            Message.warning(maxText)
            return false
        }

        setFileList([...fileList, file])
        return false

    }

    const options = {
        // onChange: onHandleChange,
        showUploadList: false,
        beforeUpload: beforeUpload
    }

    const handleDelFile = (v: File,index:number) => {
        let newfileList=[...fileList]
        newfileList.splice(index,1)
        setFileList(newfileList)
    }

    useEffect(() => {
        if (onChange)
            onChange(fileList)
    }, [JSON.stringify(fileList)])

    useEffect(() => {
        if (defaultValue)
            setFileList(defaultValue)
    }, [defaultValue])

    return (
        <div className={"form-upload"}>
            <div className="form-input-content">
                <Upload {...options}>
                    {/* <Button text='选择文件'/> */}
                </Upload>
                <span className='tishi'>* {placeholder}</span>
                <div className='file-list'>
                    <Row>
                        {fileList.map((item: File, index: number) => {
                            return (
                                <Col key={index} span={12}>
                                    <div className='file-list-item'>
                                        <span className='icon'>
                                            <Icon type={'wenjian1'} />
                                        </span>
                                        <span className='info' title={item.name}>{item.name}</span>
                                        <span className='size'>({(item.size / 1024 / 1024).toFixed(2)}M)</span>
                                        <span className='close' onClick={() => handleDelFile(item,index)}><Icon type='quxiao' /></span>
                                    </div>
                                </Col>)
                        })}
                    </Row>
                </div>
            </div>

        </div>
    )
}

export default FormInput