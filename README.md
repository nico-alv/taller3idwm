# Taller N°3 - MobileHub

[![Image from Gyazo](https://i.gyazo.com/864ab76610f86adcb95f9c32eeb35184.gif)](https://gyazo.com/864ab76610f86adcb95f9c32eeb35184)

Solución para el tercer taller de la asignatura de introducción al desarrollo web móvil en la cual se pide realizar un sistema de gestión de codigo para cuentas del dominio de la universidad.
- Documentado con swagger para el backend y JSDoc para el frontend mobile.

----

### Dependencias

1. [XAMPP](https://sourceforge.net/projects/xampp/)

2. [Composer](https://getcomposer.org)

3. [Node.js](https://nodejs.org/en)

4. [Git](https://git-scm.com/downloads)

> [!WARNING]
> Se debe tener cuidado de instalar composer después de XAMPP ya que este último es responsable de la instalación de PHP.

### Levantando el proyecto
- Clona el repositorio a tu máquina local.
- Iniciar Apache y MySQL en el panel de control de XAMPP.
- Abrir http://localhost/phpmyadmin/ y crear nueva base de datos.
- Abrir una terminal dentro de la carpeta raíz del proyecto. 

### Backend

Entra al directorio del backend, copia el archivo .env.example.
```bash
cd .\backend\ 
```
```bash
copy .env.example .env 
```
Dentro de este archivo configurar el puerto, nombre, usuario y contraseña de la base de datos creada previamente.
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taller3
DB_USERNAME=root
DB_PASSWORD=
```
Instalar las dependencias de composer.json.
```bash
composer install
```
```bash
php artisan key:generate
```
Generar la llave con la que se cifrarán los tokens.
```bash
php artisan jwt:secret
```
Ejecutar migraciones y seeders.
```bash
php artisan migrate:fresh --seed
```
Arrancar el backend.

```bash
php artisan serve --host=0.0.0.0 --port=8000
```
> [!WARNING]
> Se debe reemplazar 0.0.0.0 por la dirección de IP local, la cual se puede ver con el comando ipconfig.
#### Frontend mobile
Luego, abrir otra terminal en la raiz del proyecto y ejecutar:
```bash
cd .\mobile\
```
Instalar dependencias guardadas en package.json.
```bash
npm install
```
Copiar el archivo .env.example y reemplazar con 0.0.0.0 por la IP local del backend de laravel y token por la API Key de Github.
```bash
copy .env.example .env 
```
```
API_URL=http://0.0.0.0:8000
GITHUB_API_KEY=token
```
Arrancar el frontend.
```bash
npm start
```
Escanear el QR o apretar la tecla **A** para abrir Android studio.

----

#### Uso
- Para entrar al frontend utiliza Android Studio o la aplicación de Expo Go.
- Para probar la API separadamente, puedes utilizar Postman o herramientas similares.

