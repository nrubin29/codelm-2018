import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import * as moment from 'moment';

@Injectable()
export class EndGuard implements CanActivate {
  constructor(private settingsService: SettingsService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (next.fragment === 'admin') {
        resolve(true);
      }

      else {
        this.settingsService.getSettings().then(settings => {
          if (moment().isAfter(moment(settings.end))) {
            this.router.navigate(['end']);
            resolve(false);
          }

          else {
            resolve(true);
          }
        }).catch(() => resolve(true)); // For DisconnectedComponent, we won't be able to contact the server, so we let it load anyway.
      }
    });
  }
}
