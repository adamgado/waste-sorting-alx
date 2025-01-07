import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmachineComponent } from './editmachine.component';

describe('EditmachineComponent', () => {
  let component: EditmachineComponent;
  let fixture: ComponentFixture<EditmachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmachineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
