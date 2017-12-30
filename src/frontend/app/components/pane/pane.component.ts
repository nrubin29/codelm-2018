import { Component, Input } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-pane',
  templateUrl: './pane.component.html',
  styleUrls: ['./pane.component.scss']
})
export class PaneComponent {
  @Input() title;
  active = false;

  constructor(private tabs: TabsComponent) {
    tabs.add(this);
  }
}
