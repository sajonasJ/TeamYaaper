import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test the rendering of the welcome message
  it('should render the welcome message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const welcomeMessage = compiled.querySelector('.welcome-message h1');
    expect(welcomeMessage?.textContent).toContain('Team Yaaper');
  });

  // Test the rendering of the subtitle
  it('should render the subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('.welcome-message p');
    expect(subtitle?.textContent).toContain('Connecting gamers, one chat at a time.');
  });

  // Test that all quotes are rendered correctly
  it('should render all quotes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const quotes = compiled.querySelectorAll('.quote-card');
    expect(quotes.length).toBe(5);

    expect(quotes[0].textContent).toContain('"The art of winning a game lies in collaboration."');
    expect(quotes[1].textContent).toContain('"Great games happen when gamers connect."');
    expect(quotes[2].textContent).toContain('"Your voice, your team, your way."');
    expect(quotes[3].textContent).toContain('"Collaborating games through conversations."');
    expect(quotes[4].textContent).toContain('"Chat today, game tomorrow."');
  });

  // Test the presence of the <app-header> and <app-footer> components
  it('should render <app-header> and <app-footer> components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
