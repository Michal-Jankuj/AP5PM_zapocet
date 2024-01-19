import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherDetailPageRoutingModule } from './weather-detail-routing.module';

import { WeatherDetailPage } from './weather-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherDetailPageRoutingModule
  ],
  declarations: [WeatherDetailPage]
})
export class WeatherDetailPageModule {}
