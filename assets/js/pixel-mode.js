// ==========================================================================
// Kawaii Pixel Art Auto-Initialization
// ==========================================================================

/**
 * Kawaii Pixel Art Manager
 * Automatically applies kawaii pixel art styling to the page
 */
class KawaiiPixelArt {
    constructor() {
        this.initialize();
    }

    /**
     * Initialize kawaii pixel art system
     */
    initialize() {
        // Show welcome progress
        this.showWelcomeProgress();
        
        // Apply kawaii pixel styling immediately
        this.applyKawaiiStyling();
        
        // Add decorative elements
        this.addDecorativeElements();
        
        // Setup observers for dynamic content
        this.observeForNewElements();
        
        // Add special effects
        this.addSpecialEffects();
        
        console.log('🎮🌸 Kawaii Pixel Art Mode activated!');
    }

    /**
     * Show kawaii welcome progress
     */
    showWelcomeProgress() {
        const welcomeBar = document.getElementById('kawaiiWelcome');
        if (!welcomeBar) return;

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5; // Random progress between 5-20%
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Hide welcome bar after completion
                setTimeout(() => {
                    welcomeBar.style.animation = 'kawaii-notification-slide 0.5s ease-in reverse';
                    setTimeout(() => {
                        if (welcomeBar.parentNode) {
                            welcomeBar.remove();
                        }
                    }, 500);
                }, 1000);
            }
            
            welcomeBar.style.setProperty('--progress', `${progress}%`);
            
