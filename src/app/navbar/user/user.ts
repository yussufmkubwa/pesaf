import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { User } from '../../services/user';
import { AddUser } from './add-user/add-user';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule, RouterModule, MatDialogModule],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class UserComponent {

  users: any[] = [];
  
  constructor(
    private userService: User,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getAllUser().subscribe((response: any) => {
      this.users = response;
    });
  }
  
  addUser() {
    const dialogRef = this.dialog.open(AddUser, {
      width: '800px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUser(); // Refresh the user list after adding
      }
    });
  }

  updateUser(user: any) {
    const dialogRef = this.dialog.open(AddUser, {
      width: '800px',
      data: user
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUser(); // Refresh the user list after updating
      }
    });
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id).subscribe((response: any) => {
        console.log('User deleted successfully');
        this.getUser(); // Refresh the user list after deletion
      });
    }
  }
}


