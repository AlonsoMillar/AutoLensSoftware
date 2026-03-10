import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false // Aseguramos que sea falso
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

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