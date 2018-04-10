import { execFile } from 'child_process';
import { ServerGradedProblemSubmission } from '../common/problem-submission';
import * as assert from 'assert';
import { TestCaseSubmissionModel } from '../common/models/submission.model';

function spawnProcess(submission: ServerGradedProblemSubmission, callback: (error: Error | null, stdout: string, stderr: string) => void) {
  const process = execFile('docker', ['run', '-i', '--rm', '--cap-drop', 'ALL', '--net=none', 'coderunner'], (err, stdout, stderr) => {
    callback(err, stdout, stderr);
  });

  process.stdin.write(JSON.stringify(submission) + '\n');
  process.stdin.end();
}

describe('Docker', () => {
  describe('#container', () => {
    it('should spawn a container', done => {
      const submission: ServerGradedProblemSubmission = {
        problemTitle: 'Main',
        testCases: [
          {
            hidden: false,
            input: '',
            output: ''
          }
        ],
        language: 'python',
        code: 'print("Hello, Python!")'
      };

      spawnProcess(submission, (err, stdout, stderr) => {
        assert.equal((JSON.parse(stdout) as TestCaseSubmissionModel[])[0].output, 'Hello, Python!');
        done();
      });
    });

    it('should echo', done => {
      const submission: ServerGradedProblemSubmission = {
        problemTitle: 'Main',
        testCases: [
          {
            hidden: false,
            input: 'Hello',
            output: 'Hello'
          }
        ],
        language: 'python',
        code: 'print(input())'
      };

      spawnProcess(submission, (err, stdout, stderr) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
        assert.equal((JSON.parse(stdout) as TestCaseSubmissionModel[])[0].output, 'Hello');
        done();
      });
    });

    it('should give an error', done => {
      const submission: ServerGradedProblemSubmission = {
        problemTitle: 'Main',
        testCases: [
          {
            hidden: false,
            input: '',
            output: ''
          }
        ],
        language: 'python',
        code: 'break'
      };

      spawnProcess(submission, (err, stdout, stderr) => {
        assert.equal(stderr.length > 0, true);
        done();
      });
    });

    it('should time out', done => {
      const submission: ServerGradedProblemSubmission = {
        problemTitle: 'Main',
        testCases: [
          {
            hidden: false,
            input: '',
            output: ''
          }
        ],
        language: 'python',
        code: 'while True:\n\tpass'
      };

      spawnProcess(submission, (err, stdout, stderr) => {
        assert.equal(stderr.length > 0, true);
        done();
      });
    });
  });
});