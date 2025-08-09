import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PumpControlService, PumpControl } from '../pump-control.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  pumpStatus: string = 'OFF';

  constructor(private pumpControlService: PumpControlService) { }

  ngOnInit(): void {
    this.pumpControlService.getPumpStatus().subscribe(status => {
      this.pumpStatus = status.status;
    });
  }

  togglePump(): void {
    const newStatus = this.pumpStatus === 'ON' ? 'OFF' : 'ON';
    this.pumpControlService.setPumpStatus(newStatus).subscribe(status => {
      this.pumpStatus = status.status;
    });
  }
}
