import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { AdminModel } from '../../../../../common/models/admin.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  admin: AdminModel;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.admin.subscribe(admin => {
      this.admin = admin;
    });
  }
}