import { Injectable } from '@angular/core';
import { BaseService } from '@app/shared/services/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category, CountNewDashboard, DashboardProject, Function, Pagination, Project, StatusModel, User } from '@app/shared/models';
import { environment } from '@environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends BaseService {

  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  }
  getAll() {
    return this.http.get<Project[]>(`${environment.apiUrl}/api/projects`, { headers: this._sharedHeaders})
      .pipe(map((response: Project[]) => {
        return response;
      }), catchError(this.handleError));
  }
  getAllUsersByProjectId(projectId) {
    return this.http.get<User[]>(`${environment.apiUrl}/api/projects/${projectId}/users`, {headers: this._sharedHeaders})
      .pipe(map((response: User[]) => {
        return response;
    }), catchError(this.handleError));
  }
  getAllPaging(filter, pageIndex, pageSize) {
    return this.http.get<Pagination<Project>>(`${environment.apiUrl}/api/projects/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`, { headers: this._sharedHeaders })
      .pipe(map((response: Pagination<Project>) => {
        return response;
      }), catchError(this.handleError));
  }
  add(entity: Project) {
    return this.http.post(`${environment.apiUrl}/api/projects`, JSON.stringify(entity), { headers: this._sharedHeaders })
      .pipe(catchError(this.handleError));
  }
  update(id: number, entity: Project) {
    return this.http.put(`${environment.apiUrl}/api/projects/${id}`, JSON.stringify(entity), { headers: this._sharedHeaders })
      .pipe(catchError(this.handleError));
  }

  getDetail(id) {
    return this.http.get<Project>(`${environment.apiUrl}/api/projects/${id}`, { headers: this._sharedHeaders })
      .pipe(catchError(this.handleError));
  }
  delete(id) {
    return this.http.delete(environment.apiUrl + '/api/projects/' + id, { headers: this._sharedHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }
  assignUserToProject(projectId, userAssignRequest: any) {
    return this.http.put(`${environment.apiUrl}/api/projects/${projectId}/users`, JSON.stringify(userAssignRequest),
      {headers: this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  removeUsersFromProject(projectId, usersAssignRequest: string[]) {
    let userQuery = '';
    for (const userId of usersAssignRequest) {
      userQuery += 'userIds' + '=' + userId + '&';
    }
    return this.http.delete(environment.apiUrl + '/api/projects/' + projectId + '/users?' + userQuery, { headers: this._sharedHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllStatusByProjectId(projectId) {
    return this.http.get<StatusModel[]>(`${environment.apiUrl}/api/projects/${projectId}/status`, { headers: this._sharedHeaders})
      .pipe(map((response: StatusModel[]) => {
        return response;
      }), catchError(this.handleError));
  }
  addStatusByProjectId(projectId, addStatusRequest: any) {
    return this.http.post(`${environment.apiUrl}/api/projects/${projectId}/status`, JSON.stringify(addStatusRequest),
      { headers: this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  updateStatusByProjectId(projectId, statusId, updateStatusRequest: any) {
    return this.http.put(`${environment.apiUrl}/api/projects/${projectId}/status/${statusId}`, JSON.stringify(updateStatusRequest),
      {headers: this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  removeStatusFromProject(statusId) {
    return this.http.delete(`${environment.apiUrl}/api/statuses/${statusId}`, {headers : this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  getDashboardProject(): Observable<DashboardProject[]>{
    return this.http.get<DashboardProject[]>(`${environment.apiUrl}/api/projects/statusdashboard`, {headers : this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
  getNewItemDashboardProject(): Observable<CountNewDashboard>{
    return this.http.get<CountNewDashboard>(`${environment.apiUrl}/api/projects/newItem`, {headers : this._sharedHeaders})
      .pipe(catchError(this.handleError));
  }
}
