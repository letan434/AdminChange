import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from '@app/shared/services/base.service';
import { Pagination, Comment } from '../models';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommentsService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  }
  getDetail(commentId) {
    return this.http.get<Comment>(`${environment.apiUrl}/api/issues/comments/${commentId}`,
      {headers: this._sharedHeaders}).pipe(catchError(this.handleError));
  }
  getAllPaging(issueId, filter, pageIndex, pageSize) {
    return this.http.get<Pagination<Comment>>(`${environment.apiUrl}/api/issues/${issueId}/comments/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`,
      {headers: this._sharedHeaders}).pipe(map((response: Pagination<Comment>) => {
        return response;
    }), catchError(this.handleError));
  }
  delete(issueId, commentId) {
    return this.http.delete(environment.apiUrl + '/api/issues/' + issueId + 'comments' + commentId,
      {headers: this._sharedHeaders}).pipe(catchError(this.handleError));
  }
}
