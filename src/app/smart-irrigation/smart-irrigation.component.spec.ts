import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartIrrigationComponent } from './smart-irrigation.component';

describe('SmartIrrigationComponent', () => {
  let component: SmartIrrigationComponent;
  let fixture: ComponentFixture<SmartIrrigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartIrrigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartIrrigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
