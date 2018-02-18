import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { DivisionModel } from '../../../../common/models/division.model';
import { DivisionService } from '../../services/division.service';
import { DivisionsComponent } from '../../views/admin/divisions/divisions.component';

// TODO: Add `type` to the form.

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {
  @Input() division: DivisionModel;

  formGroup: FormGroup;

  constructor(private divisionService: DivisionService, private divisionsComponent: DivisionsComponent) { }

  ngOnInit() {
    this.division = this.division ? this.division : {_id: undefined, name: undefined, type: undefined};

    this.formGroup = new FormGroup({
      _id: new FormControl(this.division._id),
      name: new FormControl(this.division.name)
    })
  }

  submit(form: NgForm) {
    this.divisionService.addOrUpdateDivision(form.value).then(() => {
      this.divisionsComponent.reload();
    }).catch(alert);
  }

  delete() {
    if (confirm('Are you sure you want to delete this division?')) {
      this.divisionService.deleteDivision(this.division._id).then(() => {
        this.divisionsComponent.reload();
      }).catch(alert);
    }
  }
}
