'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface AnimatedElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { 
        root: null, 
        rootMargin: '0px 0px -12% 0px', 
        threshold: 0 
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-600 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-5.5 scale-[0.995]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default function ClubhouseIntro() {
  return (
    <section className="relative py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container max-w-275 mx-auto px-4 lg:px-0">
        <div className="text-center px-4 lg:px-20 pb-0 lg:pb-8">
          <AnimatedElement delay={0}>
            <h2 className="mb-4 pt-3 text-[26px] lg:text-4xl leading-[1.06] font-semibold text-gray-900">
              4-Level Clubhouse<br />
              For Indulgence Across Storeys
            </h2>
          </AnimatedElement>
          
          <AnimatedElement delay={120}>
            <p className="px-4 lg:px-20 mx-auto max-w-225 text-base leading-relaxed text-gray-600">
              Nature crafted five elements - Earth that grounds us. Water that nourishes
              us. Fire that warms us. Air that breathes through us. Space that holds us.
            </p>
          </AnimatedElement>
        </div>
      </div>
      
      {/* Shape decoration - hidden on mobile */}
      <div className="hidden lg:block absolute -right-[6%] top-2.5 w-[60%] max-w-190 opacity-[0.12] pointer-events-none">
        <Image
          src="/media/shape-two.png"
          alt="About mirai shape"
          width={760}
          height={400}
          className="w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
          priority={false}
        />
      </div>
    </section>
  );
}