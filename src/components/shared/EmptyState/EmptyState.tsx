import Image from "next/image";
import Button from "../Button/Button";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function EmptyState({
  title = "No Trips Found",
  description = "It looks like this trip isn't available right now. Browse other trips and discover new destinations.",
  buttonText = "View Available Trips",
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Image
          src="/images/empty-search.png"
          alt=""
          width={90}
          height={90}
          className={styles.icon}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {buttonText && (
        <Button
          variant="outline"
          size="lg"
          onClick={onButtonClick}
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
