import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-koalibee-home',
  templateUrl: './koalibee-home.component.html',
  styleUrls: ['./koalibee-home.component.scss']
})
export class KoalibeeHomeComponent implements OnInit {

  momentsToggled = false;

  constructor() { }

  ngOnInit() {
  }

  toggleMoments(): void {
    this.momentsToggled = !this.momentsToggled;
  }

}
