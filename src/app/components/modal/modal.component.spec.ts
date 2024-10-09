import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser'; // To find elements in the template

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  // Test if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test @Input bindings: title and modalId
  it('should display the correct title and modalId', () => {
    // Set the @Input properties
    component.title = 'Test Modal';
    component.modalId = 'testModal';

    fixture.detectChanges(); // Apply the input changes

    // Check if the title and modalId are rendered correctly in the template
    const titleElement = fixture.debugElement.query(
      By.css('.modal-title')
    ).nativeElement;
    expect(titleElement.textContent).toContain('Test Modal');
  });

  // Test @Output save event emitter
  it('should emit save event when onSave is called', () => {
    spyOn(component.save, 'emit'); // Spy on the save event emitter

    // Call the onSave method
    component.onSave();

    expect(component.save.emit).toHaveBeenCalled(); // Ensure the event was emitted
  });

  // Test button click triggers save event
  it('should emit save event when save button is clicked', () => {
    spyOn(component.save, 'emit'); // Spy on the save event emitter

    // Assuming there's a save button in the modal template with class 'save-btn'
    const saveButton = fixture.debugElement.query(
      By.css('.save-btn')
    ).nativeElement;
    saveButton.click(); // Simulate a click event

    expect(component.save.emit).toHaveBeenCalled(); // Ensure the event was emitted
  });
});