            // Update text based on progress
            if (progress < 30) {
                welcomeBar.setAttribute('data-text', 'Inicializando Kawaii Mode');
            } else if (progress < 60) {
                welcomeBar.setAttribute('data-text', 'Cargando Pixel Art');
            } else if (progress < 90) {
                welcomeBar.setAttribute('data-text', 'Agregando Sparkles');
            } else {
                welcomeBar.setAttribute('data-text', 'Kawaii Mode Listo!');
            }
            
        }, 100);
    }

    /**
     * Apply kawaii pixel styling to page elements
     */
    applyKawaiiStyling() {
        // Header styling
        const header = document.querySelector('.header');
        if (header) {
            header.classList.add('pixel-header', 'kawaii-tooltip');
            header.setAttribute('data-tooltip', '💖 Sistema Kawaii Pixel Art 💖');
        }

        // Controls styling
        const controls = document.querySelector('.controls');
        if (controls) {
            controls.classList.add('pixel-bg-pattern');
        }

        // Button styling
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach((btn, index) => {
            btn.classList.add('kawaii-tooltip');
            btn.setAttribute('data-tooltip', `✨ ${btn.textContent.trim()} ✨`);
            
            // Add loading animation on click
            btn.addEventListener('click', () => {
                this.addLoadingEffect(btn);
            });
        });

        // Input styling with placeholder enhancement
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.addSparkleEffect(input);
            });
        });

        // Stat cards with hover effects
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.classList.add('kawaii-tooltip');
            card.setAttribute('data-tooltip', '🌟 Estadística Kawaii 🌟');
            
            // Add individual animations
            card.style.animationDelay = `${index * 0.2}s`;
            
            // Add click effect
            card.addEventListener('click', () => {
                this.addClickEffect(card);
            });
        });

        // Table enhancements
        const table = document.querySelector('.table');
        if (table) {
            this.enhanceTable(table);
        }

        // Add special styling to form elements when they appear
        this.enhanceFormElements();
    }

    /**
     * Add decorative floating elements
     */
    addDecorativeElements() {
        const decorations = ['🌸', '💖', '✨', '🎀', '🌙', '⭐', '🦋', '🌈'];
        
        decorations.forEach((decoration, index) => {
            const element = document.createElement('div');
            element.className = 'kawaii-decoration';
            element.textContent = decoration;
            element.style.cssText = `
                position: fixed;
                z-index: -1;
                pointer-events: none;
                font-size: ${16 + Math.random() * 8}px;
                animation-delay: ${index * 0.5}s;
            `;
            
            // Random positioning
            const positions = [
                { top: '10%', left: '5%' },
                { top: '20%', right: '10%' },
                { top: '40%', left: '3%' },
                { top: '60%', right: '7%' },
                { bottom: '30%', left: '8%' },
                { bottom: '15%', right: '12%' },
                { top: '70%', left: '15%' },
                { top: '30%', right: '15%' }
            ];
            
            const pos = positions[index] || { top: '50%', left: '50%' };
            Object.assign(element.style, pos);
            
            document.body.appendChild(element);
        });
    }

    /**
     * Add special effects to the page
     */
    addSpecialEffects() {
        // Add floating hearts effect
        this.createFloatingHearts();
        
        // Add sparkle trail for mouse
        this.addMouseSparkles();
        
        // Add periodic kawaii notifications
        this.addPeriodicKawaiiMessages();
    }

    /**
     * Create floating hearts effect
     */
    createFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.textContent = ['💖', '💕', '💜', '💙', '💚', '💛'][Math.floor(Math.random() * 6)];
            heart.style.cssText = `
                position: fixed;
                bottom: -50px;
                left: ${Math.random() * 100}%;
                font-size: ${16 + Math.random() * 12}px;
                z-index: -1;
                pointer-events: none;
                animation: kawaii-float-up 6s linear forwards;
                filter: drop-shadow(1px 1px 0 #8E44AD);
            `;
            
            // Add floating animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes kawaii-float-up {
                    0% { 
                        transform: translateY(0) rotate(0deg) scale(0.5);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(-20vh) rotate(45deg) scale(1);
                    }
                    80% {
                        opacity: 1;
                        transform: translateY(-80vh) rotate(315deg) scale(0.8);
                    }
                    100% { 
                        transform: translateY(-100vh) rotate(360deg) scale(0);
                        opacity: 0;
                    }
                }
            `;
            
            if (!document.querySelector('#kawaii-float-up-style')) {
                style.id = 'kawaii-float-up-style';
                document.head.appendChild(style);
            }
            
            document.body.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 6000);
            
        }, 3000); // Create new heart every 3 seconds
    }

    /**
     * Add mouse sparkle trail
     */
    addMouseSparkles() {
        let sparkleTimer = 0;
        
        document.addEventListener('mousemove', (e) => {
            sparkleTimer++;
            if (sparkleTimer % 5 !== 0) return; // Throttle sparkles
            
            const sparkle = document.createElement('div');
            sparkle.textContent = ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${e.clientX - 10}px;
                top: ${e.clientY - 10}px;
                font-size: 12px;
                z-index: 999;
                pointer-events: none;
                animation: kawaii-sparkle-fade 1s ease-out forwards;
                filter: drop-shadow(1px 1px 0 #8E44AD);
            `;
            
            // Add sparkle animation if not exists
            if (!document.querySelector('#kawaii-sparkle-fade-style')) {
                const style = document.createElement('style');
                style.id = 'kawaii-sparkle-fade-style';
                style.textContent = `
                    @keyframes kawaii-sparkle-fade {
                        0% { 
                            transform: scale(0) rotate(0deg);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.2) rotate(180deg);
                            opacity: 0.8;
                        }
                        100% { 
                            transform: scale(0) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 1000);
        });
    }

    /**
     * Add periodic kawaii messages
     */
    addPeriodicKawaiiMessages() {
        const messages = [
            '💖 ¡Kawaii mode activado! 💖',
            '🌸 ¡Todo se ve más lindo! 🌸',
            '✨ ¡Pixel art kawaii! ✨',
            '🎮 ¡Retro y adorable! 🎮',
            '🌟 ¡Brillando con estilo! 🌟',
            '💕 ¡Modo pixel kawaii! 💕'
        ];
        
        // Show first message after 2 seconds
        setTimeout(() => {
            this.showKawaiiNotification(messages[0]);
        }, 2000);
        
        // Show random messages every 30 seconds
        setInterval(() => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showKawaiiNotification(randomMessage);
        }, 30000);
    }

    /**
     * Show kawaii notification
     */
    showKawaiiNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'kawaii-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'kawaii-notification-slide 0.3s ease-in reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    /**
     * Add loading effect to button
     */
    addLoadingEffect(button) {
        const originalText = button.textContent;
        const loader = document.createElement('div');
        loader.className = 'kawaii-loading';
        
        button.style.position = 'relative';
        button.textContent = '';
        button.appendChild(loader);
        
        setTimeout(() => {
            button.removeChild(loader);
            button.textContent = originalText;
        }, 1000);
    }

    /**
     * Add sparkle effect to input
     */
    addSparkleEffect(input) {
        const sparkles = ['✨', '⭐', '🌟'];
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.textContent = sparkles[i];
                sparkle.style.cssText = `
                    position: absolute;
                    font-size: 12px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: kawaii-input-sparkle 1s ease-out forwards;
                `;
                
                const rect = input.getBoundingClientRect();
                sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
                sparkle.style.top = (rect.top - 10) + 'px';
                
                // Add sparkle animation
                if (!document.querySelector('#kawaii-input-sparkle-style')) {
                    const style = document.createElement('style');
                    style.id = 'kawaii-input-sparkle-style';
                    style.textContent = `
                        @keyframes kawaii-input-sparkle {
                            0% { 
                                transform: translateY(0) scale(0) rotate(0deg);
                                opacity: 1;
                            }
                            50% {
                                transform: translateY(-20px) scale(1.2) rotate(180deg);
                                opacity: 0.8;
                            }
                            100% { 
                                transform: translateY(-40px) scale(0) rotate(360deg);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.remove();
                    }
                }, 1000);
            }, i * 200);
        }
    }

    /**
     * Add click effect to element
     */
    addClickEffect(element) {
        const effect = document.createElement('div');
        effect.textContent = '💖';
        effect.style.cssText = `
            position: absolute;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            animation: kawaii-click-effect 0.8s ease-out forwards;
            filter: drop-shadow(2px 2px 0 #8E44AD);
        `;
        
        const rect = element.getBoundingClientRect();
        effect.style.left = (rect.left + rect.width / 2 - 10) + 'px';
        effect.style.top = (rect.top + rect.height / 2 - 10) + 'px';
        
        // Add click animation
        if (!document.querySelector('#kawaii-click-effect-style')) {
            const style = document.createElement('style');
            style.id = 'kawaii-click-effect-style';
            style.textContent = `
                @keyframes kawaii-click-effect {
                    0% { 
                        transform: scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.5) rotate(180deg);
                        opacity: 0.8;
                    }
                    100% { 
                        transform: scale(2) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 800);
    }

    /**
     * Enhance table with kawaii elements
     */
    enhanceTable(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            const icons = ['🌸', '💖', '✨', '🎀', '⭐'];
            header.textContent = `${icons[index % icons.length]} ${header.textContent}`;
        });
        
        // Add hover effects to rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                this.addRowSparkle(row);
            });
        });
    }

    /**
     * Add sparkle effect to table row
     */
    addRowSparkle(row) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 14px;
            pointer-events: none;
            z-index: 1000;
            animation: kawaii-row-sparkle 1s ease-out forwards;
        `;
        
        const rect = row.getBoundingClientRect();
        sparkle.style.left = (rect.right - 30) + 'px';
        sparkle.style.top = (rect.top + rect.height / 2 - 7) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 1000);
    }

    /**
     * Enhance form elements
     */
    enhanceFormElements() {
        // Add kawaii placeholders and effects
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
        inputs.forEach(input => {
            // Enhance placeholder
            const originalPlaceholder = input.placeholder;
            if (originalPlaceholder) {
                input.placeholder = `✨ ${originalPlaceholder} 💖`;
            }
            
            // Add focus effects
            input.addEventListener('focus', () => {
                this.addSparkleEffect(input);
            });
        });
    }

    /**
     * Observe for new elements and apply kawaii styling
     */
    observeForNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        this.applyKawaiiStylingToElement(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Apply kawaii styling to a specific element
     */
    applyKawaiiStylingToElement(element) {
        // Apply to buttons
        if (element.classList && element.classList.contains('btn')) {
            element.classList.add('kawaii-tooltip');
            element.setAttribute('data-tooltip', `✨ ${element.textContent.trim()} ✨`);
            
            element.addEventListener('click', () => {
                this.addLoadingEffect(element);
            });
        }

        // Apply to inputs
        if (element.classList && (element.classList.contains('search-input') || element.tagName === 'INPUT')) {
            element.addEventListener('focus', () => {
                this.addSparkleEffect(element);
            });
        }

        // Apply to child elements
        const childButtons = element.querySelectorAll?.('.btn');
        childButtons?.forEach(btn => {
            btn.classList.add('kawaii-tooltip');
            btn.setAttribute('data-tooltip', `✨ ${btn.textContent.trim()} ✨`);
            
            btn.addEventListener('click', () => {
                this.addLoadingEffect(btn);
            });
        });

        const childInputs = element.querySelectorAll?.('input, textarea');
        childInputs?.forEach(input => {
            input.addEventListener('focus', () => {
                this.addSparkleEffect(input);
            });
        });
    }
}

// ==========================================================================
// Auto-Initialization
// ==========================================================================

// Global instance
let kawaiiPixelArt = null;

/**
 * Initialize kawaii pixel art system
 */
function initializeKawaiiPixelArt() {
    kawaiiPixelArt = new KawaiiPixelArt();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other scripts have loaded
    setTimeout(initializeKawaiiPixelArt, 100);
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KawaiiPixelArt;
}