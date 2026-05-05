import Image from "next/image";
import Button from "../Button/Button";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  /** Prefer this for navigation; avoids client router when static href is enough */
  buttonHref?: string;
  onButtonClick?: () => void;
  /** Defaults to search illustration */
  iconSrc?: string;
  /**
   * Figma-style frame: outer + inner #EAF1FD rings in CSS; `iconSrc` should be a simple glyph
   * (e.g. `/images/profile/glyphs/heart.svg`) without baked-in circles.
   */
  framedIcon?: boolean;
  /** Rendered size of the icon (px). Defaults: framed 90×90, standard 70×70 (legacy). */
  iconWidth?: number;
  iconHeight?: number;
}

export default function EmptyState({
  title = "No Trips Found",
  description = "It looks like this trip isn't available right now. Browse other trips and discover new destinations.",
  buttonText = "View Available Trips",
  buttonHref,
  onButtonClick,
  iconSrc = "/images/empty-search.png",
  framedIcon = false,
  iconWidth: iconWidthProp,
  iconHeight: iconHeightProp,
}: EmptyStateProps) {
  const defaultGlyph = framedIcon ? 90 : 70;
  let iconW: number;
  let iconH: number;
  if (iconWidthProp !== undefined && iconHeightProp !== undefined) {
    iconW = iconWidthProp;
    iconH = iconHeightProp;
  } else if (iconWidthProp !== undefined) {
    iconW = iconWidthProp;
    iconH = iconWidthProp;
  } else if (iconHeightProp !== undefined) {
    iconW = iconHeightProp;
    iconH = iconHeightProp;
  } else {
    iconW = defaultGlyph;
    iconH = defaultGlyph;
  }

  const iconStyle = { width: iconW, height: iconH } as const;

  return (
    <div className={styles.container}>
      {framedIcon ? (
        <div className={styles.iconStage}>
          <div className={styles.iconRing}>
            <Image
              src={iconSrc}
              alt=""
              width={iconW}
              height={iconH}
              className={styles.iconGlyph}
              style={iconStyle}
              unoptimized={iconSrc.endsWith(".svg")}
            />
          </div>
        </div>
      ) : (
        <div className={styles.iconWrapper}>
          <Image
            src={iconSrc}
            alt=""
            width={iconW}
            height={iconH}
            className={styles.icon}
            style={iconStyle}
          />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {buttonText && (
        <Button
          variant="outline"
          size="lg"
          href={buttonHref}
          onClick={buttonHref ? undefined : onButtonClick}
          className={styles.button}
          icon={
            <Image
              src="/images/arrows/arrow-right-blue.svg"
              alt=""
              width={20}
              height={20}
            />
          }
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
