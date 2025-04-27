import { ResultRowType } from "@/pages/Search/Target/interface";
import React from "react";


export interface GaitModalProps {
  title?: React.ReactNode
  gaitModalVisible: boolean
  onCancel: () => void
  data?: ResultRowType[]
  currentIndex: number
}

export interface GaitVideoProps {
  data: ResultRowType
  playAllVideo: () => void,
  playerId?:string
}

export interface GaitVideoRef {
  playVideo: () => void
  closeVideo: () => void
}

export interface GaitVideoPlayFormData {
  from: string
  data: Pick<ResultRowType, "locationId" | "captureTime" | "locationName" | "gaitVideoStartTime" | "gaitVideoDuration" | "gaitVideoUrl">
}

export interface GaitVideoPlayType {
  videoUrl: string
  locationId: string
}
