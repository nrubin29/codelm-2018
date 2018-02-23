import { Component, Inject, OnInit } from '@angular/core';
import { ProblemModel, TestCaseModel } from '../../../../common/models/problem.model';
import { DivisionModel } from '../../../../common/models/division.model';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ProblemService } from '../../services/problem.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html',
  styleUrls: ['./edit-problem.component.scss']
})
export class EditProblemComponent implements OnInit {
  problem: ProblemModel;
  divisions: DivisionModel[];

  testCases: FormArray;
  formGroup: FormGroup;

  constructor(private problemService: ProblemService, private dialogRef: MatDialogRef<EditProblemComponent>, @Inject(MAT_DIALOG_DATA) private data: {problem: ProblemModel, divisions: DivisionModel[]}) { }

  ngOnInit() {
    this.divisions = this.data.divisions;
    this.problem = this.data.problem ? this.data.problem : {_id: undefined, id: undefined, title: undefined, description: undefined, divisions: [], points: undefined, testCasesCaseSensitive: false, testCases: []};
    
    this.testCases = new FormArray(this.problem.testCases.map(testCase => this.createTestCaseGroup(testCase)));

    this.formGroup = new FormGroup({
      _id: new FormControl(this.problem._id),
      id: new FormControl(this.problem.id),
      title: new FormControl(this.problem.title),
      description: new FormControl(this.problem.description),
      divisions: new FormControl(this.problem.divisions.map(d => d._id)),
      points: new FormControl(this.problem.points),
      testCasesCaseSensitive: new FormControl(this.problem.testCasesCaseSensitive),
      testCases: this.testCases
    });
  }

  get formValue() {
    return this.formGroup.getRawValue();
  }

  private createTestCaseGroup(testCase?: TestCaseModel): FormGroup {
    if (!testCase) {
      testCase = {
        id: undefined,
        input: '',
        output: '',
        hidden: false
      };
    }

    return new FormGroup({
      id: new FormControl(testCase.id),
      input: new FormControl(testCase.input),
      output: new FormControl(testCase.output),
      hidden: new FormControl(testCase.hidden)
    });
  }

  addTestCase(testCase?: TestCaseModel) {
    this.testCases.push(this.createTestCaseGroup(testCase))
  }

  isDivisionSelected(division: DivisionModel) {
    return this.problem.divisions.some(d => d._id == division._id);
  }
}
