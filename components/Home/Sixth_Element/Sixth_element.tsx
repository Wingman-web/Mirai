"use client"

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SixthElement() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textLinesRef = useRef<(HTMLParagraphElement | HTMLHeadingElement)[]>([]);
  
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const processImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    if (!ctx) return null;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth = canvas.width, drawHeight = canvas.height, offsetX = 0, offsetY = 0;
    if (canvasRatio > imgRatio) { drawHeight = canvas.width / imgRatio; offsetY = (canvas.height - drawHeight) / 2; } 
    else { drawWidth = canvas.height * imgRatio; offsetX = (canvas.width - drawWidth) / 2; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const luminance = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      const originalAlpha = data[i + 3];
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
      data[i + 3] = Math.min((luminance / 180) * originalAlpha, 255); 
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const dataUrl = processImage(img);
      if (dataUrl) { setProcessedImage(dataUrl); setIsLoaded(true); }
    };
    img.src = '/text_cloud.png';
  }, [processImage]);

  useEffect(() => {
    if (!isLoaded || !sectionRef.current || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%", 
          end: "bottom top",
          scrub: 1.2,
          onLeave: () => gsap.set(containerRef.current, { display: 'none' }),
          onEnterBack: () => gsap.set(containerRef.current, { display: 'flex' }),
        }
      });
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(imageRef.current, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 0.95, ease: "power1.out", duration: 0.8 }, 0)
        .fromTo(textLinesRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.2 }, 0.2)
        .to({}, { duration: 0.8 }) 
        .to(containerRef.current, { opacity: 0, scale: 1.03, duration: 0.4, ease: "power2.in" });
    }, sectionRef);
    return () => ctx.revert();
  }, [isLoaded]);

  const migraHeaderStyle = {
    color: '#78252f',
    fontSize: '48px',
    fontFamily: '"Migra", serif',
    fontWeight: 100,
    letterSpacing: '5px',
    fontStyle: 'normal',
    lineHeight: '1.0',
    WebkitFontSmoothing: 'antialiased',
  };

  // Don't render the section until processed image is ready to avoid the component being visible during page load
  if (!isLoaded) return null;

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
      <section ref={sectionRef} className="relative w-full h-[180vh] bg-black" style={{ zIndex: 40 }}>
        <div ref={containerRef} className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          {processedImage && (
            <>
              <img ref={imageRef} src={processedImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 px-6 max-w-5xl text-center">
                
                <h2 ref={(el) => { if (el) textLinesRef.current[0] = el }} style={migraHeaderStyle} className="mb-0">
                  Welcome to Pavani Mirai
                </h2>
                
                <h3 ref={(el) => { if (el) textLinesRef.current[1] = el }} style={migraHeaderStyle} className="mb-12">
                  Where you Live the Sixth Element
                </h3>
                
                <p 
                  ref={(el) => { if (el) textLinesRef.current[2] = el }} 
                   
                  className="mb-3.5" 
                >
                  Nature crafted five elements - Earth that grounds us. Water that nourishes us. Fire that warms us. Air that breathes through us. Space that holds us.
                </p>

                <p 
                  ref={(el) => { if (el) textLinesRef.current[3] = el }} 
                  
                >
                  With Pavani as the catalyst, the sixth element takes shape when all the elements are brought together in serene harmony. This is how Mirai was birthed - to give meaning to all of these elements and to harness their full potential.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}