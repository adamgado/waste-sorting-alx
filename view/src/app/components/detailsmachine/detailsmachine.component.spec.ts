import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsmachineComponent } from './detailsmachine.component';

describe('DetailsmachineComponent', () => {
  let component: DetailsmachineComponent;
  let fixture: ComponentFixture<DetailsmachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsmachineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsmachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
