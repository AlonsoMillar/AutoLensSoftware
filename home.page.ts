import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  // Variables de estado
  showManualEntry = false;
  manualPlate = '';
  
  // Objeto para los datos del usuario (con valores por defecto)
  userData: any = {
    nombre: 'Usuario',
    foto: '',
    email: ''
  };

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  // Recupera la sesión guardada por el AuthService
async loadUserData() {
  const session = await this.authService.getSession();
  if (session) {
    this.userData = session;
  }
}

  // Cerrar sesión
  async logout() {
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
      duration: 1000
    });
    await loading.present();

    await this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  // Simulación de Escaneo
  async startScan() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sensores AutoLens...',
      duration: 2000,
      spinner: 'crescent',
    });
    await loading.present();

    await loading.onDidDismiss();

    const toast = await this.toastCtrl.create({
      message: '¡Patente capturada con éxito!',
      duration: 2500,
      position: 'top',
      color: 'success',
      icon: 'scan-circle'
    });
    await toast.present();
  }

  toggleManualEntry() {
    this.showManualEntry = !this.showManualEntry;
  }

  async submitManualPlate() {
    if (this.manualPlate.trim() === '') {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, escribe una patente.',
        duration: 2000,
        position: 'top',
        color: 'danger',
        icon: 'alert-circle'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: `Buscando matrícula ${this.manualPlate.toUpperCase()}...`,
      duration: 1500,
      spinner: 'dots'
    });
    await loading.present();
    await loading.onDidDismiss();

    this.manualPlate = '';
    this.showManualEntry = false;
  }
}