import { Router } from 'express';
import { ProblemDao } from '../daos/problem.dao';
import { CodeFile, CodeRunner, CppRunner, JavaRunner, PythonRunner, RunError } from '../coderunner';
import { TeamDao } from '../daos/team.dao';
import { ProblemSubmission } from '../../common/problem-submission';
import { ProblemModel } from '../../common/models/problem.model';
import uuid = require('uuid');
import { SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';

const router = Router();

router.put('/', PermissionsUtil.requireAdmin, (req, res) => {
  ProblemDao.addOrUpdateProblem(req.body as ProblemModel).then(problem => res.json(problem)).catch(console.error);
});

router.get('/:id', PermissionsUtil.requireAuth, (req, res) => {
  ProblemDao.getProblem(req.params.id).then(problem => {
    if (!req.params.admin) {
      problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
    }

    res.json(problem);
  }).catch(console.error);
});

router.delete('/:id', PermissionsUtil.requireAdmin, (req, res) => {
  ProblemDao.deleteProblem(req.params.id).then(() => res.json(true)).catch(console.error);
});

router.get('/division/:dId', PermissionsUtil.requireAuth, (req, res) => {
  ProblemDao.getProblemsForDivision(req.params.dId).then(problems => {
    if (!req.params.admin) {
      problems.forEach(problem => {
        problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
      });
    }

    res.json(problems);
  }).catch(console.error);
});

router.post('/submit', PermissionsUtil.requireTeam, PermissionsUtil.requireAccess, (req, res) => {
  const problemSubmission = req.body as ProblemSubmission;

  ProblemDao.getProblem(problemSubmission.problemId).then(problem => {
    let runner: CodeRunner;
    const folder = '/tmp/' + uuid();

    switch (problemSubmission.language) {
      case 'python': {
        runner = new PythonRunner(folder, [new CodeFile("main.py", problemSubmission.code)]);
        break;
      }

      case 'java': {
        runner = new JavaRunner(folder, [new CodeFile(problem.title.split(' ').join('') + ".java", problemSubmission.code)]);
        break;
      }

      case 'cpp': {
        runner = new CppRunner(folder, [new CodeFile("main.cpp", problemSubmission.code)]);
        break;
      }
    }

    // const sub = runner.subject.subscribe(next => {
    //   console.log(next);
    // });

    // TODO: Clean up redundant code.
    // TODO: If an error occurs on a hidden test case, we don't want to show the error.
    runner.run(problem.testCases.filter(testCase => !problemSubmission.test || !testCase.hidden)).then(results => {
      // sub.unsubscribe();

      SubmissionDao.addSubmission({
        team: req.params.team,
        problem: problem,
        language: problemSubmission.language,
        code: problemSubmission.code,
        testCases: results,
        test: problemSubmission.test
      }).then(submission => {
        res.json(submission._id);
      });
    }).catch((err: RunError) => {
      // console.error(err);
      SubmissionDao.addSubmission({
        team: req.params.team,
        problem: problem,
        language: problemSubmission.language,
        code: problemSubmission.code,
        error: err.error,
        test: problemSubmission.test
      }).then(submission => {
        res.json(submission._id);
      });
    });
  });
});

export default router