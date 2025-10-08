// ==========================================================================
// Visual Constants - Colors, Emojis, and Visual Elements
// ==========================================================================

/**
 * Kawaii emoji collections
 */
export const KAWAII_EMOJIS = {
    // Hearts and Love
    HEARTS: ['💖', '💕', '💜', '💙', '💚', '💛'],
    
    // Sparkles and Stars
    SPARKLES: ['✨', '⭐', '🌟', '💫'],
    
    // Decorative Elements
    DECORATIONS: ['🌸', '💖', '✨', '🎀', '🌙', '⭐', '🦋', '🌈'],
    
    // Corner Decorations
    CORNER_DECORATIONS: {
        TOP_LEFT: '🌸',
        TOP_RIGHT: '💖',
        BOTTOM_LEFT: '🎀',
        BOTTOM_RIGHT: '✨'
    },
    
    // Floating Elements
    FLOATING_ELEMENTS: '🌸 ✨ 🎀 💖 🌙 ⭐ 🦋 🌈',
    
    // Product Type Icons
    PRODUCT_ICONS: {
        coffee: '☕',
        food: '🥐',
        drink: '🥤',
        dessert: '🍰'
    },
    
    // Status Icons
    STATUS_ICONS: {
        ACTIVE: '✅',
        INACTIVE: '❌',
        LOW_STOCK: '⚠️',
        OUT_OF_STOCK: '🔴'
    }
};

/**
 * Color palette for Kawaii Pixel Art
 */
export const KAWAII_COLORS = {
    // Primary Colors
    PRIMARY: {
        PINK: '#FF69B4',
        PURPLE: '#8E44AD',
        BLUE: '#3498DB',
        GREEN: '#2ECC71',
        YELLOW: '#F1C40F'
    },
    
    // Pastel Colors
    PASTEL: {
        PINK: '#FFB3D9',
        PURPLE: '#D4B3FF',
        BLUE: '#B3D9FF',
        GREEN: '#B3FFD9',
        YELLOW: '#FFF9B3'
    },
    
    // Background Gradients
    GRADIENTS: {
        MAIN: 'linear-gradient(45deg, #FFE5F1 0%, #E5F3FF 25%, #F0E5FF 50%, #E5FFE5 75%, #FFF5E5 100%)',
        KAWAII: 'linear-gradient(45deg, #FFB3D9 0%, #D4B3FF 25%, #B3D9FF 50%, #B3FFD9 75%, #FFF9B3 100%)',
        MODAL: 'linear-gradient(135deg, #FFF0F5 0%, #F8E8FF 50%, #FFE5F1 100%)',
        HEADER: 'linear-gradient(135deg, #FFE5F1 0%, #F8E8FF 100%)',
        CARD: 'linear-gradient(135deg, #FFF8FF 0%, #F0F8FF 100%)'
    },
    
    // Shadow Colors
    SHADOWS: {
        PINK: 'rgba(255, 105, 180, 0.3)',
        PURPLE: 'rgba(142, 68, 173, 0.2)',
        LIGHT: 'rgba(255, 182, 193, 0.4)'
    },
    
    // Border Colors
    BORDERS: {
        LIGHT_PINK: '#FFB6C1',
        PINK: '#FF69B4',
        PURPLE: '#8E44AD',
        GRAY: '#E8E8E8'
    }
};

/**
 * Font configurations
 */
export const FONTS = {
    // Font Families
    FAMILIES: {
        DEFAULT: "'Nunito', 'Comic Sans MS', cursive",
        PIXEL: "'Press Start 2P', 'Courier New', monospace"
    },
    
    // Font Sizes
    SIZES: {
        SMALL: '10px',
        MEDIUM: '12px',
        LARGE: '14px',
        PIXEL_SMALL: '8px',
        PIXEL_MEDIUM: '10px',
        PIXEL_LARGE: '12px'
    },
    
    // Font Weights
    WEIGHTS: {
        LIGHT: 300,
        NORMAL: 400,
        SEMI_BOLD: 600,
        BOLD: 700,
        EXTRA_BOLD: 800
    }
};

/**
 * Effect and animation styles
 */
export const VISUAL_EFFECTS = {
    // Image Rendering for Pixel Mode
    PIXEL_RENDERING: {
        'image-rendering': '-moz-crisp-edges',
        '-webkit-image-rendering': '-webkit-crisp-edges',
        'image-rendering': 'pixelated',
        'image-rendering': 'crisp-edges'
    },
    
    // Box Shadow Presets
    BOX_SHADOWS: {
        LIGHT: '0 8px 25px rgba(255, 182, 193, 0.3)',
        MEDIUM: '0 15px 40px rgba(255, 105, 180, 0.3)',
        HEAVY: '0 25px 50px rgba(255, 105, 180, 0.3)',
        PIXEL: '4px 4px 0 #2E2E2E'
    },
    
    // Text Shadow Presets
    TEXT_SHADOWS: {
        LIGHT: '1px 1px 2px rgba(233, 30, 99, 0.2)',
        MEDIUM: '2px 2px 4px rgba(233, 30, 99, 0.2)',
        HEAVY: '2px 2px 4px rgba(255, 105, 180, 0.3)',
        PIXEL: '2px 2px 0 #8E44AD'
    },
    
    // Filter Effects
    FILTERS: {
        DROP_SHADOW_PURPLE: 'drop-shadow(2px 2px 0 #8E44AD)',
        DROP_SHADOW_LIGHT: 'drop-shadow(1px 1px 0 #8E44AD)'
    }
};