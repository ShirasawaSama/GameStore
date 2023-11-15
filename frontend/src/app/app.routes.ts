import type { Routes } from '@angular/router'
import { GameDetailComponent } from './game-detail/game-detail.component'

export const routes: Routes = [
  {
    path: 'game/:gameId',
    component: GameDetailComponent
  }
]
