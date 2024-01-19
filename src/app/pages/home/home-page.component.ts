import {Component} from '@angular/core';
import {WeatherApiService} from "../../services/weather-api/weather-api.service";
import {firstValueFrom, Observable} from "rxjs";
import {Weather} from "../../models/weather.model";
import {ModalController} from "@ionic/angular";
import {SettingsPage} from "../settings/settings.page";
import {PlacesService} from "../../services/places/places.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss']
})
export class HomePage {

  /**
   * Klasický zápis
   * nutné přepsat data pokaždé když data získám
   * je nutné kontrolovat existenci objektu a dalších zanořených objektů dodatečnýma podmínkama viz view
   *
   * @deprecated Tento způsob není doporučován, lepší možnost je použít weather$ s kombinací s pipou async
   */
  data: any = {};


  /**
   * Pokročilejší zápis
   * využívá obserable pattern
   * datový typ se uvádí do <...> - generika
   *
   * @deprecated Již se využívá weathers$
   */
  weather$: Observable<Weather>;

  /**
   * Drží pole asychroných requestů (pro každé místo je jeden)
   * Není to nejefektivnější řešení, ale pro tento případ je dostačující
   */
  weathers$: Observable<Weather>[] = [];

  // Toto by bylo lepší řešení, avšak naše API neumí vrátit v jednom requestu pole počasí pro různá místa
  // Příklad tohoto byl GET (z CRUD) modelu /users, který by vrátil pole uživatelů
  // weathers$: Observable<Weather[]>;

  constructor(
    // Vložím servisku pro Dependency Injection (má vlastní serviska)
    // private je doporučeno pro koncové třídy,
    //  pokud by se jednalo o abstraktní třídu, nebo třídu určenou k dědění použil bych public nebo protected
    private weatherApiService: WeatherApiService,
    private modalCtrl: ModalController,
    private placesService: PlacesService // přidání servisky pro získání nastavení míst
  ) {
    // načtení počasí
    // načte data z placesService (využívám na více místech, proto je to funkce)
    this.initWeather();

    // nastavým výstup funkce při načtení stránky (pozor, před načtením view)
    // zde se žádná data nezískávají!!! data se získají až ve view pomocí | async (pipy async)
    // až pipa async provede onen .subscribe(...), který získá data
    // zde se pouze předavají stejné datové typy getByGeo$(...): Observable<...> >>> this.weather$: Observable<any>
    this.weather$ = this.weatherApiService.getByGeo$(0, 0)
  }


  /**
   * inicializace počasí
   * není nejefektivnější, jelikož vždy resetuji pole requestů, optimalizace by ale zabrala více řádků a logiky
   *
   * @private
   */
  private async initWeather() {
    // reset pole na prázdné
    this.weathers$ = [];
    // získání všech places ze servisky (jsou vždy aktuální)
    // firstValueFrom = získá první (poslední přidaná) data do observable patternu tedy proměnné places$
    const places = await firstValueFrom(this.placesService.places$)
    // firstValueFrom je použití místo .subscribe, data chci totiž jen jedenkrát
    // Pokud bych použil .subscribe došlo by v každém volání funkce initWeather (tedy po zavření modalu)
    // k vytvoření nového odběratele až do n odběratelů. Následkem čeho by se přehltila pamět a aplikace by spadla.
    // this.placesService.places$.subscribe(places => {
      places.forEach(place => {
        // kontrola jestli se má zobrazovat na domovské obrazovce nebo ne
        if (place.homepage) {
          // push do resetovaného pole
          // vkládám Observable objekt (pattern)
          // na view pak používám | async stejně jako v případě získání jedné polohy
          // rozdíl je že to celé běží v cyklu, který je dynamický a reaguje na změny pole
          this.weathers$.push(
            this.weatherApiService.getByGeo$(place.latitude, place.longitude)
          )
          // Lepší jednorádkový zápis
          // this.weathers$.push(this.weatherApiService.getByGeo$(place.latitude, place.longitude))
        }
     // }); //původní část z .subscribe (ukončovací)
    })

  }

  /**
   * Get manual data
   *
   * @deprecated Tento způsob není doporučován, lepší možnost je použít weather$ s kombinací s pipou async
   */
  fetchData() {
    // získám data na pozici GEO 0,0 pomocí metody .subscribe(...)
    // používám servisku, které umožňuje přenášet logiku skrze Dependency Injection (DI)
    this.weatherApiService.getByGeo$(0, 0).subscribe(data => {
      // data získaná z requestu předám to proměnné this.data abych je mohl vypsat ve view (nahradím původní objekt uložený v data)
      this.data = data;
    })
  }

  /**
   * Modal open
   */
  async openSettings() {

    // umožňuji vytvořit modalové okno (překryv)
    // component = libovolný komponent/stránka (stránka je to samé, jen využívá lazy loading pomocí modulu)
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });

    // prezentace modalu po dalším nastaení (spustí animaci a dlaší části modalu)
    await modal.present();

    // možnost získávání dat před zavřením (onWillDismiss) nebo po zavření (onDidDismiss)
    // daty je myšleno to co modal (SettingsPage) zaslal v dismiss metodě >> this.modalCtrl.dismiss({...})
    // doporučuje se využít spíše .then() místo await struktury
    // data jsou pro onWillDismiss i onDidDismiss stejná.

    modal.onWillDismiss().then(_ => {
      // Potom co je zavřen modal (před tím než se spustí animace)
      // je znovu volán init weather, který resetuje data a znovu vše nastavuje podle aktuálního stavu
      this.initWeather();
    });

    // alternativní zápis
    // pozor na použití await, který ale nikdy nenastane, zbytečně se může plnit paměť zařízení a vše pak být pomalejší
    // .then() je v tomto případě výhodnější
    // await modal.onWillDismiss();
    // this.initWeather();

  }

  /**
   * Set detail weather data
   *
   * Nastaví detail data skrze servisku dříve, než se otevře routerLink na view
   * @param weather
   */
  setDetailData(weather: Weather) {
    this.weatherApiService.detail = weather;
  }
}
