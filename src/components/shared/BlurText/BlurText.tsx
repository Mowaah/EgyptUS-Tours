import type { CSSProperties, ElementType } from "react";
import styles from "./BlurText.module.scss";

export interface BlurTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  blur?: number;
  distance?: number;
  duration?: number;
}

export default function BlurText({
  text,
  as: Component = "span",
  className,
  baseDelay = 0.05,
  stagger = 0.035,
  blur = 12,
  distance = 16,
  duration = 0.75,
}: BlurTextProps) {
  const words = text.split(" ");
  let globalCharIndex = 0;

  const wrapperStyle = {
    "--char-duration": `${duration.toFixed(3)}s`,
    "--char-blur": `${blur}px`,
    "--char-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <Component
      className={`${styles.wrapper} ${className || ""}`}
      style={wrapperStyle}
    >
      <span className={styles.content}>
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className={styles.word}>
            {word.split("").map((char, charIdx) => {
              const delay = baseDelay + globalCharIndex * stagger;
              globalCharIndex++;

              const charStyle = {
                "--char-delay": `${delay.toFixed(3)}s`,
              } as CSSProperties;

              return (
                <span key={charIdx} className={styles.char} style={charStyle}>
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Component>
  );
}
