"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = {
  src: string;
  title?: string;
  onTimeUpdate?: (seconds: number) => void;
  startTime?: number;
};

export default function Player({ src, title, onTimeUpdate, startTime = 0 }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;

    const isHls = src.endsWith(".m3u8") || src.includes(".m3u8");
    if (isHls && !video.canPlayType("application/vnd.apple.mpegurl")) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        console.warn("HLS not supported");
      }
    } else {
      if (video.src !== src) video.src = src;
    }

    const timeHandler = () => {
      if (onTimeUpdate) onTimeUpdate(Math.floor(video.currentTime));
    };

    video.addEventListener("timeupdate", timeHandler);

    const setStart = () => {
      if (startTime > 0 && video.duration && !isNaN(video.duration)) {
        video.currentTime = Math.min(startTime, Math.max(0, video.duration - 1));
      }
    };

    video.addEventListener("loadedmetadata", setStart);

    return () => {
      video.removeEventListener("timeupdate", timeHandler);
      video.removeEventListener("loadedmetadata", setStart);
      if (hls) {
        hls.destroy();
        hls = undefined;
      }
    };
  }, [src, onTimeUpdate, startTime]);

  return (
    <div style={{ maxWidth: 1200 }}>
      {title && <h2>{title}</h2>}
      <video ref={videoRef} controls style={{ width: "100%", maxHeight: "70vh" }} />
    </div>
  );
}