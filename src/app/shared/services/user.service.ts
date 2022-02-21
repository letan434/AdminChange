import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { catchError, map } from 'rxjs/operators';
import { Function, Pagination, Role, User } from '../models';
import { environment } from '../../../environments/environment';
import { UtilitiesService } from './utilities.service';
import { pipe } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {
    private _shareHeaders = new HttpHeaders();
    constructor(private http: HttpClient,
        private utilitiesService: UtilitiesService) {
        super();
        this._shareHeaders = this._shareHeaders.set('Content-Type', 'application/json');

    }
    getMenuByUser(userId: string) {
        return this.http.get<Function[]>(`${environment.apiUrl}/api/users/${userId}/menu`, { headers: this._shareHeaders })
        .pipe(map(response => {
            const fuctions = this.utilitiesService.UnflatteringForLeftMenu(response);
            return fuctions;
            }),
            catchError(this.handleError));
    }
    add(enity: User) {
        return this.http.post(`${environment.apiUrl}/api/users`, JSON.stringify(enity), { headers: this._shareHeaders })
          .pipe(catchError(this.handleError));
    }
    update(id: string, enity: User) {
        return this.http.put(`${environment.apiUrl}/api/users/${id}`, JSON.stringify(enity), { headers: this._shareHeaders })
          .pipe(catchError(this.handleError));
    }
    getAllPaging(filter, pageIndex, pageSize) {
        return this.http.get<Pagination<User>>(`${environment.apiUrl}/api/users/filter?pageIndex=${pageIndex}&pageSize=${pageSize}&filter=${filter}`, { headers: this._shareHeaders })
          .pipe(map((response: Pagination<User>) => {
              return  response;
        }) , catchError(this.handleError));
    }
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/users`, { headers: this._shareHeaders })
          .pipe(map((response: User[]) => {
              return response;
          }), catchError(this.handleError));
    }
    getDetail(id) {
        return this.http.get(`${environment.apiUrl}/api/users/${id}`, { headers: this._shareHeaders })
          .pipe(catchError(this.handleError));
    }
    delete(id) {
        return this.http.delete(`${environment.apiUrl}/api/users/${id}`, {headers: this._shareHeaders})
        .pipe(catchError(this.handleError));
    }
    getUserRoles(userId: string) {
        return this.http.get<string[]>(`${environment.apiUrl}/api/users/${userId}/roles`, { headers: this._shareHeaders })
          .pipe(catchError(this.handleError));
    }
    removeRolesFromUser(id, roleNames: string[]) {
        let rolesQuery = '';
        for (const roleName of roleNames) {
            rolesQuery += 'roleNames' + '=' + roleName + '&';
        }
        return this.http.delete(environment.apiUrl + '/api/users/' + id + '/roles?' + rolesQuery, { headers: this._shareHeaders })
          .pipe(
            catchError(this.handleError)
          );
    }
    assignRolesToUser(userId: string, assignRolesToUser: any) {
        return this.http.post(`${environment.apiUrl}/api/users/${userId}/roles`,
          JSON.stringify(assignRolesToUser), { headers: this._shareHeaders })
          .pipe(catchError(this.handleError));
    }
}
