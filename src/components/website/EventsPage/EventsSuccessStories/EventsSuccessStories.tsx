import React from 'react';
import Image from 'next/image';
import styles from './EventsSuccessStories.module.scss';

const STORIES = [
  {
    title: "Regional Finance Forum",
    attendees: "650",
    countries: "22 Countries",
    quote: "Exceptional venue, seamless logistics, and competitive pricing made this our best event yet.",
    image: "/images/event-story1.jpg",
  },
  {
    title: "Global Pharmaceutical Convention",
    attendees: "1,800",
    countries: "30 Countries",
    quote: "Professional execution, world-class venues, and unforgettable cultural experiences for our delegates.",
    image: "/images/event-story2.jpg",
  },
  {
    title: "International Technology Summit",
    attendees: "+2500",
    countries: "45 Countries",
    quote: "The team delivered a flawless experience. Egypt exceeded our expectations as a MICE destination.",
    image: "/images/event-story3.jpg",
  },
];

export default function EventsSuccessStories() {
  return (
    <section className={styles.section}>
      <div className={styles.topBadge}>
        <span>97% Satisfaction Rate</span>
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Past Event Success Stories</h2>
        <p className={styles.subtitle}>Proven track record with international organizations</p>
      </div>

      <div className={styles.grid}>
        {STORIES.map((story, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={story.image} alt={story.title} fill className={styles.image} />
              <div className={styles.overlay} />
              <button className={styles.playBtn}>
                <Image src="/images/playbtn.svg" alt="" width={24} height={24} />
              </button>
            </div>

            <div className={styles.content}>
              <h3 className={styles.storyTitle}>{story.title}</h3>

              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Attendees</span>
                  <span className={styles.statValueOrange}>{story.attendees}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Countries</span>
                  <span className={styles.statValueBlue}>{story.countries}</span>
                </div>
              </div>

              <div className={styles.testimonial}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Image key={i} src="/images/star-yellow3.svg" alt="" width={16} height={16} />
                  ))}
                </div>
                <p className={styles.quote}>"{story.quote}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
