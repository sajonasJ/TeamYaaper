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
    if (this.newPostTitle.trim() && this.newPostText.trim()) {
      if (this.postToEdit) {
        this.postToEdit.name = this.newPostTitle;
        this.postToEdit.postText = this.newPostText;
        this.postEdited.emit(this.postToEdit);
      } else {
        const newPost: Post = {
          id: this.generateUniqueId(),
          name: this.newPostTitle,
          postText: this.newPostText,
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

  isPostTitleExceedingLimit(): boolean {
    return this.newPostTitle.length > this.postTitleCharacterLimit;
  }

  isPostTextExceedingLimit(): boolean {
    return this.newPostText.length > this.postTextCharacterLimit;
  }
}