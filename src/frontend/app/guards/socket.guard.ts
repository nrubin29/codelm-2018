import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../services/socket.service';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private socketService: SocketService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.socketService.isConnected()) {
      return true;
    }

    this.router.navigate(['/login']); // TODO: Replace this with a message that forces the user to go back to the login screen.
    return false;
  }
}
