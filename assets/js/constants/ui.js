// ==========================================================================
// UI Constants - Centralized UI-related constants
// ==========================================================================

/**
 * DOM Element IDs and selectors
 */
export const DOM_SELECTORS = {
    // Form Elements
    PRODUCT_FORM: 'productForm',
    PRODUCT_MODAL: 'productModal',
    MODAL_TITLE: 'modalTitle',
    SUBMIT_BUTTON_TEXT: 'submitButtonText',
    
    // Input Elements
    SEARCH_INPUT: 'searchInput',
    TYPE_FILTER: 'typeFilter',
    STATUS_FILTER: 'statusFilter',
    PRODUCT_TYPE: 'productType',
    
    // Display Elements
    PRODUCTS_CONTAINER: 'productsContainer',
    STATS_CONTAINER: 'stats',
    
    // Control Elements
    PIXEL_TOGGLE: 'pixelToggle',
    KAWAII_WELCOME: 'kawaiiWelcome',
    
    // Class Selectors
    CONTAINER: '.container',
    HEADER: '.header',
    CONTROLS: '.controls',
    BTN: '.btn',
    BTN_PRIMARY: '.btn-primary',
    SEARCH_INPUT_CLASS: '.search-input',
    SELECT: '.select',
    STAT_CARD: '.stat-card',
    STAT_NUMBER: '.stat-number',
    STAT_LABEL: '.stat-label',
    TABLE: '.table',
    MODAL_CONTENT: '.modal-content',
    FIELD_ERROR: '.field-error'
};

/**
 * CSS Classes for dynamic styling
 */
export const CSS_CLASSES = {
    // State Classes
    SHOW: 'show',
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    
    // Pixel Mode Classes
    PIXEL_MODE_ACTIVE: 'pixel-mode-active',
    PIXEL_HEADER: 'pixel-header',
    PIXEL_BG_PATTERN: 'pixel-bg-pattern',
    PIXEL_BTN: 'pixel-btn',
    PIXEL_BTN_SECONDARY: 'pixel-btn-secondary',
    PIXEL_INPUT: 'pixel-input',
    PIXEL_SELECT: 'pixel-select',
    PIXEL_CARD: 'pixel-card',
    PIXEL_TABLE: 'pixel-table',
    PIXEL_MODAL: 'pixel-modal',
    PIXEL_TEXT: 'pixel-text',
    PIXEL_TEXT_SMALL: 'pixel-text-small',
    PIXEL_TEXT_MEDIUM: 'pixel-text-medium',
    
    // Kawaii Classes
    KAWAII_TOOLTIP: 'kawaii-tooltip',
    KAWAII_SUPER_TOOLTIP: 'kawaii-super-tooltip',
    KAWAII_CORNER_DECORATION: 'kawaii-corner-decoration',
    KAWAII_DECORATION: 'kawaii-decoration',
    
    // Position Classes
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right'
};

/**
 * Animation and timing constants
 */
export const ANIMATION_CONFIG = {
    // Durations (milliseconds)
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DURATION: 300,
    PIXEL_NOTIFICATION_DURATION: 2000,
    SPARKLE_EFFECT_DURATION: 800,
    CLICK_EFFECT_DURATION: 800,
    WELCOME_PROGRESS_INTERVAL: 100,
    FLOATING_HEARTS_INTERVAL: 2000,
    DECORATIVE_ELEMENTS_INTERVAL: 3000,
    
    // Animation Delays
    CARD_ANIMATION_DELAY_MULTIPLIER: 0.2,
    DECORATION_ANIMATION_DELAY_MULTIPLIER: 0.5,
    
    // Progress Steps
    WELCOME_PROGRESS_MIN: 5,
    WELCOME_PROGRESS_MAX: 20
};

/**
 * Notification types and styles
 */
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

/**
 * Kawaii Pixel Art configuration
 */
export const KAWAII_CONFIG = {
    // Welcome Progress Messages
    WELCOME_MESSAGES: {
        INITIALIZING: 'Inicializando Kawaii Mode',
        LOADING_PIXEL_ART: 'Cargando Pixel Art',
        ADDING_SPARKLES: 'Agregando Sparkles',
        READY: 'Kawaii Mode Listo!'
    },
    
    // Progress Thresholds
    PROGRESS_THRESHOLDS: {
        INITIALIZING: 30,
        LOADING: 60,
        SPARKLES: 90,
        COMPLETE: 100
    }
};