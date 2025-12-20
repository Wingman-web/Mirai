"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import reveal from './reveal.png';
import mirai from './mirai.png';
import type { StaticImageData } from 'next/image';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ZoomRevealProps {
  imageUrl?: string | StaticImageData;
  zoomTo?: string | StaticImageData;
  imageAlt?: string;
  scrollDistance?: string;
  imageScale?: number;
}

export function RevealZoom({
  imageUrl = reveal,
  zoomTo = mirai,
  imageAlt = "Reveal Image",
  scrollDistance = "+=250%",
  imageScale = 4,
}: ZoomRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLImageElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: scrollDistance,
          pin: true,
          scrub: 1,
        },
      });

      scrollTl
        .fromTo(foregroundRef.current, {
          scale: 1,
          opacity: 1,
        }, {
          opacity: 0,
          scale: imageScale,
          transformOrigin: "center center",
          ease: "power1.inOut",
        }, 0)
        
        .fromTo(textRef.current, {
          color: '#000000',
          y: 40,
          opacity: 0
        }, {
          color: '#ffffff',
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 0.5, 
        }, 0.2);
    });

    return () => ctx.revert();
  }, [scrollDistance, imageScale]);

  const resolvedInitialSrc = typeof imageUrl === 'string' ? imageUrl : imageUrl.src;
  const resolvedZoomSrc = typeof zoomTo === 'string' ? zoomTo : zoomTo.src;

  return (
    <section id="gateway-trigger" ref={wrapperRef} className="relative w-full bg-black" style={{ zIndex: 50 }}>
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <img
            ref={backgroundRef}
            src={resolvedZoomSrc}
            alt="Background View"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 5 }}
          />
          
          <img
            ref={foregroundRef}
            src={resolvedInitialSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 10 }}
          />
        </div>

        <div className="absolute top-20 right-12 z-20 pointer-events-none">
          <p ref={textRef} className="text-[40px] font-bold text-black" style={{ color: '#000' }}>
            Where You're Always <br /> In Your Element
          </p>
        </div>

      </div>
    </section>
  );
}