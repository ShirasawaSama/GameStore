import { Component, Inject } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
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
  oldPassword = ''
  password = ''
  confirmPassword = ''
  error = ''
  type = 0 // 0: login, 1: register, 2: change password

  constructor (
    private readonly dialogRef: MatDialogRef<LoginDialog>,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: { isChangePassword?: boolean }
  ) {
    this.type = data?.isChangePassword ? 2 : 0
  }

  onCancelClick (): void {
    this.dialogRef.close()
  }

  onOkClick (): void {
    if (this.type !== 2 && !USERNAME_REGEX.test(this.username)) {
      this.error = 'Invalid username'
      return
    }
    if ((this.type === 1 || this.type === 2) && this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match'
      return
    }
    this.dialogRef.close()
    if (this.type === 2) {
      this.auth.changePassword(this.oldPassword, this.password).subscribe((success) => {
        this.snackBar.open(success ? 'Password changed' : 'Failed to change password', 'Close', { duration: 5000 })
      })
      return
    }
    ;(this.type === 1 ? this.auth.register : this.auth.login).call(this.auth, this.username, this.password).subscribe((success) => {
      this.snackBar.open(success
        ? (this.type === 1 ? 'Registered' : 'Logged in')
        : (this.type === 1 ? 'Failed to register' : 'Failed to log in')
      , 'Close', { duration: 5000 })
    })
  }
}
