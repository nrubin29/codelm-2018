import { Component, Input, OnInit } from '@angular/core';
import { GradedProblemModel, TestCaseModel, TestCaseOutputMode } from '../../../../../common/models/problem.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-graded-problem',
  templateUrl: './edit-graded-problem.component.html',
  styleUrls: ['./edit-graded-problem.component.scss']
})
export class EditGradedProblemComponent implements OnInit {
  @Input() mainFormGroup: FormGroup;
  @Input() gradedProblem: GradedProblemModel;

  testCases: FormArray;

  constructor() {
  }

  ngOnInit() {
    this.testCases = new FormArray((this.gradedProblem.testCases ? this.gradedProblem.testCases : []).map(testCase => this.createTestCaseGroup(testCase)));

    // TODO: Have a FormGroup here and pass it to the parent (or figure out how to use formGroupName dynamically.
    const controls = {
      testCaseOutputMode: new FormControl(this.gradedProblem.testCaseOutputMode),
      testCases: this.testCases
    };

    Object.keys(controls).forEach(key => this.mainFormGroup.addControl(key, controls[key]));
  }

  addTestCase(testCase?: TestCaseModel) {
    this.testCases.push(this.createTestCaseGroup(testCase));
  }

  deleteTestCase(index: number) {
    this.testCases.removeAt(index);
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

  get testCaseOutputModes() {
    return Object.keys(TestCaseOutputMode).map(key => TestCaseOutputMode[key]);
  }
}
