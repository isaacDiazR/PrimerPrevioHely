// ==========================================================================
// Product Model Class
// ==========================================================================

class Product {
    /**
     * Create a new Product instance
     * @param {Object} data - Product data
     */
    constructor(data = {}) {
        this.id = data.id || this._generateId();
        this.name = data.name || '';
        this.type = data.type || PRODUCT_CONFIG.TYPES.COFFEE;
        this.category = data.category || PRODUCT_CONFIG.CATEGORIES[this.type][0];
        this.price = data.price || 0;
        this.stock = data.stock || 0;
        this.description = data.description || '';
        this.active = data.active !== undefined ? data.active : true;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Generate a unique ID for the product
     * @returns {string} Unique identifier
     */
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Validate product data
     * @returns {boolean} True if product is valid
     */
    isValid() {
        const validations = [
            this.name.trim() !== '',
            this.price > 0,
            this.stock >= 0,
            Object.values(PRODUCT_CONFIG.TYPES).includes(this.type),
            this.category && this.category.trim() !== ''
        ];

        return validations.every(validation => validation === true);
    }

    /**
     * Check if product has low stock
     * @returns {boolean} True if stock is below threshold
     */
    isLowStock() {
        return this.stock < PRODUCT_CONFIG.MIN_STOCK_THRESHOLD;
    }

    /**
     * Check if product is out of stock
     * @returns {boolean} True if stock is 0
     */
    isOutOfStock() {
        return this.stock === 0;
    }

    /**
     * Get formatted price with currency
     * @returns {string} Formatted price string
     */
    getFormattedPrice() {
        return new Intl.NumberFormat(PRODUCT_CONFIG.LOCALE, {
            style: 'currency',
            currency: PRODUCT_CONFIG.CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(this.price);
    }

    /**
     * Get product type icon
     * @returns {string} Icon emoji for product type
     */
    getIcon() {
        return PRODUCT_CONFIG.ICONS[this.type] || '📦';
    }

    /**
     * Get stock status information
     * @returns {Object} Stock status with level and message
     */
    getStockStatus() {
        if (this.isOutOfStock()) {
            return {
                level: 'critical',
                message: MESSAGES.LABELS.OUT_OF_STOCK,
                class: 'stock-critical'
            };
        } else if (this.isLowStock()) {
            return {
                level: 'warning',
                message: MESSAGES.LABELS.LOW_STOCK,
                class: 'stock-warning'
            };
        } else {
            return {
                level: 'normal',
                message: 'Stock Normal',
                class: 'stock-normal'
            };
        }
    }

    /**
     * Update product with new data
     * @param {Object} data - New product data
     * @returns {Product} Updated product instance
     */
    update(data) {
        const allowedFields = [
            'name', 'type', 'category', 'price', 'stock', 
            'description', 'active'
        ];

        allowedFields.forEach(field => {
            if (data.hasOwnProperty(field)) {
                this[field] = data[field];
            }
        });

        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Create a copy of the product
     * @returns {Product} New product instance with copied data
     */
    clone() {
        return new Product(this.toJSON());
    }

    /**
     * Convert product to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            category: this.category,
            price: this.price,
            stock: this.stock,
            description: this.description,
            active: this.active,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Get product summary for display
     * @returns {Object} Summary object with key display information
     */
    getSummary() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            icon: this.getIcon(),
            price: this.getFormattedPrice(),
            stock: this.stock,
            stockStatus: this.getStockStatus(),
            active: this.active
        };
    }

    /**
     * Calculate total value of product (price * stock)
     * @returns {number} Total value
     */
    getTotalValue() {
        return this.price * this.stock;
    }

    /**
     * Get formatted total value
     * @returns {string} Formatted total value string
     */
    getFormattedTotalValue() {
        return new Intl.NumberFormat(PRODUCT_CONFIG.LOCALE, {
            style: 'currency',
            currency: PRODUCT_CONFIG.CURRENCY,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(this.getTotalValue());
    }
}
