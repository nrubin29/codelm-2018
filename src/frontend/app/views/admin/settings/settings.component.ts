import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SettingsModel, SettingsState} from '../../../../../common/models/settings.model';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: SettingsModel;
  formGroup: FormGroup;

  constructor(private settingsService: SettingsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.settings = data['settings'];

      this.formGroup = new FormGroup({
        state: new FormControl(this.settings.state),
        // end: new FormControl(moment(this.settings.end))
        end: new FormControl(this.settings.end)
      })
    });
  }

  submit(form: NgForm) {
    const value = form.value;
    // value.end = value.end.toDate();
    value.end = new Date(value.end);

    this.settingsService.updateSettings(value).then(() => {
      alert('Updated');
    }).catch(alert);
  }

  reset() {
    this.settingsService.resetSettings().then(() => {
      alert('Reset');
      // TODO: Reload.
    }).catch(alert);
  }

  get states(): SettingsState[] {
    return Object.keys(SettingsState).map(key => SettingsState[key]);
  }
}