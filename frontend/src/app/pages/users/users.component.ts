import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ManagedUser, NewUser, UserRole, UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: ManagedUser[] = [];
  loading = false;
  saving = false;
  showForm = false;
  editingId: number | null = null;
  errorMessage = '';
  successMessage = '';
  form: NewUser = { username: '', email: '', fullName: '', role: 'EDITOR', password: '' };

  constructor(private usersApi: UserService, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.usersApi.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'تعذر تحميل المستخدمين.';
      }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.form = { username: '', email: '', fullName: '', role: 'EDITOR', password: '' };
    this.errorMessage = '';
    this.showForm = true;
  }

  openEdit(user: ManagedUser): void {
    this.editingId = user.id;
    this.form = { username: user.username, email: user.email, fullName: user.fullName, role: user.role, password: '' };
    this.errorMessage = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  save(): void {
    this.saving = true;
    this.errorMessage = '';
    const request = this.editingId
      ? this.usersApi.updateUser(this.editingId, { fullName: this.form.fullName, email: this.form.email, role: this.form.role })
      : this.usersApi.createUser(this.form);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.successMessage = this.editingId ? 'تم تحديث بيانات المستخدم.' : 'تم إنشاء المستخدم.';
        this.loadUsers();
      },
      error: error => {
        this.saving = false;
        this.errorMessage = error.error?.message || 'تعذر حفظ بيانات المستخدم.';
      }
    });
  }

  toggleActive(user: ManagedUser): void {
    const nextActive = !user.isActive;
    if (!nextActive && user.username === this.auth.currentUserValue?.username) {
      this.errorMessage = 'لا يمكن تعطيل حسابك الحالي.';
      return;
    }
    const action = nextActive ? 'تفعيل' : 'تعطيل';
    if (!window.confirm(`هل تريد ${action} حساب ${user.fullName}؟`)) return;

    this.errorMessage = '';
    this.usersApi.updateUser(user.id, { isActive: nextActive }).subscribe({
      next: () => {
        this.successMessage = nextActive ? 'تم تفعيل الحساب.' : 'تم تعطيل الحساب.';
        this.loadUsers();
      },
      error: error => this.errorMessage = error.error?.message || 'تعذر تغيير حالة الحساب.'
    });
  }

  roleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      EDITOR: 'محرر',
      VERIFIER: 'متثبت',
      SENIOR_VERIFIER: 'متثبت أعلى'
    };
    return labels[role];
  }
}
