import { Injectable } from '@angular/core';

@Injectable()
export class CodeSaverService {
  data: any;
  mode: string;

  constructor() {
    this.mode = 'text/x-python';
    this.load();
  }

  save(problemId: string, mode: string, code: string) {
    if (!(problemId in this.data)) {
      this.data[problemId] = {};
    }

    this.data[problemId][mode] = code;
    window.localStorage.setItem('code', JSON.stringify(this.data));
  }

  get(problemId: string, mode: string): string | null {
    if (!(problemId in this.data)) {
      return null;
    }

    this.mode = mode;
    return this.data[problemId][mode];
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

  private load() {
    this.data = JSON.parse(window.localStorage.getItem('code')) || {};
  }
}
