import React from "react";

export interface HlsPlayProps {
  className?: string
}

export interface HlsPlayRefProps {
  changeUrl: (url: string) => void
}

export interface HlsPlayRefType {
  detachMedia: () => void
  attachMedia: (node: React.ReactNode) => void
  isSupported: () => void
}
