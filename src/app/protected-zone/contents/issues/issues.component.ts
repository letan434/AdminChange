import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IssuesService, KnowledgeBasesService, NotificationService } from '@app/shared/services';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/protected-zone/base/base.component';
import { Issue, KnowledgeBase, Pagination } from '@app/shared/models';
import { MessageConstants } from '@app/shared/constants';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent extends BaseComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  // Default
  public blockedPanel = false;
  /**
   * Paging
   */
  public pageIndex = 1;
  public pageSize = 10;
  public pageDisplay = 10;
  public totalRecords: number;
  public keyword = '';
  // Role
  public items: any[];
  public selectedItems = [];
  constructor(private issuesService: IssuesService,
              private notificationService: NotificationService,
              private router: Router) {
    super('CONTENT_ISSUE');
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadData();
  }
  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(this.issuesService.getAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .subscribe((response: Pagination<Issue>) => {
        this.processLoadData(selectedId, response);
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
  private processLoadData(selectedId = null, response: Pagination<Issue>) {
    this.items = response.items;
    this.pageIndex = this.pageIndex;
    this.pageSize = this.pageSize;
    this.totalRecords = response.totalRecords;
    if (this.selectedItems.length === 0 && this.items.length > 0) {
      this.selectedItems.push(this.items[0]);
    }
    if (selectedId != null && this.items.length > 0) {
      this.selectedItems = this.items.filter(x => x.Id === selectedId);
    }
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }
  showAddModal() {
    this.router.navigateByUrl('/contents/issues-detail/');
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    this.router.navigateByUrl('/contents/issues-detail/' + this.selectedItems[0].id);
  }
  deleteItems() {
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemsConfirm(id));
  }
  deleteItemsConfirm(id) {
    this.blockedPanel = true;
    this.subscription.add(this.issuesService.delete(id).subscribe(() => {
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      this.loadData();
      this.selectedItems = [];
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }));
  }
  viewComments() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    this.router.navigateByUrl('/contents/issues/' + this.selectedItems[0].id + '/comments');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
