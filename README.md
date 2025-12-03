# Centro Pilates – Deploy y puesta en marcha

Este repositorio (https://drive.google.com/drive/u/1/folders/1dfNQVZDE9ZKQUyffa7xwTCokix3hze8D) contiene el panel administrativo y funciones serverless del Centro Pilates. Ahora podés clonar el proyecto directamente desde GitHub para instalar, configurar y desplegar en Netlify vía CLI.

## 1. Preparar el proyecto desde GitHub

1. Elegí el directorio donde querés trabajar (opcionalmente crealo):
   ```bash
   mkdir -p ~/proyectos && cd ~/proyectos
   ```
2. Cloná el repositorio (reemplazá la URL con la de tu fork si aplica):
   ```bash
   git clone https://github.com/tu-usuario/landing-pilates.git
   ```
3. Entrá al repo clonado (ajustá el nombre si lo renombraste):
   ```bash
   cd landing-pilates
   ```

## 2. Instalación de dependencias

1. Verificá que tenés Node.js (>= 16) y npm instalados:
   ```bash
   node -v
   npm -v
   ```
2. Instalá las dependencias del proyecto:
   ```bash
   npm install
   ```

## 3. Variables de entorno

1. Copiá `.env.example` (si no existe, creá `.env`) y completá con credentials de Google:
   ```
   GOOGLE_CLIENT_EMAIL=xxx@...iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   SHEET_ID=1cgDrcvvgOjrSU0-PQzf6...
   ```
2. Recordá que en Windows la clave necesita saltos de línea representados como `\n`.
3. Estas mismas variables deben configurarse en el Dashboard de Netlify:
   - Abrí https://app.netlify.com y entrá al sitio.
   - En *Site settings > Build & deploy > Environment*, agregá las tres variables con el mismo nombre y valor.
   - Guardá los cambios.

## 4. Login e instalación del CLI de Netlify

1. Instalá Netlify CLI (si no está):
   ```bash
   npm install -g netlify-cli
   ```
2. Logueate con tu cuenta:
   ```bash
   netlify login
   ```
   Se abrirá el navegador; una vez logueado, el CLI lo detectará automáticamente.

## 5. Desarrollo local

1. Ejecutá `netlify dev` para correr el panel (`public/admin.html`) y las funciones de Netlify:
   ```bash
   npm run dev
   ```
2. Visitá `http://localhost:8888/admin.html` y probá el flujo (crear/editar alumnos, instructores y horarios).  
3. Usá la consola del CLI para ver logs de funciones y arreglar errores en tiempo real.

## 6. Deploy vía Netlify CLI

1. Inicializá el sitio (solo la primera vez o si no está enlazado):
   ```bash
   netlify init
   ```
   Elegí el repositorio existente y el build command (este repo no tiene build step, podés dejar `npm run build` aunque diga "No build step") y el `publish directory` a `public`.
2. Para desplegar cambios:
   ```bash
   npm run build
   netlify deploy --prod
   ```
   Confirmá que el CLI use la carpeta `public` para publicar y que las funciones estén en `netlify/functions`.
3. Una vez deployado, podés abrir el sitio con:
   ```bash
   netlify open:site
   ```

## 7. Acceso para instructores

- El landing público (`public/index.html`) ahora incluye el formulario de login que usa `public/login.js`. Ese script valida usuarios guardados en `usuariosPermitidos` (principio de `dueño` para el admin y `instructor` para los paneles de instructor) y almacena el rol en `localStorage` bajo `landingPilatesSession`.
- Debido al control de sesión, podés agregar nuevos usuarios o cambiar contraseñas editando `public/login.js`; los instructores deben tener el campo `instructorId` para llegar al panel correcto (`tutor.html`), mientras que el rol `dueno` redirige a `admin.html`.
- La ruta `public/tutor.html` expone la plataforma del instructor con agenda, control de sueldos, panel de recuperaciones y un bloque de datos médicos. Todas las listas de alumnos se pueblan con `/.netlify/functions/alumnos-get`.
- Agenda: puede filtrarse por mes, crear citas (fecha, hora, sala, alumno) y liberar cupos. La información persiste con `agenda-get` y `agenda-set`, y cada tarjeta permite ver datos médicos del alumno o quitar el registro.
- Sueldos: `/.netlify/functions/sueldos-get` entrega resumen mensual con total recaudado, sueldo estimado y estado de pago (pagado/pendiente).
- Recuperaciones: se gestionan desde `recuperaciones-get`, `recuperaciones-create` y `recuperaciones-update`; podés solicitar recuperaciones, cambiar estados y consultar datos médicos vinculados al alumno.
- Para actualizar sesiones o salir, usá el botón de logout en cada panel que elimina `landingPilatesSession` y vuelve al landing.


