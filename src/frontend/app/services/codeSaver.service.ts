import { Injectable } from '@angular/core';

@Injectable()
export class CodeSaverService {
  mode: string = 'text/x-java';

  save(problemId: string, mode: string, code: string) {
    const problem = JSON.parse(window.localStorage.getItem(problemId) || '{}');
    problem[mode] = code;
    window.localStorage.setItem(problemId, JSON.stringify(problem));
  }

  get(problemId: string, mode: string): string | null {
    this.mode = mode;

    const problem = JSON.parse(window.localStorage.getItem(problemId) || '{}');
    return problem[mode] || null;
  }

  getMode(language?: string) {
    if (language === undefined) {
      return this.mode;
    }

    return {
      python: 'text/x-python',
      java: 'text/x-java',
      cpp: 'text/x-c++src'
    }[language];
  }

  getLanguage(mode?: string) {
    return {
      'text/x-python': 'python',
      'text/x-java': 'java',
      'text/x-c++src': 'cpp'
    }[mode || this.mode];
  }
}
