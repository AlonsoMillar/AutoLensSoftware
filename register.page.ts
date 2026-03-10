import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importante para el [formGroup]
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  // Definimos las propiedades que el HTML está reclamando
  registerForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    // Inicializamos el formulario con validaciones básicas
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  // Función para el ojo de la contraseña
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Función de registro manual (El (ngSubmit)="register()" del HTML)
  async register() {
    if (this.registerForm.valid) {
      const loading = await this.loadingCtrl.create({ message: 'Creando cuenta...' });
      await loading.present();

      const { nombre, email, password } = this.registerForm.value;
      
      // Llamamos al servicio (Aquí luego entrará SQLite)
      const success = await this.authService.registerLocal(nombre, email, password);
      
      await loading.dismiss();

      if (success) {
        const toast = await this.toastCtrl.create({
          message: '¡Registro exitoso!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigate(['/home']);
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  // La función de Google que ya teníamos
 async loginWithGoogle() {
    const loading = await this.loadingCtrl.create({
      message: 'Vinculando con Google...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // 1. Llamamos al servicio (esto abre la ventana que ya te funciona)
      const user = await this.authService.loginWithGoogle();
      
      await loading.dismiss(); // Cerramos el "Cargando..."

      if (user) {
        // 2. Si Google nos dio los datos, mandamos el mensaje de éxito
        const toast = await this.toastCtrl.create({
          message: `¡Cuenta vinculada con éxito!`,
          duration: 2000,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        // 3. ¡ESTA ES LA LÍNEA CLAVE! Navegamos al Home
        console.log('Navegando al Home desde Registro...');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      await loading.dismiss();
      console.error('Error en el proceso de registro con Google:', error);
      
      const toast = await this.toastCtrl.create({
        message: 'Error al vincular con Google',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}