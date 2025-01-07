import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdetialsComponent } from './userdetials.component';

describe('UserdetialsComponent', () => {
  let component: UserdetialsComponent;
  let fixture: ComponentFixture<UserdetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserdetialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserdetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
