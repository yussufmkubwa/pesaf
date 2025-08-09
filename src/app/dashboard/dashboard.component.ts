import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PumpControlComponent } from '../pump-control/pump-control.component';
import { SensorReadingsComponent } from '../sensor-readings/sensor-readings.component';
import { IrrigationHistoryComponent } from '../irrigation-history/irrigation-history.component';
import { ChartsComponent } from '../charts/charts.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PumpControlComponent, SensorReadingsComponent, IrrigationHistoryComponent, ChartsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

}
