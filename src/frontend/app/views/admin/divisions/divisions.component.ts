import { Component, OnInit } from '@angular/core';
import { DivisionModel } from '../../../../../common/models/division.model';
import { DivisionService } from '../../../services/division.service';
import { DialogResult } from '../../../dialog-result';
import { MatDialog } from '@angular/material';
import { EditDivisionComponent } from '../../../components/edit-division/edit-division.component';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.scss']
})
export class DivisionsComponent implements OnInit {
  divisions: DivisionModel[] = [];
  division: DivisionModel = undefined;

  // TODO: Use the divisions resolve.
  constructor(private divisionService: DivisionService, private dialog: MatDialog) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.divisions = [];
    this.division = undefined;

    this.divisionService.getDivisions().then(divisions => {
      this.divisions = divisions;
    });
  }

  edit(division: DivisionModel) {
    const ref = this.dialog.open(EditDivisionComponent, {
      data: {
        division: division
      }
    });

    ref.afterClosed().subscribe((r?: [DialogResult, any]) => {
      if (r) {
        const result = r[0];
        const data = r[1];

        if (result === 'save') {
          this.divisionService.addOrUpdateDivision(data).then(() => {
            this.reload();
          }).catch(alert);
        }

        else if (result === 'delete') {
          if (confirm('Are you sure you want to delete this division?')) {
            this.divisionService.deleteDivision(data._id).then(() => {
              this.reload();
            }).catch(alert);
          }
        }
      }
    });
  }
}
