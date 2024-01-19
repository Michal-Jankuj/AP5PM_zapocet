import { Component } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: 'preview.page.html',
  styleUrls: ['preview.page.scss']
})
export class PreviewPage {

  num: number = 0;

  constructor() {}


  add(event: MouseEvent) {
    this.num++;
    // ++this.num;
  }
}
