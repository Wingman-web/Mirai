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
  
  // Initially don't show the section until the user scrolls to it
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

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
    // Process the image in background and replace processedImage when ready;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const dataUrl = processImage(img);
      if (dataUrl) { setProcessedImage(dataUrl); }
      else { setProcessedImage('/text_cloud.png'); }
    };
    img.onerror = () => {
      // fallback
      setProcessedImage('/text_cloud.png');
    };
    img.src = '/text_cloud.png';
  }, [processImage]);

  const [wantedReveal, setWantedReveal] = useState(false);

  // Reveal the section only after the user scrolls to it, but ensure the image is ready
  useEffect(() => {
    if (!sectionRef.current) return;
    const revealTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      // Use a function so we can reference the ScrollTrigger instance via `this` and avoid TDZ
      onEnter: function(this: any) {
        // Make the container present but keep it transparent so the timeline can animate it in
        try { gsap.set(containerRef.current, { display: 'flex', opacity: 0, zIndex: 40, pointerEvents: 'none' }); } catch (e) {}
        // Ensure we have a fallback image available; if one already exists, reveal immediately.
        setProcessedImage((prev) => {
          if (prev) { setRevealed(true); }
          else { setWantedReveal(true); }
          return prev ?? '/text_cloud.png';
        });
        try { this.kill(); } catch (e) {}
      }
    });
    return () => { try { revealTrigger.kill(); } catch (e) {} };
  }, []);

  // When image becomes available and a reveal was requested, finalize the reveal
  useEffect(() => {
    if (wantedReveal && processedImage) {
      setRevealed(true);
      setWantedReveal(false);
    }
  }, [wantedReveal, processedImage]);

  useEffect(() => {
    if (!revealed || !sectionRef.current || !containerRef.current) return;
    // We'll create an auxiliary ScrollTrigger that watches the Gateway section and forces
    // the Sixth Element behind it as soon as Gateway reaches the top of the viewport.
    let gatewayTriggerRef: any = null;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          // end when the Gateway section reaches the top of the viewport so Sixth Element won't appear after Gateway
          endTrigger: '#gateway-trigger',
          end: 'top top',
          // increase scrub so animation feels smoother over longer scroll
          scrub: 1.8,
          // Ensure the container is visible and reset visual state when entering
          onEnter: () => { gsap.set(containerRef.current, { display: 'flex', opacity: 1, scale: 1, zIndex: 40, pointerEvents: 'none' }) },
          onEnterBack: () => { gsap.set(containerRef.current, { display: 'flex', opacity: 1, scale: 1, zIndex: 40, pointerEvents: 'none' }) },
          // When leaving, keep it visible but move it behind the next content by lowering z-index
          onLeave: () => { gsap.set(containerRef.current, { zIndex: 0, opacity: 1, pointerEvents: 'none' }) }
        }
      });

      // Create a defensive ScrollTrigger bound to the Gateway element that forces z-index to 0
      const gatewayEl = document.getElementById('gateway-trigger');
      if (gatewayEl) {
        gatewayTriggerRef = ScrollTrigger.create({
          trigger: gatewayEl,
          start: 'top top',
          onEnter: () => {
            // Hide the Sixth Element overlay so Gateway is fully visible and on top
            try { gsap.set(containerRef.current, { display: 'none' }); } catch (e) {}
            gsap.set(gatewayEl, { position: 'relative', zIndex: 200, transform: 'translateZ(0)' });
          },
          onLeaveBack: () => {
            // Restore Sixth Element visibility only if it was revealed by scroll
            try {
              if (revealed) {
                gsap.set(containerRef.current, { display: 'flex', opacity: 1, zIndex: 40, pointerEvents: 'none', transform: 'none' });
              }
            } catch (e) {}
            gsap.set(gatewayEl, { zIndex: 50, transform: 'none' });
          },
        });
      }

      // Build the animation timeline inside the same GSAP context callback
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 })
        .fromTo(imageRef.current, { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 0.95, ease: "power1.out", duration: 1.2 }, 0)
        .fromTo(textLinesRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.25 }, 0.2)
        // add a longer pause in the timeline so the element remains visible for longer while scrolling
        .to({}, { duration: 2.0 })
        // Instead of hiding, move the element slightly and then push it behind by lowering z-index
        .to(containerRef.current, { scale: 1.03, duration: 0.6, ease: "power2.in" })
        .call(() => { gsap.set(containerRef.current, { zIndex: 0, pointerEvents: 'none' }) });

      // Clean up the auxiliary gateway trigger on unmount instead of using ctx.add
      // (avoids type/signature issues with ctx.add callbacks)

    }, sectionRef.current);

    return () => {
      if (gatewayTriggerRef) {
        try { gatewayTriggerRef.kill(); } catch (e) { /* ignore */ }
      }
      ctx.revert();
    };
  }, [revealed]);

  // Removed temporary insertBefore debug wrapper — behavior now relies on normal DOM APIs.
  // Any persistent insert-before issues should be fixed at the source (e.g. by ensuring
  // reference nodes are children before inserting).

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

  // The section is always present in the DOM but hidden until 'revealed' becomes true.
  // This allows Hero scrollTo to find the element while preventing it from appearing on initial load.

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
      <section id="sixth-element-trigger" ref={sectionRef} className="relative w-full h-[180vh] bg-black" style={{ zIndex: 40 }}>
        <div ref={containerRef} style={{ display: 'none', opacity: 0, zIndex: 40 }} className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none">
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