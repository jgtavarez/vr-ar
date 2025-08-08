/**
 * Explorador Espacial VR - Game Logic
 * Juego de exploración espacial en realidad virtual
 * Desarrollado con A-Frame y JavaScript
 */

class SpaceExplorerGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.gameState = 'intro'; // intro, playing, gameOver
        this.crystals = [];
        this.asteroids = [];
        this.particles = [];
        this.gameStarted = false;
        
        // Referencias a elementos DOM
        this.scene = null;
        this.camera = null;
        this.player = null;
        
        // Configuración del juego
        this.config = {
            maxCrystals: 15,
            maxAsteroids: 8,
            crystalValue: 10,
            levelUpScore: 100,
            asteroidDamage: 20,
            spawnDistance: 25,
            maxParticles: 30
        };
        
        this.init();
    }
    
    init() {
        // Esperar a que A-Frame esté listo
        document.addEventListener('DOMContentLoaded', () => {
            this.setupScene();
            this.setupEventListeners();
            this.setupComponents();
            this.createStarField();
        });
    }
    
    setupScene() {
        this.scene = document.querySelector('#vr-scene');
        this.camera = document.querySelector('#camera');
        this.player = document.querySelector('#player-rig');
        
        // Configurar física
        this.scene.addEventListener('loaded', () => {
            console.log('🚀 Explorador Espacial VR cargado');
            this.createInitialCrystals();
            this.createAsteroids();
            this.startAmbientAudio();
        });
    }
    
    setupEventListeners() {
        // Botones de la UI
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('enter-vr').addEventListener('click', () => {
            this.enterVR();
        });
        
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Eventos de VR
        this.scene.addEventListener('enter-vr', () => {
            document.body.classList.add('vr-mode');
            this.onEnterVR();
        });
        
        this.scene.addEventListener('exit-vr', () => {
            document.body.classList.remove('vr-mode');
            this.onExitVR();
        });
        
        // Eventos de interacción
        document.addEventListener('keydown', (event) => {
            this.handleKeyboard(event);
        });
    }
    
    setupComponents() {
        // Componente personalizado para cristales
        AFRAME.registerComponent('crystal', {
            schema: {
                value: { type: 'number', default: 10 }
            },
            init: function() {
                this.el.addEventListener('click', () => {
                    game.collectCrystal(this.el);
                });
                
                this.el.addEventListener('mouseenter', () => {
                    this.el.setAttribute('animation', 'property: scale; to: 1.2 1.2 1.2; dur: 200');
                });
                
                this.el.addEventListener('mouseleave', () => {
                    this.el.setAttribute('animation', 'property: scale; to: 1 1 1; dur: 200');
                });
                
                // Animación de flotación
                this.el.setAttribute('animation__rotation', {
                    property: 'rotation',
                    to: '0 360 0',
                    loop: true,
                    dur: 4000
                });
                
                this.el.setAttribute('animation__float', {
                    property: 'position',
                    to: `${this.el.getAttribute('position').x} ${this.el.getAttribute('position').y + 0.5} ${this.el.getAttribute('position').z}`,
                    dir: 'alternate',
                    loop: true,
                    dur: 2000
                });
            }
        });
        
        // Componente para asteroides
        AFRAME.registerComponent('asteroid', {
            schema: {
                damage: { type: 'number', default: 20 },
                speed: { type: 'number', default: 0.01 }
            },
            init: function() {
                this.el.addEventListener('collide', (event) => {
                    if (event.detail.body.el.id === 'player-rig') {
                        game.hitByAsteroid(this.data.damage);
                    }
                });
                
                // Rotación aleatoria
                this.el.setAttribute('animation__rotation', {
                    property: 'rotation',
                    to: `${Math.random() * 360} ${Math.random() * 360} ${Math.random() * 360}`,
                    loop: true,
                    dur: 3000 + Math.random() * 2000
                });
            },
            tick: function() {
                // Movimiento hacia el jugador
                const position = this.el.getAttribute('position');
                const playerPos = game.player.getAttribute('position');
                
                const dx = playerPos.x - position.x;
                const dy = playerPos.y - position.y;
                const dz = playerPos.z - position.z;
                
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance > 0.5) {
                    const speed = this.data.speed;
                    position.x += (dx / distance) * speed;
                    position.y += (dy / distance) * speed;
                    position.z += (dz / distance) * speed;
                    
                    this.el.setAttribute('position', position);
                }
            }
        });
        
        // Componente para efectos de partículas
        AFRAME.registerComponent('particle-system', {
            init: function() {
                this.particles = [];
                this.maxParticles = 20;
            },
            createParticle: function(position, color = '#00ff88') {
                const particle = document.createElement('a-sphere');
                particle.setAttribute('geometry', 'radius: 0.05');
                particle.setAttribute('material', `color: ${color}; emissive: ${color}; opacity: 0.8`);
                particle.setAttribute('position', position);
                
                // Animación de partícula
                particle.setAttribute('animation', {
                    property: 'position',
                    to: `${position.x + (Math.random() - 0.5) * 4} ${position.y + Math.random() * 3} ${position.z + (Math.random() - 0.5) * 4}`,
                    dur: 2000,
                    easing: 'easeOutQuad'
                });
                
                particle.setAttribute('animation__fade', {
                    property: 'material.opacity',
                    to: 0,
                    dur: 2000
                });
                
                this.el.appendChild(particle);
                
                // Remover después de la animación
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2100);
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.showScreen('game-ui');
        this.updateUI();
        this.gameStarted = true;
        
        // Iniciar el bucle de juego
        this.gameLoop();
        
        console.log('🎮 Juego iniciado');
    }
    
    enterVR() {
        if (this.scene.enterVR) {
            this.scene.enterVR();
        }
        this.startGame();
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        // Verificar nivel
        this.checkLevelUp();
        
        // Generar nuevos cristales si es necesario
        if (this.crystals.length < this.config.maxCrystals) {
            this.createCrystal();
        }
        
        // Generar asteroides
        if (Math.random() < 0.02) { // 2% de probabilidad por frame
            this.createAsteroid();
        }
        
        // Limpiar asteroides lejanos
        this.cleanupAsteroids();
        
        // Continuar el bucle
        setTimeout(() => this.gameLoop(), 100);
    }
    
    createInitialCrystals() {
        for (let i = 0; i < this.config.maxCrystals; i++) {
            this.createCrystal();
        }
    }
    
    createCrystal() {
        const crystal = document.createElement('a-octahedron');
        const position = this.getRandomPosition();
        
        crystal.setAttribute('geometry', 'radius: 0.3');
        crystal.setAttribute('material', 'color: #00ff88; emissive: #004422; metalness: 0.8');
        crystal.setAttribute('position', position);
        crystal.setAttribute('crystal', 'value: 10');
        crystal.classList.add('interactive');
        
        // Hacer el cristal físico
        crystal.setAttribute('body', 'type: static');
        crystal.setAttribute('geometry', 'primitive: octahedron; radius: 0.3');
        
        document.getElementById('crystals').appendChild(crystal);
        this.crystals.push(crystal);
    }
    
    createAsteroids() {
        for (let i = 0; i < this.config.maxAsteroids; i++) {
            this.createAsteroid();
        }
    }
    
    createAsteroid() {
        const asteroid = document.createElement('a-dodecahedron');
        const position = this.getRandomPosition(true);
        const size = 0.5 + Math.random() * 1;
        
        asteroid.setAttribute('geometry', `radius: ${size}`);
        asteroid.setAttribute('material', 'color: #8B4513; roughness: 0.8');
        asteroid.setAttribute('position', position);
        asteroid.setAttribute('asteroid', `damage: ${this.config.asteroidDamage}; speed: ${0.005 + Math.random() * 0.01}`);
        
        // Física
        asteroid.setAttribute('body', 'type: dynamic; mass: 1');
        asteroid.setAttribute('geometry', `primitive: sphere; radius: ${size}`);
        
        document.getElementById('asteroids').appendChild(asteroid);
        this.asteroids.push(asteroid);
    }
    
    getRandomPosition(farAway = false) {
        const distance = farAway ? this.config.spawnDistance : 15;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 10;
        
        return {
            x: Math.cos(angle) * distance,
            y: height,
            z: Math.sin(angle) * distance
        };
    }
    
    collectCrystal(crystalEl) {
        // Incrementar puntuación
        this.score += this.config.crystalValue;
        
        // Efecto de partículas
        const position = crystalEl.getAttribute('position');
        this.createParticleEffect(position, '#00ff88');
        
        // Sonido
        this.playSound('crystal-sound');
        
        // Remover cristal
        crystalEl.parentNode.removeChild(crystalEl);
        this.crystals = this.crystals.filter(c => c !== crystalEl);
        
        // Actualizar UI
        this.updateUI();
        
        console.log(`💎 Cristal recolectado! Puntuación: ${this.score}`);
    }
    
    hitByAsteroid(damage) {
        this.health -= damage;
        
        // Efecto visual
        this.createScreenFlash('#ff0000');
        
        // Sonido
        this.playSound('explosion-sound');
        
        if (this.health <= 0) {
            this.gameOver();
        }
        
        this.updateUI();
        console.log(`💥 Golpeado por asteroide! Salud: ${this.health}`);
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.score / this.config.levelUpScore) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.onLevelUp();
        }
    }
    
    onLevelUp() {
        console.log(`🆙 ¡Nivel ${this.level}!`);
        
        // Aumentar dificultad
        this.config.maxAsteroids += 2;
        
        // Efecto visual
        this.createParticleEffect(this.player.getAttribute('position'), '#4CC3D9');
        
        // Restaurar algo de salud
        this.health = Math.min(100, this.health + 20);
        
        this.updateUI();
    }
    
    createParticleEffect(position, color = '#00ff88') {
        const effectsContainer = document.getElementById('effects');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const particle = document.createElement('a-sphere');
                particle.setAttribute('geometry', 'radius: 0.05');
                particle.setAttribute('material', `color: ${color}; emissive: ${color}`);
                particle.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
                
                const targetPos = {
                    x: position.x + (Math.random() - 0.5) * 4,
                    y: position.y + Math.random() * 3,
                    z: position.z + (Math.random() - 0.5) * 4
                };
                
                particle.setAttribute('animation', {
                    property: 'position',
                    to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
                    dur: 1500,
                    easing: 'easeOutQuad'
                });
                
                particle.setAttribute('animation__fade', {
                    property: 'material.opacity',
                    to: 0,
                    dur: 1500
                });
                
                effectsContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1600);
            }, i * 50);
        }
    }
    
    createScreenFlash(color) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color;
        flash.style.opacity = '0.5';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s';
            flash.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(flash);
            }, 500);
        }, 100);
    }
    
    createStarField() {
        const starsContainer = document.getElementById('stars');
        
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('a-sphere');
            star.setAttribute('geometry', 'radius: 0.02');
            star.setAttribute('material', 'color: #ffffff; emissive: #ffffff');
            
            const distance = 40 + Math.random() * 60;
            const angle1 = Math.random() * Math.PI * 2;
            const angle2 = Math.random() * Math.PI;
            
            const x = distance * Math.sin(angle2) * Math.cos(angle1);
            const y = distance * Math.cos(angle2);
            const z = distance * Math.sin(angle2) * Math.sin(angle1);
            
            star.setAttribute('position', `${x} ${y} ${z}`);
            
            // Animación de parpadeo
            if (Math.random() < 0.3) {
                star.setAttribute('animation', {
                    property: 'material.opacity',
                    to: 0.3,
                    dir: 'alternate',
                    loop: true,
                    dur: 1000 + Math.random() * 2000
                });
            }
            
            starsContainer.appendChild(star);
        }
    }
    
    cleanupAsteroids() {
        this.asteroids = this.asteroids.filter(asteroid => {
            const position = asteroid.getAttribute('position');
            const playerPos = this.player.getAttribute('position');
            
            const distance = Math.sqrt(
                Math.pow(position.x - playerPos.x, 2) +
                Math.pow(position.y - playerPos.y, 2) +
                Math.pow(position.z - playerPos.z, 2)
            );
            
            if (distance > 50) {
                asteroid.parentNode.removeChild(asteroid);
                return false;
            }
            return true;
        });
    }
    
    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Error playing sound:', e));
        }
    }
    
    startAmbientAudio() {
        const ambient = document.getElementById('ambient-space');
        if (ambient) {
            ambient.loop = true;
            ambient.volume = 0.3;
            ambient.play().catch(e => console.log('Error playing ambient sound:', e));
        }
    }
    
    updateUI() {
        document.getElementById('score-value').textContent = this.score;
        document.getElementById('level-value').textContent = this.level;
        document.getElementById('health-value').textContent = this.health;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('final-score').textContent = this.score;
        this.showScreen('game-over');
        
        console.log(`🎯 Juego terminado! Puntuación final: ${this.score}`);
    }
    
    restartGame() {
        // Resetear variables
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.gameState = 'intro';
        
        // Limpiar elementos
        this.clearGameElements();
        
        // Resetear configuración
        this.config.maxAsteroids = 8;
        
        // Volver a la pantalla de inicio
        this.showScreen('intro-screen');
        
        // Recrear elementos iniciales
        setTimeout(() => {
            this.createInitialCrystals();
            this.createAsteroids();
        }, 500);
    }
    
    clearGameElements() {
        // Limpiar cristales
        document.getElementById('crystals').innerHTML = '';
        this.crystals = [];
        
        // Limpiar asteroides
        document.getElementById('asteroids').innerHTML = '';
        this.asteroids = [];
        
        // Limpiar efectos
        document.getElementById('effects').innerHTML = '';
    }
    
    handleKeyboard(event) {
        if (!this.gameStarted) return;
        
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                // Acción especial (ej: boost)
                break;
            case 'KeyR':
                this.restartGame();
                break;
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.showScreen('intro-screen');
                    this.gameState = 'intro';
                }
                break;
        }
    }
    
    onEnterVR() {
        console.log('🥽 Modo VR activado');
        // Ajustes específicos para VR
    }
    
    onExitVR() {
        console.log('🖥️ Modo VR desactivado');
        // Ajustes para modo desktop
    }
}

// Inicializar el juego
const game = new SpaceExplorerGame();

// Funciones de utilidad globales
window.game = game;

// Debug en consola
console.log(`
🚀 Explorador Espacial VR
==========================================
Comandos de debug:
- game.score = X        (cambiar puntuación)
- game.health = X       (cambiar salud)
- game.level = X        (cambiar nivel)
- game.restartGame()    (reiniciar)
==========================================
`);