"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./AboutTeam.module.scss";

export default function AboutTeam() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isScrollingRef = useRef(false);

  const handleScroll = () => {
    if (isScrollingRef.current) return;

    const el = scrollRef.current;
    if (el) {
      const scrollLeft = el.scrollLeft;
      const children = Array.from(el.children) as HTMLElement[];
      
      let closestIndex = 0;
      let minDistance = Infinity;

      children.forEach((child, i) => {
        // Calculate distance to center of viewport
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        const scrollCenter = scrollLeft + el.clientWidth / 2;
        const distance = Math.abs(childCenter - scrollCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }
  };

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (el && el.children[index]) {
      const child = el.children[index] as HTMLElement;
      isScrollingRef.current = true;
      
      // Cleanly scroll only the horizontal container without affecting the page's vertical scroll
      const targetLeft = child.offsetLeft + (child.clientWidth / 2) - (el.clientWidth / 2);
      
      el.scrollTo({
        left: targetLeft,
        behavior: "smooth"
      });
      
      setActiveIndex(index);

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 700); 
    }
  };

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % 3;
      scrollTo(nextIndex);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Photos side */}
          <div className={styles.imagesWrapper}>
            <div 
              className={styles.imagesGrid} 
              ref={scrollRef} 
              onScroll={handleScroll}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => {
                setIsPaused(true);
                isScrollingRef.current = false;
              }}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div className={`${styles.imageWrap} ${styles.img1}`}>
                <Image src="/images/team/team1.jpg" alt="Team meeting" fill className={styles.image} />
              </div>
              <div className={`${styles.imageWrap} ${styles.img2}`}>
                <Image src="/images/team/team2.jpg" alt="Team posing" fill className={styles.image} />
              </div>
              <div className={`${styles.imageWrap} ${styles.img3}`}>
                <Image src="/images/team/team3.jpg" alt="Team working" fill className={styles.image} />
              </div>
            </div>
            
            <div className={styles.pagination}>
              {[0, 1, 2].map((idx) => (
                <button 
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={idx === activeIndex ? styles.dotActive : styles.dot}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text side */}
          <div className={styles.content}>
            <div className={styles.textGroup}>
              <span className={styles.label}>The Team</span>
              <h2 className={styles.heading}>Meet the Team Behind the Experience</h2>
            </div>

            <div className={styles.paragraphs}>
              <p>
                Behind every successful corporate event, executive retreat, and large-scale company program is a team that believes in precision, structure, and accountability.
              </p>
              <p>
                Our team brings together professionals with expertise in corporate travel planning, event management, logistics coordination, venue negotiation, hospitality partnerships, and on-site operations. Each member understands that in the corporate world, details are not optional — they define the outcome.
              </p>
            </div>

          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statIconWrap}>
                <Image src="/images/whytrustus/green-profile.svg" alt="" width={24} height={24} className={styles.statIcon} />
              </div>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statDesc}>Dedicated Corporate Focus</span>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIconWrap}>
                <Image src="/images/whytrustus/award.svg" alt="" width={24} height={24} className={styles.statIcon} />
              </div>
              <span className={styles.statValue}>15,000+</span>
              <span className={styles.statDesc}>Attendees Managed</span>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIconWrap}>
                <Image src="/images/whytrustus/chart-arrow.svg" alt="" width={24} height={24} className={styles.statIcon} />
              </div>
              <span className={styles.statValue}>8+ Years</span>
              <span className={styles.statDesc}>Industry Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
