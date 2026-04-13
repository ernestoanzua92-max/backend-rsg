import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private http = inject(HttpClient);
  
  // CAMBIA ESTA LÍNEA: Usa tu link de Render
  private apiUrl = 'https://api-rsg.onrender.com/api/solicitudes';

  getSolicitudes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearSolicitud(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }
}