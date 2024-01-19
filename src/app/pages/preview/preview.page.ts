import { Component } from '@angular/core';
import {IpApiService} from "../../services/ip-api/ip-api.service";
import {IPmodel} from "../../models/ip.model";

@Component({
  selector: 'app-preview',
  templateUrl: 'preview.page.html',
  styleUrls: ['preview.page.scss']
})
export class PreviewPage {
  num: number = 0;
  inputValue: string = "";
  result: IPmodel | undefined;

  constructor(
    private ipApiService: IpApiService,
  ) {}


  add(event: MouseEvent) {
    this.ipApiService.getByIP$(this.inputValue).subscribe(data => this.result = data);
  }
}
