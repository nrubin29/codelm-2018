import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SubmissionComponent } from './common/views/submission/submission.component';
import { PluralizePipe } from './pipes/pluralize.pipe';
import { CardComponent } from './common/components/card/card.component';
import { CodeMirrorComponent } from './common/components/code-mirror/code-mirror.component';
import { GradedSubmissionComponent } from './common/views/graded-submission/graded-submission.component';
import { UploadSubmissionComponent } from './common/views/upload-submission/upload-submission.component';

@NgModule({
  declarations: [
    SubmissionComponent,
    GradedSubmissionComponent,
    UploadSubmissionComponent,
    CardComponent,
    CodeMirrorComponent,
    PluralizePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    MatCardModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
  ],
  exports: [
    SubmissionComponent,
    GradedSubmissionComponent,
    UploadSubmissionComponent,
    CardComponent,
    CodeMirrorComponent,
    PluralizePipe,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    MatCardModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
  ]
})
export class SharedModule { }
