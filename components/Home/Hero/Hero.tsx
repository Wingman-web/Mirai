'use client'

import React, { useRef, useEffect } from 'react'

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const gsapRef = useRef<any>(null)
  const [videoReady, setVideoReady] = React.useState(false)

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.play().catch(() => {})
  }, [])

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

  // Set video sources immediately on mount
  useEffect(() => {
    if (!videoRef.current) return
    const videoEl = videoRef.current

    const sources = [
      { src: '/videos/mirai_home_1.mp4', type: 'video/mp4' }
    ]

    sources.forEach(({ src, type }) => {
      const srcEl = document.createElement('source')
      srcEl.src = src
      srcEl.type = type
      try {
        // Insert at the beginning to ensure sources appear before any fallback content.
        if (videoEl.firstChild) {
          videoEl.insertBefore(srcEl, videoEl.firstChild)
        } else {
          videoEl.appendChild(srcEl)
        }
      } catch (e) {
        // Fallback to append to avoid breaking rendering
        try { videoEl.appendChild(srcEl) } catch (err) { /* ignore */ }
      }
    })

    videoEl.load()
    videoEl.play().catch(() => {})
  }, [])

  // DESKTOP OPTIMIZED STYLE
  const fullScreenMediaStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '101%', 
    height: '101%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
    display: 'block',
    zIndex: 1,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden'
  };

  return (
    <section style={{ 
      position: 'relative', 
      width: '100%',
      height: '100vh', 
      backgroundColor: '#000', 
      overflow: 'hidden', 
      margin: 0,
      padding: 0,
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
        onCanPlay={(e) => { handleCanPlay(); setVideoReady(true); }}
        onLoadedData={() => setVideoReady(true)}
      >
        <p style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          Video not supported — <a href="/videos/mirai_home_1.mp4" style={{ color: '#fff', textDecoration: 'underline' }}>download</a>
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


    </section>
  )
}

export default Hero
