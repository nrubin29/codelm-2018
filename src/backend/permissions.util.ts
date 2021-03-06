import {NextFunction, Request, Response} from 'express';
import {TeamDao} from './daos/team.dao';
import {AdminDao} from './daos/admin.dao';
import {TeamModel} from '../common/models/team.model';
import {SettingsDao} from './daos/settings.dao';
import {SettingsState} from '../common/models/settings.model';
import {DivisionType} from '../common/models/division.model';

export class PermissionsUtil {
  static async hasAccess(team: TeamModel): Promise<boolean> {
    const settings = await SettingsDao.getSettings();

    return team.division.type === DivisionType.Special ||
      settings.state === SettingsState.Debug ||
      (settings.state === SettingsState.Graded && team.division.type === DivisionType.Competition) ||
      (settings.state === SettingsState.Upload && team.division.type === DivisionType.Competition) ||
      (settings.state === SettingsState.Preliminaries && team.division.type === DivisionType.Preliminaries);
  }

  static async requireTeam(req: Request, res: Response, next: NextFunction) {
    req.params.team = await TeamDao.getTeam(req.header('Authorization').split(' ')[1]);

    if (req.params.team) {
      next();
    }

    else {
      next(new Error('No team found for given authorization.'));
    }
  }

  static async requireAccess(req: Request, res: Response, next: NextFunction) {
    if (!req.params.team) {
      next(new Error('No team found. Did you forget to use requireTeam?'));
    }

    else {
      if (await PermissionsUtil.hasAccess(req.params.team)) {
        next();
      }

      else {
        next(new Error('Team does not have access.'));
      }
    }
  }

  static async requireAdmin(req: Request, res: Response, next: NextFunction) {
    req.params.admin = await AdminDao.getAdmin(req.header('Authorization').split(' ')[1]);

    if (req.params.admin) {
      next();
    }

    else {
        next(new Error('No admin found for given authorization.'));
    }
  }

  static async requestAdmin(req: Request, res: Response, next: NextFunction) {
    req.params.admin = await AdminDao.getAdmin(req.header('Authorization').split(' ')[1]);

    if (!req.params.admin) {
      delete req.params.admin;
    }

    next();
  }

  static requireSuperUser(req: Request, res: Response, next: NextFunction) {
    if (!req.params.admin) {
      next(new Error('No admin found. Did you forget to use requireAdmin?'));
    }

    else {
      if (req.params.admin.superUser) {
        next();
      }

      else {
        next(new Error('Admin does not have superuser permissions.'));
      }
    }
  }

  static async requireAuth(req: Request, res: Response, next: NextFunction) {
    const team = await TeamDao.getTeam(req.header('Authorization').split(' ')[1]);

    if (team) {
      req.params.team = team;
      next();
    }

    else {
      await PermissionsUtil.requestAdmin(req, res, () => {
        if (req.params.admin) {
          next();
        }

        else {
          next(new Error('No authentication.'));
        }
      });
    }
  }
}
