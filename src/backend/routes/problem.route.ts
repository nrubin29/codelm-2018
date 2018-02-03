import { Router } from 'express';
import { ProblemDao } from '../daos/problem.dao';
import { CodeFile, PythonRunner } from '../coderunner';
import { TeamDao } from '../daos/team.dao';
import { ProblemSubmission } from '../../common/problem-submission';

const router = Router();

// TODO: Don't send hidden test cases unless user is admin.

router.get('/:id', (req, res) => {
  ProblemDao.getProblem(req.params.id).then(p => res.json(p)).catch(console.error)
});

router.get('/division/:dId', (req, res) => {
  ProblemDao.getProblemsForDivision(req.params.dId).then(p => res.json(p)).catch(console.error)
});

router.post('/submit', (req, res) => {
  const problemSubmission = req.body as ProblemSubmission;

  ProblemDao.getProblem(problemSubmission.problemId).then(problem => {
    const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", problemSubmission.code)]);

    const sub = runner.subject.subscribe(next => {
      console.log(next);
    });

    runner.run(problem.testCases).then(results => {
      sub.unsubscribe();

      TeamDao.addSubmission(req.header('Authorization').split(' ')[1], {
        problem: problem,
        code: problemSubmission.code,
        testCases: results,
        result: '100%',
        test: problemSubmission.test
      }).then(submissionId => {
        res.json(submissionId);
      });
    }).catch(err => res.json(err));
  })
});

export default router