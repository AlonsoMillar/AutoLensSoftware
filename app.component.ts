import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.checkSession();
  }

  async checkSession() {
    const session = await this.authService.getSession();
    if (session) {
      // Si hay sesión, lo mandamos al Home directamente
      this.navCtrl.navigateRoot('/home');
    } else {
      // Si no, lo mandamos al Login
      this.navCtrl.navigateRoot('/login');
    }
  }

  async logout() {
    await this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  async showAbout() {
    const alert = await this.alertCtrl.create({
      header: 'AutoLens CL',
      subHeader: 'Versión 1.0.0',
      message: 'Sistema inteligente de lectura de patentes para seguridad vial.',
      buttons: ['Entendido']
    });
    await alert.present();
  }
}