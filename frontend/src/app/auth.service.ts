/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { HttpClient } from '@angular/common/http'

import { JwtHelperService } from '@auth0/angular-jwt'
import { Observable, map, mergeMap } from 'rxjs'
import JSEncrypt from 'jsencrypt'

import { User } from '../types'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser?: User
  private readonly apiUrl = '/api/user'

  constructor (
    private readonly jwtHelperService: JwtHelperService,
    private readonly snackBar: MatSnackBar,
    private readonly http: HttpClient
  ) {
    const token = localStorage.getItem('token')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (token) {
      const user = this.jwtHelperService.decodeToken(token)
      if (user) {
        this.currentUser = user
        this.updateLikes()
      }
    }
  }

  private action (action: string, username: string, password: string): Observable<boolean> {
    return this.encryptPassword(password).pipe(
      mergeMap((encrypted) => this.http.post<{ access_token: string, error?: string }>(`${this.apiUrl}/${action}`, { username, password: encrypted })),
      map((response) => {
        if (response.error) {
          this.snackBar.open(response.error, 'Close', { duration: 5000 })
          return false
        }
        localStorage.setItem('token', response.access_token)
        const user = this.jwtHelperService.decodeToken(response.access_token)
        if (user) {
          this.currentUser = user
          this.updateLikes()
        }
        return true
      })
    )
  }

  login (username: string, password: string): Observable<boolean> {
    return this.action('login', username, password)
  }

  register (username: string, password: string): Observable<boolean> {
    return this.action('register', username, password)
  }

  changePassword (password: string): Observable<boolean> {
    return this.action('change-password', this.currentUser?.sub ?? '', password)
  }

  logout (): void {
    this.currentUser = undefined
  }

  updateLikes (): void {
    if (!this.currentUser) return
    this.http.get<{ likes: string[] }>(`${this.apiUrl}/likes`).subscribe((response) => {
      if (this.currentUser) {
        const likes: Record<string, true> = { }
        this.currentUser.likes = likes
        response.likes.forEach((like) => {
          likes[like] = true
        })
      }
    })
  }

  likeGame (gameId: string): void {
    if (!this.currentUser) return
    ;(this.currentUser.likes[gameId] ? this.http.delete : this.http.put).call(this.http, `${this.apiUrl}/likes/${gameId}`, {}).subscribe(() => {
      if (this.currentUser) {
        if (this.currentUser.likes[gameId]) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.currentUser.likes[gameId]
        } else {
          this.currentUser.likes[gameId] = true
        }
      }
    })
  }

  private encryptPassword (password: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/public-key`, { responseType: 'text' }).pipe(
      map((key) => {
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(key)
        const encrypted = encrypt.encrypt(password)
        if (!encrypted) throw new Error('Failed to encrypt password')
        return encrypted
      })
    )
  }
}
