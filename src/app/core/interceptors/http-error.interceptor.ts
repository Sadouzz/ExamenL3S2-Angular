import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Erreur: ${error.error.message}`;
      } else {
        errorMsg = error.error?.message || `Erreur: ${error.status} - ${error.statusText}`;
      }
      toastService.showError(errorMsg);
      return throwError(() => new Error(errorMsg));
    })
  );
};
