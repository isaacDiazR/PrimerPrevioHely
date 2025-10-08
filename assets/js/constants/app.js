// ==========================================================================
// Application Constants - Business logic and configuration
// ==========================================================================

/**
 * Product configuration
 */
export const PRODUCT_CONFIG = {
    // Product Types
    TYPES: {
        COFFEE: 'coffee',
        FOOD: 'food',
        DRINK: 'drink',
        DESSERT: 'dessert'
    },
    
    // Categories by type
    CATEGORIES: {
        coffee: ['Americano', 'Espresso', 'Cappuccino', 'Latte', 'Frappé', 'Mocha', 'Macchiato'],
        food: ['Sándwich', 'Ensalada', 'Pasta', 'Pizza', 'Hamburguesa', 'Wrap', 'Tostada'],
        drink: ['Jugo Natural', 'Smoothie', 'Té', 'Chocolate Caliente', 'Agua', 'Gaseosa', 'Limonada'],
        dessert: ['Torta', 'Galleta', 'Helado', 'Muffin', 'Donut', 'Cheesecake', 'Brownie']
    },
    
    // Business Rules
    MIN_STOCK_THRESHOLD: 5,
    DEFAULT_STOCK: 10,
    DEFAULT_PRICE: 0,
    
    // Currency and Locale
    CURRENCY: 'COP',
    LOCALE: 'es-CO',
    
    // Status Values
    STATUS: {
        ACTIVE: true,
        INACTIVE: false
    }
};

/**
 * Application messages
 */
export const MESSAGES = {
    SUCCESS: {
        PRODUCT_ADDED: 'Producto añadido exitosamente',
        PRODUCT_UPDATED: 'Producto actualizado exitosamente',
        PRODUCT_DELETED: 'Producto eliminado exitosamente',
        PRODUCTS_EXPORTED: 'Productos exportados exitosamente',
        PRODUCTS_IMPORTED: 'Productos importados exitosamente',
        DATA_SAVED: 'Datos guardados correctamente',
        BACKUP_CREATED: 'Respaldo creado exitosamente'
    },
    
    ERROR: {
        GENERIC: 'Ha ocurrido un error',
        VALIDATION: 'Por favor, verifica los datos ingresados',
        NOT_FOUND: 'Producto no encontrado',
        DUPLICATE_NAME: 'Ya existe un producto con este nombre',
        INVALID_PRICE: 'El precio debe ser mayor a 0',
        INVALID_STOCK: 'El stock debe ser mayor o igual a 0',
        REQUIRED_FIELD: 'Este campo es obligatorio',
        STORAGE_FULL: 'No hay suficiente espacio de almacenamiento',
        IMPORT_FAILED: 'Error al importar archivo',
        EXPORT_FAILED: 'Error al exportar datos',
        NETWORK_ERROR: 'Error de conexión',
        PERMISSION_DENIED: 'Permisos insuficientes'
    },
    
    WARNING: {
        LOW_STOCK: 'producto(s) con stock bajo',
        UNSAVED_CHANGES: 'Tienes cambios sin guardar',
        DELETE_CONFIRMATION: '¿Estás seguro de que deseas eliminar este producto?',
        CLEAR_DATA_CONFIRMATION: '¿Estás seguro de que deseas limpiar todos los datos?',
        OVERWRITE_CONFIRMATION: 'Esto sobrescribirá los datos existentes. ¿Continuar?'
    },
    
    INFO: {
        LOADING: 'Cargando...',
        SAVING: 'Guardando...',
        PROCESSING: 'Procesando...',
        NO_PRODUCTS: 'No hay productos registrados',
        NO_RESULTS: 'No se encontraron resultados',
        PIXEL_MODE_ENABLED: '🎮 Modo Pixel Art Activado!',
        PIXEL_MODE_DISABLED: '🌸 Modo Normal Activado!'
    },
    
    LABELS: {
        // Status Labels
        ACTIVE: 'Activo',
        INACTIVE: 'Inactivo',
        LOW_STOCK: 'Stock Bajo',
        OUT_OF_STOCK: 'Sin Stock',
        
        // Statistics Labels
        TOTAL_PRODUCTS: 'Total Productos',
        ACTIVE_PRODUCTS: 'Productos Activos',
        TOTAL_VALUE: 'Valor Total',
        LOW_STOCK_PRODUCTS: 'Stock Bajo',
        
        // Form Labels
        PRODUCT_NAME: 'Nombre del Producto',
        PRODUCT_TYPE: 'Tipo de Producto',
        PRODUCT_CATEGORY: 'Categoría',
        PRODUCT_PRICE: 'Precio',
        PRODUCT_STOCK: 'Stock',
        PRODUCT_DESCRIPTION: 'Descripción',
        
        // Filter Labels
        ALL_TYPES: '🌈 Todos los tipos',
        ALL_STATUS: '🎀 Todos los estados',
        
        // Button Labels
        ADD_PRODUCT: 'Agregar Producto',
        EDIT_PRODUCT: 'Editar Producto',
        DELETE_PRODUCT: 'Eliminar Producto',
        SAVE: 'Guardar',
        CANCEL: 'Cancelar',
        EXPORT: 'Exportar',
        IMPORT: 'Importar',
        CLEAR_FILTERS: 'Limpiar Filtros'
    }
};

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
    PRODUCT_NAME: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.]+$/
    },
    
    PRODUCT_PRICE: {
        required: true,
        min: 0.01,
        max: 1000000,
        type: 'number'
    },
    
    PRODUCT_STOCK: {
        required: true,
        min: 0,
        max: 10000,
        type: 'integer'
    },
    
    PRODUCT_DESCRIPTION: {
        required: false,
        maxLength: 500
    },
    
    PRODUCT_TYPE: {
        required: true,
        allowedValues: ['coffee', 'food', 'drink', 'dessert']
    },
    
    PRODUCT_CATEGORY: {
        required: true,
        minLength: 2,
        maxLength: 50
    }
};

/**
 * Feature flags and application settings
 */
export const APP_SETTINGS = {
    // Feature Flags
    FEATURES: {
        PIXEL_MODE: true,
        KAWAII_EFFECTS: true,
        AUTO_SAVE: true,
        REAL_TIME_VALIDATION: true,
        ADVANCED_STATISTICS: true,
        EXPORT_IMPORT: true,
        BACKUP_RESTORE: true
    },
    
    // Performance Settings
    PERFORMANCE: {
        DEBOUNCE_SEARCH: 300,
        DEBOUNCE_SAVE: 1000,
        RENDER_BATCH_SIZE: 50,
        ANIMATION_ENABLED: true
    },
    
    // UI Settings
    UI: {
        DEFAULT_PAGE_SIZE: 20,
        MAX_VISIBLE_PRODUCTS: 100,
        SHOW_TOOLTIPS: true,
        SHOW_ANIMATIONS: true,
        AUTO_FOCUS_FORMS: true
    }
};