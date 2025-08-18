import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User, UserService } from '../user.service';

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

  @ViewChild('userModal') userModal!: ElementRef;
  
  openModal(): void {
    // Reset form for adding a new user
    this.data = null;
    this.userForm.reset();
    // Add password validation for new user
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    // Show modal using Bootstrap's modal functionality
    const modal = this.userModal.nativeElement;
    // First ensure any previous backdrop is removed
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }
    
    // Add modal classes and create backdrop
    modal.classList.add('show');
    modal.style.display = 'block';
    modal.style.zIndex = '1050';
    document.body.classList.add('modal-open');
    
    // Create backdrop with proper z-index
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    backdrop.style.zIndex = '1040';
    document.body.appendChild(backdrop);
    
    // Ensure focus is available inside the modal
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
  
  closeModal(): void {
    // Properly close the modal
    const modal = this.userModal.nativeElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
    
    // Clean up body classes and remove backdrop with a slight delay
    // to ensure smooth animation
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }, 150);
  }

  addUser(): void {
    if (this.userModal.nativeElement.style.display !== 'block') {
      this.openModal();
    } else if (this.userForm.valid) {
      // Submit the form for adding a new user
      this.userService.createUser(this.userForm.value).subscribe({
        next: (data) => {
          this.closeModal();
          Swal.fire({
            title: 'Success!',
            text: `User ${data.username} has been created successfully!`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to create user. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  updateUser(user?: User): void {
    if (user) {
      // Prepare form for editing
      this.data = user;
      this.userForm.patchValue(user);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      // Show modal using the same improved method as openModal
      const modal = this.userModal.nativeElement;
      // First ensure any previous backdrop is removed
      const existingBackdrop = document.querySelector('.modal-backdrop');
      if (existingBackdrop) {
        existingBackdrop.remove();
      }
      
      // Add modal classes and create backdrop
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.style.zIndex = '1050';
      document.body.classList.add('modal-open');
      
      // Create backdrop with proper z-index
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.zIndex = '1040';
      document.body.appendChild(backdrop);
      
      // Ensure focus is available inside the modal
      setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    } else {
      // Handle form submission for update
      if (this.userForm.valid && this.data) {
        this.userService.updateUser(this.data.id, this.userForm.value).subscribe({
          next: (data) => {
            this.closeModal();
            Swal.fire({
              title: 'Success!',
              text: `User ${data.username} has been updated successfully!`,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update user. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    }
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete user ${user.username}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id!).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: `User ${user.username} has been deleted.`,
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete user. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  close(): void {
    this.closeModal();
  }
  
  // Check for form field validity
  isInvalid(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
