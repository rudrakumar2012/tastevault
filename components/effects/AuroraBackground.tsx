'use client';

import { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function AuroraBackground({
  children,
  className = ''
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      time += 0.002;

      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create aurora effect with multiple gradient waves
      const gradients = [
        {
          color1: 'rgba(212, 165, 116, 0.15)',
          color2: 'rgba(212, 165, 116, 0.05)',
          yOffset: 0.3,
          speed: 1,
        },
        {
          color1: 'rgba(100, 200, 255, 0.1)',
          color2: 'rgba(100, 200, 255, 0.02)',
          yOffset: 0.5,
          speed: 0.8,
        },
        {
          color1: 'rgba(255, 100, 150, 0.08)',
          color2: 'rgba(255, 100, 150, 0.01)',
          yOffset: 0.7,
          speed: 1.2,
        },
      ];

      gradients.forEach((gradient, index) => {
        const y = canvas.height * gradient.yOffset + Math.sin(time * gradient.speed) * 100;
        const radius = Math.max(canvas.width, canvas.height) * 0.8;

        const grd = ctx.createRadialGradient(
          canvas.width / 2,
          y,
          0,
          canvas.width / 2,
          y,
          radius
        );
        grd.addColorStop(0, gradient.color1);
        grd.addColorStop(1, gradient.color2);

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      {children}
    </div>
  );
}
