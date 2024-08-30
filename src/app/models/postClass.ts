// post.ts

// Import the User class from its file
import { User } from './userClass';

export class Post {
  id: string;
  content: string;
  author: User;

  constructor(id: string, content: string, author: User) {
    this.id = id;
    this.content = content;
    this.author = author;
  }

  // Method to edit the post content
  editPost(newContent: string): void {
    this.content = newContent;
  }

  // Placeholder for delete functionality
  deletePost(): void {
    // Implementation for deleting the post
  }
}
