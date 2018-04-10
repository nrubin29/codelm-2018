import { Request, Response, Router } from 'express';
import { ProblemDao, sanitizeProblem } from '../daos/problem.dao';
import { ClientGradedProblemSubmission, ClientProblemSubmission, ServerGradedProblemSubmission } from '../../common/problem-submission';
import { isGradedProblem, ProblemModel } from '../../common/models/problem.model';
import { SubmissionDao } from '../daos/submission.dao';
import { PermissionsUtil } from '../permissions.util';
import {
  GradedSubmissionModel,
  SubmissionFileModel,
  SubmissionModel,
  TestCaseSubmissionModel,
  UploadSubmissionModel
} from '../../common/models/submission.model';
import { execFile } from 'child_process';
import { FileArray, UploadedFile } from 'express-fileupload';

const router = Router();

router.put('/', PermissionsUtil.requireAdmin, PermissionsUtil.requireSuperUser, async (req: Request, res: Response) => {
  res.json(await ProblemDao.addOrUpdateProblem(req.body as ProblemModel));
});

router.get('/:id', PermissionsUtil.requireAuth, async (req: Request, res: Response) => {
  let problem = await ProblemDao.getProblem(req.params.id);

  if (!req.params.admin) {
    problem = sanitizeProblem(problem);
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
    problems.forEach(problem => sanitizeProblem(problem));
  }

  res.json(problems);
});

router.post('/submit', PermissionsUtil.requireTeam, PermissionsUtil.requireAccess, async (req: Request & { files?: FileArray }, res: Response) => {
  const problemSubmission = req.body as ClientProblemSubmission;
  const problem = await ProblemDao.getProblem(problemSubmission.problemId);

  if (isGradedProblem(problem)) {
    const gradedProblemSubmission = <ClientGradedProblemSubmission>problemSubmission;

    const serverProblemSubmission: ServerGradedProblemSubmission = {
      problemTitle: problem.title,
      testCases: problem.testCases.filter(testCase => !gradedProblemSubmission.test || !testCase.hidden),
      language: gradedProblemSubmission.language,
      code: gradedProblemSubmission.code
    };

    const process = execFile('docker', ['run', '-i', '--rm', '--cap-drop', 'ALL', '--net=none', 'coderunner'], async (err, stdout, stderr) => {
      let submission: SubmissionModel;

      if (stderr.length > 0) {
        try {
          const runError = JSON.parse(stderr);

          submission = await SubmissionDao.addSubmission({
            team: req.params.team,
            problem: problem,
            language: gradedProblemSubmission.language,
            code: gradedProblemSubmission.code,
            error: runError.error,
            test: gradedProblemSubmission.test
          } as GradedSubmissionModel);
        } catch {
          console.error(stderr);
          res.json(false);
          return;
        }
      } else {
        try {
          const testCaseSubmissions = JSON.parse(stdout) as TestCaseSubmissionModel[];

          submission = await SubmissionDao.addSubmission({
            team: req.params.team,
            problem: problem,
            language: gradedProblemSubmission.language,
            code: gradedProblemSubmission.code,
            testCases: testCaseSubmissions,
            test: gradedProblemSubmission.test
          } as GradedSubmissionModel);
        }

        catch {
          console.log(stdout);
          res.json(false);
          return;
        }
      }

      res.json(submission._id);
    });

    process.stdin.write(JSON.stringify(serverProblemSubmission) + '\n');
    process.stdin.end();
  }

  else {
    const files = req.files['files'] as UploadedFile[];

    const submission = await SubmissionDao.addSubmission({
      team: req.params.team,
      problem: problem,
      files: files.map(file => <SubmissionFileModel>{name: file.name, contents: file.data.toString()}),
      score: 0
    } as UploadSubmissionModel);

    res.json(submission._id);
  }
});

export default router;
