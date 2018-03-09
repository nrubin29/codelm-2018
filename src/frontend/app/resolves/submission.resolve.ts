import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SubmissionModel } from '../../../common/models/submission.model';
import { SubmissionService } from '../services/submission.service';

@Injectable()
export class SubmissionResolve implements Resolve<SubmissionModel> {
  constructor(private submissionService: SubmissionService) {}

  resolve(route: ActivatedRouteSnapshot): Promise<SubmissionModel> {
    return this.submissionService.getSubmission(route.paramMap.get('id'));
  }
}
