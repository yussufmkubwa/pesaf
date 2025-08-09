import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrrigationHistoryComponent } from './irrigation-history.component';

describe('IrrigationHistoryComponent', () => {
  let component: IrrigationHistoryComponent;
  let fixture: ComponentFixture<IrrigationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IrrigationHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IrrigationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
