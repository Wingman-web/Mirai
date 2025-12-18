'use client';

import { useEffect, useRef, useState } from 'react';

export default function ImageScrollScrubber() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  const imagesRef = useRef<Array<HTMLImageElement | HTMLCanvasElement>>([]);
  const currentFrameRef = useRef<number>(-1);
  const drawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        imagesRef.current = [];
        const images: HTMLImageElement[] = [];
        const totalImages = 5;

        for (let i = 1; i <= totalImages; i++) {
          const exts = ['.gif', '.svg', '.png'];
          let loaded = false;
          for (const ext of exts) {
            const imagePath = `/components/Home/Mirai_Grace/${i}${ext}`;
            const img = new Image();
            await new Promise<void>((resolve) => {
              img.onload = () => {
                images.push(img);
                loaded = true;
                resolve();
              };
              img.onerror = () => resolve();
              img.src = imagePath;
            });
            if (loaded) break;
          }
        }
        if (images.length === 0) throw new Error("No images loaded");
        imagesRef.current = images;
        setLoading(false);
        handleResize();
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || imagesRef.current.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const scrollIndex = Math.floor(progress * (imagesRef.current.length - 1));
      const frameIndex = currentFrameRef.current >= 0 ? currentFrameRef.current : scrollIndex;
      const currentImage = imagesRef.current[frameIndex];

      if (currentImage) {
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const sourceW = (currentImage as any).width;
        const sourceH = (currentImage as any).height;
        const scale = Math.max(viewportW / sourceW, viewportH / sourceH);
        
        const w = sourceW * scale;
        const h = sourceH * scale;
        const x = (viewportW - w) / 2;
        const y = (viewportH - h) / 2;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, viewportW, viewportH);
        ctx.drawImage(currentImage as any, x, y, w, h);
      }
    };

    drawRef.current = draw;
    const handleScroll = () => {
      currentFrameRef.current = -1;
      requestAnimationFrame(() => drawRef.current?.());
    };
    const handleResize = () => {
      resizeCanvas();
      requestAnimationFrame(() => drawRef.current?.());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    loadImages();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [reloadCounter]);

  return (
    <div className="relative w-full bg-black">
      {/* THE FIX: We use h-[200vh] for the scroll length. 
        We add 'mb-[-1px]' to ensure no sub-pixel gap between this 
        and the following section.
      */}
      <div ref={containerRef} className="relative w-full h-[200vh] bg-black mb-[-1px]">
        
        {/* h-[100.5vh] ensures the sticky container is slightly 
           taller than the viewport to avoid edge flickering.
        */}
        <div className="sticky top-0 left-0 w-full h-[100vh] overflow-hidden bg-black">
          
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full block scale-[1.01]"
          />
        </div>
      </div>
    </div>
  );
}