interface Trackplayback {
  on: any;
  off: any;
  start: () => void;
  stop: () => void;
  rePlaying: () => void;
  slowSpeed: () => void;
  quickSpeed: () => void;
  getSpeed: () => void;
  getCurTime: () => number;
  getStartTime: () => number;
  getEndTime: () => number;
  isPlaying: () => void;
  setCursor: (time: number) => void;
  setSpeed: (speed: number) => void;
  showTrackPoint: () => void;
  hideTrackPoint: () => void;
  showTrackLine: () => void;
  hideTrackLine: () => void;
  dispose: () => void;
  getTrackPointsBeforeTime: (time: number) => void;
}

declare module "trackplayback" {
  export = trackplayback;
}
declare var trackplayback: Trackplayback;