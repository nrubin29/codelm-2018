import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;
  sidebarState = 'out';

  constructor() { }

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarState = this.sidebarState === 'out' ? 'in': 'out'
  }
}
