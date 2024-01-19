import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IPmodel} from "../../models/ip.model";

@Injectable({
  providedIn: 'root'
})
export class IpApiService {
  /**
   * Pomocná proměnná pro předávání dat mezi kontrolery
   */
  detail?: IPmodel;

  constructor(
    // Vložím servisku pro Dependency Injection (pro komunikaci s API skrze HTTP protokol)
    // private je doporučeno pro koncové třídy,
    //  pokud by se jednalo o abstraktní třídu, nebo třídu určenou k dědění použil bych public nebo protected
    private http: HttpClient
  ) {
  }

  /**
   * Get info by ip
   * @param ip
   */
  getByIP$(ip: string) {
    // environment.ts (soubor), který obsahuje konstantu environment, která obsahuje následující strukturu
    // environment je zde pro možnost změny různých vývojových prostředí (DEV, STAGING, PRODUCTION...),
    //  které se mění automaticky pomocí buildu aplikace (ionic build, ionic build prod, ng build, ng build prod, ...)
    // environment.ts i environment.prod.ts musejí mít stejnou strukturu!!!
    // moderní skládání stringů v JS/TS
    return this.http.get<IPmodel>(`${environment.baseUrl}${ip}/json`);
  }
}
