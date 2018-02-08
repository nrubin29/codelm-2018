import { Injectable } from '@angular/core';

@Injectable()
export class CodeSaverService {
  data: any;

  constructor() {
    this.load();
  }

  save(problemId: string, language: string, code: string) {
    if (!(problemId in this.data)) {
      this.data[problemId] = {};
    }

    this.data[problemId][language] = code;
    window.localStorage.setItem('code', JSON.stringify(this.data));
  }

  get(problemId: string, language: string): string | null {
    if (!(problemId in this.data)) {
      return null;
    }

    return this.data[problemId][language]
  }

  private load() {
    this.data = JSON.parse(window.localStorage.getItem('code')) || {};
  }
}
