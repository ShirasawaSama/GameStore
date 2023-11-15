// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core'
import { CommonModule } from '@angular/common'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActivatedRoute, RouterModule } from '@angular/router'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient, HttpClientModule } from '@angular/common/http'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatChipsModule } from '@angular/material/chips'
import { MatCardModule } from '@angular/material/card'
import KeenSlider, { type KeenSliderInstance } from 'keen-slider'
import type { Game } from '../../types'

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, MatSnackBarModule, MatCardModule, MatChipsModule],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.less', '../../../node_modules/keen-slider/keen-slider.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sliderRef') sliderRef?: ElementRef<HTMLElement>
  game?: Game
  slider: KeenSliderInstance = null as unknown as KeenSliderInstance
  currentSlide = 0
  dotHelper: number[] = []

  get tags (): string[] {
    return this.game ? Object.entries(this.game.tags).sort((a, b) => b[1] - a[1]).map((tag) => tag[0]) : []
  }

  constructor (router: ActivatedRoute, private readonly http: HttpClient, private readonly snackBar: MatSnackBar) {
    router.params.subscribe((params) => {
      http.get<{ game: Game, error?: string }>(`/api/game/${params['id']}`).subscribe((game) => {
        if (game.error) {
          snackBar.open(game.error, 'Close', { duration: 5000 })
          return
        }
        this.game = game.game

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
    })
  }

  ngAfterViewInit (): void {
  }

  ngOnDestroy (): void {
    if (this.slider) this.slider.destroy()
  }
}
