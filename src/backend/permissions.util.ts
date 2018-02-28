import { NextFunction, Request, Response } from 'express';
import { TeamDao } from './daos/team.dao';
import { AdminDao } from './daos/admin.dao';
import { TeamModel } from '../common/models/team.model';
import { SettingsDao } from './daos/settings.dao';
import { SettingsState } from '../common/models/settings.model';
import { DivisionType } from '../common/models/division.model';

export class PermissionsUtil {
  static hasAccess(team: TeamModel): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      SettingsDao.getSettings().then(settings => {
        resolve(
          team.division.type === DivisionType.Special ||
          settings.state === SettingsState.Debug ||
          (settings.state === SettingsState.Competition && team.division.type === DivisionType.Competition) ||
          (settings.state === SettingsState.Preliminaries && team.division.type === DivisionType.Preliminaries)
        );
      }).catch(reject);
    });
  }

  static requireTeam(req: Request, res: Response, next: NextFunction) {
    TeamDao.getTeam(req.header('Authorization').split(' ')[1]).then(team => {
      req.params.team = team;
      next();
    }).catch(next);
  }

  static requireAccess(req: Request, res: Response, next: NextFunction) {
    if (!req.params.team) {
      next(new Error('No team found. Did you forget to use requireTeam?'));
    }

    else {
      if (PermissionsUtil.hasAccess(req.params.team)) {
        next();
      }

      else {
        next(new Error('Team does not have access.'));
      }
    }
  }

  static requireAdmin(req: Request, res: Response, next: NextFunction) {
    AdminDao.getAdmin(req.header('Authorization').split(' ')[1]).then(admin => {
      req.params.admin = admin;
      next();
    }).catch(next);
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

  static requireAuth(req: Request, res: Response, next: NextFunction) {
    PermissionsUtil.requireTeam(req, res, () => {
      if (req.params.team) {
        next();
      }

      else {
        PermissionsUtil.requireAdmin(req, res, () => {
          if (req.params.admin) {
            next();
          }

          else {
            next(new Error('No authentication.'));
          }
        });
      }
    });
  }
}