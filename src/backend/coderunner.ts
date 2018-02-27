import fs = require('fs-extra');
import { spawn } from 'child_process';
import { TestCaseModel } from '../common/models/problem.model';
import { Subject } from 'rxjs/Subject';
import { TestCaseSubmissionModel } from '../common/models/submission.model';

// This interface is used internally by runProcess().
interface ProcessRunResult {
  output: string;
  error: string;
}

interface RunResult {
  output: string
}

export type TestCaseRunResult = TestCaseSubmissionModel & RunResult;

export interface RunError {
  stage: 'compile' | 'run';
  testCase?: number;
  error: string
}

export class CodeFile {
  constructor(public name: string, public code: string) { }

  static fromFile(name: string, path: string): Promise<CodeFile> {
    return new Promise<CodeFile>((resolve, reject) => {
      fs.readFile(path).then(data => resolve(new CodeFile(name, data.toString()))).catch(reject)
    })
  }

  mkfile(folderPath: string): Promise<void> {
    return fs.writeFile(folderPath + '/' + this.name, this.code);
  }
}

export class CodeRunner {
  public subject: Subject<string | TestCaseRunResult>;

  constructor(public folder: string, public files: CodeFile[]) {
    this.subject = new Subject<string>();
  }

  protected before() {

  }

  protected runProc(cmd: string, args: string[]): Promise<RunResult> {
    return new Promise<RunResult>((resolve: (value: RunResult) => void, reject: (reason: RunError) => void) => {
      this.runProcess(cmd, args).then(data => {
        const {output, error} = data;

        if (error.length > 0) {
          reject({
            stage: 'compile',
            error: error
          });
        }

        else {
          resolve({
            output: output
          });
        }
      }).catch(reject);
    });
  }

  protected runTestCaseProc(cmd: string, args: string[], testCase: TestCaseModel): Promise<TestCaseRunResult> {
    return new Promise<TestCaseRunResult>((resolve: (value: TestCaseRunResult) => void, reject: (reason: RunError) => void) => {
      this.runProcess(cmd, args, testCase.input).then(data => {
        const {output, error} = data;

        if (error.length > 0) {
          reject({
            stage: 'run',
            error: error
          });
        }

        else {
          resolve({
            hidden: testCase.hidden,
            input: testCase.input,
            output: output,
            correctOutput: testCase.output
          });
        }
      }).catch(reject);
    });
  }

  private runProcess(cmd: string, args: string[], input?: string): Promise<ProcessRunResult> {
    return new Promise<ProcessRunResult>((resolve, reject) => {
      try {
        // TODO: Timeout!
        const process = spawn(cmd, args, { cwd: this.folder });
        let output = '';
        let error = '';

        if (input) {
          process.stdin.write(input + '\n');
          process.stdin.end();
        }

        process.stdout.on('data', data => {
          output += data.toString();
        });

        process.stderr.on('data', data => {
          error += data.toString();
        });

        process.on('close', () => {
          output = output.replace(/^\s+|\s+$/g, '');
          error = error.replace(/^\s+|\s+$/g, '');
          resolve({output: output, error: error});
        });
      }

      catch (e) {
        reject(e);
      }
    });
  }

  async run(testCases: TestCaseModel[]): Promise<TestCaseSubmissionModel[]> {
    try {
      this.before();

      await fs.remove(this.folder);

      try {
        await fs.mkdir(this.folder);
      }
      catch {}

      await Promise.all(this.files.map(file => file.mkfile(this.folder)));

      this.subject.next("compiling");
      await this.compile();

      this.subject.next("running");

      const results: TestCaseRunResult[] = [];
      for (let testCase of testCases) {
        const result = await this.runTestCase(testCase);
        results.push(result);
        this.subject.next(result);
      }

      this.subject.next("cleaning up");

      return Promise.resolve(results);
    }

    finally {
      await fs.remove(this.folder);
    }
  }

  protected compile(): Promise<RunResult> {
    return Promise.reject(new Error("compile() not implemented."));
  }

  protected runTestCase(testCase: TestCaseModel): Promise<TestCaseRunResult> {
    return Promise.reject(new Error('runTestCase() not implemented.'));
  }
}

export class JavaRunner extends CodeRunner {
  compile() {
    return this.runProc('javac', this.files.map(file => file.name));
  }

  runTestCase(testCase: TestCaseModel) {
    return this.runTestCaseProc('java', [this.files[0].name.substring(0, this.files[0].name.length - 5)], testCase);
  }
}

export class PythonRunner extends CodeRunner {
  before() {
    this.files.push(new CodeFile('__init__.py', ''));
  }

  compile() {
    return this.runProc('python3', ['-m', 'py_compile'].concat(this.files.map(file => file.name)));
  }

  runTestCase(testCase: TestCaseModel) {
    return this.runTestCaseProc('python3', [this.files[0].name], testCase);
  }
}

export class CppRunner extends CodeRunner {
  compile() {
    return this.runProc('g++', this.files.map(file => file.name));
  }

  runTestCase(testCase: TestCaseModel) {
    return this.runTestCaseProc('./a.out', [], testCase);
  }
}
