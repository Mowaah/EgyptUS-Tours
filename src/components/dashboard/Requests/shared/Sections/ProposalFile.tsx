import Image from "next/image";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";
import styles from "./ProposalFile.module.scss";

export default function ProposalFile() {
  return (
    <InfoCard title="Proposal File" iconSrc="/images/dashboard/send.svg">
      <div className={styles.fileItem}>
        <div className={styles.fileIconWrapper}>
          <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
        </div>
        
        <div className={styles.fileInfo}>
          <p className={styles.fileName}>Description of the problem.pdf</p>
          <div className={styles.fileMeta}>
            <span className={styles.fileSize}>200 KB of 200 KB</span>
          </div>
        </div>

        <a 
          href="#"
          className={styles.fileDownloadBtn}
        >
          <Image src="/images/dashboard/download.svg" alt="Download" width={24} height={24} />
        </a>
      </div>
    </InfoCard>
  );
}
