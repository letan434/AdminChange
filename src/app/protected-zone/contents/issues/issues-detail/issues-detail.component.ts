import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CategoriesService,
  IssuesService,
  KnowledgeBasesService,
  NotificationService,
  StatusesService,
  UtilitiesService
} from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api/selectitem';
import { environment } from '@environments/environment';
import { ProjectsService } from '@app/shared/services/projects.service';
import { Category, Project, StatusModel } from '@app/shared/models';
import { MessageConstants } from '@app/shared/constants';

@Component({
  selector: 'app-issues-detail',
  templateUrl: './issues-detail.component.html',
  styleUrls: ['./issues-detail.component.scss']
})
export class IssuesDetailComponent implements OnInit, OnDestroy {

  constructor(
    private issuesService: IssuesService,
    private statusesService: StatusesService,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private utilitiesService: UtilitiesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
  }
  private subscription: Subscription[] = [];
  public entityForm: FormGroup;
  public dialogTitle: string;
  public entityId: string;
  public projects: any[] = [];
  public statuses: any[] = [];

  public blockedPanel = false;
  public selectedFiles: File[] = [];
  public attachments: any[] = [];
  public backendApiUrl = environment.apiUrl;

  // Validate
  validation_messages = {
    'title': [
      { type: 'required', message: 'Trường này bắt buộc' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 30 kí tự' }
    ],
    'statusId': [
      { type: 'required', message: 'Trường này bắt buộc' },
    ],
    'sample': [
      { type: 'required', message: 'Trường này bắt buộc' },
    ]
  };
  ngOnInit(): void {
    this.entityForm = this.fb.group({
      'statusId': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'title': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'sample': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'description': new FormControl(''),
      'listPosition': new FormControl(''),
      'priority': new FormControl('', Validators.compose([
        Validators.required
      ])),
      'labels': new FormControl(''),
    });
    this.subscription.push(this.activeRoute.params.subscribe(params => {
      this.entityId = params['id'];
    }));
    this.subscription.push(this.projectsService.getAll()
      .subscribe((response: Project[]) => {
        response.forEach(element => {
          this.projects.push({ label: element.name, value: element.id });
        });
      }));
    this.subscription.push(this.projectsService.getAllStatusByProjectId(this.projects[0].id)
      .subscribe((response: StatusModel[]) => {
        response.forEach(element => {
          this.statuses.push({ label: element.name, value: element.id });
        });
      }));
  }
  public generateStatus() {
    const seoAlias = this.utilitiesService.MakeSeoTitle(this.entityForm.controls['title'].value);
    this.entityForm.controls['seoAlias'].setValue(seoAlias);
  }
  private loadFormDetails(id: any) {
    this.blockedPanel = true;
    this.subscription.push(this.issuesService.getDetail(id).subscribe((response: any) => {
      this.entityForm.setValue({
        title: response.title,
        statusId: response.statusId,
        sample: response.sample,
        description: response.description,
        listPosition: response.listPosition,
        priority: response.priority,
        labels: response.labels
      });
      this.attachments = response.attachments;
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }, error => {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }));
  }
  public selectAttachments($event) {
    if ($event.currentFiles) {
      $event.currentFiles.forEach(element => {
        this.selectedFiles.push(element);
      });
    }
  }
  public removeAttachments($event) {
    if ($event.file) {
      this.selectedFiles.splice(this.selectedFiles.findIndex(item => item.name === $event.file.name), 1);
    }

  }
  public deleteAttachment(attachmentId) {
    this.blockedPanel = true;
    this.subscription.push(this.issuesService.deleteAttachment(this.entityId, attachmentId)
      .subscribe(() => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.attachments.splice(this.attachments.findIndex(item => item.id === attachmentId), 1);
        setTimeout(() => { this.blockedPanel = false; }, 1000);

      }, error => {
        setTimeout(() => { this.blockedPanel = false; }, 1000);
      }));
    return false;
  }
  goBackToList() {
    this.router.navigateByUrl('/contents/issues');
  }
  public saveChange() {
    this.blockedPanel = true;
    const formValues = this.entityForm.getRawValue();
    const formData = this.utilitiesService.ToFormData(formValues);
    this.selectedFiles.forEach(file => {
      formData.append('attachments', file, file.name);
    });

    if (this.entityId) {
      this.subscription.push(this.issuesService.update(this.entityId, formData)
        .subscribe((response: any) => {
          if (response.status === 204) {
            this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
            this.router.navigateByUrl('/contents/knowledge-bases');
          }

        }, error => {
          setTimeout(() => { this.blockedPanel = false; }, 1000);
        }));
    } else {
      this.subscription.push(this.issuesService.add(formData)
        .subscribe((response: any) => {
          if (response.status === 201) {
            this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
            this.router.navigateByUrl('/contents/knowledge-bases');
          }
        }, error => {
          setTimeout(() => { this.blockedPanel = false; }, 1000);
        }));
    }
    return false;
  }
  ngOnDestroy(): void {
    this.subscription.forEach(element => {
      element.unsubscribe();
    });
  }
}
