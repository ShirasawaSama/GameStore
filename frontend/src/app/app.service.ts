import { Injectable } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http'
import type { Observable } from 'rxjs'
import type { Game } from '../types'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute, Router } from '@angular/router'
import { ProfileComponent } from './profile/profile.component'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export default class GameService {
  private readonly apiUrl = '/api/game'
  private _searchTag = ''
  private _sortBy = ''
  private _order = ''
  search = ''
  games: Game[] = []
  searchInfo = 'Searching...'
  pageSize = 9
  length = 0
  pageIndex = 0
  private isProfilePage = false

  constructor (
    private readonly http: HttpClient,
    router: Router,
    activedRouter: ActivatedRoute,
    private readonly auth: AuthService
  ) {
    auth.likesUpdate$.subscribe(() => this.getLikeGames())
    router.events.subscribe(() => {
      const value = activedRouter.firstChild?.component === ProfileComponent
      if (value !== this.isProfilePage) {
        this.isProfilePage = value
        this.pageIndex = 0
      }
      if (!value) setTimeout(() => this.searchGames(), 500)
    })
    this.searchGames()
  }

  get searchTag (): string { return this._searchTag }
  set searchTag (value: string) {
    this.pageIndex = 0
    this._searchTag = value
    this.searchGames()
  }

  get sortBy (): string { return this._sortBy }
  set sortBy (value: string) {
    this.pageIndex = 0
    this._sortBy = value
    this.searchGames()
  }

  get order (): string { return this._order }
  set order (value: string) {
    this.pageIndex = 0
    this._order = value
    this.searchGames()
  }

  private getLikeGames (): void {
    if (!this.isProfilePage) return
    this.games = []
    const likes = this.auth.currentUser?.likes
    if (!likes) return
    const arr = Object.keys(likes)
    this.length = arr.length
    this.searchInfo = 'Searching...'
    this.http.post<{ games: Game[] }>(`${this.apiUrl}/find`, {
      ids: arr.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize)
    }).subscribe((data) => {
      this.games = data.games
      if (data.games.length === 0) {
        this.searchInfo = 'No results found.'
      }
    })
  }

  searchGames (): void {
    if (this.isProfilePage && this.auth.currentUser) {
      this.getLikeGames()
    } else {
      this.games = []
      this.searchInfo = 'Searching...'
      this.http.get<{
        games: Game[]
        total: number
        pageSize: number
        page: number
      }>(
        `${this.apiUrl}/search?search=${this.search}&page=${this.pageIndex}&page_size=${this.pageSize}&tags=${this.searchTag}&sort_order=${this.order}` +
          (this.sortBy ? `&sort=${this.sortBy}` : '')
      ).subscribe((data) => {
        this.games = data.games
        if (data.games.length === 0) {
          this.searchInfo = 'No results found.'
        }
        this.length = data.total
        this.pageSize = data.pageSize
        this.pageIndex = data.page
      })
    }
  }

  getRandomGames (): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/random`)
  }
}
