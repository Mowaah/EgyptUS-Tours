import Image from "next/image";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";
import styles from "./ProposalFile.module.scss";

interface ProposalFileProps {
  files?: Array<{
    original_filename: string;
    file_size: number;
    file_url: string;
  }>;
}

export default function ProposalFile({ files = [] }: ProposalFileProps) {
  if (files.length === 0) return null;
  const latestFile = files[0]; // the latest version is first

  // format bytes to KB/MB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <InfoCard title="Proposal File" iconSrc="/images/dashboard/requests/proposal-file.svg">
      <div className={styles.fileItem}>
        <div className={styles.fileIconWrapper}>
          <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
        </div>
        
        <div className={styles.fileInfo}>
          <p className={styles.fileName}>{latestFile.original_filename}</p>
          <div className={styles.fileMeta}>
            <span className={styles.fileSize}>{formatBytes(latestFile.file_size)}</span>
          </div>
        </div>

        <a 
          href={latestFile.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fileDownloadBtn}
          download={latestFile.original_filename}
        >
          <Image src="/images/dashboard/download.svg" alt="Download" width={24} height={24} />
        </a>
      </div>
    </InfoCard>
  );
}
