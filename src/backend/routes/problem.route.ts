import { Router } from 'express';
import { ProblemDao } from '../daos/problem.dao';
import { CodeFile, CodeRunner, CppRunner, JavaRunner, PythonRunner, RunError } from '../coderunner';
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
    let runner: CodeRunner;

    switch (problemSubmission.language) {
      case 'python': {
        runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", problemSubmission.code)]);
        break;
      }

      case 'java': {
        runner = new JavaRunner("coderunner-test", [new CodeFile("Main.java", problemSubmission.code)]);
        break;
      }

      case 'cpp': {
        runner = new CppRunner("coderunner-test", [new CodeFile("main.cpp", problemSubmission.code)]);
        break;
      }
    }

    const sub = runner.subject.subscribe(next => {
      console.log(next);
    });

    runner.run(problem.testCases).then(results => {
      sub.unsubscribe();

      TeamDao.addSubmission(req.header('Authorization').split(' ')[1], {
        problem: problem,
        language: problemSubmission.language,
        code: problemSubmission.code,
        testCases: results,
        result: '100%',
        test: problemSubmission.test
      }).then(submissionId => {
        res.json(submissionId);
      });
    }).catch((err: RunError) => {
      console.error(err);
      TeamDao.addSubmission(req.header('Authorization').split(' ')[1], {
        problem: problem,
        language: problemSubmission.language,
        code: problemSubmission.code,
        result: 'error',
        error: err.error,
        test: problemSubmission.test
      }).then(submissionId => {
        res.json(submissionId);
      });
    });
  })
});

export default router