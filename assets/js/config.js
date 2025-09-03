// ==========================================================================
// Application Configuration
// ==========================================================================

const PRODUCT_CONFIG = {
    TYPES: {
        COFFEE: 'coffee',
        FOOD: 'food',
        DRINK: 'drink',
        DESSERT: 'dessert'
    },
    
    CATEGORIES: {
        coffee: ['Americano', 'Espresso', 'Cappuccino', 'Latte', 'Frappé', 'Mocha', 'Macchiato'],
        food: ['Sándwich', 'Ensalada', 'Pasta', 'Pizza', 'Hamburguesa', 'Wrap', 'Tostada'],
        drink: ['Jugo Natural', 'Smoothie', 'Té', 'Chocolate Caliente', 'Agua', 'Gaseosa', 'Limonada'],
        dessert: ['Torta', 'Galleta', 'Helado', 'Muffin', 'Donut', 'Cheesecake', 'Brownie']
    },
    
    ICONS: {
        coffee: '☕',
        food: '🥐',
        drink: '🥤',
        dessert: '🍰'
    },
    
    MIN_STOCK_THRESHOLD: 5,
    CURRENCY: 'COP',
    LOCALE: 'es-CO'
};

// Application Settings
const APP_CONFIG = {
    STORAGE_KEY: 'cafeteria_products',
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DURATION: 300
};

// Messages and Labels
const MESSAGES = {
    SUCCESS: {
        PRODUCT_ADDED: 'Producto añadido exitosamente',
        PRODUCT_UPDATED: 'Producto actualizado exitosamente',
        PRODUCT_DELETED: 'Producto eliminado exitosamente',
        PRODUCTS_EXPORTED: 'Productos exportados exitosamente'
    },
    
    ERROR: {
        GENERIC: 'Ha ocurrido un error',
        VALIDATION: 'Por favor, verifica los datos ingresados',
        NOT_FOUND: 'Producto no encontrado',
        LOW_STOCK: 'producto(s) con stock bajo'
    },
    
    LABELS: {
        ACTIVE: 'Activo',
        INACTIVE: 'Inactivo',
        LOW_STOCK: 'Stock Bajo',
        OUT_OF_STOCK: 'Sin Stock',
        TOTAL_PRODUCTS: 'Total Productos',
        ACTIVE_PRODUCTS: 'Productos Activos',
        TOTAL_VALUE: 'Valor Total',
        LOW_STOCK_PRODUCTS: 'Stock Bajo'
    }
};

// Default Products Data
const DEFAULT_PRODUCTS = [
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
