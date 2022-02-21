import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from '@app/shared/services/base.service';
import { environment } from '@environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Command } from '@app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class CommandService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private http: HttpClient) {
    super();
    this._sharedHeaders = this._sharedHeaders.set('Content-Type', 'application/json');
  }
  getAll() {
    return this.http.get<Command[]>(`${environment.apiUrl}/api/commands`, { headers : this._sharedHeaders })
      .pipe(map((response: Command[]) => {
        return response;
      }), catchError(this.handleError));
  }
}
