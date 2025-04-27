/**
 * 图片放大镜组件Props
 */
 export default interface ImgZoomProps {
  imgSrc: string
  position?: "left" | "right"
  scale?: boolean
  draggable?:boolean
}
