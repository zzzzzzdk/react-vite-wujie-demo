//组件接受的参数 ，定义为 ：ComponentNameProps
//组件的里面如果需要请求：请求参数：定义为：ComponentNameFormDataType
export interface VideoPlayProps {
  type?: "flv" | "mp4" | "m3u8"
  className?: string
}

export interface VideoPlayRefProps {
  changeUrl: (url: string) => void
  destroyVideo?: () => void
}
