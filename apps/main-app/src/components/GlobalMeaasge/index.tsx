import React, { useState } from "react"
import { Message, Progress, Space } from '@yisa/webui'
import { useRafInterval } from 'ahooks';
import loadingLightIcon from "@/assets/images/loading-icon-light.gif"
import './index.scss'

function GlobalMeaasge() {
  return null
}

function ProgressBar(props: { progress?: number }) {
  const { progress } = props
  const [percent, setPercent] = useState(0)

  useRafInterval(() => {
    if (percent <= 90 && !('progress' in props)) {
      setPercent(percent + 1);
    }
  }, 2000);

  return (
    <Progress
      percent={progress ? progress : percent}
      strokeColor={"#3377FF"}
      status="active"
      strokeWidth={10}
    />
  )
}

GlobalMeaasge.showLoading = () => {
  return Message.loading({
    id: 'need_update',
    className: "global-loading-message",
    duration: 0,
    content: (
      <Space size={20}>
        <div className="loading-icon">
          <img src={loadingLightIcon} />
        </div>
        <div>
          <ProgressBar />
          <p>您的检索请求涉及大量数据，系统正在全力处理中</p>
        </div>
      </Space>
    ),
  });
}

GlobalMeaasge.hideLoading = () => {
  return Message.success({
    id: 'need_update',
    className: "global-loading-message",
    duration: 200,
    content: (
      <div>
        <ProgressBar progress={100} />
        <p>请求成功</p>
      </div>
    ),
  });
}

export default GlobalMeaasge