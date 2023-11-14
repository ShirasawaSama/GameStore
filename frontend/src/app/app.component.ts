import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule, NgFor, NgIf } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { HttpClientModule } from '@angular/common/http'

import GameService from './app.service'
import type { Game } from '../types'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, HttpClientModule, NgFor, NgIf],
  providers: [GameService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  search = ''
  randomGames: Game[] = []
  currentRandomGame: Game | null = null

  constructor (private readonly service: GameService) {}

  ngOnInit (): void {
    this.service.getRandomGames().subscribe((games) => {
      this.randomGames = games.games
      this.currentRandomGame = this.randomGames[0]
    })
  }

  nextVideo (): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = this.randomGames.indexOf(this.currentRandomGame!)
    this.currentRandomGame = this.randomGames[index >= this.randomGames.length - 1 ? 0 : index + 1]
  }
}
