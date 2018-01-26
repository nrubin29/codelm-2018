import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  state = 'out';

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.state = this.state === 'out' ? 'in': 'out';
  }
}
