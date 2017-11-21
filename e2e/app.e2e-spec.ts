import { CodelmMeanA4Page } from './app.po';

describe('codelm-mean-a4 App', () => {
  let page: CodelmMeanA4Page;

  beforeEach(() => {
    page = new CodelmMeanA4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
