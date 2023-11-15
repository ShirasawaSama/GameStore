import { Component, ViewEncapsulation, type OnInit } from '@angular/core'
import { CommonModule, NgFor, NgIf } from '@angular/common'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute, RouterModule, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialogModule, MatDialog } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { HttpClientModule } from '@angular/common/http'
import { Subject, debounceTime } from 'rxjs'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GameService from './app.service'
import { GameCardComponent } from './game-card/game-card.component'
import { LoginDialog } from './login-dialog/login-dialog.component'
import type { Game } from '../types'
import { MatChipsModule } from '@angular/material/chips'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule, MatMenuModule,
    MatInputModule, MatFormFieldModule, HttpClientModule, NgFor, NgIf, GameCardComponent, MatPaginatorModule, MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  randomGames: Game[] = []
  currentRandomGame: Game | null = null
  currentGame = ''

  private readonly search$ = new Subject<void>()

  constructor (
    readonly service: GameService,
    readonly auth: AuthService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly activedRouter: ActivatedRoute
  ) {
    router.events.subscribe(() => this.checkHomePage())
    this.checkHomePage()
  }

  private checkHomePage (): void {
    this.currentGame = this.activedRouter.snapshot.firstChild?.params?.['gameId']
  }

  get search (): string { return this.service.search }
  set search (value: string) {
    this.service.search = value
    this.service.pageIndex = 0
    this.search$.next()
    if (this.activedRouter.firstChild?.component != null) {
      void this.router.navigate(['/'])
    }
  }

  get currentGameId (): string { return this.currentGame || (this.currentRandomGame?._id ?? '') }

  ngOnInit (): void {
    this.service.getRandomGames().subscribe((games) => {
      this.randomGames = games.games
      this.currentRandomGame = this.randomGames[0]
    })

    this.search$.pipe(debounceTime(500)).subscribe(() => this.service.searchGames())
  }

  nextVideo (): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const index = this.randomGames.indexOf(this.currentRandomGame!)
    this.currentRandomGame = this.randomGames[index >= this.randomGames.length - 1 ? 0 : index + 1]
  }

  handlePageEvent (e: PageEvent): void {
    this.service.length = e.length
    this.service.pageSize = e.pageSize
    this.service.pageIndex = e.pageIndex
    this.search$.next()
  }

  openLoginDialog (): void {
    if (!this.auth.currentUser) {
      this.dialog.open(LoginDialog)
    }
  }
}
