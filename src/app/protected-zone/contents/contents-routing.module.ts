import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CommentsComponent } from './comments/comments.component';
import { KnowledgeBasesComponent } from './knowledge-bases/knowledge-bases.component';
import { AuthGuard } from '@app/shared';
import { KnowledgeBasesDetailComponent } from '@app/protected-zone/contents/knowledge-bases/knowledge-bases-detail/knowledge-bases-detail.component';
import { ProjectsComponent } from '@app/protected-zone/contents/projects/projects.component';
import { IssuesComponent } from '@app/protected-zone/contents/issues/issues.component';
import { IssuesDetailComponent } from '@app/protected-zone/contents/issues/issues-detail/issues-detail.component';

const routes: Routes = [
    {
        path: '',
        component: KnowledgeBasesComponent,
        data: {
            functionCode: 'CONTENT_KNOWLEDGEBASE'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'knowledge-bases',
        component: KnowledgeBasesComponent,
        data: {
            functionCode: 'CONTENT_KNOWLEDGEBASE'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues',
        component: IssuesComponent,
        data: {
            functionCode: 'CONTENT_ISSUE'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues-detail/:id',
        component: IssuesDetailComponent,
        data: {
            functionCode: 'CONTENT_ISSUE'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'knowledge-bases-detail/:id',
        component: KnowledgeBasesDetailComponent,
        data: {
            functionCode: 'CONTENT_KNOWLEDGEBASE'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'categories',
        component: CategoriesComponent,
        data: {
            functionCode: 'CONTENT_CATEGORY'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'projects',
        component: ProjectsComponent,
        data: {
            functionCode: 'CONTENT_PROJECT'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues/:issueId/comments',
        component: CommentsComponent,
        data: {
            functionCode: 'CONTENT_COMMENT'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues/comments',
        component: CommentsComponent,
        data: {
            functionCode: 'CONTENT_COMMENT'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues/:issueId/comments',
        component: CommentsComponent,
        data: {
            functionCode: 'CONTENT_COMMENT'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'issues/comments',
        component: CommentsComponent,
        data: {
            functionCode: 'CONTENT_COMMENT'
        },
        canActivate: [AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContentsRoutingModule {}
