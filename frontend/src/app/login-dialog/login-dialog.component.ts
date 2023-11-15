import { Component } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '../auth.service'

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/

@Component({
  selector: 'login-dialog',
  templateUrl: 'login-dialog.component.html',
  styleUrl: './login-dialog.component.less',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSnackBarModule]
})
export class LoginDialog {
  username = ''
  password = ''
  confirmPassword = ''
  error = ''
  isRegister = false

  constructor (
    private readonly dialogRef: MatDialogRef<LoginDialog>,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar
  ) {}

  onCancelClick (): void {
    this.dialogRef.close()
  }

  onOkClick (): void {
    if (!USERNAME_REGEX.test(this.username)) {
      this.error = 'Invalid username'
      return
    }
    if (this.isRegister && this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match'
      return
    }
    this.dialogRef.close()
    ;(this.isRegister ? this.auth.register : this.auth.login).call(this.auth, this.username, this.password).subscribe((success) => {
      this.snackBar.open(success
        ? (this.isRegister ? 'Registered' : 'Logged in')
        : (this.isRegister ? 'Failed to register' : 'Failed to log in')
      , 'Close', { duration: 5000 })
    })
  }
}
