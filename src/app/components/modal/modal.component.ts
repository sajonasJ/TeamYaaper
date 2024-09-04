import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() modalId: string = '';

  @Output() save = new EventEmitter<void>();

  // Emit the save event when the save button is clicked
  onSave() {
    this.save.emit();
  }
}
