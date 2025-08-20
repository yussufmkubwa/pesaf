import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpMonitoringComponent } from './pump-monitoring.component';

describe('PumpMonitoringComponent', () => {
  let component: PumpMonitoringComponent;
  let fixture: ComponentFixture<PumpMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PumpMonitoringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PumpMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
