
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../../../services/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-user',
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
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
    console.log('Data received in dialog:', this.data)
    this.configForm();
    if (this.data) {
      this.userForm.patchValue(this.data);
    }
  }

  configForm() {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      userName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      phone_Number: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });
  }
  
//   const dialogRef = this.dialog.open(AddUser, {
//   width: '500px',
//   data: { /* optional data to pass to the dialog */ }
// });


  // private _filter(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.options.filter(option => 
  //     option.plateNumber && option.plateNumber.toLowerCase().includes(filterValue)
  //   );
  // }



  addUser() {
    if (this.userForm.valid) {
      this.userService.addUser(this.userForm.value).subscribe((response) => {
        console.log('User added successfully', response);
        this.dialogRef.close(true); // Close the dialog and return true
      });
      this.userForm.reset(); // Reset the form after submission
    } else {
      console.error('Form is invalid');
    }
  }

  updateUser() {
    if (this.userForm.valid) {
      // this.userForm.patchValue({
      //   carId: this.userForm.get('carId')?.value.id
      // });
      this.userService.update(this.userForm.value, this.data.id).subscribe((response) => {
        console.log('User updated successfully', response);
        this.dialogRef.close(true); // Close the dialog and return true
      });
      this.userForm.reset(); // Reset the form after submission
    } else {
      console.error('Form is invalid');
    }
  }

  close() {
    this.dialogRef.close();
  }
}
