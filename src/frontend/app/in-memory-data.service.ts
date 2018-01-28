import {InMemoryDbService} from 'angular-in-memory-web-api';
import { ProblemModel } from '../../common/models/problem.model';
import { SubmissionModel } from '../../common/models/submission.model';
import { DivisionModel } from '../../common/models/division.model';
import { TeamModel } from '../../common/models/team.model';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // const divisions: DivisionModel[] = [
    //   { id: 1, name: 'Demo' }
    // ];

    // const problems: ProblemModel[] = [
    //   {
    //     id: 1,
    //     title: 'Add one',
    //     description: 'Given a number, add 1 to it.',
    //     divisions: [],
    //     points: 1,
    //     testCasesCaseSensitive: true,
    //     testCases: [{id: 1, hidden: false, input: '1', output: '2'}, {id: 2, hidden: true, input: '2', output: '3'}]
    //   }
    // ];

    // const submissions: SubmissionModel[] = [
    //   {
    //     id: 1,
    //     team: {
    //       id: 1,
    //       username: 'demoteam',
    //       members: 'Alice, Bob, Charlie',
    //       division: {
    //         id: 1,
    //         name: 'Expert'
    //       },
    //       submissions: []
    //     },
    //     problem: problems[0],
    //     code: 'def foo(bar):\n  print(bar)',
    //     testCases: [{testCase: {id: 1, hidden: false, input: '1', output: '2'}, output: '2'}, {testCase: {id: 2, hidden: false, input: '2', output: '3'}, output: '3'}],
    //     result: '100%'
    //   }
    // ];
    //
    // const teams: TeamModel[] = [{
    //   id: 1, username: 'demoteam', members: 'Alice, Bob, Charlie', division: divisions[0], submissions: submissions
    // }];

    // return {divisions, problems, submissions, teams};
    return {}
  }
}
