
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { User } from '../../../services/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {
  userForm!: FormGroup;
 
  constructor(
    private dialogRef: MatDialogRef<AddUser>,
    private userService: User,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('Data received in dialog:', this.data);
    this.configForm();
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  configForm() {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });
  }

  addUser() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe((response: any) => {
        console.log('User added successfully', response);
        this.dialogRef.close(true);
      }, (error: any) => {
        console.error('Error adding user:', error);
      });
      this.userForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }

  updateUser() {
    if (this.userForm.valid) {
      this.userService.update(this.userForm.value, this.data.id).subscribe((response: any) => {
        console.log('User updated successfully', response);
        this.dialogRef.close(true);
      }, (error: any) => {
        console.error('Error updating user:', error);
      });
      this.userForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }

  close() {
    this.dialogRef.close();
  }
}
