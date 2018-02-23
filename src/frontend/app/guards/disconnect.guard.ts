import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

// This is the opposite of SocketGuard. Maybe it should have a better name.

@Injectable()
export class DisconnectGuard implements CanActivate {
  constructor(private socketService: SocketService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !this.socketService.isConnected();
  }
}
