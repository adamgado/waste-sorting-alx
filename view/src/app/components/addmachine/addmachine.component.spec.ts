import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmachineComponent } from './addmachine.component';

describe('AddmachineComponent', () => {
  let component: AddmachineComponent;
  let fixture: ComponentFixture<AddmachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddmachineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
