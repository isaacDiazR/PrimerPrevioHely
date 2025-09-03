// ==========================================================================
// Product View Class - Handles UI rendering and interactions
// ==========================================================================

class ProductView {
    constructor() {
        this.currentFilters = {
            search: '',
            type: '',
            active: ''
        };
        this.currentEditingProduct = null;
        this.initializeEventListeners();
    }

    /**
     * Initialize DOM event listeners
     */
    initializeEventListeners() {
        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideProductModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideProductModal();
            }
        });

        // Product type change in form
        const typeSelect = document.getElementById('productType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateCategoryOptions());
        }
    }

    /**
     * Render products grid
     * @param {Product[]} products - Products to render
     */
    renderProducts(products) {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }

        container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
    }

    /**
     * Render a single product card
     * @param {Product} product - Product to render
     * @returns {string} HTML string for product card
     */
    renderProductCard(product) {
        const stockStatus = product.getStockStatus();
        const activeClass = product.active ? '' : 'inactive';
        
        return `
            <div class="product-card ${activeClass}" data-product-id="${product.id}">
                <div class="product-header">
                    <div>
                        <div class="product-title">${product.getIcon()} ${product.name}</div>
                        <div class="product-category">${product.category}</div>
                    </div>
                    <div class="status ${product.active ? 'active' : 'inactive'}">
                        ${product.active ? '✅' : '❌'} ${product.active ? MESSAGES.LABELS.ACTIVE : MESSAGES.LABELS.INACTIVE}
                    </div>
                </div>

                <div class="product-info">
                    <div class="info-item">
                        <span class="info-label">Precio</span>
                        <span class="info-value price-highlight">${product.getFormattedPrice()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Stock</span>
                        <span class="info-value ${stockStatus.class}">${product.stock}</span>
                    </div>
                </div>

                ${product.description ? `
                    <div class="product-description">${product.description}</div>
                ` : ''}

                ${stockStatus.level !== 'normal' ? `
                    <div class="stock-warning">
                        ⚠️ ${stockStatus.message}
                    </div>
                ` : ''}

                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="editProduct('${product.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render empty state
     * @returns {string} HTML string for empty state
     */
    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3 class="empty-state-title">No hay productos</h3>
                <p class="empty-state-description">
                    No se encontraron productos que coincidan con los filtros seleccionados.
                </p>
                <button class="btn btn-primary" onclick="showProductModal()">
                    ➕ Añadir Primer Producto
                </button>
            </div>
        `;
    }

    /**
     * Render statistics
     * @param {Object} stats - Statistics object
     */
    renderStats(stats) {
        const container = document.getElementById('stats');
        if (!container) return;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stats.totalProducts}</div>
                <div class="stat-label">${MESSAGES.LABELS.TOTAL_PRODUCTS}</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.activeProducts}</div>
                <div class="stat-label">${MESSAGES.LABELS.ACTIVE_PRODUCTS}</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.formattedTotalValue}</div>
                <div class="stat-label">${MESSAGES.LABELS.TOTAL_VALUE}</div>
            </div>
            <div class="stat-card">
                <div class="stat-number ${stats.lowStockProducts > 0 ? 'stock-warning' : ''}">${stats.lowStockProducts}</div>
                <div class="stat-label">${MESSAGES.LABELS.LOW_STOCK_PRODUCTS}</div>
            </div>
        `;
    }

    /**
     * Show product modal for adding/editing
     * @param {Product|null} product - Product to edit, null for new product
     */
    showProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = document.getElementById('modalTitle');
        const submitButton = document.getElementById('submitButtonText');

        if (!modal || !form || !title || !submitButton) return;

        this.currentEditingProduct = product;

        if (product) {
            title.textContent = 'Editar Producto';
            submitButton.textContent = 'Actualizar Producto';
            this.populateForm(product);
        } else {
            title.textContent = 'Añadir Producto';
            submitButton.textContent = 'Añadir Producto';
            form.reset();
            document.getElementById('productActive').checked = true;
        }

        this.updateCategoryOptions();
        modal.classList.add('show');
        
        // Focus first input
        const firstInput = form.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    /**
     * Hide product modal
     */
    hideProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('show');
            this.currentEditingProduct = null;
            
            // Clear form
            const form = document.getElementById('productForm');
            if (form) {
                form.reset();
            }
        }
    }

    /**
     * Populate form with product data
     * @param {Product} product - Product to populate form with
     */
    populateForm(product) {
        const elements = {
            productName: product.name,
            productType: product.type,
            productCategory: product.category,
            productPrice: product.price,
            productStock: product.stock,
            productDescription: product.description,
            productActive: product.active
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
    }

    /**
     * Update category options based on selected type
     */
    updateCategoryOptions() {
        const typeSelect = document.getElementById('productType');
        const categorySelect = document.getElementById('productCategory');
        
        if (!typeSelect || !categorySelect) return;

        const selectedType = typeSelect.value;
        const categories = selectedType ? PRODUCT_CONFIG.CATEGORIES[selectedType] : [];

        categorySelect.innerHTML = '<option value="">Seleccionar categoría...</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // If editing, select current category
        if (this.currentEditingProduct && this.currentEditingProduct.type === selectedType) {
            categorySelect.value = this.currentEditingProduct.category;
        }
    }

    /**
     * Get form data from product modal
     * @returns {Object} Form data object
     */
    getFormData() {
        const form = document.getElementById('productForm');
        if (!form) return null;

        const formData = new FormData(form);
        return {
            name: formData.get('name').trim(),
            type: formData.get('type'),
            category: formData.get('category'),
            price: parseInt(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            description: formData.get('description').trim(),
            active: formData.has('active')
        };
    }

    /**
     * Show notification message
     * @param {string} message - Message to show
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = document.getElementById('notificationMessage');
        
        if (!notification || !messageElement) return;

        // Remove existing type classes
        notification.classList.remove('success', 'error', 'warning', 'info');
        notification.classList.add(type);
        
        messageElement.textContent = message;
        notification.classList.add('show');

        // Auto hide after duration
        setTimeout(() => {
            this.hideNotification();
        }, APP_CONFIG.NOTIFICATION_DURATION);
    }

    /**
     * Hide notification
     */
    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.remove('show');
        }
    }

    /**
     * Update search and filter inputs
     * @param {Object} filters - Current filters
     */
    updateFilters(filters) {
        this.currentFilters = { ...filters };
        
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) searchInput.value = filters.search || '';
        if (typeFilter) typeFilter.value = filters.type || '';
        if (statusFilter) statusFilter.value = filters.active || '';
    }

    /**
     * Get current filter values from UI
     * @returns {Object} Current filter values
     */
    getCurrentFilters() {
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');

        return {
            search: searchInput ? searchInput.value.trim() : '',
            type: typeFilter ? typeFilter.value : '',
            active: statusFilter ? statusFilter.value : ''
        };
    }

    /**
     * Show loading state
     */
    showLoading() {
        const container = document.getElementById('productsContainer');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="loading">
                        <div class="spinner"></div>
                        Cargando productos...
                    </div>
                </div>
            `;
        }
    }

    /**
     * Create download link for data export
     * @param {string} data - Data to export
     * @param {string} filename - File name
     */
    downloadData(data, filename) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}
