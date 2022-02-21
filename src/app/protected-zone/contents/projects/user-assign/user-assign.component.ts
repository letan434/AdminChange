import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RolesService, UsersService } from '@app/shared/services';
import { ProjectsService } from '@app/shared/services/projects.service';

@Component({
  selector: 'app-user-assign',
  templateUrl: './user-assign.component.html',
  styleUrls: ['./user-assign.component.scss']
})
export class UserAssignComponent implements OnInit {

  private chosenEvent: EventEmitter<any> = new EventEmitter();
  public blockedPanel = false;
  // User Role
  public items: any[];
  public selectedItems = [];
  public title: string;
  public projectId: number;
  public existingUsers: any[];

  constructor(
    public bsModalRef: BsModalRef,
    private usersService: UsersService,
    private projectsService: ProjectsService) {
  }

  ngOnInit(): void {
    this.loadAllUsers();
  }
  loadAllUsers() {
    this.blockedPanel = true;
    this.usersService.getAll().subscribe((response: any) => {
      response.forEach(function (element) {
        element.Selected = false;
      });
      const existingUsers = this.existingUsers;
      const newUsers = response.filter(function (item) {
        return existingUsers.indexOf(item.id) === -1;
      });
      this.items = newUsers;
      if (this.selectedItems.length === 0 && this.items.length > 0) {
        this.selectedItems.push(this.items[0]);
      }
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    });
  }
  chooseUsers() {
    this.blockedPanel = true;
    const selectedIds = [];
    this.selectedItems.forEach(element => {
      selectedIds.push(element.id);
    });
    const assignUsertoProject = {
      userIds: selectedIds
    };
    this.projectsService.assignUserToProject(this.projectId, assignUsertoProject).subscribe(() => {
      this.chosenEvent.emit(this.selectedItems);
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    });
  }

}
