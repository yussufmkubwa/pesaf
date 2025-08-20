import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DeviceReadingService } from '../device-reading.service';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() chartType: 'soilMoisture' = 'soilMoisture'; // Removed waterUsage option
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

  constructor(
    private deviceReadingService: DeviceReadingService
  ) { }

  ngOnInit(): void {
    // Only create soil moisture chart as water usage is removed
    this.createSoilMoistureChart();
  }

  createSoilMoistureChart(): void {
    this.deviceReadingService.getDeviceReadings().subscribe(readings => {
      const labels = readings.map(r => new Date(r.timestamp!).toLocaleTimeString());
      const data = readings.map(r => r.soil_moisture);
      this.createChart(labels, data, 'Soil Moisture (%)');
    });
  }

  createChart(labels: string[], data: number[], label: string): void {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'line', // Always a line chart since we only have soil moisture
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
