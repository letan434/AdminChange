import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentsService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { Comment } from '@app/shared/models';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-comments-detail',
  templateUrl: './comments-detail.component.html',
  styleUrls: ['./comments-detail.component.scss']
})
export class CommentsDetailComponent implements OnInit, OnDestroy {
  constructor(
    public bsModalRef: BsModalRef,
    private commentsService: CommentsService) {
  }

  private subscription = new Subscription();
  public dialogTitle: string;
  public issueId: number;
  public commentId: number;
  public btnDisabled = false;
  public blockedPanel = false;
  public comment: Comment;

  ngOnInit() {
    if (this.commentId) {
      this.loadFormDetails(this.commentId);
    }
  }
  private loadFormDetails(commentId) {
    this.blockedPanel = true;
    this.subscription.add(this.commentsService.getDetail(commentId)
      .subscribe((response: Comment) => {
        this.comment = response;
        setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
      }, error => {
        setTimeout(() => { this.blockedPanel = false; this.btnDisabled = false; }, 1000);
      }));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
