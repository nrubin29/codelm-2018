import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [ // TODO: Make this work.
    trigger('slideInOut', [
      state('in', style({
        // flex: '0',
        // transform: 'translateX(-100%)',
        display: 'none'
      })),
      state('out', style({
        // flex: '1',
        // transform: 'translateX(0)',
        display: 'flex'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ])
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  constructor() { }

  ngOnInit() {
  }
}
