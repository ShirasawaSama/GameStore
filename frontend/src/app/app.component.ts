import { Component, ViewEncapsulation } from '@angular/core'
import { CommonModule, NgFor, NgIf } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { HttpClientModule } from '@angular/common/http'
import { Subject, debounceTime } from 'rxjs'

import GameService from './app.service'
import { GameCardComponent } from './game-card/game-card.component'
import { LoginDialog } from './login-dialog/login-dialog.component'
import type { Game } from '../types'
import { AuthService } from './auth.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule,
    MatInputModule, MatFormFieldModule, HttpClientModule, NgFor, NgIf, GameCardComponent, MatPaginatorModule, MatSnackBarModule
  ],
  providers: [GameService, AuthService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  private _search = 'a'
  randomGames: Game[] = []
  currentRandomGame: Game | null = null
  games: Game[] = []
  searchInfo = 'Searching...'
  pageSize = 9
  length = 0
  pageIndex = 1

  private readonly search$ = new Subject<void>()

  constructor (private readonly service: GameService, private readonly dialog: MatDialog) {}

  get search (): string { return this._search }
  set search (value: string) {
    this._search = value
    this.search$.next()
  }

  ngOnInit (): void {
    this.service.getRandomGames().subscribe((games) => {
      this.randomGames = games.games
      this.currentRandomGame = this.randomGames[0]
    })

    this.search$.pipe(debounceTime(500)).subscribe(() => this.searchGames())
    this.searchGames()
  }

  nextVideo (): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = this.randomGames.indexOf(this.currentRandomGame!)
    this.currentRandomGame = this.randomGames[index >= this.randomGames.length - 1 ? 0 : index + 1]
  }

  private searchGames (): void {
    this.games = []
    this.searchInfo = 'Searching...'
    this.service.searchGames(`search=${this.search}&page=${this.pageIndex}&page_size=${this.pageSize}`).subscribe((data) => {
      this.games = data.games
      if (data.games.length === 0) {
        this.searchInfo = 'No results found.'
      }
      this.length = data.total
      this.pageSize = data.pageSize
      this.pageIndex = data.page
    })
  }

  handlePageEvent (e: PageEvent): void {
    this.length = e.length
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex
    this.search$.next()
  }

  openLoginDialog (): void {
    const dialogRef = this.dialog.open(LoginDialog)

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    })
  }
}
