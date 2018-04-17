import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EditProblemComponent } from '../edit-problem/edit-problem.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DivisionModel, DivisionType } from '../../../../../common/models/division.model';
import { DivisionService } from '../../../services/division.service';

@Component({
  selector: 'app-edit-division',
  templateUrl: './edit-division.component.html',
  styleUrls: ['./edit-division.component.scss']
})
export class EditDivisionComponent implements OnInit {
  division: DivisionModel;

  formGroup: FormGroup;
  graded: File;
  upload: File;

  constructor(private divisionService: DivisionService, private dialogRef: MatDialogRef<EditProblemComponent>, @Inject(MAT_DIALOG_DATA) private data: {division: DivisionModel}) { }

  ngOnInit() {
    this.division = this.data.division ? this.data.division : {_id: undefined, name: undefined, type: undefined};

    this.formGroup = new FormGroup({
      _id: new FormControl(this.division._id),
      name: new FormControl(this.division.name),
      type: new FormControl(this.division.type)
    });
  }

  handleGradedFile(files: FileList) {
    this.graded = files[0];
  }

  handleUploadFile(files: FileList) {
    this.upload = files[0];
  }

  get formValue() {
    return Object.assign({graded: this.graded, upload: this.upload}, this.formGroup.getRawValue());
  }

  get types(): DivisionType[] {
    return Object.keys(DivisionType).map(key => DivisionType[key]);
  }
}
