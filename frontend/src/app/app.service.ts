import { Injectable } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http'
import type { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export default class GameService {
  private readonly apiUrl = '/api/game'

  constructor (private readonly http: HttpClient) { }

  getRandomGames (): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/random`)
  }

  searchGames (query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?q=${query}`)
  }
}
