import Image from "next/image";
import styles from "./BlogSubscribe.module.scss";

export default function BlogSubscribe() {
  return (
    <section className={styles.section}>
      {/* Decorative paper plane â€” left side, absolutely positioned */}
      <div className={styles.planeDecoration}>
        <Image
          src="/images/paper-plane.svg"
          alt=""
          fill
          className={styles.planeImage}
        />
      </div>

      {/* Right-aligned content block */}
      <div className={styles.contentBlock}>
        <h2 className={styles.title}>
          Subscribe Now For Egypt US Latest Blogs !
        </h2>

        <div className={styles.formGroup}>
          <div className={styles.inputWrap}>
            <input
              type="email"
              placeholder="Youremail@Gmail.Com"
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
