import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Dashboard } from '../../services/dashboard';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
//  status: any;
 irrigationData: any [] = [];

  // Form fields
  form: any = {
    zone_name: '',
    start_time: '',
    duration_minutes: '',
    moisture_level_before: '',
    moisture_level_after: '',
    created_by: 1 // Hardcoded user ID for now
  };
  constructor(
    private dashboardService: Dashboard    
    
  ){}

  ngOnInit(){
    this.getIrrigationEvent();
  }

  getIrrigationEvent(){
    this.dashboardService.getAllIrrigationEvent().subscribe(response=>{
      console.log('Irrigation data:', response);
      this.irrigationData = response;
    })
    
  

  

  
  
  }
  


 

}
