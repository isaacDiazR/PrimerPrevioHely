// ==========================================================================
// Storage Constants - LocalStorage keys and data management
// ==========================================================================

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
    // Main Application Data
    PRODUCTS: 'cafeteria_products',
    
    // User Preferences
    PIXEL_MODE: 'pixelMode',
    THEME: 'cafeteria_theme',
    USER_PREFERENCES: 'cafeteria_user_prefs',
    
    // Cache Keys
    STATS_CACHE: 'cafeteria_stats_cache',
    FILTERS_CACHE: 'cafeteria_filters_cache',
    
    // Backup Keys
    BACKUP_PREFIX: 'cafeteria_backup_',
    LAST_BACKUP: 'cafeteria_last_backup'
};

/**
 * Data validation and limits
 */
export const DATA_LIMITS = {
    // Storage Limits
    MAX_PRODUCTS: 1000,
    MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB
    
    // String Limits
    MAX_PRODUCT_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_CATEGORY_LENGTH: 50,
    
    // Numeric Limits
    MIN_PRICE: 0,
    MAX_PRICE: 1000000, // 1 million
    MIN_STOCK: 0,
    MAX_STOCK: 10000,
    
    // File Limits
    MAX_IMPORT_FILE_SIZE: 1024 * 1024, // 1MB
    MAX_EXPORT_RECORDS: 10000
};

/**
 * File format configurations
 */
export const FILE_FORMATS = {
    // Export Formats
    JSON: {
        extension: '.json',
        mimeType: 'application/json',
        description: 'Archivo JSON'
    },
    
    CSV: {
        extension: '.csv',
        mimeType: 'text/csv',
        description: 'Archivo CSV'
    },
    
    // Import Formats
    SUPPORTED_IMPORT: ['.json', '.csv'],
    
    // File Size Units
    SIZE_UNITS: ['B', 'KB', 'MB', 'GB'],
    SIZE_MULTIPLIER: 1024
};

/**
 * Cache configurations
 */
export const CACHE_CONFIG = {
    // Cache TTL (Time To Live) in milliseconds
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    STATS_TTL: 1 * 60 * 1000,   // 1 minute
    FILTERS_TTL: 30 * 1000,      // 30 seconds
    
    // Cache Strategies
    STRATEGIES: {
        MEMORY_FIRST: 'memory_first',
        STORAGE_FIRST: 'storage_first',
        NETWORK_FIRST: 'network_first'
    }
};