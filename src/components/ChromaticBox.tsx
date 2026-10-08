import React, { useState, useRef, useCallback } from 'react';

export type ChromaticPreset = 'amber' | 'prismatic' | 'emerald' | 'cyan' | 'fuchsia';

interface ChromaticBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  preset?: ChromaticPreset;
  tilt?: boolean;
  borderGlow?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}

export const ChromaticBox: React.FC<ChromaticBoxProps> = ({
  children,
  className = '',
  preset = 'prismatic',
  tilt = true,
  borderGlow = true,
  interactive = true,
  as: Component = 'div',
  ...rest
}) => {
  const [isEngaged, setIsEngaged] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tiltStyle, setTiltStyle] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!boxRef.current) return;
      const rect = boxRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      setCoords({ x, y });

      if (tilt) {
        // Calculate tilt between -5 and 5 degrees
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 4;
        const rotateX = -((y - centerY) / centerY) * 4;
        setTiltStyle({ rotateX, rotateY });
      }
    },
    [tilt]
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsEngaged(true);
    handlePointerMove(e.clientX, e.clientY);
  };

  const onPointerLeave = () => {
    setIsEngaged(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

  // Gradient recipes for chromatic radiance
  const getGlowGradient = () => {
    switch (preset) {
      case 'amber':
        return `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(245, 158, 11, 0.28), rgba(217, 119, 6, 0.16), rgba(251, 191, 36, 0.08), transparent 70%)`;
      case 'emerald':
        return `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(16, 185, 129, 0.28), rgba(6, 182, 212, 0.18), rgba(52, 211, 153, 0.08), transparent 70%)`;
      case 'cyan':
        return `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(6, 182, 212, 0.28), rgba(59, 130, 246, 0.18), rgba(147, 197, 253, 0.08), transparent 70%)`;
      case 'fuchsia':
        return `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(217, 70, 239, 0.26), rgba(168, 85, 247, 0.18), rgba(244, 114, 182, 0.08), transparent 70%)`;
      case 'prismatic':
      default:
        return `radial-gradient(380px circle at ${coords.x}px ${coords.y}px, rgba(245, 158, 11, 0.28), rgba(236, 72, 153, 0.22), rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.15), transparent 75%)`;
    }
  };

  const getBorderSheen = () => {
    if (!borderGlow || !isEngaged) return 'transparent';
    return `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(245, 158, 11, 0.65), rgba(217, 70, 239, 0.5), rgba(6, 182, 212, 0.45), transparent 70%)`;
  };

  return (
    <Component
      ref={boxRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onTouchStart={() => setIsEngaged(true)}
      onTouchEnd={() => setIsEngaged(false)}
      style={{
        transform:
          tilt && isEngaged
            ? `perspective(1000px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg) scale3d(1.015, 1.015, 1.015)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isEngaged ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.4s ease-out',
      }}
      className={`group relative overflow-hidden rounded-2xl bg-[#12141C]/80 backdrop-blur-md transition-shadow duration-300 ${
        isEngaged
          ? 'shadow-2xl shadow-amber-500/15 ring-1 ring-amber-500/30'
          : 'shadow-md border border-white/10'
      } ${className}`}
      {...rest}
    >
      {/* 1. Chromatic Border Sheen Layer */}
      {borderGlow && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: isEngaged ? 1 : 0,
            padding: '1px',
            background: getBorderSheen(),
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* 2. Responsive Chromatic Radiance Illumination Core */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isEngaged ? 1 : 0,
          background: getGlowGradient(),
        }}
      />

      {/* 3. Subtle ambient iridescent rim light */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 70, 239, 0.08) 50%, rgba(6, 182, 212, 0.12) 100%)',
          filter: 'blur(10px)',
          zIndex: -1,
        }}
      />

      {/* 4. Child Content Container */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </Component>
  );
};
