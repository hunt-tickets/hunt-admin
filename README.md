# Hunt Admin Panel

Panel de administración moderno para eventos de Hunt Tickets, construido con las últimas tecnologías y optimizado para rendimiento y eficiencia de costos.

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router y Turbopack
- **React 19** - Última versión con React Compiler
- **TypeScript** - Tipado estático completo
- **Tailwind CSS v4** - Estilos utilitarios sin configuración
- **shadcn/ui** - Componentes UI accesibles y customizables
- **Source Sans 3** - Tipografía variable de Adobe

## ✨ Características

- **🎨 Diseño Hunt Tickets**: Sistema de diseño con glassmorphism y gradientes animados
- **📱 Responsive**: Optimizado para todos los dispositivos
- **⚡ Alto Rendimiento**: Turbopack, optimizaciones de Next.js 15
- **🔒 Seguro**: Headers de seguridad y mejores prácticas
- **💰 Eficiencia de Costos**: Optimizaciones para reducir recursos

## 🏗️ Páginas del Panel

- **📊 Dashboard**: Vista general con métricas clave
- **📅 Eventos**: Gestión completa de eventos y tickets
- **📈 Reportes**: Analytics y métricas detalladas
- **👥 Clientes**: Base de datos de usuarios
- **📢 Campañas**: Marketing y promociones
- **🤝 Equipo**: Gestión de miembros y permisos

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con Turbopack)
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver el resultado.

## 🎨 Sistema de Diseño Hunt

### Paleta de Colores
- **Base**: `#0a0a0a` (Fondo principal oscuro)
- **Secundarios**: `#151515`, `#202020`, `#2a2a2a`
- **Texto**: `#ffffff`, `#b8b8b8`, `#808080`
- **Gradientes**: `#ff6b6b`, `#4ecdc4`, `#45b7d1`, `#96ceb4`, `#ffeaa7`, `#fd79a8`

### Efectos Visuales
- **Glassmorphism**: `backdrop-filter: blur(25px)` con transparencias
- **Animaciones**: Gradientes dinámicos con `8s ease infinite`
- **Hover Effects**: `translateY(-2px)` con sombras expandidas
- **Border Radius**: Consistente `12px` para cards, `16px` para formularios

## 📁 Estructura

```
src/
├── app/                 # App Router (Next.js 15)
│   ├── eventos/        # Gestión de eventos
│   ├── reportes/       # Analytics
│   ├── clientes/       # CRM
│   ├── campanas/       # Marketing
│   ├── equipo/         # Team management
│   └── layout.tsx      # Layout con sidebar
├── components/
│   ├── ui/             # shadcn/ui components
│   └── app-sidebar.tsx # Navegación principal
└── lib/
    └── utils.ts        # Utilidades
```

## ⚡ Optimizaciones

### Next.js 15 Features
- **Turbopack**: Compilación ultra-rápida
- **Static Route Indicator**: Identificación visual de rutas
- **Package Optimization**: Tree-shaking automático
- **React Compiler**: Optimizaciones automáticas

### Performance
- **Font Optimization**: Source Sans 3 variable con `display: swap`
- **Image Optimization**: AVIF y WebP automático
- **Bundle Analysis**: Herramientas de análisis incluidas
- **Compression**: Gzip/Brotli habilitado

## 🔧 Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=https://api.hunt-tickets.com
```

### Personalización
Los colores se pueden modificar en `src/app/globals.css`:
```css
:root {
  --background: #0a0a0a;
  --foreground: #ffffff;
}
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
vercel --prod
```

El proyecto está optimizado para deploy en [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

**Hunt Admin Panel** - Gestión moderna de eventos con tecnología de vanguardia 🎯
