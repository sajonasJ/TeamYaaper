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

  newCommentText: string = '';
  postCommentingOn: Post | null = null;
  commentToEdit: Comment | null = null;
  postToEdit: Post | null = null;

  handlePostAdded(newPost: Post): void {
    if (this.selectedGroup) {
      this.selectedGroup.posts.push(newPost);
    }
  }

  handlePostEdited(editedPost: Post): void {
    if (this.selectedGroup) {
      const index = this.selectedGroup.posts.findIndex(post => post.id === editedPost.id);
      if (index !== -1) {
        this.selectedGroup.posts[index] = editedPost;
      }
    }
    this.postToEdit = null; // Clear the editing state
  }

  editPost(post: Post): void {
    this.postToEdit = post;
    const modalElement = document.getElementById('addPostModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  showCommentInput(post: Post, comment: Comment | null = null): void {
    this.postCommentingOn = post;
    this.commentToEdit = comment;
    this.newCommentText = comment ? comment.text : '';
  }

  saveComment(post: Post): void {
    if (this.newCommentText.trim()) {
      if (this.commentToEdit) {
        this.commentToEdit.text = this.newCommentText;
      } else {
        const newComment: Comment = {
          profileIcon: 'path/to/default/icon.png',
          name: 'Anonymous',
          text: this.newCommentText
        };
        post.comments.push(newComment);
      }
      this.resetCommentInput();
    } else {
      alert("Comment text cannot be empty.");
    }
  }

  cancelComment(): void {
    this.resetCommentInput();
  }

  resetCommentInput(): void {
    this.newCommentText = '';
    this.postCommentingOn = null;
    this.commentToEdit = null;
  }

  deletePost(post: Post): void {
    if (this.selectedGroup) {
      this.selectedGroup.posts = this.selectedGroup.posts.filter(p => p.id !== post.id);
    }
  }

  deleteComment(post: Post, comment: Comment): void {
    post.comments = post.comments.filter(c => c !== comment);
  }
}