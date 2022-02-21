import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProjectsService } from '@app/shared/services/projects.service';
import { NotificationService, StatusesService, UtilitiesService } from '@app/shared/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng';
import { Project, StatusModel } from '@app/shared/models';
import { MessageConstants } from '@app/shared/constants';

@Component({
  selector: 'app-status-assign',
  templateUrl: './status-assign.component.html',
  styleUrls: ['./status-assign.component.scss']
})
export class StatusAssignComponent implements OnInit, OnDestroy {

  constructor(public bsModalRef: BsModalRef,
              private projectsService: ProjectsService,
              private notificationService: NotificationService,
              private utilitiesService: UtilitiesService,
              private statusesService: StatusesService,
              private fb: FormBuilder) {
  }
  private subscription = new Subscription();
  public entityForm: FormGroup;
  public dialogTitle: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId: number;
  public statusId: number;
  public btnDisabled = false;

  public blockedPanel = false;

  public statuses: SelectItem[] = [];

  validation_messages = {
    'name': [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
    ],
    'description' : [
      {type: 'required', message: 'Trường này bắt buộc '}
    ],
  };
  ngOnInit(): void {
    this.entityForm = this.fb.group({
      'name': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),

      'description': new FormControl('')});
    this.subscription.add(this.projectsService.getAllStatusByProjectId(this.entityId)
      .subscribe((response: StatusModel[]) => {
        response.forEach( element1 => {
          this.statuses.push({
            value: element1.id,
            label: element1.name
          });
        });
        if (this.statusId) {
          this.dialogTitle = 'Cập nhật';
          this.loadFormDetails(this.statusId);
        } else {
          this.dialogTitle = 'Thêm mới';
        }
      }));
  }
  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.add(this.statusesService.getById(id).subscribe((response: any) => {
      this.entityForm.setValue({
        name: response.name,
        description: response.description
      });
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
    }));
  }
  public saveChange() {
    this.btnDisabled = true;
    this.blockedPanel = true;
    if (this.statusId) {
      this.subscription.add(this.projectsService.updateStatusByProjectId(this.entityId, this.statusId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
          this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }));
    } else {
      this.subscription.add(this.projectsService.addStatusByProjectId(this.entityId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
          this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }));
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
