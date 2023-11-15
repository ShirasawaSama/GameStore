import { Component, Input, ViewEncapsulation } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { MatChipsModule } from '@angular/material/chips'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import type { Game } from '../../types'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GameService from '../app.service'

@Component({
  selector: 'game-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule, RouterModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.less',
  encapsulation: ViewEncapsulation.None
})
export class GameCardComponent {
  @Input() game: Game = null as unknown as Game

  constructor (readonly service: GameService) { }

  get tags (): string[] {
    return Object.entries(this.game.tags).sort((a, b) => b[1] - a[1]).map((tag) => tag[0])
  }
}
