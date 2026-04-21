import { useEffect, useRef, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => {
      setFading(true);
      setTimeout(onFinish, 600);
    };

    video.addEventListener("ended", handleEnd);

    const timeout = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 600);
    }, 15000);

    return () => {
      video.removeEventListener("ended", handleEnd);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-600"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto" }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onError={() => {
          setFading(true);
          setTimeout(onFinish, 600);
        }}
      />
    </div>
  );
}
