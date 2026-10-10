'use client';

import React, { useEffect, useRef, useState } from 'react';

export function FluidCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is preferred
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Check for contextual cursor labels and clickability
      const target = e.target as HTMLElement | null;
      if (target) {
        const labelledElem = target.closest('[data-cursor]') as HTMLElement | null;
        if (labelledElem) {
          const label = labelledElem.getAttribute('data-cursor');
          setCursorLabel(label);
          setIsHovering(true);
        } else {
          setCursorLabel(null);
          const isClickable = Boolean(
            target.closest('a') ||
            target.closest('button') ||
            target.closest('[role="button"]') ||
            target.classList.contains('cursor-pointer') ||
            window.getComputedStyle(target).cursor === 'pointer'
          );
          setIsHovering(isClickable);
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth lerp for outer magnetic trailing ring
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  // Don't render on mobile/server
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="fluid-cursor-dot"
        style={{ opacity: isVisible ? (cursorLabel ? 0 : 1) : 0 }}
      />
      <div
        ref={ringRef}
        className={`fluid-cursor-ring ${isHovering || cursorLabel ? 'active' : ''}`}
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {cursorLabel && (
          <span className="fluid-cursor-label animate-in fade-in zoom-in duration-150">
            {cursorLabel}
          </span>
        )}
      </div>
    </>
  );
}
