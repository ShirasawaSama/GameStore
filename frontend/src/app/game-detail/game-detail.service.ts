import { Injectable } from '@angular/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http'
import type { Observable } from 'rxjs'

import type { Game } from '../../types'

@Injectable({
  providedIn: 'root'
})
export default class GameDetailService {
  private readonly apiUrl = '/api/game'

  constructor (private readonly http: HttpClient) { }

  getGame (id: string): Observable<any> {
    return this.http.get<{ game: Game, error?: string }>(`${this.apiUrl}/${id}`)
  }

  addComment (id: string, comment: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/comment`, { comment })
  }

  deleteComment (id: string, commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/comment/${commentId}`)
  }

  likeComment (id: string, commentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/comment/${commentId}/like`, {})
  }

  dislikeComment (id: string, commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/comment/${commentId}/like`, {})
  }
}
