import React, { useEffect, useState, useRef } from 'react';

export const AmberInteractiveCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const trailingPos = useRef({ x: -100, y: -100 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch device or prefers-reduced-motion
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsTouch(true);
      return;
    }

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover], .group, [tabindex="0"]'
        );
        setIsHovering(!!interactive);
      }
    };

    const onMouseDown = () => setIsPressing(true);
    const onMouseUp = () => setIsPressing(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth spring physics loop for trailing halo
    const animate = () => {
      const ease = 0.22;
      trailingPos.current.x += (pos.x - trailingPos.current.x) * ease;
      trailingPos.current.y += (pos.y - trailingPos.current.y) * ease;

      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`;
      }
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-50">
      {/* 1. Trailing Chromatic Radiance Halo */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out"
        style={{
          width: isHovering ? '52px' : '30px',
          height: isHovering ? '52px' : '30px',
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-300 ${
            isHovering
              ? 'bg-gradient-to-r from-amber-500/25 via-pink-500/20 to-cyan-500/25 border border-amber-400/50 shadow-lg shadow-amber-500/30 backdrop-blur-xs scale-110'
              : 'border border-amber-500/35 bg-amber-500/10 scale-100'
          }`}
        />
      </div>

      {/* 2. Core Amber Circle Pinpoint */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isPressing
              ? 'w-1.5 h-1.5 bg-amber-300 shadow-sm'
              : isHovering
              ? 'w-2 h-2 bg-amber-400 ring-2 ring-amber-300/60 shadow-md shadow-amber-400/80 scale-125'
              : 'w-2 h-2 bg-[#F59E0B] shadow-sm shadow-amber-500/80'
          }`}
        />
      </div>
    </div>
  );
};
