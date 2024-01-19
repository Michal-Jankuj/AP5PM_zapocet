import {Injectable} from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {ReplaySubject} from "rxjs";

/**
 * Model place
 *
 * Měl by existovat ve složce models
 * Zde ale dává větší logiku, proto jej nechávám zde
 * Je zde vše více ucelenější
 */
export interface Place {
  latitude: number;
  longitude: number;
  name: string;
  homepage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  /**
   * Základní místa v aplikaci
   *
   * @private
   */
  private privatePlaces: Place[] = [
    {
      latitude: 28.6472799,
      longitude: 28.6472799,
      name: 'Dehli, India',
      homepage: true,
    },
    {
      latitude: -5.7759362,
      longitude: 106.1174957,
      name: 'Jakarta, Indonesia',
      homepage: false,
    },
    {
      latitude: 51.5287718,
      longitude: -0.2416815,
      name: 'London, UK',
      homepage: true,
    },
    {
      latitude: 40.6976701,
      longitude: -74.2598666,
      name: 'New York, USA',
      homepage: false,
    },
    {
      latitude: 48.8589507,
      longitude: 2.2770202,
      name: 'Paris, France',
      homepage: false,
    },
    {
      latitude: 37.757815,
      longitude: -122.5076401,
      name: 'San Francisco, USA',
      homepage: false,
    }
  ];

  /**
   * Available places
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
  private get places() {
    return this.privatePlaces;
  }

  /**
   * Vlastní inicializace možného observable patternu
   *
   * Subject - je jich nekolik, implementaci volím, dle potřeby, viz oficiální dokumentace
   * @private
   */
  private privatePlacesSubject = new ReplaySubject<Place[]>(1)

  /**
   * Drží náš vlastní observable Pattern - proměnnou
   */
  get places$() {
    return this.privatePlacesSubject.asObservable();
  }


  constructor() {
    // zísání dat z localstorage
    // await zde nejde, constructor musí být vždy synchronní proto je zde then
    Preferences.get({key: 'places'}).then(data => {
      // pokud data nejsou (třeba aplikace bězí poprvé, musíme rozhodnout)
      if (data.value) {
        // data mám, přeložím zpět ze stringu do pole
        const places = JSON.parse(data.value)
        // nastavení nových dat pro všechny odběratele (observable pattern)
        this.privatePlacesSubject.next(places as Place[])
      } else {
        // data nejsou, vložím výchozí data
        // nastavení nových dat pro všechny odběratele (observable pattern)
        this.privatePlacesSubject.next(this.places)
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
    this.privatePlaces[index].homepage = active;
    // nastavení nových dat pro všechny odběratele (observable pattern)
    this.privatePlacesSubject.next(this.privatePlaces);
    // uložení dat do localstorage (využívá vestavěný adapter pattern pro jednotlivé platformy)
    await Preferences.set({
      key: 'places',
      value: JSON.stringify(this.privatePlaces),
    });
  }
}
