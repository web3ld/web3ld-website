'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showText, setShowText] = useState(false);
  const [showBottomText, setShowBottomText] = useState(false);
  const [showColorCycle, setShowColorCycle] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  // Split the text
  const staticText = "The Semantic Web is about ensuring a source's authority";
  const typewriterText = " over its messages remain consistent across consumers and relayers.";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrame: number;
    const smoothSlowdown = () => {
      if (!video) return;
      
      const timeRemaining = video.duration - video.currentTime;
      
      // Show text at 3.5 seconds
      if (video.currentTime >= 3.5 && !showText) {
        setShowText(true);
        // Add color cycle after the clip-path animation completes (1s)
        setTimeout(() => setShowColorCycle(true), 1000);
      }
      
      // Show bottom text at 4.5 seconds
      if (video.currentTime >= 4.5 && !showBottomText) {
        setShowBottomText(true);
      }
      
      // Smooth slowdown over last 1.5 seconds
      if (timeRemaining <= 1.5 && timeRemaining > 0) {
        // Ease out cubic for smooth deceleration
        const progress = timeRemaining / 1.5;
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        video.playbackRate = Math.max(0.6, easedProgress);
      } else {
        video.playbackRate = 1;
      }
      
      animationFrame = requestAnimationFrame(smoothSlowdown);
    };

    animationFrame = requestAnimationFrame(smoothSlowdown);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [showText, showBottomText]);

  // Typewriter effect
  useEffect(() => {
    if (!showBottomText) return;
    
    // Start typewriter after fade-in completes (500ms)
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex < typewriterText.length) {
          setTypedText(typewriterText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30); // Adjust typing speed here (lower = faster)
      
      return () => clearInterval(typeInterval);
    }, 500); // Wait for fade-in to complete
    
    return () => clearTimeout(startDelay);
  }, [showBottomText]);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          playsInline
        >
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        <h1 className={`${styles.heading} ${showText ? styles.visible : ''} ${showColorCycle ? styles.colorCycle : ''}`}>
          Keep Your Story Straight
        </h1>
        <div className={`${styles.bottomText} ${showBottomText ? styles.visible : ''}`}>
          {staticText}
          <span className={styles.typewriter}>{typedText}</span>
        </div>
      </div>
    </section>
  );
}