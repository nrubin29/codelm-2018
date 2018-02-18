import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TeamModel } from '../../../../../common/models/team.model';
import { TeamService } from '../../../services/team.service';
import { ProblemModel } from '../../../../../common/models/problem.model';
import { ProblemService } from '../../../services/problem.service';
import { SettingsService } from '../../../services/settings.service';
import { SettingsModel } from '../../../../../common/models/settings.model';

@Injectable()
export class SettingsResolve implements Resolve<SettingsModel> {
  constructor(private settingsService: SettingsService) {}

  resolve(route: ActivatedRouteSnapshot): Promise<SettingsModel> {
    return this.settingsService.getSettings();
  }
}
