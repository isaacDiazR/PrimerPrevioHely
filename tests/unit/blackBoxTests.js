// ==========================================================================
// Black Box Tests - Functional Testing (Testing de Caja Negra)
// Tests basados en especificaciones sin conocer la implementación interna
// ==========================================================================

describe('⚫ Black Box Tests - Functional Requirements', () => {
    let app;

    beforeAll(() => {
        // Initialize application for testing
        app = new CafeteriaApp();
    });

    beforeEach(() => {
        // Reset application state
        localStorage.clear();
        app.initialize();
    });

    describe('🍕 Product Management - Basic CRUD Operations', () => {
        it('should add a new product successfully', () => {
            const productData = {
                name: 'Nuevo Café',
                type: 'coffee',
                category: 'Americano',
                price: 4000,
                stock: 25,
                description: 'Delicioso café nuevo'
            };

            // Act: Add product through the system
            const result = app.controller.addProduct(productData);

            // Assert: Product should be added
            expect(result).toBeTruthy();
            expect(result.name).toBe(productData.name);
            expect(result.price).toBe(productData.price);
            expect(result.active).toBe(true);
        });

        it('should retrieve all products', () => {
            // Act: Get all products
            const products = app.service.getAllProducts();

            // Assert: Should return array with default products
            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);
            expect(products[0]).toHaveProperty('name');
            expect(products[0]).toHaveProperty('price');
        });

        it('should update an existing product', () => {
            // Arrange: Get first product
            const products = app.service.getAllProducts();
            const productId = products[0].id;
            const originalName = products[0].name;

            const updateData = {
                name: 'Producto Actualizado',
                type: 'coffee',
                category: 'Americano',
                price: 5000,
                stock: 30
            };

            // Act: Update product
            const result = app.controller.updateProduct(productId, updateData);

            // Assert: Product should be updated
            expect(result).toBeTruthy();
            expect(result.name).toBe(updateData.name);
            expect(result.name).not.toBe(originalName);
            expect(result.price).toBe(updateData.price);
        });

        it('should delete a product', () => {
            // Arrange: Get initial count
            const initialProducts = app.service.getAllProducts();
            const initialCount = initialProducts.length;
            const productToDelete = initialProducts[0];

            // Act: Delete product
            const result = app.controller.deleteProduct(productToDelete.id);

            // Assert: Product should be deleted
            expect(result).toBe(true);
            
            const remainingProducts = app.service.getAllProducts();
            expect(remainingProducts.length).toBe(initialCount - 1);
            
            // Product should not exist anymore
            const deletedProduct = app.service.getProductById(productToDelete.id);
            expect(deletedProduct).toBeNull();
        });

        it('should reject invalid product data', () => {
            const invalidProducts = [
                { name: '', type: 'coffee', price: 1000, stock: 10 }, // Empty name
                { name: 'Valid', type: 'invalid', price: 1000, stock: 10 }, // Invalid type
                { name: 'Valid', type: 'coffee', price: -100, stock: 10 }, // Negative price
                { name: 'Valid', type: 'coffee', price: 1000, stock: -5 } // Negative stock
            ];

            invalidProducts.forEach((productData, index) => {
                expect(() => {
                    app.controller.addProduct(productData);
                }).toThrow(); // Should throw validation error
            });
        });
    });

    describe('🔍 Search and Filter Functionality', () => {
        beforeEach(() => {
            // Add test products
            const testProducts = [
                { name: 'Café Americano', type: 'coffee', category: 'Americano', price: 3000, stock: 50 },
                { name: 'Café Latte', type: 'coffee', category: 'Latte', price: 4000, stock: 30 },
                { name: 'Sandwich Club', type: 'food', category: 'Sándwich', price: 8000, stock: 15 },
                { name: 'Jugo Naranja', type: 'drink', category: 'Jugo Natural', price: 3500, stock: 20 }
            ];

            testProducts.forEach(product => {
                app.controller.addProduct(product);
            });
        });

        it('should filter products by type', () => {
            // Act: Filter by coffee type
            const coffeeProducts = app.service.filterProducts({ type: 'coffee' });

            // Assert: Should return only coffee products
            expect(coffeeProducts.length).toBeGreaterThan(0);
            coffeeProducts.forEach(product => {
                expect(product.type).toBe('coffee');
            });
        });

        it('should search products by name', () => {
            // Act: Search for "Café"
            const searchResults = app.service.filterProducts({ search: 'Café' });

            // Assert: Should return products containing "Café"
            expect(searchResults.length).toBeGreaterThan(0);
            searchResults.forEach(product => {
                expect(product.name.toLowerCase()).toContain('café');
            });
        });

        it('should filter products by status', () => {
            // Arrange: Deactivate one product
            const products = app.service.getAllProducts();
            const productToDeactivate = products[0];
            app.controller.updateProduct(productToDeactivate.id, { 
                ...productToDeactivate, 
                active: false 
            });

            // Act: Filter by active status
            const activeProducts = app.service.filterProducts({ status: 'true' });
            const inactiveProducts = app.service.filterProducts({ status: 'false' });

            // Assert: Should separate active and inactive products
            activeProducts.forEach(product => {
                expect(product.active).toBe(true);
            });

            inactiveProducts.forEach(product => {
                expect(product.active).toBe(false);
            });

            expect(inactiveProducts.length).toBeGreaterThan(0);
        });

        it('should combine multiple filters', () => {
            // Act: Filter by type AND search
            const results = app.service.filterProducts({ 
                type: 'coffee', 
                search: 'americano' 
            });

            // Assert: Should return coffee products containing "americano"
            results.forEach(product => {
                expect(product.type).toBe('coffee');
                expect(product.name.toLowerCase()).toContain('americano');
            });
        });
    });

    describe('📊 Statistics and Reporting', () => {
        it('should calculate correct statistics', () => {
            // Act: Get statistics
            const stats = app.service.getStats();

            // Assert: Statistics should be valid
            expect(stats).toHaveProperty('totalProducts');
            expect(stats).toHaveProperty('activeProducts');
            expect(stats).toHaveProperty('totalValue');
            expect(stats).toHaveProperty('lowStockProducts');

            expect(typeof stats.totalProducts).toBe('number');
            expect(typeof stats.activeProducts).toBe('number');
            expect(typeof stats.totalValue).toBe('number');
            expect(typeof stats.lowStockProducts).toBe('number');

            expect(stats.activeProducts).toBeLessThanOrEqual(stats.totalProducts);
            expect(stats.lowStockProducts).toBeLessThanOrEqual(stats.totalProducts);
        });

        it('should identify low stock products correctly', () => {
            // Arrange: Add product with low stock
            app.controller.addProduct({
                name: 'Low Stock Product',
                type: 'coffee',
                category: 'Americano',
                price: 3000,
                stock: 2 // Below threshold of 5
            });

            // Act: Get statistics
            const stats = app.service.getStats();

            // Assert: Should detect low stock
            expect(stats.lowStockProducts).toBeGreaterThan(0);
        });

        it('should calculate total value correctly', () => {
            // Arrange: Clear products and add known values
            app.service.products = [];
            
            const testProducts = [
                { name: 'Product 1', type: 'coffee', category: 'Test', price: 1000, stock: 10 },
                { name: 'Product 2', type: 'coffee', category: 'Test', price: 2000, stock: 5 }
            ];

            testProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            // Act: Get statistics
            const stats = app.service.getStats();

            // Assert: Total value should be (1000*10) + (2000*5) = 20000
            expect(stats.totalValue).toBe(20000);
        });
    });

    describe('💾 Data Persistence', () => {
        it('should save data to localStorage', () => {
            // Arrange: Add a product
            const testProduct = {
                name: 'Persistence Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            };

            // Act: Add product
            app.controller.addProduct(testProduct);

            // Assert: Data should be in localStorage
            const savedData = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            expect(savedData).toBeTruthy();
            
            const parsedData = JSON.parse(savedData);
            expect(parsedData.products).toBeTruthy();
            
            const foundProduct = parsedData.products.find(p => p.name === testProduct.name);
            expect(foundProduct).toBeTruthy();
        });

        it('should load data from localStorage', () => {
            // Arrange: Save test data to localStorage
            const testData = {
                products: [{
                    id: 'test-load-1',
                    name: 'Loaded Product',
                    type: 'coffee',
                    category: 'Test',
                    price: 4000,
                    stock: 25,
                    active: true
                }],
                lastUpdated: new Date().toISOString()
            };

            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(testData));

            // Act: Initialize new service
            const newService = new ProductService();

            // Assert: Should load the saved data
            const products = newService.getAllProducts();
            const loadedProduct = products.find(p => p.name === 'Loaded Product');
            expect(loadedProduct).toBeTruthy();
            expect(loadedProduct.price).toBe(4000);
        });

        it('should handle export functionality', () => {
            // Act: Export products
            const exportData = app.controller.exportProducts();

            // Assert: Export should return valid data
            expect(exportData).toBeTruthy();
            expect(typeof exportData).toBe('string');
            
            // Should be valid JSON
            const parsedData = JSON.parse(exportData);
            expect(parsedData).toHaveProperty('products');
            expect(parsedData).toHaveProperty('exportDate');
            expect(Array.isArray(parsedData.products)).toBe(true);
        });
    });

    describe('🎨 User Interface Behavior', () => {
        beforeEach(() => {
            // Set up DOM for UI tests
            document.body.innerHTML = `
                <div id="productsContainer"></div>
                <div id="stats"></div>
                <form id="productForm">
                    <input id="productName" name="name" />
                    <select id="productType" name="type">
                        <option value="coffee">Coffee</option>
                    </select>
                    <input id="productPrice" name="price" type="number" />
                    <input id="productStock" name="stock" type="number" />
                </form>
                <div id="notification"></div>
            `;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should render products in the UI', () => {
            // Act: Render products
            app.view.renderProducts(app.service.getAllProducts());

            // Assert: Products should appear in container
            const container = document.getElementById('productsContainer');
            expect(container.children.length).toBeGreaterThan(0);
        });

        it('should render statistics correctly', () => {
            // Act: Render statistics
            const stats = app.service.getStats();
            app.view.renderStats(stats);

            // Assert: Stats should appear in UI
            const statsContainer = document.getElementById('stats');
            expect(statsContainer.innerHTML).not.toBe('');
            expect(statsContainer.innerHTML).toContain(stats.totalProducts.toString());
        });

        it('should show notifications', () => {
            // Act: Show notification
            app.view.showNotification('Test message', 'success');

            // Assert: Notification should be visible
            const notification = document.getElementById('notification');
            expect(notification.style.display).not.toBe('none');
        });
    });

    describe('⚠️ Error Handling', () => {
        it('should handle missing required fields gracefully', () => {
            const incompleteData = {
                name: 'Incomplete Product'
                // Missing required fields
            };

            expect(() => {
                app.controller.addProduct(incompleteData);
            }).toThrow();
        });

        it('should handle invalid product IDs', () => {
            // Act & Assert: Should handle non-existent product ID
            const result = app.service.getProductById('non-existent-id');
            expect(result).toBeNull();

            expect(() => {
                app.controller.updateProduct('non-existent-id', {});
            }).toThrow();
        });

        it('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw error
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = () => {
                throw new Error('Storage quota exceeded');
            };

            // Act: Try to add product
            const result = app.controller.addProduct({
                name: 'Test Product',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            // Should not crash the application
            expect(result).toBeTruthy();

            // Restore localStorage
            localStorage.setItem = originalSetItem;
        });
    });

    describe('🔄 Integration Points', () => {
        it('should maintain data consistency across operations', () => {
            // Arrange: Get initial state
            const initialCount = app.service.getAllProducts().length;

            // Act: Perform multiple operations
            const addedProduct = app.controller.addProduct({
                name: 'Consistency Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            const updatedProduct = app.controller.updateProduct(addedProduct.id, {
                name: 'Updated Consistency Test',
                type: 'coffee',
                category: 'Test',
                price: 3500,
                stock: 20
            });

            // Assert: Data should remain consistent
            expect(app.service.getAllProducts().length).toBe(initialCount + 1);
            expect(updatedProduct.name).toBe('Updated Consistency Test');
            expect(updatedProduct.id).toBe(addedProduct.id);
        });

        it('should trigger appropriate events', () => {
            let eventTriggered = false;
            
            // Arrange: Listen for events
            app.service.on('product:added', () => {
                eventTriggered = true;
            });

            // Act: Add product
            app.controller.addProduct({
                name: 'Event Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            // Assert: Event should be triggered
            expect(eventTriggered).toBe(true);
        });
    });
});