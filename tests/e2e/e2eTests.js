// ==========================================================================
// End-to-End Tests - Complete User Workflows
// ==========================================================================

describe('🎭 End-to-End Tests - Complete User Scenarios', () => {
    let app;

    beforeAll(() => {
        // Setup complete application environment
        app = new CafeteriaApp();
    });

    beforeEach(() => {
        // Reset application state and DOM
        localStorage.clear();
        app.initialize();
        
        // Setup complete DOM structure
        document.body.innerHTML = `
            <div class="container">
                <header class="header">
                    <h1>🍕 Sistema de Gestión - Tienda Cafetería</h1>
                    <p>Gestiona tu inventario de productos de manera eficiente</p>
                </header>

                <div class="controls">
                    <input type="text" 
                           class="search-input" 
                           id="searchInput"
                           placeholder="🔍 Buscar productos..."
                           onkeyup="handleSearch(this.value)">
                    
                    <select class="select" id="typeFilter" onchange="handleFilterChange()">
                        <option value="">🌈 Todos los tipos</option>
                        <option value="coffee">☕ Cafés</option>
                        <option value="food">🥐 Comidas</option>
                        <option value="drink">🥤 Bebidas</option>
                        <option value="dessert">🍰 Postres</option>
                    </select>
                    
                    <select class="select" id="statusFilter" onchange="handleFilterChange()">
                        <option value="">🎀 Todos los estados</option>
                        <option value="true">✅ Activos</option>
                        <option value="false">❌ Inactivos</option>
                    </select>
                    
                    <button class="btn btn-primary" onclick="showProductModal()">
                        ✨ Agregar Producto
                    </button>
                    
                    <button class="btn btn-secondary" onclick="exportProducts()">
                        📤 Exportar
                    </button>
                </div>

                <div id="stats" class="stats-container"></div>
                <div id="productsContainer" class="products-container"></div>

                <!-- Product Modal -->
                <div id="productModal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 id="modalTitle">✨ Agregar Nuevo Producto</h2>
                            <span class="close" onclick="hideProductModal()">&times;</span>
                        </div>
                        <form id="productForm" onsubmit="handleProductSubmit(event)">
                            <div class="form-group">
                                <label for="productName">🏷️ Nombre del Producto:</label>
                                <input type="text" id="productName" name="name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="productType">🎯 Tipo:</label>
                                <select id="productType" name="type" required>
                                    <option value="">Seleccionar tipo...</option>
                                    <option value="coffee">☕ Café</option>
                                    <option value="food">🥐 Comida</option>
                                    <option value="drink">🥤 Bebida</option>
                                    <option value="dessert">🍰 Postre</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="productCategory">📂 Categoría:</label>
                                <select id="productCategory" name="category" required>
                                    <option value="">Seleccionar categoría...</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="productPrice">💰 Precio:</label>
                                <input type="number" id="productPrice" name="price" step="0.01" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="productStock">📦 Stock:</label>
                                <input type="number" id="productStock" name="stock" min="0" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="productDescription">📝 Descripción:</label>
                                <textarea id="productDescription" name="description" rows="3"></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">
                                    <span id="submitButtonText">💾 Guardar Producto</span>
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="hideProductModal()">
                                    ❌ Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Notification -->
                <div id="notification" class="notification" style="display: none;">
                    <span id="notificationMessage"></span>
                    <button onclick="hideNotification()">&times;</button>
                </div>
            </div>
        `;

        // Setup global functions
        window.handleSearch = (value) => {
            app.view.currentFilters = { ...app.view.currentFilters, search: value };
            app.controller.renderProducts();
        };

        window.handleFilterChange = () => {
            const typeFilter = document.getElementById('typeFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            
            app.view.currentFilters = {
                ...app.view.currentFilters,
                type: typeFilter,
                status: statusFilter
            };
            app.controller.renderProducts();
        };

        window.showProductModal = () => {
            app.view.showProductModal();
        };

        window.hideProductModal = () => {
            app.view.hideProductModal();
        };

        window.handleProductSubmit = (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const productData = {
                name: formData.get('name'),
                type: formData.get('type'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                description: formData.get('description')
            };

            try {
                app.controller.addProduct(productData);
                app.view.hideProductModal();
            } catch (error) {
                app.view.showNotification(error.message, 'error');
            }
        };

        window.exportProducts = () => {
            const data = app.controller.exportProducts();
            app.view.showNotification('Productos exportados exitosamente', 'success');
        };

        window.hideNotification = () => {
            document.getElementById('notification').style.display = 'none';
        };

        // Initial render
        app.controller.render();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        // Clean up global functions
        delete window.handleSearch;
        delete window.handleFilterChange;
        delete window.showProductModal;
        delete window.hideProductModal;
        delete window.handleProductSubmit;
        delete window.exportProducts;
        delete window.hideNotification;
    });

    describe('👤 Complete User Workflows', () => {
        it('should handle complete product creation workflow', async () => {
            // User clicks "Add Product" button
            const addButton = document.querySelector('.btn.btn-primary');
            addButton.click();

            // Modal should appear
            const modal = document.getElementById('productModal');
            expect(modal.classList.contains('show')).toBe(true);

            // User fills out the form
            document.getElementById('productName').value = 'E2E Test Producto';
            document.getElementById('productType').value = 'coffee';
            
            // Trigger category update
            app.view.updateCategoryOptions();
            document.getElementById('productCategory').value = 'Americano';
            
            document.getElementById('productPrice').value = '4500';
            document.getElementById('productStock').value = '25';
            document.getElementById('productDescription').value = 'Producto creado en prueba E2E';

            // User submits the form
            const form = document.getElementById('productForm');
            const submitEvent = new Event('submit');
            form.dispatchEvent(submitEvent);

            // Product should be added to the system
            const products = app.service.getAllProducts();
            const addedProduct = products.find(p => p.name === 'E2E Test Producto');
            expect(addedProduct).toBeTruthy();
            expect(addedProduct.price).toBe(4500);
            expect(addedProduct.stock).toBe(25);

            // Modal should close
            expect(modal.classList.contains('show')).toBe(false);

            // Product should appear in the UI
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('E2E Test Producto');

            // Statistics should be updated
            const statsContainer = document.getElementById('stats');
            expect(statsContainer.innerHTML).not.toBe('');
        });

        it('should handle complete search and filter workflow', () => {
            // Add test products first
            const testProducts = [
                { name: 'Café Americano Especial', type: 'coffee', category: 'Americano', price: 3500, stock: 50 },
                { name: 'Café Latte Premium', type: 'coffee', category: 'Latte', price: 4500, stock: 30 },
                { name: 'Sandwich Club Deluxe', type: 'food', category: 'Sándwich', price: 8500, stock: 15 },
                { name: 'Jugo de Naranja Natural', type: 'drink', category: 'Jugo Natural', price: 4000, stock: 20 }
            ];

            testProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            app.controller.render();

            // User searches for "Café"
            const searchInput = document.getElementById('searchInput');
            searchInput.value = 'Café';
            searchInput.dispatchEvent(new Event('keyup'));

            // Results should be filtered
            let container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('Café Americano Especial');
            expect(container.innerHTML).toContain('Café Latte Premium');
            expect(container.innerHTML).not.toContain('Sandwich Club Deluxe');

            // User filters by type "coffee"
            const typeFilter = document.getElementById('typeFilter');
            typeFilter.value = 'coffee';
            typeFilter.dispatchEvent(new Event('change'));

            // Should show only coffee products
            container = document.getElementById('productsContainer');
            const visibleProducts = container.querySelectorAll('.product-card');
            expect(visibleProducts.length).toBeGreaterThan(0);

            // User clears search
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('keyup'));

            // Should show all coffee products
            container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('Café Americano Especial');
            expect(container.innerHTML).toContain('Café Latte Premium');
        });

        it('should handle complete product editing workflow', () => {
            // First add a product
            const originalProduct = app.controller.addProduct({
                name: 'Producto Original',
                type: 'coffee',
                category: 'Americano',
                price: 3000,
                stock: 20,
                description: 'Descripción original'
            });

            app.controller.render();

            // User clicks edit button (simulate)
            app.view.showProductModal(originalProduct);

            // Form should be populated with existing data
            expect(document.getElementById('productName').value).toBe('Producto Original');
            expect(document.getElementById('productPrice').value).toBe('3000');
            expect(document.getElementById('productStock').value).toBe('20');

            // User modifies the product
            document.getElementById('productName').value = 'Producto Editado';
            document.getElementById('productPrice').value = '3500';
            document.getElementById('productStock').value = '25';

            // Simulate update (since we don't have edit button in this test setup)
            const updatedData = {
                name: 'Producto Editado',
                type: 'coffee',
                category: 'Americano',
                price: 3500,
                stock: 25,
                description: 'Descripción original'
            };

            const updatedProduct = app.controller.updateProduct(originalProduct.id, updatedData);

            // Product should be updated
            expect(updatedProduct.name).toBe('Producto Editado');
            expect(updatedProduct.price).toBe(3500);
            expect(updatedProduct.stock).toBe(25);

            // UI should reflect changes
            app.controller.render();
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('Producto Editado');
            expect(container.innerHTML).not.toContain('Producto Original');
        });

        it('should handle complete product deletion workflow', () => {
            // Add a product to delete
            const productToDelete = app.controller.addProduct({
                name: 'Producto a Eliminar',
                type: 'coffee',
                category: 'Americano',
                price: 3000,
                stock: 15
            });

            app.controller.render();

            const initialCount = app.service.getAllProducts().length;

            // User deletes the product
            const deleteResult = app.controller.deleteProduct(productToDelete.id);
            expect(deleteResult).toBe(true);

            // Product should be removed from system
            const finalCount = app.service.getAllProducts().length;
            expect(finalCount).toBe(initialCount - 1);

            const deletedProduct = app.service.getProductById(productToDelete.id);
            expect(deletedProduct).toBeNull();

            // UI should be updated
            app.controller.render();
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).not.toContain('Producto a Eliminar');

            // Statistics should be updated
            const stats = app.service.getStats();
            expect(stats.totalProducts).toBe(finalCount);
        });

        it('should handle data persistence across page reloads', () => {
            // Add a product
            const testProduct = app.controller.addProduct({
                name: 'Producto Persistente',
                type: 'coffee',
                category: 'Americano',
                price: 4000,
                stock: 30
            });

            // Verify it's saved in localStorage
            const savedData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            expect(savedData).toBeTruthy();

            const parsedData = JSON.parse(savedData);
            const savedProduct = parsedData.products.find(p => p.id === testProduct.id);
            expect(savedProduct).toBeTruthy();
            expect(savedProduct.name).toBe('Producto Persistente');

            // Simulate page reload by creating new app instance
            const newApp = new CafeteriaApp();
            const reloadedProducts = newApp.service.getAllProducts();
            const reloadedProduct = reloadedProducts.find(p => p.id === testProduct.id);

            expect(reloadedProduct).toBeTruthy();
            expect(reloadedProduct.name).toBe('Producto Persistente');
            expect(reloadedProduct.price).toBe(4000);
        });

        it('should handle export functionality workflow', () => {
            // Add some test products
            const testProducts = [
                { name: 'Export Test 1', type: 'coffee', category: 'Americano', price: 3000, stock: 20 },
                { name: 'Export Test 2', type: 'food', category: 'Sándwich', price: 7000, stock: 10 }
            ];

            testProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            // User clicks export button
            const exportData = app.controller.exportProducts();

            // Export data should be valid
            expect(exportData).toBeTruthy();
            expect(typeof exportData).toBe('string');

            const parsedExport = JSON.parse(exportData);
            expect(parsedExport).toHaveProperty('products');
            expect(parsedExport).toHaveProperty('exportDate');
            expect(parsedExport).toHaveProperty('version');

            // Should contain the test products
            const exportedProducts = parsedExport.products;
            const exportedNames = exportedProducts.map(p => p.name);
            expect(exportedNames).toContain('Export Test 1');
            expect(exportedNames).toContain('Export Test 2');
        });

        it('should handle error scenarios gracefully', () => {
            // Try to add invalid product
            document.getElementById('productName').value = ''; // Invalid name
            document.getElementById('productType').value = 'coffee';
            document.getElementById('productPrice').value = '-100'; // Invalid price
            document.getElementById('productStock').value = 'invalid'; // Invalid stock

            const form = document.getElementById('productForm');
            
            // Form validation should prevent submission
            let errorOccurred = false;
            try {
                const submitEvent = new Event('submit');
                form.dispatchEvent(submitEvent);
            } catch (error) {
                errorOccurred = true;
            }

            // Application should handle errors gracefully
            // Product should not be added
            const products = app.service.getAllProducts();
            const invalidProduct = products.find(p => p.name === '');
            expect(invalidProduct).toBeFalsy();

            // Try to update non-existent product
            expect(() => {
                app.controller.updateProduct('non-existent-id', {
                    name: 'Updated Product',
                    type: 'coffee',
                    category: 'Test',
                    price: 3000,
                    stock: 15
                });
            }).toThrow();

            // Application should remain functional
            const validProduct = app.controller.addProduct({
                name: 'Valid Product After Error',
                type: 'coffee',
                category: 'Americano',
                price: 3000,
                stock: 15
            });

            expect(validProduct).toBeTruthy();
        });
    });

    describe('📱 User Interface Interactions', () => {
        it('should handle modal interactions correctly', () => {
            // Modal should be hidden initially
            const modal = document.getElementById('productModal');
            expect(modal.classList.contains('show')).toBe(false);

            // User opens modal
            const addButton = document.querySelector('.btn.btn-primary');
            addButton.click();

            expect(modal.classList.contains('show')).toBe(true);

            // User can close modal with X button
            const closeButton = document.querySelector('.close');
            closeButton.click();

            expect(modal.classList.contains('show')).toBe(false);

            // User can close modal with Cancel button
            addButton.click();
            expect(modal.classList.contains('show')).toBe(true);

            const cancelButton = document.querySelector('.btn.btn-secondary');
            cancelButton.click();

            expect(modal.classList.contains('show')).toBe(false);
        });

        it('should handle notification system', () => {
            const notification = document.getElementById('notification');

            // Show success notification
            app.view.showNotification('Test success message', 'success');
            expect(notification.style.display).not.toBe('none');
            expect(notification.textContent).toContain('Test success message');

            // User can dismiss notification
            const dismissButton = notification.querySelector('button');
            dismissButton.click();
            expect(notification.style.display).toBe('none');

            // Show error notification
            app.view.showNotification('Test error message', 'error');
            expect(notification.style.display).not.toBe('none');
            expect(notification.textContent).toContain('Test error message');
        });

        it('should handle dynamic category updates', () => {
            const typeSelect = document.getElementById('productType');
            const categorySelect = document.getElementById('productCategory');

            // Select coffee type
            typeSelect.value = 'coffee';
            app.view.updateCategoryOptions();

            // Category options should be updated for coffee
            const coffeeOptions = Array.from(categorySelect.options).map(opt => opt.value);
            expect(coffeeOptions).toContain('Americano');
            expect(coffeeOptions).toContain('Latte');
            expect(coffeeOptions).toContain('Cappuccino');

            // Select food type
            typeSelect.value = 'food';
            app.view.updateCategoryOptions();

            // Category options should be updated for food
            const foodOptions = Array.from(categorySelect.options).map(opt => opt.value);
            expect(foodOptions).toContain('Sándwich');
            expect(foodOptions).toContain('Ensalada');
            expect(foodOptions).toContain('Pizza');
        });
    });

    describe('🔄 Complex User Scenarios', () => {
        it('should handle inventory management scenario', () => {
            // Scenario: Restaurant manager managing daily inventory

            // 1. Manager adds new products for the day
            const morningProducts = [
                { name: 'Café del Día', type: 'coffee', category: 'Americano', price: 3200, stock: 100 },
                { name: 'Especial Desayuno', type: 'food', category: 'Sándwich', price: 9500, stock: 20 },
                { name: 'Jugo Fresco Mañana', type: 'drink', category: 'Jugo Natural', price: 4500, stock: 30 }
            ];

            morningProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            // 2. Check initial statistics
            let stats = app.service.getStats();
            expect(stats.totalProducts).toBeGreaterThan(10); // Including default products
            expect(stats.totalValue).toBeGreaterThan(0);

            // 3. Simulate sales by reducing stock
            const cafeDelDia = app.service.getAllProducts().find(p => p.name === 'Café del Día');
            app.controller.updateProduct(cafeDelDia.id, {
                ...cafeDelDia,
                stock: 50 // Sold 50 units
            });

            // 4. Check for low stock products
            const lowStockProduct = app.controller.addProduct({
                name: 'Producto Agotándose',
                type: 'dessert',
                category: 'Torta',
                price: 6500,
                stock: 3 // Low stock
            });

            stats = app.service.getStats();
            expect(stats.lowStockProducts).toBeGreaterThan(0);

            // 5. Filter to see only low stock items
            app.view.currentFilters = { lowStock: true };
            const lowStockProducts = app.service.getAllProducts().filter(p => 
                p.stock <= PRODUCT_CONFIG.MIN_STOCK_THRESHOLD && p.active
            );
            expect(lowStockProducts.length).toBeGreaterThan(0);

            // 6. Update stock for low stock item
            app.controller.updateProduct(lowStockProduct.id, {
                ...lowStockProduct,
                stock: 25 // Restocked
            });

            // 7. Export daily report
            const dailyReport = app.controller.exportProducts();
            expect(dailyReport).toBeTruthy();

            const reportData = JSON.parse(dailyReport);
            expect(reportData.products.length).toBeGreaterThan(10);
        });

        it('should handle menu planning scenario', () => {
            // Scenario: Chef planning weekly menu

            // 1. Add seasonal products
            const seasonalProducts = [
                { name: 'Latte Pumpkin Spice', type: 'coffee', category: 'Latte', price: 5200, stock: 40 },
                { name: 'Ensalada Otoñal', type: 'food', category: 'Ensalada', price: 8800, stock: 25 },
                { name: 'Smoothie Seasonal', type: 'drink', category: 'Smoothie', price: 5800, stock: 35 }
            ];

            seasonalProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            // 2. Categorize by type for menu planning
            const coffeeItems = app.service.filterProducts({ type: 'coffee' });
            const foodItems = app.service.filterProducts({ type: 'food' });
            const drinkItems = app.service.filterProducts({ type: 'drink' });

            expect(coffeeItems.length).toBeGreaterThan(0);
            expect(foodItems.length).toBeGreaterThan(0);
            expect(drinkItems.length).toBeGreaterThan(0);

            // 3. Check pricing strategy
            const avgCoffeePrice = coffeeItems.reduce((sum, p) => sum + p.price, 0) / coffeeItems.length;
            expect(avgCoffeePrice).toBeGreaterThan(0);

            // 4. Deactivate seasonal items (end of season)
            const pumpkinLatte = app.service.getAllProducts().find(p => p.name === 'Latte Pumpkin Spice');
            app.controller.updateProduct(pumpkinLatte.id, {
                ...pumpkinLatte,
                active: false
            });

            // 5. Filter active items for current menu
            const activeItems = app.service.filterProducts({ status: 'true' });
            expect(activeItems.every(p => p.active)).toBe(true);
            expect(activeItems.some(p => p.name === 'Latte Pumpkin Spice')).toBe(false);

            // 6. Generate menu report
            const menuReport = {
                coffee: coffeeItems.filter(p => p.active),
                food: foodItems.filter(p => p.active),
                drinks: drinkItems.filter(p => p.active)
            };

            expect(menuReport.coffee.length).toBeGreaterThan(0);
            expect(menuReport.food.length).toBeGreaterThan(0);
            expect(menuReport.drinks.length).toBeGreaterThan(0);
        });
    });
});