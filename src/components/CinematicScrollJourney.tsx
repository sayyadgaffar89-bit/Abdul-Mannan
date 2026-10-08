import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface CinematicScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'tilt-forward' | 'depth-zoom' | 'pan-elevate' | 'subtle';
}

export const CinematicScrollSection: React.FC<CinematicScrollSectionProps> = ({
  children,
  className = '',
  effect = 'tilt-forward',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth springs for buttery motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // 3D transforms mapped to section viewport journey
  const scale = useTransform(smoothProgress, [0, 0.45, 0.55, 1], [0.93, 1, 1, 0.95]);
  const rotateX = useTransform(smoothProgress, [0, 0.45, 0.55, 1], [6, 0, 0, -4]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], [50, 0, -50]);
  const opacity = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.65, 1, 1, 0.7]);

  return (
    <div
      ref={containerRef}
      className="perspective-1200 w-full"
    >
      <motion.div
        style={{
          scale: effect === 'subtle' ? 1 : scale,
          rotateX: effect === 'subtle' ? 0 : rotateX,
          y: effect === 'subtle' ? 0 : y,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className={`w-full transition-shadow duration-500 ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
