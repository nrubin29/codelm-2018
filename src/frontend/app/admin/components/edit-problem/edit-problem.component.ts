import { Component, Inject, OnInit } from '@angular/core';
import {
  ProblemDivision, ProblemModel, TestCaseModel,
  TestCaseOutputMode
} from '../../../../../common/models/problem.model';
import { DivisionModel } from '../../../../../common/models/division.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ProblemService } from '../../../services/problem.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html',
  styleUrls: ['./edit-problem.component.scss']
})
export class EditProblemComponent implements OnInit {
  problem: ProblemModel;
  divisionModels: DivisionModel[];

  testCases: FormArray;
  divisions: FormArray;
  formGroup: FormGroup;

  constructor(private problemService: ProblemService, private dialogRef: MatDialogRef<EditProblemComponent>, @Inject(MAT_DIALOG_DATA) private data: {problem: ProblemModel, divisions: DivisionModel[]}) { }

  ngOnInit() {
    this.divisionModels = this.data.divisions;
    this.problem = this.data.problem ? this.data.problem : {_id: undefined, title: undefined, description: undefined, divisions: [], testCaseOutputMode: undefined, testCases: []};

    this.testCases = new FormArray(this.problem.testCases.map(testCase => this.createTestCaseGroup(testCase)));
    this.divisions = new FormArray(this.problem.divisions.map(problemDivision => this.createProblemDivisionGroup(problemDivision)));

    this.formGroup = new FormGroup({
      _id: new FormControl(this.problem._id),
      title: new FormControl(this.problem.title),
      description: new FormControl(this.problem.description),
      testCaseOutputMode: new FormControl(this.problem.testCaseOutputMode),
      divisions: this.divisions,
      testCases: this.testCases
    });
  }

  get formValue() {
    return this.formGroup.getRawValue();
  }

  private createTestCaseGroup(testCase?: TestCaseModel): FormGroup {
    if (!testCase) {
      testCase = {
        input: '',
        output: '',
        hidden: false
      };
    }

    return new FormGroup({
      input: new FormControl(testCase.input),
      output: new FormControl(testCase.output),
      hidden: new FormControl(testCase.hidden)
    });
  }

  private createProblemDivisionGroup(problemDivision?: ProblemDivision): FormGroup {
    if (!problemDivision) {
      problemDivision = {
        division: undefined,
        problemNumber: undefined,
        points: undefined
      };
    }

    return new FormGroup({
      division: new FormControl(problemDivision.division ? problemDivision.division._id : ''),
      problemNumber: new FormControl(problemDivision.problemNumber),
      points: new FormControl(problemDivision.points),
    });
  }

  addTestCase(testCase?: TestCaseModel) {
    this.testCases.push(this.createTestCaseGroup(testCase))
  }

  addDivision(problemDivision?: ProblemDivision) {
    this.divisions.push(this.createProblemDivisionGroup(problemDivision));
  }

  deleteTestCase(index: number) {
    this.testCases.removeAt(index);
  }

  deleteDivision(index: number) {
    this.divisions.removeAt(index);
  }

  get testCaseOutputModes() {
    return Object.keys(TestCaseOutputMode).map(key => TestCaseOutputMode[key]);
  }
}
