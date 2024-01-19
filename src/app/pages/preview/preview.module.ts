import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreviewPage } from './preview.page';
import { PreviewPageRoutingModule } from './preview-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PreviewPageRoutingModule
  ],
  declarations: [PreviewPage]
})
export class Tab3PageModule {}
