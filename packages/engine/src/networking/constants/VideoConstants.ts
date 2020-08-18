// adding constraints, VIDEO_CONSTRAINTS is video quality levels
// localMediaConstraints is passed to the getUserMedia object to request a lower video quality than the maximum
export const VIDEO_CONSTRAINTS = {
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};

export const localMediaConstraints = {
  audio: true,
  video: {
    width: VIDEO_CONSTRAINTS.qvga.width,
    height: VIDEO_CONSTRAINTS.qvga.height,
    frameRate: { max: 30 }
  }
};

// encodings for outgoing video
// just two resolutions, for now, as chrome 75 seems to ignore more
// than two encodings
export const CAM_VIDEO_SIMULCAST_ENCODINGS = [
  { maxBitrate: 36000, scaleResolutionDownBy: 2 }
  // { maxBitrate: 96000, scaleResolutionDownBy: 2 },
  // { maxBitrate: 680000, scaleResolutionDownBy: 1 },
];
