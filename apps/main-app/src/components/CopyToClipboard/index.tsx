import React from "react"
import { CopyToClipboardProps } from './interface'
import { Message } from '@yisa/webui'
import { CopyOutlined } from '@yisa/webui/es/Icon'
import { CopyToClipboard as CopyToClipboardF } from 'react-copy-to-clipboard'
import './index.scss'

const CopyToClipboard = (props: CopyToClipboardProps) => {
  const {
    text = ''
  } = props

  // 复制
  // const handleCopy = (text: CopyToClipboardProps["text"]) => {
  //   if (
  //     typeof navigator === 'object' &&
  //     'clipboard' in navigator
  //   ) {
  //     navigator.clipboard.writeText(text as string)
  //       .then(() => {
  //         Message.success('已复制到剪贴板')
  //       })
  //       .catch(() => {
  //         Message.error('无法复制文本')
  //       })
  //   } else {
  //     let copyInput = document.createElement('input')
  //     copyInput.value = text as string
  //     document.body.appendChild(copyInput)
  //     copyInput.select()
  //     document.execCommand('copy')
  //     document.body.removeChild(copyInput)
  //     Message.success('已复制到剪贴板')
  //   }
  // }

  return (
    <CopyToClipboardF
      text={text}
      onCopy={() => {
        Message.success('已复制到剪贴板')
      }}
    >
      <div className="copy-to-clipboard" title="复制">
        <CopyOutlined />
      </div>
    </CopyToClipboardF>
  )
}

export default CopyToClipboard
