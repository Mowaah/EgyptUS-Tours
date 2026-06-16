export type ArticleCategory = "Destination" | "Adventures" | "Travel Tips";
export type ArticleStatus = "Published" | "Draft" | "Scheduled";

export interface ArticleRow {
  id: string;
  postId: string;
  title: string;
  category: ArticleCategory;
  publishDate: string;
  views: number;
  status: ArticleStatus;
}
