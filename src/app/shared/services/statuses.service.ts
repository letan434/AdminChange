import { Injectable } from '@angular/core';
import { BaseService } from '@app/shared/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { catchError, map } from 'rxjs/operators';
import { StatusModel } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class StatusesService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  }
  getById(id) {
    return this.http.get(`${environment.apiUrl}/api/statuses/${id}`, { headers: this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  // getAllbyProjectId(projectId) {
  //   return this.http.get<StatusModel[]>(`${environment.apiUrl}/api/projects/${projectId}/status`, {headers: this._sharedHeaders})
  //     .pipe(map((response: StatusModel[]) => {
  //       return response;
  //     }), catchError(this.handleError));
  // }
}
