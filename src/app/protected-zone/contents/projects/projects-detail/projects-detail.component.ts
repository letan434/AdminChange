import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationService, UtilitiesService } from '@app/shared/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng';
import { Project } from '@app/shared/models';
import { ProjectsService } from '@app/shared/services/projects.service';
import { MessageConstants } from '@app/shared/constants';

@Component({
  selector: 'app-projects-detail',
  templateUrl: './projects-detail.component.html',
  styleUrls: ['./projects-detail.component.scss']
})
export class ProjectsDetailComponent implements OnInit, OnDestroy {

  constructor(
    public bsModalRef: BsModalRef,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private utilitiesService: UtilitiesService,
    private fb: FormBuilder) {
  }

  private subscription = new Subscription();
  public entityForm: FormGroup;
  public dialogTitle: string;
  private savedEvent: EventEmitter<any> = new EventEmitter();
  public entityId: number;
  public btnDisabled = false;

  public blockedPanel = false;

  public projects: SelectItem[] = [];

  // Validate
  validation_messages = {
    'name': [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
    ],
    'description' : [
      {type: 'required', message: 'Trường này bắt '}
    ],
    'categoryId' : [
      {type: 'required', message: 'Trường này bắt '}
    ]
  };

  ngOnInit() {
    this.entityForm = this.fb.group({
      'name': new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      'categoryId': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'description': new FormControl('')
    });
    this.subscription.add(this.projectsService.getAll()
      .subscribe((response: Project[]) => {
        response.forEach( element1 => {
          this.projects.push({
            value: element1.id,
            label: element1.name
          });
        });
        if (this.entityId) {
          this.dialogTitle = 'Cập nhật';
          this.loadFormDetails(this.entityId);
        } else {
          this.dialogTitle = 'Thêm mới';
        }
      }));
  }
  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.add(this.projectsService.getDetail(id).subscribe((response: any) => {
      this.entityForm.setValue({
        name: response.name,
        categoryId: response.categoryId,
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
    if (this.entityId) {
      this.subscription.add(this.projectsService.update(this.entityId, this.entityForm.getRawValue())
        .subscribe(() => {
          this.savedEvent.emit(this.entityForm.value);
          this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
          this.btnDisabled = false;
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }, error => {
          setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
        }));
    } else {
      this.subscription.add(this.projectsService.add(this.entityForm.getRawValue())
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
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
