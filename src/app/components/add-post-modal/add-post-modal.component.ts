import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Modal } from 'bootstrap';
import { Post } from '../../models/dataInterfaces'; // Import necessary interfaces

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrl: './add-post-modal.component.css'
})
export class AddPostModalComponent {
  @Input() postToEdit: Post | null = null;  // Holds the post being edited, if any
  @Output() postAdded = new EventEmitter<Post>();
  @Output() postEdited = new EventEmitter<Post>();

  newPostTitle: string = '';
  newPostText: string = '';

  ngOnChanges(): void {
    // Set initial values if editing a post
    if (this.postToEdit) {
      this.newPostTitle = this.postToEdit.name;
      this.newPostText = this.postToEdit.postText;
    } else {
      this.newPostTitle = '';
      this.newPostText = '';
    }
  }

  savePost(): void {
    if (this.newPostTitle && this.newPostText) {
      if (this.postToEdit) {
        // Editing an existing post
        this.postToEdit.name = this.newPostTitle;
        this.postToEdit.postText = this.newPostText;
        this.postEdited.emit(this.postToEdit);
      } else {
        // Adding a new post
        const newPost: Post = {
          id: this.generateUniqueId(),
          name: this.newPostTitle,
          postText: this.newPostText,
          profileIcon: 'path/to/default/icon.png',
          comments: []
        };
        this.postAdded.emit(newPost);
      }

      this.newPostTitle = '';
      this.newPostText = '';
      this.postToEdit = null;

      // Close the modal after saving
      const modalElement = document.getElementById('addPostModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    }
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}