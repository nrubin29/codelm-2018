import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SettingsService } from '../services/settings.service';
import * as moment from 'moment';

@Injectable()
export class NotEndGuard implements CanActivate {
  constructor(private settingsService: SettingsService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const settings = await this.settingsService.getSettings();

    if (moment().isAfter(moment(settings.end))) {
      return true;
    }

    else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
