import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';
import { MonthlyNewKbsComponent } from './monthly-new-kbs/monthly-new-kbs.component';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';
import { AuthGuard } from '@app/shared';

const routes: Routes = [
    {
        path: '',
        component: MonthlyNewKbsComponent,
        data: {
            functionCode: 'STATISTIC_MONTHLY_NEWKB'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'monthly-newkbs',
        component: MonthlyNewKbsComponent,
        data: {
            functionCode: 'STATISTIC_MONTHLY_NEWKB'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'monthly-registers',
        component: MonthlyNewMembersComponent,
        data: {
            functionCode: 'STATISTIC_MONTHLY_NEWMEMBER'
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'monthly-newcomments',
        component: MonthlyNewCommentsComponent,
        data: {
            functionCode: 'STATISTIC_MONTHLY_COMMENT'
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatisticsRoutingModule {}
