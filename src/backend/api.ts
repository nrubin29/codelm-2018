import { Router } from 'express';
import { ProblemDao } from './daos/problem.dao';

const router = Router();

router.get('/problems/:id', (req, res) => {
  ProblemDao.getProblem(req.params.id).then(res.json).catch(res.json)

  // res.json({
  //   id: +req.params.id,
  //   title: 'Add one',
  //   description: 'Given a number, add 1 to it.',
  //   divisions: [],
  //   points: 1,
  //   testCases: [{id: 1, hidden: false, input: '1', output: '2'}, {id: 2, hidden: true, input: '2', output: '3'}]
  // })
});

router.get('/problems/?division=:dId', (req, res) => {
  ProblemDao.getProblemsForDivision(req.params.dId).then(res.json).catch(res.json)

  // res.json([{
  //   id: +req.params.dId,
  //   title: 'Add one',
  //   description: 'Given a number, add 1 to it.',
  //   divisions: [],
  //   points: 1,
  //   testCases: [{id: 1, hidden: false, input: '1', output: '2'}, {id: 2, hidden: true, input: '2', output: '3'}]
  // }])
});

export default router