import { Component } from '@angular/core';
import { PaneComponent } from '../pane/pane.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  panes: PaneComponent[] = [];

  add(pane: PaneComponent) {
    this.panes.push(pane);

    if (this.panes.length === 1) {
      pane.active = true;
    }
  }

  select(pane: PaneComponent) {
    this.panes.forEach(p => p.active = false);
    pane.active = true;
  }
}
