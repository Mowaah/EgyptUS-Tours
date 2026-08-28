import Image from "next/image";
import InfoCard from "@/components/dashboard/shared/InfoCard/InfoCard";
import styles from "./ProposalFile.module.scss";
import { BASE_URL } from "@/lib/adminCoreApi";

interface ProposalFileProps {
  files?: Array<{
    original_filename: string;
    file_size: number;
    file_url: string;
  }>;
}

export default function ProposalFile({ files = [] }: ProposalFileProps) {
  if (files.length === 0) return null;

  // format bytes to KB/MB
  const formatBytes = (bytes: number | null | undefined) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFullUrl = (url: string | null | undefined) => {
    if (!url) return "#";
    if (url.startsWith('/')) return `${BASE_URL}${url}`;
    return url;
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const fullUrl = getFullUrl(url);
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "proposal.pdf";
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download file:", error);
      // Fallback: just open in new tab
      window.open(getFullUrl(url), "_blank");
    }
  };

  return (
    <InfoCard title="Proposal Files" iconSrc="/images/dashboard/requests/proposal-file.svg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {files.map((file, idx) => (
          <div key={idx} className={styles.fileItem}>
            <div className={styles.fileIconWrapper}>
              <Image src="/images/dashboard/file/pdf.svg" alt="PDF" width={40} height={40} />
            </div>
            
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{file.original_filename}</p>
              <div className={styles.fileMeta}>
                <span className={styles.fileSize}>{formatBytes(file.file_size)}</span>
              </div>
            </div>

            {file.file_url && (
              <button 
                type="button"
                onClick={() => handleDownload(file.file_url, file.original_filename)}
                className={styles.fileDownloadBtn}
                title="Download file"
              >
                <Image src="/images/dashboard/download.svg" alt="Download" width={24} height={24} />
              </button>
            )}
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
