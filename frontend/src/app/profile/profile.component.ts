import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '../auth.service'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {
  constructor (
    readonly auth: AuthService
  ) { }
}
