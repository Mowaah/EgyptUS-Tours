export type BlogCategory = "Destination" | "Adventures" | "Travel Tips";
export type BlogStatus = "Published" | "Draft" | "Scheduled";

export interface BlogRow {
  id: string;
  postId: string;
  title: string;
  category: BlogCategory;
  publishDate: string;
  views: number;
  status: BlogStatus;
}
