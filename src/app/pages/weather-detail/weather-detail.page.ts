import {Component, OnInit} from '@angular/core';
import {WeatherApiService} from "../../services/weather-api/weather-api.service";
import {Weather} from "../../models/weather.model";

@Component({
  selector: 'app-weather-detail',
  templateUrl: './weather-detail.page.html',
  styleUrls: ['./weather-detail.page.scss'],
})
export class WeatherDetailPage implements OnInit {

  /**
   * Data detailu pro propsání do view
   */
  weather: Weather;

  constructor(
      private weatherApiService: WeatherApiService
  ) {
    // získání dat ze servisky
    // správný postup je využít routeGuard, ale tento postup snažší na pochopení
    // data do servisky proměnné detail byly předány při kliknutí na kartu na halvní stránce
    this.weather = this.weatherApiService.detail!;
  }

  ngOnInit() {
  }

}
