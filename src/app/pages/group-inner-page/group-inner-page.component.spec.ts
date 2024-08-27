import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInnerPageComponent } from './group-inner-page.component';

describe('GroupInnerPageComponent', () => {
  let component: GroupInnerPageComponent;
  let fixture: ComponentFixture<GroupInnerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupInnerPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupInnerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
