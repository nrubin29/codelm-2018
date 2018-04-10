import { CodeFile, CodeRunner, CppRunner, JavaRunner, PythonRunner } from './coderunner';
import { ServerGradedProblemSubmission } from '../common/problem-submission';

const stdin = process.openStdin();
stdin.once('data', data => {
  const submission = JSON.parse(data) as ServerGradedProblemSubmission;
  let runner: CodeRunner;

  switch (submission.language) {
    case 'python': {
      runner = new PythonRunner('code', [new CodeFile('main.py', submission.code)]);
      break;
    }

    case 'java': {
      runner = new JavaRunner('code', [new CodeFile(submission.problemTitle.split(' ').join('') + '.java', submission.code)]);
      break;
    }

    case 'cpp': {
      runner = new CppRunner('code', [new CodeFile('main.cpp', submission.code)]);
      break;
    }

    default: {
      throw new Error(`Invalid language ${submission.language}`);
    }
  }

  runner.run(submission.testCases).then(data => console.log(JSON.stringify(data))).catch(error => console.error(JSON.stringify(error)));
});