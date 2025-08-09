import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IrrigationEventService, IrrigationEvent } from '../irrigation-event.service';

@Component({
  selector: 'app-irrigation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './irrigation-history.component.html',
  styleUrls: ['./irrigation-history.component.css']
})
export class IrrigationHistoryComponent implements OnInit {
  irrigationEvents: IrrigationEvent[] = [];

  constructor(private irrigationEventService: IrrigationEventService) { }

  ngOnInit(): void {
    this.irrigationEventService.getIrrigationEvents().subscribe(events => {
      this.irrigationEvents = events.slice(0, 5);
    });
  }
}
