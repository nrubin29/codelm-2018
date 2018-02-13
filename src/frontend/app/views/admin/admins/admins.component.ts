import { Component, OnInit } from '@angular/core';
import { AdminModel } from '../../../../../common/models/admin.model';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  admins: AdminModel[] = [];
  admin: AdminModel = undefined;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.admins = [];
    this.admin = undefined;

    this.adminService.getAdmins().then(admins => {
      this.admins = admins;
    });
  }

  get ready() {
    return this.admins
  }
}
