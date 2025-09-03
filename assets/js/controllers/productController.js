// ==========================================================================
// Product Controller Class - Handles business logic and coordinates between View and Service
// ==========================================================================

class ProductController {
    constructor(service, view) {
        this.service = service;
        this.view = view;
        this.currentFilters = {};
        this.initialize();
    }

    /**
     * Initialize controller
     */
    initialize() {
        this.setupEventListeners();
        this.render();
        this.checkLowStock();
    }

    /**
     * Setup service event listeners
     */
    setupEventListeners() {
        // Listen to service events
        this.service.on('product:added', () => {
            this.render();
            this.view.showNotification(MESSAGES.SUCCESS.PRODUCT_ADDED, 'success');
        });

        this.service.on('product:updated', () => {
            this.render();
            this.view.showNotification(MESSAGES.SUCCESS.PRODUCT_UPDATED, 'success');
        });

        this.service.on('product:deleted', () => {
            this.render();
            this.view.showNotification(MESSAGES.SUCCESS.PRODUCT_DELETED, 'success');
        });

        this.service.on('products:imported', (data) => {
            this.render();
            this.view.showNotification(
                `${data.imported} productos importados exitosamente`, 
                'success'
            );
        });
    }

    /**
     * Render all UI components
     */
    render() {
        this.renderProducts();
        this.renderStats();
    }

    /**
     * Render products with current filters
     */
    renderProducts() {
        const filters = this.view.getCurrentFilters();
        const products = this.service.filterProducts(filters);
        this.view.renderProducts(products);
        this.currentFilters = filters;
    }

    /**
     * Render statistics
     */
    renderStats() {
        const stats = this.service.getStats();
        this.view.renderStats(stats);
    }

    /**
     * Handle adding a new product
     * @param {Object} productData - Product data from form
     */
    async addProduct(productData) {
        try {
            // Validate required fields
            this.validateProductData(productData);
            
            const product = this.service.addProduct(productData);
            this.view.hideProductModal();
            
            return product;
        } catch (error) {
            this.view.showNotification(error.message, 'error');
            throw error;
        }
    }

    /**
     * Handle editing an existing product
     * @param {string} productId - Product ID
     * @param {Object} productData - Updated product data
     */
    async updateProduct(productId, productData) {
        try {
            // Validate required fields
            this.validateProductData(productData);
            
            const product = this.service.updateProduct(productId, productData);
            this.view.hideProductModal();
            
            return product;
        } catch (error) {
            this.view.showNotification(error.message, 'error');
            throw error;
        }
    }

