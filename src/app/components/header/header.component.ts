import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public translate: TranslateService, public router: Router) {
    translate.setDefaultLang('pt-br');
    translate.use('pt-br');
  }

  ngOnInit(): void {}

  returnHome() {
    this.router.navigate(['/']);
  }

  logout() {
    localStorage.removeItem('TOKEN_TESTE');
    this.router.navigate(['/login']);
  }

  onValChange($event: string) {
    this.translate.use($event);
  }
}
