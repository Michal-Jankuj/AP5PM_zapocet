import {Component, OnInit} from '@angular/core';
import {IpApiService} from "../../services/ip-api/ip-api.service";
import {IPmodel} from "../../models/ip.model";

@Component({
  selector: 'app-weather-detail',
  templateUrl: './weather-detail.page.html',
  styleUrls: ['./weather-detail.page.scss'],
})
export class WeatherDetailPage implements OnInit {

  /**
   * Data detailu pro propsání do view
   */
  ipModel: IPmodel;

  constructor(
      private ipApiService: IpApiService
  ) {
    // získání dat ze servisky
    // správný postup je využít routeGuard, ale tento postup snažší na pochopení
    // data do servisky proměnné detail byly předány při kliknutí na kartu na halvní stránce
    this.ipModel = this.ipApiService.detail!;
  }

  ngOnInit() {
  }

}
