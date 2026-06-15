import { BlogsPanel } from "../BlogsPanel/BlogsPanel";
import styles from "./Blogs.module.scss";

interface BlogsProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function Blogs({ searchQuery = "", onClearSearch }: BlogsProps) {
  return (
    <div className={styles.page}>
      <BlogsPanel searchQuery={searchQuery} onClearSearch={onClearSearch} />
    </div>
  );
}
