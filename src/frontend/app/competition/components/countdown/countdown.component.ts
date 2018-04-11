import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
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
  private interval: NodeJS.Timer;

  end: Moment;
  countdown: string;

  constructor(private socketService: SocketService, private settingsService: SettingsService, private router: Router) { }

  ngOnInit() {
    this.socketService.stream.subscribe(packet => {
      if (packet.name === 'updateSettings') {
        this.settingsService.getSettings().then(settings => {
          this.settings = settings;
          this.setup();
        });
      }
    });

    this.settingsService.getSettings().then(settings => {
      this.settings = settings;
      this.setup();
    });
  }

  private setup() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }

    this.end = moment(this.settings.schedule.filter(schedule => moment().isBefore(moment(schedule.when))).sort(schedule => moment(schedule.when).unix())[0].when);

    const tick = () => {
      if (moment().isAfter(this.end)) {
        clearInterval(this.interval);
        this.countdown = 'Time\'s up!';
        this.router.navigate(['end']);
      }

      else {
        const diff = moment.duration(this.end.diff(moment()));
        this.countdown = [
          diff.days(), diff.hours(), diff.minutes(), diff.seconds()
        ].map(x => this.pad(x)).join(':');
      }
    };

    tick();
    this.interval = setInterval(tick, 500);
  }

  private pad(x: number, size: number = 2) {
    let s = x.toString();

    while (s.length < size) {
      s = '0' + s;
    }

    return s;
  }
}
