import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DeviceReading, DeviceReadingService } from '../device-reading.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  allDeviceReadings: DeviceReading[] = [];

  constructor(
    private deviceReadingService: DeviceReadingService
  ) { }

  ngOnInit(): void {
    this.loadAllDeviceReadings();
  }

  loadAllDeviceReadings(): void {
    this.deviceReadingService.getDeviceReadings().subscribe({
      next: (data: DeviceReading[]) => {
        this.allDeviceReadings = data;
        console.log('All device readings for reports:', this.allDeviceReadings);
      },
      error: (error: any) => {
        console.error('Error loading all device readings for reports:', error);
      }
    });
  }
}
