import {Component} from '@angular/core';
import {IpApiService} from "../../services/ip-api/ip-api.service";
import {firstValueFrom, Observable} from "rxjs";
import {IPmodel} from "../../models/ip.model";
import {ModalController} from "@ionic/angular";
import {SettingsPage} from "../settings/settings.page";
import {AdressesService} from "../../services/Adresses/adresses.service";

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
  ip$: Observable<IPmodel>;

  /**
   * Drží pole asychroných requestů (pro každé místo je jeden)
   * Není to nejefektivnější řešení, ale pro tento případ je dostačující
   */
  ips$: Observable<IPmodel>[] = [];

  // Toto by bylo lepší řešení, avšak naše API neumí vrátit v jednom requestu pole počasí pro různá místa
  // Příklad tohoto byl GET (z CRUD) modelu /users, který by vrátil pole uživatelů

  constructor(
    // Vložím servisku pro Dependency Injection (má vlastní serviska)
    // private je doporučeno pro koncové třídy,
    //  pokud by se jednalo o abstraktní třídu, nebo třídu určenou k dědění použil bych public nebo protected
    private ipApiService: IpApiService,
    private modalCtrl: ModalController,
    private adressesService: AdressesService // přidání servisky pro získání nastavení míst
  ) {
    // načtení počasí
    // načte data z adressesService (využívám na více místech, proto je to funkce)
    this.initIP();

    // nastavým výstup funkce při načtení stránky (pozor, před načtením view)
    // zde se žádná data nezískávají!!! data se získají až ve view pomocí | async (pipy async)
    // až pipa async provede onen .subscribe(...), který získá data
    // zde se pouze předavají stejné datové typy getByIP$(...): Observable<...> >>> this.ip$: Observable<any>
    this.ip$ = this.ipApiService.getByIP$("8.8.8.8")
  }


  /**
   * inicializace počasí
   * není nejefektivnější, jelikož vždy resetuji pole requestů, optimalizace by ale zabrala více řádků a logiky
   *
   * @private
   */
  private async initIP() {
    // reset pole na prázdné
    this.ips$ = [];
    // získání všech Adresses ze servisky (jsou vždy aktuální)
    // firstValueFrom = získá první (poslední přidaná) data do observable patternu tedy proměnné Adresses$
    const places = await firstValueFrom(this.adressesService.adresses$)
    // firstValueFrom je použití místo .subscribe, data chci totiž jen jedenkrát
    // Pokud bych použil .subscribe došlo by v každém volání funkce initIP (tedy po zavření modalu)
    // k vytvoření nového odběratele až do n odběratelů. Následkem čeho by se přehltila pamět a aplikace by spadla.
    // this.adressesService.Adresses$.subscribe(Adresses => {
      places.forEach(place => {
        // kontrola jestli se má zobrazovat na domovské obrazovce nebo ne
        if (place.homepage) {
          // push do resetovaného pole
          // vkládám Observable objekt (pattern)
          // na view pak používám | async stejně jako v případě získání jedné polohy
          // rozdíl je že to celé běží v cyklu, který je dynamický a reaguje na změny pole
          this.ips$.push(
            this.ipApiService.getByIP$(place.ip)
          )
          // Lepší jednorádkový zápis
          // this.weathers$.push(this.ipApiService.getByGeo$(place.latitude, place.longitude))
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
    // získám data na adrese 8.8.8.8 pomocí metody .subscribe(...)
    // používám servisku, které umožňuje přenášet logiku skrze Dependency Injection (DI)
    this.ipApiService.getByIP$("8.8.8.8").subscribe(data => {
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
      this.initIP();
    });

    // alternativní zápis
    // pozor na použití await, který ale nikdy nenastane, zbytečně se může plnit paměť zařízení a vše pak být pomalejší
    // .then() je v tomto případě výhodnější
    // await modal.onWillDismiss();
    // this.initIP();

  }

  /**
   * Set detail weather data
   *
   * Nastaví detail data skrze servisku dříve, než se otevře routerLink na view
   * @param ip
   */
  setDetailData(ip: IPmodel) {
    this.ipApiService.detail = ip;
  }
}
