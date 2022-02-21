import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/protected-zone/base/base.component';
import { StatisticsService } from '@app/shared/services';

@Component({
  selector: 'app-monthly-new-kbs',
  templateUrl: './monthly-new-kbs.component.html',
  styleUrls: ['./monthly-new-kbs.component.css']
})
export class MonthlyNewKbsComponent extends BaseComponent implements OnInit {
  public screenTitle: string;
  // Default
  public blockedPanel = false;
// Customer Receivable
  public items: any[];
  public year: number = new Date().getFullYear();
  public totalItems = 0;
  constructor(private statisticsService: StatisticsService) {
    super('STATISTIC_MONTHLY_NEWKB');
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadData();
  }
  loadData() {
    this.blockedPanel = true;
    this.statisticsService.getMonthlyNewKbs(this.year)
      .subscribe((response: any) => {
        this.totalItems = 0;
        this.items = response;
        response.forEach(element => {
          this.totalItems += element.NumberOfUsers;
        });
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      });
  }

}
