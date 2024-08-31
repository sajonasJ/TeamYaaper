import { Component, Input } from '@angular/core';
import { Group, Post, Comment } from '../../models/dataInterfaces';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  @Input() selectedGroup: Group | null = null;

  newPostTitle: string = '';
  newPostText: string = '';
  newCommentText: string = '';

  addPost(): void {
    if (this.selectedGroup && this.newPostTitle && this.newPostText) {
      const newPost: Post = {
        id: this.generateUniqueId(),
        name: this.newPostTitle,
        postText: this.newPostText,
        profileIcon: 'path/to/default/icon.png',
        comments: []
      };
      this.selectedGroup.posts.push(newPost);
      this.newPostTitle = '';
      this.newPostText = '';

      // Close the modal after adding a post
      const modalElement = document.getElementById('addPostModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    }
  }

  addComment(post: Post): void {
    if (this.newCommentText) {
      const newComment: Comment = {
        profileIcon: 'path/to/default/icon.png',
        name: 'Anonymous',
        text: this.newCommentText
      };
      post.comments.push(newComment);
      this.newCommentText = '';
    }
  }

  deletePost(post: Post): void {
    if (this.selectedGroup) {
      this.selectedGroup.posts = this.selectedGroup.posts.filter(p => p.id !== post.id);
    }
  }

  deleteComment(post: Post, comment: Comment): void {
    post.comments = post.comments.filter(c => c !== comment);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}