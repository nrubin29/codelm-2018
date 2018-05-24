import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SettingsService } from '../services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class OpenRegistrationGuard implements CanActivate {
  constructor(private settingsService: SettingsService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (next.fragment === 'admin') {
      return true;
    }

    const settings = await this.settingsService.getSettings();
    return settings.openRegistration;
  }
}
