import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ProblemService } from '../services/problem.service';
import { SubmissionService } from '../services/submission.service';

@Injectable()
export class ProblemGuard implements CanActivate {
  constructor(private problemService: ProblemService, private submissionService: SubmissionService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const problem = await this.problemService.getProblem(next.paramMap.get('id'));
    let submissions = await this.submissionService.getSubmissions();
    submissions = submissions.filter(submission => submission.problem._id === problem._id);
    const solved = submissions.filter(submission => submission.points > 0);

    // TODO: Is it safe to assume that points > 0 means success?
    if (solved.length > 0) {
      this.router.navigate(['/dashboard', 'submission', solved[0]._id]);
      return false;
    }

    else {
      return true;
    }
  }
}
