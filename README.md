# ATELIER

E-commerce de ropa con frontend estático y backend Node.js/Express + MongoDB.

## Qué incluye
- **Frontend** estático en `frontend/`.
- **Backend** API REST en `backend/`.
- **Config pública sincronizada** desde `backend/.env` hacia `frontend/js/config.js`.
- **Tests mínimos** de backend y frontend.
- **ESLint** y **CI básica** con GitHub Actions.

## Estructura del proyecto
```text
.
├── .github/workflows/ci.yml
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── scripts/
│   ├── src/
│   └── test/
├── frontend/
│   ├── *.html
│   ├── css/
│   └── js/
└── readme.md
```

## Decisiones de arquitectura
- La **única raíz npm real** es `backend/`.
- El frontend **no usa npm**: se sirve como sitio estático.
- `frontend/js/config.js` está **versionado a propósito** para que el frontend funcione apenas abrís el proyecto, pero su **fuente de verdad** sigue siendo `backend/.env`.

## Requisitos
- Node.js **20 o superior**
- MongoDB local o remoto
- Un servidor estático para `frontend/` (por ejemplo Live Server)

## Instalación local
### 1) Configurar variables de entorno
Copiá el archivo de ejemplo:

```bash
cd backend
cp .env.example .env
```

En Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

### 2) Instalar dependencias
```bash
cd backend
npm install
```

### 3) Sincronizar la config pública del frontend
```bash
npm run config:frontend
```

### 4) Cargar productos de ejemplo
```bash
npm run seed
```

### 5) Levantar el backend
```bash
npm run dev
```

### 6) Servir el frontend
Abrí la carpeta `frontend/` con Live Server o cualquier servidor estático.

## Scripts disponibles
Ejecutar siempre dentro de `backend/`.

- `npm run config:frontend` genera `frontend/js/config.js`.
- `npm run dev` sincroniza config y levanta la API con watch.
- `npm run start` sincroniza config y levanta la API en modo normal.
- `npm run seed` sincroniza config y carga productos de ejemplo.
- `npm run test` corre tests de backend.
- `npm run test:frontend` corre tests de frontend.
- `npm run test:all` corre backend + frontend.
- `npm run lint` ejecuta ESLint sobre backend y módulos del frontend.
- `npm run check` corre tests + lint.

## Variables de entorno
Archivo: `backend/.env`

```env
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/ropa_store
CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
FRONTEND_API_BASE_URL=http://localhost:8080/api
FRONTEND_WHATSAPP_NUMBER=5491112345678
APP_PUBLIC_URL=http://localhost:8080
```

### Variables usadas
- `NODE_ENV`: entorno de ejecución.
- `PORT`: puerto del backend.
- `MONGO_URI`: conexión a MongoDB.
- `CORS_ORIGIN`: orígenes permitidos separados por coma.
- `FRONTEND_API_BASE_URL`: base URL consumida por el frontend.
- `FRONTEND_WHATSAPP_NUMBER`: número de WhatsApp público.
- `APP_PUBLIC_URL`: URL pública del backend o del despliegue.

## API disponible
### Salud
- `GET /`

### Productos
- `GET /api/products`
- `GET /api/products/:id`

### Categorías
- `GET /api/categories`

### Contacto
- `POST /api/contact`

## Calidad
### Tests
```bash
cd backend
npm run test:all
```

### Lint
```bash
cd backend
npm run lint
```

### Todo junto
```bash
cd backend
npm run check
```

## Qué conviene versionar y qué no
### Sí conviene versionar
- `backend/package-lock.json`
- `frontend/js/config.js` (en esta estrategia)
- `.github/workflows/ci.yml`

### No conviene versionar
- `backend/node_modules/`
- `backend/.env`
- configuraciones personales del editor (`.vscode/`, `.idea/`)

## Limpieza aplicada al proyecto
En esta versión ya se eliminaron archivos redundantes o problemáticos:
- `node_modules/`
- `backend/.env`
- `package.json` y `package-lock.json` en la raíz
- `eslint.config.js` en la raíz
- `backend/.gitignore` duplicado
- `frontend/js/script.js` sin uso
- `.vscode/`

## Posibles mejoras futuras
- agregar autenticación/admin si querés volver a exponer lectura de contactos
- ampliar cobertura de tests
- sumar tests E2E
- agregar deploy automatizado
