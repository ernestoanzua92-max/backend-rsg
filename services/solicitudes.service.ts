import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private http = inject(HttpClient);
  // Asegúrate de que este puerto sea el mismo que sale cuando corres "node index.js"
  private apiUrl = 'http://localhost:3000/api/solicitudes';

  getSolicitudes() {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearSolicitud(datos: any) {
    return this.http.post(this.apiUrl, datos);
  }
}