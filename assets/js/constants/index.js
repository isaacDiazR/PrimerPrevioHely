// ==========================================================================
// Constants Index - Central export for all constants
// ==========================================================================

// Import all constant modules
import { DOM_SELECTORS, CSS_CLASSES, ANIMATION_CONFIG, NOTIFICATION_TYPES, KAWAII_CONFIG } from './ui.js';
import { KAWAII_EMOJIS, KAWAII_COLORS, FONTS, VISUAL_EFFECTS } from './visual.js';
import { STORAGE_KEYS, DATA_LIMITS, FILE_FORMATS, CACHE_CONFIG } from './storage.js';
import { PRODUCT_CONFIG, MESSAGES, VALIDATION_RULES, APP_SETTINGS } from './app.js';

// Re-export all constants for easy importing
export {
    // UI Constants
    DOM_SELECTORS,
    CSS_CLASSES,
    ANIMATION_CONFIG,
    NOTIFICATION_TYPES,
    KAWAII_CONFIG,
    
    // Visual Constants
    KAWAII_EMOJIS,
    KAWAII_COLORS,
    FONTS,
    VISUAL_EFFECTS,
    
    // Storage Constants
    STORAGE_KEYS,
    DATA_LIMITS,
    FILE_FORMATS,
    CACHE_CONFIG,
    
    // Application Constants
    PRODUCT_CONFIG,
    MESSAGES,
    VALIDATION_RULES,
    APP_SETTINGS
};

// Legacy compatibility - maintain old constant names for backward compatibility
export const APP_CONFIG = {
    STORAGE_KEY: STORAGE_KEYS.PRODUCTS,
    NOTIFICATION_DURATION: ANIMATION_CONFIG.NOTIFICATION_DURATION,
    ANIMATION_DURATION: ANIMATION_CONFIG.ANIMATION_DURATION
};

// Default products data (moved from config.js)
export const DEFAULT_PRODUCTS = [
    {
        name: 'Café Americano',
        type: 'coffee',
        category: 'Americano',
        price: 3500,
        stock: 50,
        description: 'Café suave y aromático, perfecto para cualquier momento del día'
    },
    {
        name: 'Cappuccino Tradicional',
        type: 'coffee',
        category: 'Cappuccino',
        price: 4500,
        stock: 30,
        description: 'Café espresso con leche vaporizada y espuma cremosa'
    },
    {
        name: 'Sándwich Club',
        type: 'food',
        category: 'Sándwich',
        price: 8500,
        stock: 15,
        description: 'Delicioso sándwich con pollo, tocino, lechuga y tomate'
    },
    {
        name: 'Jugo de Naranja Natural',
        type: 'drink',
        category: 'Jugo Natural',
        price: 4000,
        stock: 25,
        description: 'Jugo de naranja 100% natural, recién exprimido'
    },
    {
        name: 'Torta de Chocolate',
        type: 'dessert',
        category: 'Torta',
        price: 6000,
        stock: 3,
        description: 'Deliciosa torta de chocolate con frosting de mantequilla'
    },
    {
        name: 'Latte Vainilla',
        type: 'coffee',
        category: 'Latte',
        price: 5000,
        stock: 20,
        description: 'Café latte con un toque de jarabe de vainilla'
    },
    {
        name: 'Ensalada César',
        type: 'food',
        category: 'Ensalada',
        price: 7500,
        stock: 12,
        description: 'Fresca ensalada con lechuga romana, crutones y aderezo césar'
    },
    {
        name: 'Smoothie de Fresa',
        type: 'drink',
        category: 'Smoothie',
        price: 5500,
        stock: 18,
        description: 'Refrescante smoothie de fresa con yogurt natural'
    }
];