import { PythonRunner, CodeFile } from './coderunner';

const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "print(input())")]);

const sub = runner.subject.subscribe(next => {
  console.log(next);
});

runner.run([
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
]).then(results => {
  sub.unsubscribe();
  console.log(results);
}).catch(err => {
  console.log(err);
});