import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TeamModel } from '../../../../common/models/team.model';
import { ProblemService } from '../../services/problem.service';
import { ProblemModel } from '../../../../common/models/problem.model';
import { AdminModel } from '../../../../common/models/admin.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  admin: AdminModel;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.admin.subscribe(admin => {
      this.admin = admin;
    });
  }

}
