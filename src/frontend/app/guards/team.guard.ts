import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TeamService } from '../services/team.service';

@Injectable()
export class TeamGuard implements CanActivate {
  constructor(private teamService: TeamService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.teamService.team.value) {
      return true;
    }

    this.router.navigate(['/admin']);
    return false;
  }
}
