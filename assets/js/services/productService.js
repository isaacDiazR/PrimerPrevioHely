// ==========================================================================
// Product Service Class - Handles data operations
// ==========================================================================

class ProductService extends EventEmitter {
    constructor() {
        super();
        this.products = [];
        this.initialize();
    }

    /**
     * Initialize the service
     */
    initialize() {
        this.loadProducts();
    }

    /**
     * Load products from localStorage
     */
    loadProducts() {
        try {
            const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            if (saved) {
                const productData = JSON.parse(saved);
                this.products = productData.map(data => new Product(data));
            } else {
                this.loadDefaultProducts();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.loadDefaultProducts();
        }
    }

    /**
     * Load default products
     */
    loadDefaultProducts() {
        this.products = DEFAULT_PRODUCTS.map(data => new Product(data));
        this.saveProducts();
    }

    /**
     * Save products to localStorage
     */
    saveProducts() {
        try {
            const productData = this.products.map(product => product.toJSON());
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(productData));
            this.emit('products:saved', { products: this.products });
        } catch (error) {
            console.error('Error saving products:', error);
            throw new Error('No se pudo guardar los productos');
        }
    }

    /**
     * Get all products
     * @returns {Product[]} Array of all products
     */
    getAllProducts() {
        return [...this.products];
    }

    /**
     * Get product by ID
     * @param {string} id - Product ID
     * @returns {Product|null} Product instance or null if not found
     */
    getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    /**
     * Add a new product
     * @param {Object} productData - Product data
     * @returns {Product} Created product instance
     */
    addProduct(productData) {
        const product = new Product(productData);
        
        if (!product.isValid()) {
            throw new Error('Datos de producto inválidos');
        }

        this.products.push(product);
        this.saveProducts();
        
        this.emit('product:added', { product });
        return product;
    }

    /**
     * Update an existing product
     * @param {string} id - Product ID
     * @param {Object} updateData - Data to update
     * @returns {Product} Updated product instance
     */
    updateProduct(id, updateData) {
        const product = this.getProductById(id);
        
        if (!product) {
            throw new Error('Producto no encontrado');
        }

        product.update(updateData);
        
        if (!product.isValid()) {
            throw new Error('Datos de producto inválidos');
        }

        this.saveProducts();
        this.emit('product:updated', { product });
        
        return product;
    }

    /**
     * Delete a product
     * @param {string} id - Product ID
     * @returns {boolean} True if deleted successfully
     */
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = this.products[index];
        this.products.splice(index, 1);
        this.saveProducts();
        
        this.emit('product:deleted', { product: deletedProduct });
        return true;
    }

    /**
     * Filter products based on criteria
     * @param {Object} filters - Filter criteria
     * @returns {Product[]} Filtered products array
     */
    filterProducts(filters = {}) {
        let filtered = [...this.products];

        // Filter by search term
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by type
        if (filters.type && filters.type !== '') {
            filtered = filtered.filter(product => product.type === filters.type);
        }

        // Filter by category
        if (filters.category && filters.category !== '') {
            filtered = filtered.filter(product => product.category === filters.category);
        }

        // Filter by active status
        if (filters.active !== undefined && filters.active !== '') {
            const isActive = filters.active === 'true' || filters.active === true;
            filtered = filtered.filter(product => product.active === isActive);
        }

        // Filter by stock status
        if (filters.stockStatus) {
            switch (filters.stockStatus) {
                case 'low':
                    filtered = filtered.filter(product => product.isLowStock());
                    break;
                case 'out':
                    filtered = filtered.filter(product => product.isOutOfStock());
                    break;
                case 'normal':
                    filtered = filtered.filter(product => 
                        !product.isLowStock() && !product.isOutOfStock()
                    );
                    break;
            }
        }

        // Sort by name by default
        filtered.sort((a, b) => a.name.localeCompare(b.name));

        return filtered;
    }

    /**
     * Get products statistics
     * @returns {Object} Statistics object
     */
    getStats() {
        const totalProducts = this.products.length;
        const activeProducts = this.products.filter(p => p.active).length;
        const lowStockProducts = this.products.filter(p => p.isLowStock()).length;
        const outOfStockProducts = this.products.filter(p => p.isOutOfStock()).length;
        const totalValue = this.products.reduce((sum, p) => sum + p.getTotalValue(), 0);

        return {
            totalProducts,
            activeProducts,
            inactiveProducts: totalProducts - activeProducts,
            lowStockProducts,
            outOfStockProducts,
            totalValue,
            formattedTotalValue: new Intl.NumberFormat(PRODUCT_CONFIG.LOCALE, {
                style: 'currency',
                currency: PRODUCT_CONFIG.CURRENCY,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(totalValue)
        };
    }

    /**
     * Get products by type
     * @param {string} type - Product type
     * @returns {Product[]} Products of specified type
     */
    getProductsByType(type) {
        return this.products.filter(product => product.type === type);
    }

    /**
     * Get low stock products
     * @returns {Product[]} Products with low stock
     */
    getLowStockProducts() {
        return this.products.filter(product => product.isLowStock());
    }

    /**
     * Search products by name or description
     * @param {string} query - Search query
     * @returns {Product[]} Matching products
     */
    searchProducts(query) {
        if (!query || query.trim() === '') {
            return this.getAllProducts();
        }

        const searchTerm = query.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Export products data
     * @returns {string} JSON string of all products
     */
    exportData() {
        return JSON.stringify(this.products.map(p => p.toJSON()), null, 2);
    }

    /**
     * Import products data
     * @param {string} jsonData - JSON string of products
     * @returns {Object} Import results
     */
    importData(jsonData) {
        try {
            const productsData = JSON.parse(jsonData);
            
            if (!Array.isArray(productsData)) {
                throw new Error('Los datos deben ser un array de productos');
            }

            let imported = 0;
            let skipped = 0;
            
            productsData.forEach(data => {
                try {
                    const product = new Product(data);
                    if (product.isValid()) {
                        this.products.push(product);
                        imported++;
                    } else {
                        skipped++;
                    }
                } catch (error) {
                    skipped++;
                }
            });

            if (imported > 0) {
                this.saveProducts();
                this.emit('products:imported', { imported, skipped });
            }

            return { imported, skipped, success: true };
            
        } catch (error) {
            return { 
                imported: 0, 
                skipped: 0, 
                success: false, 
                error: error.message 
            };
        }
    }

    /**
     * Clear all products
     */
    clearAllProducts() {
        this.products = [];
        this.saveProducts();
        this.emit('products:cleared');
    }

    /**
     * Reset to default products
     */
    resetToDefault() {
        this.loadDefaultProducts();
        this.emit('products:reset');
    }
}
