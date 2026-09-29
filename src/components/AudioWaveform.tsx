import React from 'react';

interface AudioWaveformProps {
  state: 'idle' | 'listening' | 'speaking' | 'processing';
  size?: 'sm' | 'md' | 'lg';
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ state, size = 'md' }) => {
  const barCount = size === 'sm' ? 12 : size === 'md' ? 20 : 32;

  const heights = [
    25, 45, 75, 30, 90, 60, 40, 85, 95, 55,
    30, 80, 65, 45, 90, 35, 70, 85, 40, 60,
    30, 75, 80, 50, 95, 40, 65, 85, 45, 60, 30, 70
  ];

  return (
    <div className="flex items-center justify-center gap-1 h-12 px-4">
      {Array.from({ length: barCount }).map((_, i) => {
        let barHeight = 8;
        let colorClass = 'bg-slate-300 dark:bg-slate-700';

        if (state === 'listening') {
          // Dynamic pulsing waves
          const wave = Math.sin((i / barCount) * Math.PI * 4 + Date.now() / 200);
          barHeight = Math.max(12, Math.abs(wave) * (heights[i % heights.length] || 50));
          colorClass = 'bg-emerald-500 animate-pulse';
        } else if (state === 'speaking') {
          const wave = Math.cos((i / barCount) * Math.PI * 3 + Date.now() / 150);
          barHeight = Math.max(16, Math.abs(wave) * (heights[(i + 4) % heights.length] || 60));
          colorClass = 'bg-blue-500 animate-pulse';
        } else if (state === 'processing') {
          barHeight = 16 + (i % 3) * 10;
          colorClass = 'bg-amber-500/80 animate-bounce';
        }

        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${colorClass}`}
            style={{
              height: `${barHeight}%`,
              transitionDelay: `${(i % 5) * 20}ms`,
            }}
          />
        );
      })}
    </div>
  );
};
