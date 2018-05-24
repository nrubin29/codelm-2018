import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Packet } from '../../../common/packets/packet';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;
  stream: Observable<Packet>;

  constructor(private router: Router) {}

  connect(): Promise<void> {
    this.socket = io(location.protocol + '//' + location.hostname + environment.socketSuffix);

    return new Promise<void>((resolve, reject) => {
      this.socket.on('connect', () => {
        this.stream = new Observable<Packet>(observer => {
          this.socket.on('packet', packet => {
            observer.next(packet)
          });
          // return () => {
          //     this.socket.off('packet');
          // }
        });
        resolve();
      });
    });
  }

  listenOnDisconnect() {
    this.socket.on('disconnect', () => {
      this.socket.close();
      this.router.navigate(['/disconnected']);
    });
  }

  isConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  emit(packet: Packet) {
    if (!this.isConnected()) {
      throw new Error('Socket is not connected!');
    }

    this.socket.emit('packet', packet);
  }
}
