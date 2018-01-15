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
        transform: 'translateX(0)',
        display: 'flex'
      })),
      state('out', style({
        transform: 'translateX(-100%)',
        display: 'none'
      })),
      transition('in => out',[
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]), //animate('400ms ease-in-out')),
      transition('out => in', [
        animate(100, style({transform: 'translateX(100%)'}))
      ]) //animate('400ms ease-in-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent;

  constructor() { }

  ngOnInit() {
  }
}
