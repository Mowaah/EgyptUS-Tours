import Image from "next/image";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./TablePanel.module.scss";

interface TablePanelHeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconSrc?: string;
  children: ReactNode;
}

export default function TablePanelHeaderButton({
  iconSrc,
  children,
  className,
  type = "button",
  ...props
}: TablePanelHeaderButtonProps) {
  const buttonClassName = className
    ? `${styles.outlineButton} ${className}`
    : styles.outlineButton;

  return (
    <button type={type} className={buttonClassName} {...props}>
      {iconSrc ? <Image src={iconSrc} alt="" width={20} height={20} /> : null}
      {children}
    </button>
  );
}
