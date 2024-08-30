export interface Post {
    id: string;
    profileIcon: string;
    name: string;
    postText: string;
    postImageUrl?: string;
    comments: Comment[];
  }
  
  export interface Comment {
    profileIcon: string;
    name: string;
    text: string;
  }
  
  export interface Group {
    id: string;
    name: string;
    posts: Post[];
  }
  