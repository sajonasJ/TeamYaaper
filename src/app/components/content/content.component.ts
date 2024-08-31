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
  postToEdit: Post | null = null;
  postCommentingOn: Post | null = null; // To manage visibility of comment input

  // Method to handle post addition from the modal component
  handlePostAdded(newPost: Post): void {
    if (this.selectedGroup) {
      this.selectedGroup.posts.push(newPost);
    }
  }

  // Method to handle post editing from the modal component
  handlePostEdited(editedPost: Post): void {
    this.postToEdit = null;  // Clear the editing state
  }

  // Method to initiate editing a post
  editPost(post: Post): void {
    this.postToEdit = post;
    const modalElement = document.getElementById('addPostModal');
    if (modalElement) {
      const modalInstance = Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  // Method to edit a comment
  editComment(post: Post, comment: Comment): void {
    const newCommentText = prompt('Edit comment', comment.text);
    if (newCommentText) {
      comment.text = newCommentText;
    }
  }

  // Method to show comment input
  showCommentInput(post: Post): void {
    this.postCommentingOn = post;
  }

  // Method to add a new comment to a specific post
  addComment(post: Post): void {
    if (this.newCommentText.trim()) {
      const newComment: Comment = {
        profileIcon: 'path/to/default/icon.png', // Replace with actual path or logic to set the profile icon
        name: 'Anonymous', // Replace with actual logic to set the commenter's name
        text: this.newCommentText
      };
      post.comments.push(newComment);
      this.newCommentText = ''; // Clear the input field after adding the comment
      this.postCommentingOn = null; // Hide the comment input
    } else {
      alert("Comment text cannot be empty.");
    }
  }

  // Method to cancel adding a comment
  cancelComment(): void {
    this.newCommentText = ''; // Clear the input field
    this.postCommentingOn = null; // Hide the comment input
  }

  // Method to delete a post
  deletePost(post: Post): void {
    if (this.selectedGroup) {
      this.selectedGroup.posts = this.selectedGroup.posts.filter(p => p.id !== post.id);
    }
  }

  // Method to delete a comment
  deleteComment(post: Post, comment: Comment): void {
    post.comments = post.comments.filter(c => c !== comment);
  }
}