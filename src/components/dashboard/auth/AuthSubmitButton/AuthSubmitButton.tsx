import type { ButtonHTMLAttributes } from "react";
import Image from "next/image";
import styles from "./AuthSubmitButton.module.scss";

interface AuthSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function AuthSubmitButton({
  children,
  isLoading = false,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button className={styles.button} aria-busy={isLoading} {...props}>
      {isLoading ? (
        <span className={styles.spinner} aria-hidden />
      ) : (
        <>
          <span>{children}</span>
          <Image
            src="/images/arrows/arrow-right.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
        </>
      )}
    </button>
  );
}
