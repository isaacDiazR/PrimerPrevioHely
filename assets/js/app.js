// ==========================================================================
// Main Application Class - Orchestrates the entire application
// ==========================================================================

class CafeteriaApp {
    constructor() {
        this.service = null;
        this.view = null;
        this.controller = null;
        this.initialize();
    }

    /**
     * Initialize the application
     */
    initialize() {
        try {
            // Initialize components in order
            this.service = new ProductService();
            this.view = new ProductView();
            this.controller = new ProductController(this.service, this.view);
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Initialize UI state
            this.initializeUI();
            
            console.log('✅ Cafetería App initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle window events
        window.addEventListener('beforeunload', (e) => {
            // Optional: warn user about unsaved changes
            // e.preventDefault();
            // e.returnValue = '';
        });

        // Handle visibility change (when user switches tabs)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Refresh data when user returns to tab
                this.controller.render();
            }
        });

        // Handle storage events (when localStorage is changed in another tab)
        window.addEventListener('storage', (e) => {
            if (e.key === APP_CONFIG.STORAGE_KEY) {
                this.service.loadProducts();
                this.controller.render();
                this.controller.showNotification('Datos actualizados desde otra pestaña', 'info');
            }
        });

        // Handle errors globally
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.controller.showNotification('Ha ocurrido un error inesperado', 'error');
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.controller.showNotification('Error en operación asíncrona', 'error');
        });
    }

    /**
     * Initialize UI state
     */
    initializeUI() {
        // Set up form validation
        this.setupFormValidation();
        
        // Initialize any tooltips or help elements
        this.initializeHelpSystem();
        
        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        const form = document.getElementById('productForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    /**
     * Validate individual form field
     * @param {HTMLElement} field - Form field to validate
     */
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.name) {
            case 'name':
                if (!value) {
                    isValid = false;
                    message = 'El nombre es obligatorio';
                }
                break;
            
            case 'price':
                if (!value || parseFloat(value) <= 0) {
                    isValid = false;
                    message = 'El precio debe ser mayor a 0';
                }
                break;
            
            case 'stock':
                if (!value || parseInt(value) < 0) {
                    isValid = false;
                    message = 'El stock no puede ser negativo';
                }
                break;
            
            case 'type':
                if (!value) {
                    isValid = false;
                    message = 'Selecciona un tipo de producto';
                }
                break;
            
            case 'category':
                if (!value) {
                    isValid = false;
                    message = 'Selecciona una categoría';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, message);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    /**
     * Show field validation error
     * @param {HTMLElement} field - Form field
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }

    /**
     * Clear field validation error
     * @param {HTMLElement} field - Form field
     */
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Initialize help system
     */
    initializeHelpSystem() {
        // Add help tooltips or info buttons as needed
        // This could be expanded to include guided tours, help bubbles, etc.
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New product
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.controller.showAddModal();
            }

            // Ctrl/Cmd + E: Export products
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                this.controller.exportProducts();
            }

            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Error that occurred during initialization
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-state" style="text-align: center; padding: 3rem; color: #dc2626;">
                    <h2>❌ Error al cargar la aplicación</h2>
                    <p>Ha ocurrido un error al inicializar el sistema:</p>
                    <p><strong>${error.message}</strong></p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        🔄 Recargar Página
                    </button>
                </div>
            `;
        }
    }

    /**
     * Get public API for external use
     * @returns {Object} Public API interface
     */
    getAPI() {
        if (!this.controller) {
            throw new Error('Application not initialized');
        }

        return {
            // Core API from controller
            ...this.controller.getAPI(),
            
            // App-level methods
            app: {
                version: '1.0.0',
                initialized: true,
                restart: () => this.restart(),
                getStats: () => this.getAppStats()
            }
        };
    }

    /**
     * Restart the application
     */
    restart() {
        // Clear existing instances
        if (this.service) {
            this.service.removeAllListeners();
        }
        
        // Reinitialize
        this.initialize();
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getAppStats() {
        return {
            initializationTime: Date.now(),
            productCount: this.service ? this.service.getAllProducts().length : 0,
            version: '1.0.0',
            storageUsed: this.getStorageUsage()
        };
    }

    /**
     * Get localStorage usage information
     * @returns {Object} Storage usage statistics
     */
    getStorageUsage() {
        try {
            const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            return {
                exists: !!data,
                size: data ? data.length : 0,
                sizeFormatted: data ? this.formatBytes(data.length) : '0 B'
            };
        } catch (error) {
            return { exists: false, size: 0, sizeFormatted: '0 B' };
        }
    }

    /**
     * Format bytes to human readable string
     * @param {number} bytes - Number of bytes
     * @returns {string} Formatted string
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// ==========================================================================
// Global Functions - Available in window scope for HTML event handlers
// ==========================================================================

let app = null;

/**
 * Show product modal for adding new product
 */
function showProductModal() {
    if (app && app.controller) {
        app.controller.showAddModal();
    }
}

/**
 * Hide product modal
 */
function hideProductModal() {
    if (app && app.view) {
        app.view.hideProductModal();
    }
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleProductSubmit(event) {
    if (app && app.controller) {
        app.controller.handleFormSubmit(event);
    }
}

/**
 * Handle search input
 * @param {string} value - Search value
 */
function handleSearch(value) {
    if (app && app.controller) {
        app.controller.handleSearch(value);
    }
}

/**
 * Handle filter change
 */
function handleFilterChange() {
    if (app && app.controller) {
        app.controller.handleFilterChange();
    }
}

/**
 * Edit product
 * @param {string} productId - Product ID to edit
 */
function editProduct(productId) {
    if (app && app.controller) {
        app.controller.showEditModal(productId);
    }
}

/**
 * Delete product
 * @param {string} productId - Product ID to delete
 */
function deleteProduct(productId) {
    if (app && app.controller) {
        app.controller.deleteProduct(productId);
    }
}

/**
 * Export products
 */
function exportProducts() {
    if (app && app.controller) {
        app.controller.exportProducts();
    }
}

/**
 * Update category options in form
 */
function updateCategoryOptions() {
    if (app && app.view) {
        app.view.updateCategoryOptions();
    }
}

/**
 * Hide notification
 */
function hideNotification() {
    if (app && app.view) {
        app.view.hideNotification();
    }
}

// ==========================================================================
// Application Initialization
// ==========================================================================

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        app = new CafeteriaApp();
        
        // Expose API globally for debugging and extensions
        window.CafeteriaAPI = app.getAPI();
        
        // Development helpers
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.group('🔧 Development Mode');
            console.log('✅ Cafetería App initialized');
            console.log('📚 API available at: window.CafeteriaAPI');
            console.log('🎯 Quick commands:');
            console.log('   CafeteriaAPI.stats() - Ver estadísticas');
            console.log('   CafeteriaAPI.products.getAll() - Ver productos');
            console.log('   CafeteriaAPI.export() - Exportar datos');
            console.log('   CafeteriaAPI.app.restart() - Reiniciar app');
            console.groupEnd();
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize Cafetería App:', error);
    }
});
