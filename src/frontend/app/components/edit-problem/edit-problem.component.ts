import { Component, Input, OnInit } from '@angular/core';
import { ProblemModel, TestCaseModel } from '../../../../common/models/problem.model';
import { DivisionModel } from '../../../../common/models/division.model';
import { FormArray, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ProblemService } from '../../services/problem.service';
import { ProblemsComponent } from '../../views/admin/problems/problems.component';

@Component({
  selector: 'app-edit-problem',
  templateUrl: './edit-problem.component.html',
  styleUrls: ['./edit-problem.component.scss']
})
export class EditProblemComponent implements OnInit {
  @Input() problem: ProblemModel;
  @Input() divisions: DivisionModel[];

  testCases: FormArray;
  formGroup: FormGroup;

  constructor(private problemService: ProblemService, private problemsComponent: ProblemsComponent) { }

  ngOnInit() {
    this.problem = this.problem ? this.problem : {_id: undefined, id: undefined, title: undefined, description: undefined, divisions: [], points: undefined, testCasesCaseSensitive: false, testCases: []};
    
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
    })
  }

  submit(form: NgForm) {
    this.problemService.addOrUpdateProblem(form.value).then(() => {
      this.problemsComponent.reload();
    }).catch(alert);
  }

  delete() {
    if (confirm('Are you sure you want to delete this problem?')) {
      this.problemService.deleteProblem(this.problem._id).then(() => {
        this.problemsComponent.reload();
      }).catch(alert);
    }
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
    return this.problem ? this.problem.divisions.some(d => d._id == division._id) : false;
  }
}