    /**
     * Handle deleting a product
     * @param {string} productId - Product ID
     */
    async deleteProduct(productId) {
        const product = this.service.getProductById(productId);
        
        if (!product) {
            this.view.showNotification(MESSAGES.ERROR.NOT_FOUND, 'error');
            return;
        }

        const confirmed = confirm(
            `¿Estás seguro de que deseas eliminar "${product.name}"?\n\nEsta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                this.service.deleteProduct(productId);
            } catch (error) {
                this.view.showNotification(error.message, 'error');
            }
        }
    }

    /**
     * Show product modal for editing
     * @param {string} productId - Product ID to edit
     */
    showEditModal(productId) {
        const product = this.service.getProductById(productId);
        
        if (!product) {
            this.view.showNotification(MESSAGES.ERROR.NOT_FOUND, 'error');
            return;
        }

        this.view.showProductModal(product);
    }

    /**
     * Show product modal for adding new product
     */
    showAddModal() {
        this.view.showProductModal();
    }

    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        const formData = this.view.getFormData();
        const editingProduct = this.view.currentEditingProduct;

        try {
            if (editingProduct) {
                await this.updateProduct(editingProduct.id, formData);
            } else {
                await this.addProduct(formData);
            }
        } catch (error) {
            // Error already handled in add/update methods
        }
    }

    /**
     * Handle search input
     * @param {string} searchTerm - Search term
     */
    handleSearch(searchTerm) {
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.renderProducts();
        }, 300);
    }

    /**
     * Handle filter changes
     */
    handleFilterChange() {
        this.renderProducts();
    }

    /**
     * Export products data
     */
    exportProducts() {
        try {
            const data = this.service.exportData();
            const filename = `productos_cafeteria_${new Date().toISOString().split('T')[0]}.json`;
            
            this.view.downloadData(data, filename);
            this.view.showNotification(MESSAGES.SUCCESS.PRODUCTS_EXPORTED, 'success');
        } catch (error) {
            this.view.showNotification('Error al exportar productos: ' + error.message, 'error');
        }
    }

    /**
     * Import products data
     * @param {File} file - JSON file with products data
     */
    async importProducts(file) {
        try {
            const text = await file.text();
            const result = this.service.importData(text);

            if (result.success) {
                this.view.showNotification(
                    `${result.imported} productos importados exitosamente`, 
                    'success'
                );
            } else {
                this.view.showNotification(
                    'Error al importar productos: ' + result.error, 
                    'error'
                );
            }
        } catch (error) {
            this.view.showNotification('Error al leer el archivo: ' + error.message, 'error');
        }
    }

    /**
     * Validate product data
     * @param {Object} productData - Product data to validate
     * @throws {Error} If validation fails
     */
    validateProductData(productData) {
        const errors = [];

        if (!productData.name || productData.name.trim() === '') {
            errors.push('El nombre del producto es obligatorio');
        }

        if (!productData.type) {
            errors.push('El tipo de producto es obligatorio');
        }

        if (!productData.category) {
            errors.push('La categoría es obligatoria');
        }

        if (!productData.price || productData.price <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        if (productData.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    /**
     * Check for low stock products and show notification
     */
    checkLowStock() {
        setTimeout(() => {
            const lowStockProducts = this.service.getLowStockProducts();
            
            if (lowStockProducts.length > 0) {
                this.view.showNotification(
                    `${lowStockProducts.length} ${MESSAGES.ERROR.LOW_STOCK}`, 
                    'warning'
                );
            }
        }, 1000);
    }

    /**
     * Show notification
     * @param {string} message - Message to show
     * @param {string} type - Notification type
     */
    showNotification(message, type = 'info') {
        this.view.showNotification(message, type);
    }

    /**
     * Get filtered products
     * @param {Object} filters - Filter criteria
     * @returns {Product[]} Filtered products
     */
    getFilteredProducts(filters = {}) {
        return this.service.filterProducts(filters);
    }

    /**
     * Get product statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return this.service.getStats();
    }

    /**
     * Reset all data to defaults
     */
    resetToDefault() {
        const confirmed = confirm(
            '¿Estás seguro de que deseas restablecer todos los productos a los valores por defecto?\n\nEsta acción eliminará todos los productos actuales.'
        );

        if (confirmed) {
            this.service.resetToDefault();
            this.render();
            this.view.showNotification('Productos restablecidos a valores por defecto', 'success');
        }
    }

    /**
     * Clear all products
     */
    clearAllProducts() {
        const confirmed = confirm(
            '¿Estás seguro de que deseas eliminar TODOS los productos?\n\nEsta acción no se puede deshacer.'
        );

        if (confirmed) {
            this.service.clearAllProducts();
            this.render();
            this.view.showNotification('Todos los productos han sido eliminados', 'warning');
        }
    }

    /**
     * Get API interface for external use
     * @returns {Object} API interface
     */
    getAPI() {
        return {
            // Product CRUD operations
            products: {
                getAll: () => this.service.getAllProducts(),
                getById: (id) => this.service.getProductById(id),
                create: (data) => this.addProduct(data),
                update: (id, data) => this.updateProduct(id, data),
                delete: (id) => this.deleteProduct(id),
                filter: (filters) => this.service.filterProducts(filters)
            },
            
            // Statistics and reports
            stats: () => this.service.getStats(),
            lowStock: () => this.service.getLowStockProducts(),
            
            // Data management
            export: () => this.exportProducts(),
            import: (file) => this.importProducts(file),
            reset: () => this.resetToDefault(),
            clear: () => this.clearAllProducts(),
            
            // UI operations
            ui: {
                showNotification: (msg, type) => this.showNotification(msg, type),
                refresh: () => this.render(),
                showAddModal: () => this.showAddModal(),
                showEditModal: (id) => this.showEditModal(id)
            }
        };
    }
}
