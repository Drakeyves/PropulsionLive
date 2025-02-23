export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  likes?: number;
  comments?: number;
}
