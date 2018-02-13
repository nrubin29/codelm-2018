import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import Packet from '../../../common/packets/packet';

@Injectable()
export class SocketService {
  private socket: SocketIOClient.Socket;
  stream: Observable<Packet>;

  constructor(private router: Router) {}

  connect(): Promise<void> {
    this.socket = io(location.protocol + '//' + location.hostname + environment.socketSuffix);
    this.socket.on('disconnect', () => {
      // TODO: Display a message saying that it disconnected.
      this.router.navigate(['/login']);
    });

    return new Promise<void>((resolve, reject) => {
      this.socket.on('connect', () => {
        this.stream = new Observable<Packet>(observer => {
          this.socket.on('packet', packet => {
            observer.next(packet)
          });
          // return () => {
          //     this.socket.off('event');
          // }
        });
        resolve();
      });
    });
  }

  isConnected(): boolean {
    return this.socket && this.socket.connected;
  }

  emit(packet: Packet) {
    if (!this.isConnected()) {
      throw new Error('Socket is not connected!');
    }

    console.log(`Emitting packet ${JSON.stringify(packet)}`);
    this.socket.emit('packet', packet);
  }
}
