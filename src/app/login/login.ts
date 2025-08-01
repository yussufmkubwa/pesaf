import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
passwordFieldType: any;
togglePasswordVisibility() {
throw new Error('Method not implemented.');
}
  loginForm: FormGroup;
showPassword: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Simulate login success
      this.router.navigate(['/navbar']);
    } else {
      alert('Tafadhali jaza taarifa zote sahihi');
    }
  }


}
