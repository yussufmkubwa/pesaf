import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceReadingService, DeviceReading } from '../device-reading.service';

@Component({
  selector: 'app-sensor-readings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensor-readings.component.html',
  styleUrls: ['./sensor-readings.component.css']
})
export class SensorReadingsComponent implements OnInit {
  latestReading: DeviceReading | null = null;

  constructor(private deviceReadingService: DeviceReadingService) { }

  ngOnInit(): void {
    this.deviceReadingService.getDeviceReadings().subscribe(readings => {
      this.latestReading = readings[0];
    });
  }
}
