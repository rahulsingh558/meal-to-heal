import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CarouselService {
    private apiUrl = `${environment.apiUrl}/carousel`;

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
        if (!environment.production && isPlatformBrowser(this.platformId)) {
            const hostname = window.location.hostname;
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                this.apiUrl = `http://${hostname}:5001/api/carousel`;
            }
        }
    }

    getCarouselImages(): Observable<string[]> {
        return this.http.get<string[]>(this.apiUrl);
    }
}
