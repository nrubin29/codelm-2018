import { Component, OnInit } from '@angular/core';
import { AdminModel } from '../../../../common/models/admin.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  admin: AdminModel;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.admin.subscribe(admin => {
      this.admin = admin;
    });
  }

}
