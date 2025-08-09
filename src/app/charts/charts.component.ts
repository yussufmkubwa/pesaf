import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DeviceReadingService } from '../device-reading.service';
import { IrrigationEventService } from '../irrigation-event.service';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() chartType: 'soilMoisture' | 'waterUsage' = 'soilMoisture';
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  constructor(
    private deviceReadingService: DeviceReadingService,
    private irrigationEventService: IrrigationEventService
  ) { }

  ngOnInit(): void {
    if (this.chartType === 'soilMoisture') {
      this.createSoilMoistureChart();
    } else {
      this.createWaterUsageChart();
    }
  }

  createSoilMoistureChart(): void {
    this.deviceReadingService.getDeviceReadings().subscribe(readings => {
      const labels = readings.map(r => new Date(r.timestamp!).toLocaleTimeString());
      const data = readings.map(r => r.soil_moisture);
      this.createChart(labels, data, 'Soil Moisture (%)');
    });
  }

  createWaterUsageChart(): void {
    this.irrigationEventService.getIrrigationEvents().subscribe(events => {
      const labels = events.map(e => new Date(e.timestamp!).toLocaleDateString());
      const data = events.map(e => e.water_consumed_liters);
      this.createChart(labels, data, 'Water Consumed (L)');
    });
  }

  createChart(labels: string[], data: number[], label: string): void {
    new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType === 'soilMoisture' ? 'line' : 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: '#3e95cd',
          backgroundColor: '#7bb6dd',
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
