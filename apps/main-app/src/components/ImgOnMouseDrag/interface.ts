import React, { PropsWithChildren } from 'react'

export default interface ImgOnMouseDragProps extends PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
  imgUrl?: string;
}