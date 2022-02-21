import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseComponent } from '@app/protected-zone/base/base.component';
import { KnowledgeBasesService, NotificationService } from '@app/shared/services';
import { ProjectsService } from '@app/shared/services/projects.service';
import { Router } from '@angular/router';
import { KnowledgeBase, Pagination, Project } from '@app/shared/models';
import { CategoriesDetailComponent } from '@app/protected-zone/contents/categories/categories-detail/categories-detail.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProjectsDetailComponent } from '@app/protected-zone/contents/projects/projects-detail/projects-detail.component';
import { MessageConstants } from '@app/shared/constants';
import { RolesAssignComponent } from '@app/protected-zone/systems/users/roles-assign/roles-assign.component';
import { UserAssignComponent } from '@app/protected-zone/contents/projects/user-assign/user-assign.component';
import { StatusAssignComponent } from '@app/protected-zone/contents/projects/status-assign/status-assign.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends BaseComponent implements OnInit, OnDestroy {

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
  // users
  public items: any[];
  public selectedItems = [];
  public showUserAssign: boolean;
  public selectedUsersItems = [];
  public totalProjectUserRecords: number;
  // public selectedUserIds: string[] = [];
  public blockedPanelUser = false;
  public users: any[] = [];
  public blockedPanelStatus = false;
  public showStatusAssign: boolean;
  public selectedStatusItems = [];
  public statuses: any[] = [];
  public totalProjectStatusRecords: number;
  constructor(private projectsService: ProjectsService,
              private notificationService: NotificationService,
              private modalService: BsModalService  ) {
                super('CONTENT_PROJECT');
              }
  public bsModalRef: BsModalRef;
  ngOnInit(): void {
    super.ngOnInit();
    this.loadData();
  }
  loadData(selectedId = null) {
    this.blockedPanel = true;
    this.subscription.add(this.projectsService.getAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .subscribe((response: Pagination<Project>) => {
        this.processLoadData(selectedId, response);
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }
  showAddModal() {
    this.bsModalRef = this.modalService.show(ProjectsDetailComponent,
      {
        class: 'modal-lg',
        backdrop: 'static'
      });
    this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData();
      this.selectedItems = [];
    });
  }
  showEditModal() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(ProjectsDetailComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });

    this.subscription.add( this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData(response.id);
    }));
  }
  deleteItems() {
    const id = this.selectedItems[0].id;
    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteItemsConfirm(id));
  }
  deleteItemsConfirm(id) {
    this.blockedPanel = true;
    this.subscription.add(this.projectsService.delete(id).subscribe(() => {
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      this.loadData();
      this.selectedItems = [];
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }));
  }
  private processLoadData(selectedId = null, response: Pagination<Project>) {
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
  onRowSelect(event) {
    this.selectedUsersItems = [];
    this.totalProjectUserRecords = 0;
    this.users = [];
    this.selectedStatusItems = [];
    this.statuses = [];
    if (this.selectedItems.length === 1 && this.showUserAssign) {
      this.loadProjectUser();
    }
    if (this.selectedItems.length === 1 && this.showStatusAssign) {
      this.loadProjectStatus();
    }
  }

  onRowUnselect(event) {
    this.selectedUsersItems = [];
    this.totalProjectUserRecords = 0;
    this.users = [];
    this.selectedStatusItems = [];
    this.statuses = [];
    if (this.selectedItems.length === 1 && this.showUserAssign) {
      this.loadProjectUser();
    }
    if (this.selectedItems.length === 1 && this.showStatusAssign) {
      this.loadProjectStatus();
    }
  }
  togglePanel() {
    if (this.showUserAssign) {
      if (this.selectedItems.length === 1) {
        this.loadProjectUser();
      }
    }
  }
  showStatus() {
    if (this.showStatusAssign) {
      if (this.selectedItems.length === 1) {
        this.loadProjectStatus();
      }
    }
  }

  addUserProject() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      existingUsers: this.users,
      projectId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(UserAssignComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });
    this.bsModalRef.content.chosenEvent.subscribe((response: any[]) => {
      this.bsModalRef.hide();
      this.loadProjectUser();
      this.selectedUsersItems = [];
    });
  }
  loadProjectUser() {
    this.blockedPanelUser = true;
    // Nếu tồn tại selection thì thực hiện
    if (this.selectedItems != null && this.selectedItems.length > 0) {
      const projectId = this.selectedItems[0].id;
      this.projectsService.getAllUsersByProjectId(projectId).subscribe((response: any) => {
        this.users = response;
        this.totalProjectUserRecords = response.length;
        if (this.selectedUsersItems.length === 0 && this.users.length > 0) {
          this.selectedUsersItems.push(this.users[0]);
        }
        setTimeout(() => { this.blockedPanelUser = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanelUser = false; }, 1000);
      });
    } else {
      this.selectedUsersItems = [];
      setTimeout(() => { this.blockedPanelUser = false; }, 1000);
    }
  }
  removeUsers() {
    const selectedUserIds = [];
    this.selectedUsersItems.forEach(element => {
      selectedUserIds.push(element.id);
    });

    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteUsersConfirm(selectedUserIds));
  }
  deleteUsersConfirm(userIds) {
    this.blockedPanelUser = true;
    this.projectsService.removeUsersFromProject(this.selectedItems[0].id, userIds).subscribe(() => {
      this.loadProjectUser();
      this.selectedUsersItems = [];
      this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
      setTimeout(() => { this.blockedPanelUser = false; }, 1000);
    }, error => {
      this.notificationService.showError(error);
      setTimeout(() => { this.blockedPanelUser = false; }, 1000);
    });
  }
  loadProjectStatus() {
    this.blockedPanelStatus = true;
    // Nếu tồn tại selection thì thực hiện
    if (this.selectedItems != null && this.selectedItems.length > 0) {
      const projectId = this.selectedItems[0].id;
      this.projectsService.getAllStatusByProjectId(projectId).subscribe((response: any) => {
        this.statuses = response;
        this.totalProjectUserRecords = response.length;
        if (this.selectedStatusItems.length === 0 && this.statuses.length > 0) {
          this.selectedStatusItems.push(this.statuses[0]);
        }
        setTimeout(() => {
          this.blockedPanelUser = false;
        }, 1000);
      }, error => {
        setTimeout(() => {
          this.blockedPanelUser = false;
        }, 1000);
      });
    } else {
      this.selectedStatusItems = [];
      setTimeout(() => {
        this.blockedPanelStatus = false;
      }, 1000);
    }
  }
  showAddStatusProject() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id
    };
    this.bsModalRef = this.modalService.show(StatusAssignComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });

    this.subscription.add( this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData(response.id);
      this.loadProjectStatus();
    }));
  }
  showEditStatusProject() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    if (this.selectedStatusItems.length === 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    const initialState = {
      entityId: this.selectedItems[0].id,
      statusId: this.selectedStatusItems[0].id
    };
    this.bsModalRef = this.modalService.show(StatusAssignComponent,
      {
        initialState: initialState,
        class: 'modal-lg',
        backdrop: 'static'
      });

    this.subscription.add( this.bsModalRef.content.savedEvent.subscribe((response) => {
      this.bsModalRef.hide();
      this.loadData(response.id);
      this.loadProjectStatus();
    }));
  }
  removeStatus() {
    const selectedStatusId = this.selectedStatusItems[0].id;

    this.notificationService.showConfirmation(MessageConstants.CONFIRM_DELETE_MSG,
      () => this.deleteStatusesConfirm(selectedStatusId));
  }
  deleteStatusesConfirm(statusId) {
    this.blockedPanelStatus = true;
    this.subscription.add(
      this.projectsService.removeStatusFromProject(statusId).subscribe(() => {
        this.loadProjectStatus();
        this.selectedStatusItems = [];
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        setTimeout(() => { this.blockedPanelStatus = false; }, 1000);
      }, error => {
        this.notificationService.showError(error);
        setTimeout(() => { this.blockedPanelStatus = false; }, 1000);
      }));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
