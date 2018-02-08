import _ = require('mocha');
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { PythonRunner, CodeFile, RunError, CppRunner } from './coderunner';

chai.use(chaiAsPromised);
chai.should();

describe('CodeRunner', () => {
  describe('#badCompile', () => {
    it('should fail with a compile error', () => {
      const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "def")]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          id: 1,
          hidden: false,
          input: "Hello",
          output: "Hello"
        },
        {
          id: 2,
          hidden: false,
          input: "Goodbye",
          output: "Goodbye"
        },
        {
          id: 3,
          hidden: false,
          input: "Peace",
          output: "Peace"
        }
      ]).should.eventually.be.rejected;
    });
  });

  describe('#badRun', () => {
    it('should fail with a runtime error', () => {
      const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "int(input()) / 0")]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          id: 1,
          hidden: false,
          input: "1",
          output: "1"
        }
      ]).should.eventually.be.rejected;
    });
  });

  describe('#echo', () => {
    it('should succeed', () => {
      const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "print(input())")]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          id: 1,
          hidden: false,
          input: "Hello",
          output: "Hello"
        },
        {
          id: 2,
          hidden: false,
          input: "Goodbye",
          output: "Goodbye"
        },
        {
          id: 3,
          hidden: false,
          input: "Peace",
          output: "Peace"
        }
      ]).should.eventually.be.fulfilled;
    });
  });

  describe('#cppEven', () => {
    it('should succeed', () => {
      const runner = new CppRunner("coderunner-test", [new CodeFile("main.cpp", `#include <iostream>
using namespace std;

int main ()
{
  int i;
  cin >> i;
  cout << (i % 2 == 0);
  return 0;
}`)]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          id: 1,
          hidden: false,
          input: "1",
          output: "0"
        },
        {
          id: 2,
          hidden: false,
          input: "2",
          output: "1"
        },
        {
          id: 3,
          hidden: true,
          input: "100",
          output: "1"
        }
      ]).should.eventually.be.fulfilled;
    });
  });
});

// import crypto = require('crypto');
//
// const password = 'password';
//
// const salt = crypto.randomBytes(16).toString('hex');
// const hash = crypto.pbkdf2Sync(password, new Buffer(salt), 1000, 64, 'sha512').toString('hex');
//
// console.log(salt);
// console.log(hash);