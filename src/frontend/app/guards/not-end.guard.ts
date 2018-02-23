import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import * as moment from 'moment';

@Injectable()
export class NotEndGuard implements CanActivate {
  constructor(private settingsService: SettingsService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.settingsService.getSettings().then(settings => {
        if (moment().isAfter(moment(settings.end))) {
          resolve(true);
        }

        else {
          this.router.navigate(['/']);
          resolve(false);
        }
      });
    });
  }
}
