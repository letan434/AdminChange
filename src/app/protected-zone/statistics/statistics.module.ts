import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyNewMembersComponent } from './monthly-new-members/monthly-new-members.component';
import { MonthlyNewKbsComponent } from './monthly-new-kbs/monthly-new-kbs.component';
import { MonthlyNewCommentsComponent } from './monthly-new-comments/monthly-new-comments.component';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BlockUIModule, InputTextModule, ProgressSpinnerModule } from 'primeng';



@NgModule({
  declarations: [MonthlyNewMembersComponent, MonthlyNewKbsComponent, MonthlyNewCommentsComponent],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    PaginatorModule,
    PanelModule,
    ButtonModule,
    TableModule,
    BlockUIModule,
    InputTextModule,
    ProgressSpinnerModule
  ]
})
export class StatisticsModule { }
