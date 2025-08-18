import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  showForm = false;
  data: any = null; // Used to determine if we are adding or updating

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      address: [''],
      phone_number: [''],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  addUser(): void {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value).subscribe({
        next: (data) => {
          console.log('User added:', data);
          this.loadUsers();
          this.close();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
    }
  }

  updateUser(user?: User): void {
    if (user) {
      this.data = user;
      this.showForm = true;
      this.userForm.patchValue(user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Handle form submission for update
      if (this.userForm.valid && this.data) {
        this.userService.updateUser(this.data.id, this.userForm.value).subscribe({
          next: (data) => {
            console.log('User updated:', data);
            this.loadUsers();
            this.close();
          },
          error: (error) => {
            console.error('Error updating user:', error);
          }
        });
      }
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          console.log('User deleted:', user.id);
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  close(): void {
    this.showForm = false;
    this.data = null;
  }
}
