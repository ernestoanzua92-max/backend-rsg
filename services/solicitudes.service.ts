import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private http = inject(HttpClient);
  
  // CORRECCIÓN: Cambiamos 'solicitudes' por 'mantenimiento'
  private apiUrl = 'https://api-rsg.onrender.com/api/mantenimiento';

  getSolicitudes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearSolicitud(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }
}