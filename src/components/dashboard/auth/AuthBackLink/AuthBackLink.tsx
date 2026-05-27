import Image from "next/image";
import Link from "next/link";
import styles from "./AuthBackLink.module.scss";

interface AuthBackLinkProps {
  href: string;
}

export default function AuthBackLink({ href }: AuthBackLinkProps) {
  return (
    <Link href={href} className={styles.backLink}>
      <Image
        src="/images/arrows/back-arrow.svg"
        alt=""
        width={20}
        height={20}
        aria-hidden
      />
      <span>Back</span>
    </Link>
  );
}
