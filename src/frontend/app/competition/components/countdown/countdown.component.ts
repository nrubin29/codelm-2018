import { Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { SocketService } from '../../../services/socket.service';
import { SettingsModel } from '../../../../../common/models/settings.model';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  private settings: SettingsModel;
  countdown: string;

  constructor(private socketService: SocketService, private settingsService: SettingsService, private router: Router) { }

  ngOnInit() {
    this.socketService.stream.subscribe(packet => {
      if (packet.name === 'updateSettings') {
        this.settingsService.getSettings().then(settings => {
          this.settings = settings;
        });
      }
    });

    this.settingsService.getSettings().then(settings => {
      this.settings = settings;

      const tick = () => {
        if (moment().isAfter(moment(this.settings.end))) {
          this.countdown = 'Time\'s up!';
          this.router.navigate(['end']);
        }

        else {
          const diff = moment.duration(moment(this.settings.end).diff(moment()));
          this.countdown = [
            diff.days(), diff.hours(), diff.minutes(), diff.seconds()
          ].map(x => this.pad(x)).join(':');
        }
      };

      tick();
      setInterval(tick, 500);
    });
  }

  private pad(x: number, size: number = 2) {
    let s = x.toString();

    while (s.length < size) {
      s = '0' + s;
    }

    return s;
  }
}
