import { type Routes, Router } from '@angular/router'
import { GameDetailComponent } from './game-detail/game-detail.component'
import { ProfileComponent } from './profile/profile.component'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'

export const routes: Routes = [
  {
    path: 'game/:gameId',
    component: GameDetailComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      () => {
        const ret = inject(AuthService).currentUser != null
        if (!ret) {
          void inject(Router).navigate(['/'])
        }
        return ret
      }
    ]
  }
]
