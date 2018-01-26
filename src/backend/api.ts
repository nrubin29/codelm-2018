import { Router } from 'express';
import { ProblemDao } from './daos/problem.dao';
import { TeamDao } from './daos/team.dao';
import { CodeFile, PythonRunner } from './coderunner';
// import { SubmissionDao } from './daos/submission.dao';

const router = Router();

// TODO: Don't send hidden test cases unless user is admin. This applies to problems and submissions.

router.get('/problems/:id', (req, res) => {
  ProblemDao.getProblem(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/problems/?division=:dId', (req, res) => {
  ProblemDao.getProblemsForDivision(req.params.dId).then(p => res.json(p)).catch(console.error)
});

router.post('/problems/:id/submit', (req, res) => {
  ProblemDao.getProblem(req.params.id).then(problem => {
    const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "print(int(input()) % 2 == 0)")]);

    const sub = runner.subject.subscribe(next => {
      console.log(next);
    });

    runner.run(problem.testCases).then(results => {
      sub.unsubscribe();

      TeamDao.addSubmission('1', {
        problem: problem,
        code: 'print(int(input()) % 2 == 0)',
        testCases: results,
        result: '100%'
      }).then(submissionId => {
        res.json(submissionId);
      });
    }).catch(err => res.json(err));
  })
});

router.get('/submissions/:id', (req, res) => {
  // TeamDao.getTeam('1').then(team => console.log(team.submissions));
  TeamDao.getTeam('1').then(team => res.json(team.submissions.find(t => t._id.toString() === req.params.id)))
  // SubmissionDao.getSubmission(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/submissions/?team=:tId', (req, res) => {
  TeamDao.getTeam('1').then(team => res.json(team.submissions))
  // SubmissionDao.getSubmissionsForTeam(req.params.tId).then(p => res.json(p)).catch(console.error)
});

export default router