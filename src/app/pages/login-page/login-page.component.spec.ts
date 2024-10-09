import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      queryParams: of({ signup: 'true' }) 
    };
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test component creation
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test ngOnInit - Sign Up mode (when "signup" query param is present)
  it('should switch to sign-up mode when "signup" query param is present', () => {
    mockActivatedRoute.queryParams = of({ signup: 'true' });
    component.ngOnInit();
    expect(component.isSignIn).toBeFalse();
  });

  // Test ngOnInit - Sign In mode (when "signup" query param is absent)
  it('should switch to sign-in mode when "signup" query param is absent', () => {
    mockActivatedRoute.queryParams = of({});
    component.ngOnInit();
    expect(component.isSignIn).toBeTrue();
  });

  // Test switchToSignUp method
  it('should navigate to sign-up when switchToSignUp is called', () => {
    component.switchToSignUp();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { signup: true },
    });
  });

  // Test switchToSignIn method
  it('should navigate to sign-in when switchToSignIn is called', () => {
    component.switchToSignIn();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      relativeTo: mockActivatedRoute,
      queryParams: { signup: null },
      queryParamsHandling: 'merge',
    });
  });
});
