"use client";

import React, { useEffect, useRef, useState } from "react";

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  analyserNode: AnalyserNode | null;
  barCount?: number;
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  analyserNode,
  barCount = 5,
  className = "h-4 flex items-center gap-[3px]",
}) => {
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    new Array(barCount).fill(3)
  );
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setBarHeights(new Array(barCount).fill(3));
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let dataArray: any = null;
    if (analyserNode) {
      dataArray = new Uint8Array(new ArrayBuffer(analyserNode.frequencyBinCount));
    }

    let t = 0;

    const render = () => {
      t += 0.08;

      if (analyserNode && dataArray) {
        analyserNode.getByteFrequencyData(dataArray);

        // Sample frequencies evenly across the low-to-mid spectrum
        const step = Math.floor(dataArray.length / (barCount + 2));
        const newHeights = Array.from({ length: barCount }, (_, i) => {
          const val = dataArray![(i + 1) * step] || 0;
          // Scale 0-255 to min 3px, max 16px
          return Math.max(3, Math.min(16, (val / 255) * 16));
        });

        setBarHeights(newHeights);
      } else {
        // Fallback procedural oscillation if analyser has no stream yet
        const newHeights = Array.from({ length: barCount }, (_, i) => {
          const offset = i * 0.8;
          const osc = (Math.sin(t + offset) + 1) * 0.5; // 0 to 1
          return Math.max(3, Math.min(16, 3 + osc * 13));
        });
        setBarHeights(newHeights);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, analyserNode, barCount]);

  return (
    <div className={className} aria-hidden="true">
      {barHeights.map((height, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full bg-gold transition-[height] duration-75 shadow-[0_0_6px_rgba(254,190,16,0.6)]"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
};
