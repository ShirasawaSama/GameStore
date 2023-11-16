import { type ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { JwtModule } from '@auth0/angular-jwt'
import { type HttpEvent, type HttpHandlerFn, type HttpRequest, provideHttpClient, withInterceptorsFromDi, withInterceptors, HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { TimeagoModule } from 'ngx-timeago'

import { routes } from './app.routes'
import { provideAnimations } from '@angular/platform-browser/animations'
import { catchError, throwError, type Observable, of } from 'rxjs'

function httpErrorCatchingInterceptor (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  // covert not 2xx to { error: string }
  return next(req).pipe(
    catchError(response => {
      if (response instanceof HttpErrorResponse && response.status >= 300) {
        console.error('HttpErrorResponse', response)
        return of(
          new HttpResponse({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: response.error || { error: response.message }
          })
        )
      }
      return throwError(() => new Error(response))
    })
  )
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('token')
        }
      })
    ),
    provideHttpClient(
      withInterceptors([httpErrorCatchingInterceptor]),
      withInterceptorsFromDi()
    ),
    importProvidersFrom(TimeagoModule.forRoot())
  ]
}
