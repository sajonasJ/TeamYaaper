import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Modal } from 'bootstrap';
import { Post } from '../../models/dataInterfaces'; // Import necessary interfaces

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrl: './add-post-modal.component.css'
})
export class AddPostModalComponent implements OnChanges {
  @Input() postToEdit: Post | null = null;  // Holds the post being edited, if any
  @Output() postAdded = new EventEmitter<Post>();
  @Output() postEdited = new EventEmitter<Post>();

  postTitleCharacterLimit: number = 100;
  postTextCharacterLimit: number = 1000;

  newPostTitle: string = '';
  newPostText: string = '';

  ngOnChanges(): void {
    if (this.postToEdit) {
      this.newPostTitle = this.postToEdit.name;
      this.newPostText = this.postToEdit.postText;
    } else {
      this.newPostTitle = '';
      this.newPostText = '';
    }
  }

  savePost(): void {
    // Capitalize the post title just before saving
    const capitalizedTitle = this.newPostTitle.trim().toUpperCase();
    const capitalizedText = this.newPostText.trim();

    if (capitalizedTitle && capitalizedText) {
      if (this.postToEdit) {
        // Editing an existing post
        this.postToEdit.name = capitalizedTitle;
        this.postToEdit.postText = capitalizedText;
        this.postEdited.emit(this.postToEdit);
      } else {
        // Adding a new post
        const newPost: Post = {
          id: this.generateUniqueId(),
          name: capitalizedTitle,
          postText: capitalizedText,
          profileIcon: 'path/to/default/icon.png',
          comments: []
        };
        this.postAdded.emit(newPost);
      }

      this.resetForm();

      const modalElement = document.getElementById('addPostModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    }
  }

  resetForm(): void {
    this.newPostTitle = '';
    this.newPostText = '';
    this.postToEdit = null;
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Helper methods to check character limits
  isPostTitleExceedingLimit(): boolean {
    return this.newPostTitle.length > this.postTitleCharacterLimit;
  }

  isPostTextExceedingLimit(): boolean {
    return this.newPostText.length > this.postTextCharacterLimit;
  }
}