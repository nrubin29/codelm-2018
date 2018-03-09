import { Router, Request, Response } from 'express';
import { ProblemDao } from '../daos/problem.dao';
import { CodeFile, CodeRunner, CppRunner, JavaRunner, PythonRunner, RunError } from '../coderunner';
import { ProblemSubmission } from '../../common/problem-submission';
import { ProblemModel } from '../../common/models/problem.model';
import uuid = require('uuid');
import { SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';
import { SubmissionModel } from '../../common/models/submission.model';

const router = Router();

router.put('/', PermissionsUtil.requireAdmin, async (req: Request, res: Response) => {
  res.json(await ProblemDao.addOrUpdateProblem(req.body as ProblemModel));
});

router.get('/:id', PermissionsUtil.requireAuth, async (req: Request, res: Response) => {
  const problem = await ProblemDao.getProblem(req.params.id);

  if (!req.params.admin) {
    problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
  }

  res.json(problem);
});

router.delete('/:id', PermissionsUtil.requireAdmin, async (req: Request, res: Response) => {
  await ProblemDao.deleteProblem(req.params.id);
  res.json(true);
});

router.get('/division/:dId', PermissionsUtil.requireAuth, async (req: Request, res: Response) => {
  const problems = await ProblemDao.getProblemsForDivision(req.params.dId);

  if (!req.params.admin) {
    problems.forEach(problem => {
      problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
    });
  }

  res.json(problems);
});

router.post('/submit', PermissionsUtil.requireTeam, PermissionsUtil.requireAccess, async (req: Request, res: Response) => {
  const problemSubmission = req.body as ProblemSubmission;

  const problem = await ProblemDao.getProblem(problemSubmission.problemId);

  let runner: CodeRunner;
  const folder = '/tmp/' + uuid();

  switch (problemSubmission.language) {
    case 'python': {
      runner = new PythonRunner(folder, [new CodeFile('main.py', problemSubmission.code)]);
      break;
    }

    case 'java': {
      runner = new JavaRunner(folder, [new CodeFile(problem.title.split(' ').join('') + '.java', problemSubmission.code)]);
      break;
    }

    case 'cpp': {
      runner = new CppRunner(folder, [new CodeFile('main.cpp', problemSubmission.code)]);
      break;
    }

    default: {
      res.sendStatus(400);
      return;
    }
  }

  // const sub = runner.subject.subscribe(next => {
  //   console.log(next);
  // });

  // TODO: Clean up redundant code.
  // TODO: If an error occurs on a hidden test case, we don't want to show the error.
  let submission: SubmissionModel;

  try {
    const results = await runner.run(problem.testCases.filter(testCase => !problemSubmission.test || !testCase.hidden));

    submission = await SubmissionDao.addSubmission({
      team: req.params.team,
      problem: problem,
      language: problemSubmission.language,
      code: problemSubmission.code,
      testCases: results,
      test: problemSubmission.test
    });
  }

  catch (err) {
    console.error(err);

    submission = await SubmissionDao.addSubmission({
      team: req.params.team,
      problem: problem,
      language: problemSubmission.language,
      code: problemSubmission.code,
      error: err.error,
      test: problemSubmission.test
    });
  }

  finally {
    res.json(submission._id);
  }
});

export default router