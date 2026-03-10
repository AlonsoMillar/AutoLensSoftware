import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'autolens_session';

  constructor() {
    // Inicializamos el plugin con tu ID de cliente
    this.initializeApp();
  }

  async initializeApp() {
    await GoogleAuth.initialize({
      clientId: '878983344319-8foqajj5ud3v7os23ckvheok6ltdb6me.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }

  // ==========================================
  // 1. LÓGICA LOCAL (SQLite + LocalStorage)
  // ==========================================

  async registerLocal(nombre: string, email: string, password: string): Promise<boolean> {
    const sessionData = { nombre, email, provider: 'local' };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    return true; 
  }

  async loginLocal(email: string, password: string): Promise<boolean> {
    // Aquí luego implementaremos la validación real contra SQLite
    const sessionData = { email, provider: 'local' };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    return true; 
  }

  // ==========================================
  // 2. LÓGICA CON API DE GOOGLE (CORREGIDA)
  // ==========================================

  async loginWithGoogle(): Promise<any> {
    try {
      console.log('Iniciando motores para la API de Google...');
      
      // 1. Llamamos a la ventana de Google
      const googleUser = await GoogleAuth.signIn();
      console.log('Datos brutos recibidos:', googleUser);

      // 2. Estructuramos los datos usando los campos que TS reconoce
      // Usamos el operador || para asegurar que siempre tengamos un nombre
      const sessionData = {
        nombre: googleUser.name || `${googleUser.givenName} ${googleUser.familyName}`,
        email: googleUser.email,
        foto: googleUser.imageUrl,
        provider: 'google',
        token: googleUser.authentication.idToken
      };

      // 3. Guardamos en LocalStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));

      return sessionData;

    } catch (error) {
      console.error('Error detallado en el servicio:', error);
      throw error; 
    }
  }

  // ==========================================
  // 3. UTILIDADES GENERALES
  // ==========================================

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  async logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    try {
      await GoogleAuth.signOut();
    } catch (e) {
      console.log('Ya estaba deslogueado de Google');
    }
  }
}