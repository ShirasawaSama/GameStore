// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, ElementRef, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute, RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatChipsModule } from '@angular/material/chips'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TimeagoModule } from 'ngx-timeago'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import KeenSlider, { type KeenSliderInstance } from 'keen-slider'
import type { Game } from '../../types'

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '../auth.service'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GameDetailService from './game-detail.service'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import GameService from '../app.service'

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, HttpClientModule, MatSnackBarModule, MatCardModule, MatChipsModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, FormsModule, TimeagoModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.less', '../../../node_modules/keen-slider/keen-slider.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailComponent implements OnDestroy {
  @ViewChild('sliderRef') sliderRef?: ElementRef<HTMLElement>
  game?: Game
  slider: KeenSliderInstance = null as unknown as KeenSliderInstance
  currentSlide = 0
  comment = ''
  dotHelper: number[] = []

  get tags (): string[] {
    return this.game ? Object.entries(this.game.tags).sort((a, b) => b[1] - a[1]).map((tag) => tag[0]) : []
  }

  constructor (
    router: ActivatedRoute,
    readonly gameService: GameService,
    private readonly service: GameDetailService,
    private readonly snackBar: MatSnackBar,
    readonly auth: AuthService
  ) {
    router.params.subscribe((params) => this.refresh(params['id']))
  }

  private refresh (id = this.game?._id): void {
    if (!id) return
    this.service.getGame(id).subscribe((game) => {
      if (game.error) {
        this.snackBar.open(game.error, 'Close', { duration: 5000 })
        return
      }
      this.game = game.game
      console.log(this.game?.comments)

      setTimeout(() => {
        if (!this.sliderRef) return
        this.slider = new KeenSlider(this.sliderRef.nativeElement, {
          initial: this.currentSlide,
          slideChanged: (s) => {
            this.currentSlide = s.track.details.rel
          }
        })
        this.dotHelper = Array.from({ length: this.slider.track.details.slides.length }, (_, i) => i)
      })
    })
  }

  ngOnDestroy (): void {
    if (this.slider) this.slider.destroy()
  }

  addComment (): void {
    if (!this.game || !this.comment || this.comment.length > 500) return
    this.service.addComment(this.game._id, this.comment).subscribe((res) => {
      if (res.error) {
        this.snackBar.open(res.error, 'Close', { duration: 5000 })
        return
      }
      this.snackBar.open('Comment added', 'Close', { duration: 5000 })
      this.refresh()
      this.comment = ''
    })
  }

  likeComment (commentId: string): void {
    if (!this.auth.currentUser || !this.game?.comments) return
    const isLiked = this.game.comments.find((comment) => comment._id === commentId)?.likes.includes(this.auth.currentUser.sub)
    ;(isLiked ? this.service.dislikeComment : this.service.likeComment).call(this.service, this.game._id, commentId).subscribe((res) => {
      if (res.error) {
        console.log(res.error)
        return
      }
      this.refresh()
    })
  }

  deleteComment (commentId: string): void {
    if (!this.game || !this.auth.currentUser) return
    this.service.deleteComment(this.game._id, commentId).subscribe((res) => {
      if (res.error) {
        this.snackBar.open(res.error, 'Close', { duration: 5000 })
        return
      }
      this.snackBar.open('Comment deleted', 'Close', { duration: 5000 })
      this.refresh()
    })
  }
}
