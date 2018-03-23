import { Request, Response, Router } from 'express';
import { ProblemDao } from '../daos/problem.dao';
import { ClientProblemSubmission, ServerProblemSubmission } from '../../common/problem-submission';
import { ProblemModel } from '../../common/models/problem.model';
import { SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';
import { SubmissionModel, TestCaseSubmissionModel } from '../../common/models/submission.model';
import { execFile } from "child_process";

const router = Router();

router.put('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, async (req: Request, res: Response) => {
  res.json(await ProblemDao.addOrUpdateProblem(req.body as ProblemModel));
});

router.get('/:id', PermissionsUtil.requireAuth, async (req: Request, res: Response) => {
  const problem = await ProblemDao.getProblem(req.params.id);

  if (!req.params.admin) {
    problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
  }

  res.json(problem);
});

router.delete('/:id', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, async (req: Request, res: Response) => {
  await ProblemDao.deleteProblem(req.params.id);
  res.json(true);
});

router.get('/division/:id', PermissionsUtil.requireAuth, async (req: Request, res: Response) => {
  let problems = await ProblemDao.getProblemsForDivision(req.params.id);

  if (!req.params.admin) {
    problems = problems.filter(problem => problem.divisions.findIndex(pD => pD.division._id.toString() === req.params.team.division._id.toString()) !== -1);
    problems.forEach(problem => {
      problem.testCases = problem.testCases.filter(testCase => !testCase.hidden);
    });
  }

  res.json(problems);
});

router.post('/submit', PermissionsUtil.requireTeam, PermissionsUtil.requireAccess, async (req: Request, res: Response) => {
  const problemSubmission = req.body as ClientProblemSubmission;
  const problem = await ProblemDao.getProblem(problemSubmission.problemId);
  const serverProblemSubmission: ServerProblemSubmission = {
    problemTitle: problem.title,
    testCases: problem.testCases.filter(testCase => !problemSubmission.test || !testCase.hidden),
    language: problemSubmission.language,
    code: problemSubmission.code
  };

  const process = execFile('docker', ['run', '-i', '--rm', '--cap-drop', 'ALL', '--net=none', 'coderunner'], async (err, stdout, stderr) => {
    let submission: SubmissionModel;

    if (stderr.length > 0) {
      try {
        const runError = JSON.parse(stderr);

        submission = await SubmissionDao.addSubmission({
          team: req.params.team,
          problem: problem,
          language: problemSubmission.language,
          code: problemSubmission.code,
          error: runError.error,
          test: problemSubmission.test
        });
      }

      catch {
        console.error(stderr);
        res.json(false);
      }
    }

    else {
      try {
        const testCaseSubmissions = JSON.parse(stdout) as TestCaseSubmissionModel[];

        submission = await SubmissionDao.addSubmission({
          team: req.params.team,
          problem: problem,
          language: problemSubmission.language,
          code: problemSubmission.code,
          testCases: testCaseSubmissions,
          test: problemSubmission.test
        });

        res.json(false);
      }

      catch {
        console.log(stdout);
        res.json(false);
      }
    }

    res.json(submission._id);
  });

  process.stdin.write(JSON.stringify(serverProblemSubmission) + '\n');
  process.stdin.end();
});

export default router