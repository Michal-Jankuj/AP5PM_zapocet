import {Injectable} from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {ReplaySubject} from "rxjs";

/**
 * Model adress
 *
 * Měl by existovat ve složce models
 * Zde ale dává větší logiku, proto jej nechávám zde
 * Je zde vše více ucelenější
 */
export interface IPplace {
  ip: string,
  country_code: string,
  homepage: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  /**
   * Základní místa v aplikaci
   *
   * @private
   */
  private importantAdresses:IPplace[] = [
    {
      ip: "8.8.8.8",
      country_code: "US",
      homepage: true
    },
    {
      ip: "208.67.222.222",
      country_code: "US",
      homepage: true
    },
    {
      ip: "194.195.196.197",
      country_code: "DE",
      homepage: false
    },
    {
      ip: "110.120.130.140",
      country_code: "CN",
      homepage: false
    },
  ];

  /**
   * Available Adresses
   *
   * Setter pro získání míst
   * Uvnitř settrů je možné volat funkce třídy, například init atd...
   * Využití to má třeba pro user$ kdy se vrací observable pattern, ale init pro získání dat se zavolá až je potřeba
   * Následně pak všude kde je použito je vše plně dynamické skrze Observable pattern a vše lze propsat mezi N stránkami
   *
   * Zde je obyčejná implementace získání dat z proměnné
   *
   * Již je nepotřebná (použití v předchozím commitu), nechávám jen pro ukázku možného získávání dat uvnitř servisky
   */
  private get adresses() {
    return this.importantAdresses;
  }

  /**
   * Vlastní inicializace možného observable patternu
   *
   * Subject - je jich nekolik, implementaci volím, dle potřeby, viz oficiální dokumentace
   * @private
   */
  private privateAdressSubject = new ReplaySubject<IPplace[]>(1)

  /**
   * Drží náš vlastní observable Pattern - proměnnou
   */
  get adresses$() {
    return this.privateAdressSubject.asObservable();
  }


  constructor() {
    // zísání dat z localstorage
    // await zde nejde, constructor musí být vždy synchronní proto je zde then
    Preferences.get({key: 'places'}).then(data => {
      // pokud data nejsou (třeba aplikace bězí poprvé, musíme rozhodnout)
      if (data.value) {
        // data mám, přeložím zpět ze stringu do pole
        const adresses = JSON.parse(data.value)
        // nastavení nových dat pro všechny odběratele (observable pattern)
        this.privateAdressSubject.next(adresses as IPplace[])
      } else {
        // data nejsou, vložím výchozí data
        // nastavení nových dat pro všechny odběratele (observable pattern)
        this.privateAdressSubject.next(this.adresses)
      }
    });

  }

  /**
   * Set home visibility
   *
   * Nastaví zobrazení na domovské obrazovce
   * Není setter, je funkce. Setter umí příjmout maximálně 1 attribut
   *
   *
   * @param index
   * @param active
   */
  async setHome(index: number, active: boolean) {
    // nastavení zobrazení místa na hlavní stránce
    this.importantAdresses[index].homepage = active;
    // nastavení nových dat pro všechny odběratele (observable pattern)
    this.privateAdressSubject.next(this.importantAdresses);
    // uložení dat do localstorage (využívá vestavěný adapter pattern pro jednotlivé platformy)
    await Preferences.set({
      key: 'places',
      value: JSON.stringify(this.importantAdresses),
    });
  }
}
