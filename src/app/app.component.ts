import { Component } from '@angular/core';

import { AuthService } from './core/services/auth.service';
import { KoalibeeService } from './core/services/koalibee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Koality Harmonia';

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
  ) { }

}
