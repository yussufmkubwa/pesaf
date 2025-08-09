import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PumpControlService } from '../pump-control.service';

@Component({
  selector: 'app-pump-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pump-control.component.html',
  styleUrls: ['./pump-control.component.css']
})
export class PumpControlComponent implements OnInit {
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
