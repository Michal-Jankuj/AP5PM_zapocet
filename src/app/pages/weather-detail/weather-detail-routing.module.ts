import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeatherDetailPage } from './weather-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeatherDetailPageRoutingModule {}
