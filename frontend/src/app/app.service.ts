import { Injectable } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http'
import type { Observable } from 'rxjs'
import type { Game } from '../types'

@Injectable({
  providedIn: 'root'
})
export default class GameService {
  private readonly apiUrl = '/api/game'
  private _searchTag = ''
  search = ''
  games: Game[] = []
  searchInfo = 'Searching...'
  pageSize = 9
  length = 0
  pageIndex = 1

  get searchTag (): string { return this._searchTag }
  set searchTag (value: string) {
    this._searchTag = value
    this.searchGames()
  }

  searchGames (): void {
    this.games = []
    console.log(this.searchTag)
    this.searchInfo = 'Searching...'
    this.http.get<{
      games: Game[]
      total: number
      pageSize: number
      page: number
    }>(`${this.apiUrl}/search?search=${this.search}&page=${this.pageIndex}&page_size=${this.pageSize}&tags=${this.searchTag}`).subscribe((data) => {
      this.games = data.games
      if (data.games.length === 0) {
        this.searchInfo = 'No results found.'
      }
      this.length = data.total
      this.pageSize = data.pageSize
      this.pageIndex = data.page
    })
  }

  constructor (private readonly http: HttpClient) {
    this.searchGames()
  }

  getRandomGames (): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/random`)
  }
}
