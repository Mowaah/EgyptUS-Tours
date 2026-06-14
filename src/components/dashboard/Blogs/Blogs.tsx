import { BlogsPanel } from "./BlogsPanel";
import styles from "./Blogs.module.scss";

export function Blogs() {
  return (
    <div className={styles.page}>
      <BlogsPanel />
    </div>
  );
}
