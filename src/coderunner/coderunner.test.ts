import * as _ from 'mocha';
import { CodeFile, CppRunner, JavaRunner, PythonRunner } from './coderunner';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

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
          hidden: false,
          input: "Hello",
          output: "Hello"
        },
        {
          hidden: false,
          input: "Goodbye",
          output: "Goodbye"
        },
        {
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
          hidden: false,
          input: "1",
          output: "1"
        }
      ]).should.eventually.be.rejected;
    });
  });

  describe('#timeout', () => {
    it('should time out', () => {
      const runner = new PythonRunner("coderunner-test", [new CodeFile("main.py", "while True: pass")]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          hidden: false,
          input: "",
          output: ""
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
          hidden: false,
          input: "Hello",
          output: "Hello"
        },
        {
          hidden: false,
          input: "Goodbye",
          output: "Goodbye"
        },
        {
          hidden: false,
          input: "Peace",
          output: "Peace"
        }
      ]).should.eventually.be.fulfilled;
    });
  });

  describe('#prettyRectangle', () => {
    it('should succeed', () => {
      const runner = new JavaRunner("coderunner-test", [new CodeFile("PrettyRectangle.java", `import java.util.Scanner;

public class PrettyRectangle {

	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		
		int n = s.nextInt();
		
		for (int i = 1; i<=n; i++){
			for (int j = 1; j <=n; j++) {
				if (i==1 || j==1 || i==n || j==n)
					System.out.print("-");
				else
					System.out.print("!");
			}
			System.out.println( );
		}
	}
}`)]);

      runner.subject.subscribe(next => {
        console.log(next);
      });

      return runner.run([
        {
          hidden: false,
          input: "1",
          output: "-"
        },
        {
          hidden: false,
          input: "2",
          output: "--\n--"
        },
        {
          hidden: false,
          input: "3",
          output: "---\n-!-\n---"
        },
        {
          hidden: true,
          input: "5",
          output: "-----\n-!!!-\n-!!!-\n-!!!-\n-----"
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
          hidden: false,
          input: "1",
          output: "0"
        },
        {
          hidden: false,
          input: "2",
          output: "1"
        },
        {
          hidden: true,
          input: "100",
          output: "1"
        }
      ]).should.eventually.be.fulfilled;
    });
  });
});