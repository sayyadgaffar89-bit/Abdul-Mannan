import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  description?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Conceptual Draft / As-Built',
  afterLabel = 'Completed Architectural Reality',
  title = 'Renovation & Structural Transformation',
  description = 'Drag the slider below to inspect how our civil and architectural intervention remodeled an existing structure into a contemporary residence.',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-[#EFECE6] p-6 sm:p-10 rounded-2xl border border-[#16161A]/10">
      <div className="max-w-2xl mb-6">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#B08D57] font-semibold">
          Comparative Analysis
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#16161A] mt-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-[#8C8A85] mt-1.5 leading-relaxed">
          {description}
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={(e) => handleMove(e.clientX)}
        className="relative h-[320px] sm:h-[480px] w-full rounded-xl overflow-hidden cursor-ew-resize select-none border border-[#16161A]/15 shadow-sm"
      >
        {/* After Image (Full width background) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#16161A]/80 backdrop-blur-md rounded text-[11px] font-medium text-[#F6F3EE]">
          {afterLabel}
        </div>

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 h-full w-full object-cover max-w-none"
            style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#16161A]/80 backdrop-blur-md rounded text-[11px] font-medium text-[#B08D57]">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#16161A] border-2 border-white flex items-center justify-center text-white text-[10px] font-mono shadow-md">
            ↔
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-[#8C8A85]">
        <span>← Slide left for After</span>
        <span>Slide right for Before →</span>
      </div>
    </div>
  );
};
