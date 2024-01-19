import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // přidaný endpoint /settings pro naši aplikaci, V aplikaci se nevyužívá, bude v budoucnu odebrán.
  // V tuto chvíli funguje pokud zadáte /settings
  // TODO: v budoucnu odebrat
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  // vložení endpointu /detail s lazy loadingem
  {
    path: 'detail',
    loadChildren: () => import('./pages/weather-detail/weather-detail.module').then( m => m.WeatherDetailPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
