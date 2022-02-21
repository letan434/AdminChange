import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Pagination, Permission, Role } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  private _shareHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._shareHeaders = this._shareHeaders.set('Content-Type', 'application/json');
  }
  add(entity: Role) {
    return this.http.post(`${environment.apiUrl}/api/roles`, JSON.stringify(entity), {headers: this._shareHeaders})
      .pipe(catchError(this.handleError));
  }
  update(id: string, entity: Role) {
    return this.http.post(`${environment.apiUrl}/api/roles/${id}`, JSON.stringify(entity), {headers: this._shareHeaders})
      .pipe(catchError(this.handleError));
  }
  getDetail(id) {
    return this.http.get(`${environment.apiUrl}/api/roles/${id}`, {headers: this._shareHeaders})
      .pipe(catchError(this.handleError));
  }
  getAllPaging(filter, pageIndex, pageSize) {
    return this.http.get<Pagination<Role>>(`${environment.apiUrl}/api/roles/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`, { headers: this._shareHeaders })
      .pipe(map((response: Pagination<Role>) => {
        return response;
      }), catchError(this.handleError));
  }
  delete(id) {
    return this.http.delete(`${environment.apiUrl}/api/roles/${id}`, {headers: this._shareHeaders})
      .pipe(catchError(this.handleError));
  }
  getAll() {
    return this.http.get<Role[]>(`${environment.apiUrl}/api/roles`, { headers: this._shareHeaders })
      .pipe(map((response: Role[]) => {
        return response;
      }), catchError(this.handleError));
  }
  getRolePermissions(roleId) {
    return this.http.get<Permission[]>(`${environment.apiUrl}/api/roles/${roleId}/permissions`, {headers: this._shareHeaders})
      .pipe(catchError(this.handleError));
  }

}
