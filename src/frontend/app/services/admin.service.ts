import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AdminModel } from '../../../common/models/admin.model';

@Injectable()
export class AdminService {
  private endpoint = 'admins';
  admin: BehaviorSubject<AdminModel>;

  constructor(private restService: RestService) {
    this.admin = new BehaviorSubject<AdminModel>(null);
  }

  getAdmins(): Promise<AdminModel[]> {
    return this.restService.get<AdminModel[]>(this.endpoint);
  }

  addOrUpdateAdmin(admin: any): Promise<AdminModel> {
    return this.restService.put<AdminModel>(this.endpoint, admin);
  }

  deleteAdmin(adminId: string): Promise<void> {
    return this.restService.delete<void>(`${this.endpoint}/${adminId}`);
  }
}
