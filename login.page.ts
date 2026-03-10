import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service'; // <-- Ajusta la ruta si es necesario

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService // <-- Inyectamos tu nuevo cerebro
  ) { }

  ngOnInit() {
  }

  // ... (aquí mantienes tu función de login local que ya tenías) ...

  // La nueva función poderosa de Google
  async loginWithGoogle() {
    // 1. Mostramos el loader para que el usuario sepa que está cargando
    const loading = await this.loadingCtrl.create({
      message: 'Conectando con Google...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      // 2. Llamamos a tu servicio
      const sessionData = await this.authService.loginWithGoogle();
      
      // 3. Cerramos el loader
      await loading.dismiss();

      // 4. Mostramos el mensaje de éxito usando el nombre que nos dio Google
      const toast = await this.toastCtrl.create({
        message: `¡Bienvenido, ${sessionData.nombre}!`,
        duration: 2000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle'
      });
      await toast.present();

      // 5. ¡Viaje directo al Home!
      this.router.navigate(['/home']);

    } catch (error) {
      await loading.dismiss();
      console.error('Error al iniciar sesión con Google:', error);
      
      // Si el usuario cancela o hay error, mostramos alerta
      const toast = await this.toastCtrl.create({
        message: 'No se pudo iniciar sesión con Google.',
        duration: 3000,
        position: 'top',
        color: 'danger',
        icon: 'alert-circle'
      });
      await toast.present();
    }
  }

}