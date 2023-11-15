import { type ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { JwtModule } from '@auth0/angular-jwt'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TimeagoModule } from 'ngx-timeago'

import { routes } from './app.routes'
import { provideAnimations } from '@angular/platform-browser/animations'

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
      withInterceptorsFromDi()
    ),
    importProvidersFrom(TimeagoModule.forRoot())
  ]
}
