# 🚀 Explorador Espacial VR

Un juego inmersivo de exploración espacial desarrollado en **Realidad Virtual** usando **A-Frame** y **JavaScript**. Embárcate en una aventura épica a través del cosmos, recolecta cristales espaciales y evita asteroides peligrosos.

![Explorador Espacial VR](https://img.shields.io/badge/VR-Ready-blue?style=for-the-badge)
![A-Frame](https://img.shields.io/badge/A--Frame-1.4.0-red?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge)

## 🌟 Características

### 🎮 Gameplay
- **Exploración espacial inmersiva** en primera persona
- **Recolección de cristales** para ganar puntos
- **Sistema de niveles** progresivo
- **Asteroides dinámicos** que representan desafíos
- **Sistema de salud** y energía
- **Efectos de partículas** y visuales impresionantes

### 🥽 Compatibilidad VR/AR
- **WebXR compatible** - funciona en navegadores modernos
- **Oculus Quest/Quest 2** - experiencia VR completa
- **HTC Vive** - soporte nativo
- **Modo desktop** - jugable con ratón y teclado
- **Mobile VR** - compatible con dispositivos móviles

### 🎨 Características Técnicas
- **A-Frame 1.4.0** - framework VR líder
- **Física realista** con Ammo.js
- **Audio espacial** inmersivo
- **Responsive design** - adaptable a cualquier dispositivo
- **Optimizado para web** - carga rápida
- **PWA ready** - instalable como app

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 14+ (recomendado 18+)
- Navegador moderno con soporte WebXR
- (Opcional) Casco VR para experiencia completa

### Instalación Local

```bash

# Instalar dependencias (opcional para desarrollo)
npm install

# Ejecutar servidor local
npm run dev
# o alternativamente
npx serve .

# Abrir en navegador
# http://localhost:3000
```

### Despliegue en Vercel

#### Opción 1: Despliegue Automático
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/usuario/explorador-espacial-vr)

#### Opción 2: CLI de Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Desplegar
vercel --prod
```

#### Opción 3: Conectar Repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el proyecto:
   - **Build Command:** `echo "No build needed"`
   - **Output Directory:** `./`
   - **Install Command:** `npm install` (opcional)

## 🎮 Cómo Jugar

### Controles Desktop
- **Ratón:** Mirar alrededor
- **WASD:** Moverse
- **Click:** Interactuar con objetos
- **R:** Reiniciar juego
- **Escape:** Volver al menú

### Controles VR
- **Controladores VR:** Apuntar e interactuar
- **Movimiento de cabeza:** Mirar alrededor
- **Gatillo:** Seleccionar objetos
- **Joystick:** Movimiento (si está disponible)

### Controles Móviles
- **Touch:** Mirar alrededor
- **Tap:** Interactuar
- **Giroscopio:** Movimiento de cabeza (si está habilitado)

### Objetivos del Juego
1. **Recolecta cristales espaciales** 💎 - Cada cristal vale 10 puntos
2. **Evita los asteroides** ☄️ - Causan 20 puntos de daño
3. **Sube de nivel** 🆙 - Cada 100 puntos = nuevo nivel
4. **Sobrevive** ❤️ - Mantén tu energía por encima de 0

## 🛠️ Estructura del Proyecto

```
explorador-espacial-vr/
├── index.html          # Página principal con escena A-Frame
├── styles.css          # Estilos CSS y responsive design
├── game.js             # Lógica principal del juego
├── package.json        # Configuración del proyecto
├── vercel.json         # Configuración de despliegue
└── README.md           # Documentación
```

### Arquitectura del Código

#### `index.html`
- **Configuración A-Frame:** Escena VR principal
- **Assets:** Texturas, sonidos y recursos
- **Entidades:** Planetas, cristales, asteroides
- **UI Overlay:** Menús e interfaz de usuario

#### `game.js`
- **Clase SpaceExplorerGame:** Lógica principal
- **Componentes A-Frame:** Crystal, Asteroid, Particle System
- **Sistema de puntuación:** Score, niveles, salud
- **Gestión de eventos:** VR, teclado, ratón

#### `styles.css`
- **UI responsiva:** Menús adaptativos
- **Efectos visuales:** Animaciones y transiciones
- **Tema espacial:** Colores y gradientes cósmicos
- **Accesibilidad:** Soporte para motion reduction

## 🎨 Personalización

### Modificar Dificultad
```javascript
// En game.js, ajusta estos valores:
this.config = {
    maxCrystals: 15,        // Número máximo de cristales
    maxAsteroids: 8,        // Número máximo de asteroides
    crystalValue: 10,       // Puntos por cristal
    levelUpScore: 100,      // Puntos para subir nivel
    asteroidDamage: 20,     // Daño por asteroide
    spawnDistance: 25,      // Distancia de aparición
    maxParticles: 30        // Máximo de partículas
};
```

### Añadir Nuevos Planetas
```html
<!-- En index.html, dentro de <a-entity id="planets"> -->
<a-sphere
    id="venus"
    geometry="radius: 1.8"
    material="color: #FFC649"
    position="15 3 -12"
    animation="property: rotation; to: 0 360 0; loop: true; dur: 18000"
    class="planet interactive">
</a-sphere>
```

### Cambiar Colores y Tema
```css
/* En styles.css, modifica las variables CSS */
:root {
    --primary-color: #00ff88;    /* Verde espacial */
    --secondary-color: #4CC3D9;  /* Azul cósmico */
    --danger-color: #ff4757;     /* Rojo peligro */
    --bg-gradient: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
}
```

## 🔧 Características Técnicas Avanzadas

### Optimizaciones de Rendimiento
- **LOD (Level of Detail):** Objetos distantes se renderizan con menor detalle
- **Frustum Culling:** Solo se renderizan objetos visibles
- **Particle Pooling:** Reutilización de efectos de partículas
- **Lazy Loading:** Carga progresiva de assets

### Compatibilidad WebXR
```javascript
// Detección automática de capacidades VR
if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
            // Habilitar características VR avanzadas
        }
    });
}
```

### Física Realista
- **Colisiones:** Detección precisa entre objetos
- **Gravedad:** Simulación de fuerzas espaciales
- **Momentum:** Inercia y movimiento realista

## 🎵 Assets y Recursos

### Audio
- **Sonido ambiente:** Música espacial atmosférica
- **Efectos sonoros:** Recolección, explosiones, interacciones
- **Audio 3D:** Sonido posicional en VR

### Texturas
- **Planetas:** Imágenes HD de la NASA
- **Espacio:** Nebulosas y campos estelares
- **Materiales:** Metales y cristales realistas

### Modelos 3D
- **Primitivas A-Frame:** Esferas, octaedros, dodecaedros
- **Geometría procedural:** Asteroides generados algorítmicamente

## 📱 Soporte Móvil y Responsivo

### Mobile VR
- **Google Cardboard:** Soporte completo
- **Gear VR:** Compatible
- **Daydream:** Funcional

### Responsive Design
- **Desktop:** 1920x1080+ resolución completa
- **Tablet:** 768px+ interfaz adaptada
- **Mobile:** 320px+ experiencia optimizada

## 🔒 Seguridad y Privacidad

### Headers de Seguridad
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Permisos
- **No requiere micrófono** (opcional para VR voice commands)
- **No requiere cámara** (opcional para AR features)
- **No requiere geolocalización**
- **No almacena datos personales**

## 🚀 Próximas Características

### Roadmap v2.0
- [ ] **Multijugador:** Exploración cooperativa
- [ ] **Más planetas:** Sistema solar completo
- [ ] **Missions:** Objetivos específicos
- [ ] **Power-ups:** Mejoras temporales
- [ ] **Leaderboard:** Tabla de puntuaciones
- [ ] **AR Mode:** Realidad aumentada

### Roadmap v3.0
- [ ] **Construcción:** Construir bases espaciales
- [ ] **Comercio:** Sistema económico
- [ ] **Exploración:** Galaxias procedurales
- [ ] **Naves:** Diferentes tipos de vehículos

## 🤝 Contribuir

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. **Commit** tus cambios (`git commit -am 'Añadir nueva característica'`)
4. **Push** a la rama (`git push origin feature/nueva-caracteristica`)
5. **Crea** un Pull Request

### Guidelines
- **Código limpio:** Sigue las convenciones de JavaScript
- **Comentarios:** Documenta funciones complejas
- **Testing:** Prueba en múltiples dispositivos
- **Performance:** Mantén 60 FPS en VR

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto y Soporte

- **Developer:** Juan Gabriel Tavarez Lopez
- **Email:** [tu-email@universidad.edu]
- **Universidad:** UTESA
- **Proyecto:** Desarrollo VR/AR

### Reportar Bugs
Si encuentras algún problema:
1. Revisa los [issues existentes](../../issues)
2. Crea un [nuevo issue](../../issues/new) con:
   - Descripción del problema
   - Pasos para reproducir
   - Dispositivo y navegador
   - Capturas de pantalla

---

**¡Disfruta explorando el cosmos en VR! 🌌🚀**

*Desarrollado con ❤️ para la comunidad VR/AR*# vr-ar
