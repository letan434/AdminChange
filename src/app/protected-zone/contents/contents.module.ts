import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoriesComponent } from './categories/categories.component';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { CommentsComponent } from './comments/comments.component';
import { ContentsRoutingModule } from './contents-routing.module';
import { KnowledgeBasesDetailComponent } from '@app/protected-zone/contents/knowledge-bases/knowledge-bases-detail/knowledge-bases-detail.component';
import { CategoriesDetailComponent } from '@app/protected-zone/contents/categories/categories-detail/categories-detail.component';
import {
  BlockUIModule,
  ButtonModule, CalendarModule, CheckboxModule, ChipsModule,
  DropdownModule, EditorModule, FileUploadModule,
  InputTextareaModule,
  InputTextModule,
  KeyFilterModule, PaginatorModule,
  PanelModule,
  ProgressSpinnerModule, TableModule, TreeTableModule
} from 'primeng';
import { SharedDirectivesModule } from '@app/shared/directives/shared-directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationMessageModule } from '@app/shared/modules/validation-message/validation-message.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NotificationService } from '@app/shared/services';
import { CommentsDetailComponent } from './comments/comments-detail/comments-detail.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectsDetailComponent } from './projects/projects-detail/projects-detail.component';
import { UserAssignComponent } from './projects/user-assign/user-assign.component';
import { StatusAssignComponent } from './projects/status-assign/status-assign.component';
import { IssuesComponent } from './issues/issues.component';
import { IssuesDetailComponent } from './issues/issues-detail/issues-detail.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    KnowledgeBasesComponent,
    CommentsComponent,
    KnowledgeBasesDetailComponent,
    CategoriesDetailComponent,
    CommentsDetailComponent,
    ProjectsComponent,
    ProjectsDetailComponent,
    UserAssignComponent,
    StatusAssignComponent,
    IssuesComponent,
    IssuesDetailComponent,

  ],  imports: [
    CommonModule,
    ContentsRoutingModule,
    PanelModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    BlockUIModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    ValidationMessageModule,
    KeyFilterModule,
    CalendarModule,
    CheckboxModule,
    TreeTableModule,
    DropdownModule,
    InputTextareaModule,
    ChipsModule,
    FileUploadModule,
    EditorModule,
    SharedDirectivesModule,
    ModalModule.forRoot()
  ],
  providers: [
    NotificationService,
    BsModalService,
    DatePipe
  ]
})
export class ContentsModule { }
