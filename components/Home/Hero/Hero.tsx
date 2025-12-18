'use client'

import React, { useRef, useEffect } from 'react'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const gsapRef = useRef<any>(null)
  const [videoReady, setVideoReady] = React.useState(false)
  const [triedLocalFallback, setTriedLocalFallback] = React.useState(false) 

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.play().catch(() => {})
  }, [])

  const handleVideoError = async (e?: any) => {
    console.error('Video error:', e);
    if (videoRef.current && !triedLocalFallback) {
      setTriedLocalFallback(true);
      const trySources = [
        'https://knbjvd97qa5keve4.public.blob.vercel-storage.com/mirai/mirai_home1.webm',
        'https://knbjvd97qa5keve4.public.blob.vercel-storage.com/mirai/mirai_home1.mp4',
        '/videos/mirai_home1.webm',
        '/videos/mirai_home1.mp4'
      ];
      for (const src of trySources) {
        try {
          videoRef.current.src = src;
          videoRef.current.load();
          await videoRef.current.play().then(() => {
            setVideoReady(true);
          }).catch(() => {});
          if (!videoRef.current.paused) return; // success
        } catch (err) {
          // try next source
        }
      }
    }
    // final fallback: keep it hidden
    setVideoReady(false);
  }

  const handleCanPlay = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {})
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    Promise.all([import('gsap'), import('gsap/ScrollToPlugin')])
      .then(([gsapModule, scrollModule]) => {
        const gsap = gsapModule.gsap || gsapModule.default || gsapModule
        const ScrollToPlugin = scrollModule.ScrollToPlugin || scrollModule.default || scrollModule
        try { gsap.registerPlugin(ScrollToPlugin) } catch(e) {}
        gsapRef.current = gsap
      })
  }, [])

  const handleScrollToNext = () => {
    const gsap = gsapRef.current
    if (gsap) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: '#sixth-element-trigger', offsetY: 0 },
        ease: 'power2.inOut'
      })
    } else {
      const el = document.getElementById('sixth-element-trigger')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // DESKTOP OPTIMIZED STYLE
  const fullScreenMediaStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // We use 101% to create a tiny "overshoot" 
    // This kills the 1px black line caused by sub-pixel rendering
    width: '101%', 
    height: '101%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
    display: 'block',
    zIndex: 1,
    // Prevents potential browser anti-aliasing issues
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  };

  return (
    <section style={{ 
      position: 'relative', 
      width: '100%',
      height: '100vh', 
      // Ensure the background is black so if the video loads late, it matches
      backgroundColor: '#000', 
      overflow: 'hidden', 
      margin: 0,
      padding: 0,
      // Fix for some desktop browsers where 100vh includes the scrollbar height
      maxHeight: '100vh' 
    }}>
      {/* Video Background */}
      <video
        ref={videoRef}
        style={{ ...fullScreenMediaStyle, opacity: videoReady ? 1 : 0, transition: 'opacity 300ms ease' }}
        crossOrigin="anonymous"
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="auto"
        onError={handleVideoError}
        onCanPlay={(e) => { handleCanPlay(); setVideoReady(true); }}
        onLoadedData={() => setVideoReady(true)}
      >
        <source src="https://knbjvd97qa5keve4.public.blob.vercel-storage.com/mirai/mirai_home1.webm" type="video/webm" />
        <source src="https://knbjvd97qa5keve4.public.blob.vercel-storage.com/mirai/mirai_home1.mp4" type="video/mp4" />
        {/* Browser will pick the first supported format */}
        <p style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          Video not supported — <a href="/videos/mirai_home1.mp4" style={{ color: '#fff', textDecoration: 'underline' }}>download</a>
        </p>
      </video>

      {/* Optional: Subtle Vignette to help the video blend into the next section */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: 'linear-gradient(to top, rgba(0,0,0,1), transparent)',
        zIndex: 5
      }} />

      {/* Scroll Button */}
      <div style={{ position: 'absolute', bottom: '32px', right: '32px', zIndex: 10 }}>
        <button
          onClick={handleScrollToNext}
          style={{
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            backgroundColor: '#8B4F5C',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: 'none', 
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Scroll to next section"
        >
          <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default Hero