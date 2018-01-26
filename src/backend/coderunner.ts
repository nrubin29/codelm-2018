import fs = require('fs-extra');
import { spawn } from 'child_process';
import { TestCaseModel } from '../common/models/problem.model';
import { Subject } from 'rxjs/Subject';
import { TestCaseSubmissionModel } from '../common/models/submission.model';

type RunResult = {exitCode: number, output: string}
type TestCaseRunResult = TestCaseSubmissionModel & RunResult

export class CodeFile {
  /*
  This class represents a single code file. A Runner can have multiple files.
  */

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

class Runner {
  public log: string[];
  public subject: Subject<string | TestCaseRunResult>;

  constructor(public folder: string, public files: CodeFile[]) {
    this.log = [];
    this.subject = new Subject<string>();
  }

  protected before() {

  }

  // TODO: Refactor runProc and runTestCase to keep them DRY.
  protected runProc(cmd: string, args: string[]): Promise<RunResult> {
    return new Promise<RunResult>((resolve, reject) => {
      try {
        // TODO: Timeout!
        const process = spawn(cmd, args, { cwd: this.folder });
        const output = [];

        process.stdout.on('data', data => {
          output.push(data.toString().replace(/^\s+|\s+$/g, ''));
        });

        process.stderr.on('data', data => {
          output.push(data.toString().replace(/^\s+|\s+$/g, ''));
          // TODO: reject with error.
        });

        process.on('close', exitCode => {
          resolve({
            exitCode: exitCode,
            output: output.filter(line => line !== '').join('\n'),
          });
        });
      }

      catch (e) {
        reject(e);
      }
    })
  }

  protected runTestCaseProc(cmd: string, args: string[], testCase: TestCaseModel): Promise<TestCaseRunResult> {
    return new Promise<TestCaseRunResult>((resolve, reject) => {
      try {
        // TODO: Timeout!
        const process = spawn(cmd, args, { cwd: this.folder });
        const output = [];

        process.stdin.write(testCase.input + '\n');
        process.stdin.end();

        process.stdout.on('data', data => {
          output.push(data.toString().replace(/^\s+|\s+$/g, ''));
        });

        process.stderr.on('data', data => {
          output.push(data.toString().replace(/^\s+|\s+$/g, ''));
          // TODO: reject with error.
        });

        process.on('close', exitCode => {
          resolve({
            id: testCase.id,
            hidden: testCase.hidden,
            input: testCase.input,
            output: output.filter(line => line !== '').join('\n'),
            correctOutput: testCase.output,
            exitCode: exitCode,
          });
        });
      }

      catch (e) {
        reject(e);
      }
    })
  }

  async run(testCases: TestCaseModel[]): Promise<TestCaseRunResult[]> {
    this.before();

    await fs.remove(this.folder);

    try {
      await fs.mkdir(this.folder);
    }
    catch {}

    await Promise.all(this.files.map(async file => file.mkfile(this.folder)));

    this.subject.next("compiling");
    const compileResult = await this.compile();
    if (compileResult.exitCode !== 0) {
      this.subject.error(compileResult.exitCode);
      this.subject.complete();
    }

    this.subject.next("running");

    const results: TestCaseRunResult[] = [];
    for (let testCase of testCases) {
      const result = await this.runTestCase(testCase);
      results.push(result);
      this.subject.next(result);
      if (result.exitCode !== 0) {
        this.subject.error(result.exitCode);
        this.subject.complete();
        break;
      }
    }

    this.subject.next("cleaning up");

    await fs.remove(this.folder);

    return Promise.resolve(results);
  }

  protected compile(): Promise<RunResult> {
    return Promise.resolve({
      output: '',
      exitCode: 0
    });
  }

  protected runTestCase(testCase: TestCaseModel): Promise<TestCaseRunResult> {
    return Promise.reject(new Error('runTestCase() not implemented.'));
  }
}

export class JavaRunner extends Runner {
  compile() {
    return this.runProc('javac', this.files.map(file => file.name));
  }

  runTestCase(testCase: TestCaseModel) {
    return this.runTestCaseProc('java', [this.files[0].name.substring(0, this.files[0].name.length - 5)], testCase);
  }
}

export class PythonRunner extends Runner {
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

export class CppRunner extends Runner {
  compile() {
    return this.runProc('g++', this.files.map(file => file.name));
  }

  runTestCase(testCase: TestCaseModel) {
    return this.runTestCaseProc('./a.out', [], testCase);
  }
}
