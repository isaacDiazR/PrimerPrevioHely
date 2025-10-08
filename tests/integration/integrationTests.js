// ==========================================================================
// Integration Tests - Component Integration Testing
// ==========================================================================

describe('🔗 Integration Tests - Component Interactions', () => {
    let app;

    beforeAll(() => {
        // Setup complete application environment
        app = new CafeteriaApp();
    });

    beforeEach(() => {
        // Reset state for each test
        localStorage.clear();
        app.initialize();
    });

    describe('🎯 MVC Pattern Integration', () => {
        it('should integrate Model-View-Controller correctly', () => {
            // Setup DOM for full integration
            document.body.innerHTML = `
                <div id="productsContainer"></div>
                <div id="stats"></div>
                <form id="productForm">
                    <input id="productName" name="name" />
                    <select id="productType" name="type">
                        <option value="coffee">Coffee</option>
                    </select>
                    <input id="productPrice" name="price" />
                    <input id="productStock" name="stock" />
                </form>
                <div id="notification"></div>
            `;

            // Test complete flow: Model -> Controller -> View
            const productData = {
                name: 'Integration Test Product',
                type: 'coffee',
                category: 'Americano',
                price: 4000,
                stock: 30
            };

            // Act through Controller (should update Model and View)
            const product = app.controller.addProduct(productData);
            app.controller.render();

            // Assert: Model should be updated
            expect(app.service.getAllProducts()).toContain(product);

            // Assert: View should reflect changes
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('Integration Test Product');

            // Assert: Statistics should be recalculated
            const statsContainer = document.getElementById('stats');
            expect(statsContainer.innerHTML).toContain(app.service.getStats().totalProducts.toString());

            document.body.innerHTML = '';
        });

        it('should handle event flow between components', () => {
            let eventChain = [];

            // Monitor event flow
            app.service.on('product:added', () => {
                eventChain.push('service:product:added');
            });

            app.service.on('product:updated', () => {
                eventChain.push('service:product:updated');
            });

            // Perform operations
            const product = app.controller.addProduct({
                name: 'Event Test Product',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 20
            });

            app.controller.updateProduct(product.id, {
                ...product,
                price: 3500
            });

            // Assert: Event chain should be correct
            expect(eventChain).toEqual([
                'service:product:added',
                'service:product:updated'
            ]);
        });
    });

    describe('💾 Data Layer Integration', () => {
        it('should integrate Service with Storage correctly', () => {
            // Test Service -> StorageManager integration
            const originalProduct = {
                name: 'Storage Integration Test',
                type: 'food',
                category: 'Sandwich',
                price: 7500,
                stock: 25
            };

            // Add through service
            const addedProduct = app.service.addProduct(originalProduct);

            // Check StorageManager was called correctly
            const storageInfo = StorageManager.getStorageInfo();
            expect(storageInfo.itemCount).toBeGreaterThan(0);

            const savedData = StorageManager.getItem(APP_CONFIG.STORAGE_KEY);
            expect(savedData).toBeTruthy();
            expect(savedData.products.some(p => p.id === addedProduct.id)).toBe(true);

            // Test reload from storage
            const newService = new ProductService();
            const reloadedProduct = newService.getProductById(addedProduct.id);
            expect(reloadedProduct).toBeTruthy();
            expect(reloadedProduct.name).toBe(originalProduct.name);
        });

        it('should handle validation across layers', () => {
            // Test ValidationUtils -> Service -> Controller integration
            const invalidData = {
                name: '', // Invalid name
                type: 'coffee',
                category: 'Test',
                price: -100, // Invalid price
                stock: 'invalid' // Invalid stock
            };

            // Validation should be caught at service level
            expect(() => {
                app.service.addProduct(invalidData);
            }).toThrow();

            // Should also be caught at controller level
            expect(() => {
                app.controller.addProduct(invalidData);
            }).toThrow();

            // Verify no invalid data was stored
            const allProducts = app.service.getAllProducts();
            expect(allProducts.every(p => p.name.length > 0)).toBe(true);
            expect(allProducts.every(p => p.price > 0)).toBe(true);
        });
    });

    describe('🎨 UI Component Integration', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="productsContainer"></div>
                <div id="stats"></div>
                <form id="productForm">
                    <input id="productName" name="name" />
                    <select id="productType" name="type">
                        <option value="coffee">Coffee</option>
                        <option value="food">Food</option>
                    </select>
                    <input id="productCategory" name="category" />
                    <input id="productPrice" name="price" type="number" />
                    <input id="productStock" name="stock" type="number" />
                    <textarea id="productDescription" name="description"></textarea>
                </form>
                <div id="notification" style="display: none;"></div>
                <input id="searchInput" type="text" />
                <select id="typeFilter">
                    <option value="">All Types</option>
                    <option value="coffee">Coffee</option>
                    <option value="food">Food</option>
                </select>
            `;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should integrate form handling with data processing', () => {
            // Fill form with test data
            document.getElementById('productName').value = 'Form Integration Test';
            document.getElementById('productType').value = 'coffee';
            document.getElementById('productCategory').value = 'Americano';
            document.getElementById('productPrice').value = '4200';
            document.getElementById('productStock').value = '35';
            document.getElementById('productDescription').value = 'Test description';

            // Simulate form submission through app
            const formData = new FormData(document.getElementById('productForm'));
            const productData = {
                name: formData.get('name'),
                type: formData.get('type'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                description: formData.get('description')
            };

            // Process through controller
            const addedProduct = app.controller.addProduct(productData);

            // Verify integration worked
            expect(addedProduct.name).toBe('Form Integration Test');
            expect(addedProduct.price).toBe(4200);
            expect(addedProduct.stock).toBe(35);

            // Check data persistence
            const persistedProduct = app.service.getProductById(addedProduct.id);
            expect(persistedProduct).toEqual(addedProduct);
        });

        it('should integrate search and filter functionality', () => {
            // Add test products
            const testProducts = [
                { name: 'Coffee Americano', type: 'coffee', category: 'Americano', price: 3000, stock: 50 },
                { name: 'Coffee Latte', type: 'coffee', category: 'Latte', price: 4000, stock: 30 },
                { name: 'Sandwich Turkey', type: 'food', category: 'Sandwich', price: 8000, stock: 15 }
            ];

            testProducts.forEach(product => {
                app.controller.addProduct(product);
            });

            // Test search integration
            const searchInput = document.getElementById('searchInput');
            const typeFilter = document.getElementById('typeFilter');

            // Search for "Coffee"
            searchInput.value = 'Coffee';
            let results = app.service.filterProducts({ search: searchInput.value });
            expect(results.length).toBe(2);
            expect(results.every(p => p.name.includes('Coffee'))).toBe(true);

            // Filter by type "coffee"
            typeFilter.value = 'coffee';
            results = app.service.filterProducts({ type: typeFilter.value });
            expect(results.length).toBeGreaterThan(0);
            expect(results.every(p => p.type === 'coffee')).toBe(true);

            // Combined search and filter
            results = app.service.filterProducts({
                search: searchInput.value,
                type: typeFilter.value
            });
            expect(results.length).toBe(2);
            expect(results.every(p => p.name.includes('Coffee') && p.type === 'coffee')).toBe(true);
        });

        it('should integrate notification system with operations', () => {
            const notification = document.getElementById('notification');

            // Test success notification
            app.view.showNotification('Test success message', 'success');
            expect(notification.style.display).not.toBe('none');
            expect(notification.textContent).toContain('Test success message');

            // Test error notification
            app.view.showNotification('Test error message', 'error');
            expect(notification.textContent).toContain('Test error message');

            // Test auto-hide functionality
            setTimeout(() => {
                expect(notification.style.display).toBe('none');
            }, APP_CONFIG.NOTIFICATION_DURATION + 100);
        });
    });

    describe('🔄 Real-time Updates Integration', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="productsContainer"></div>
                <div id="stats"></div>
            `;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should update UI automatically when data changes', () => {
            // Initial render
            app.controller.render();
            const initialHTML = document.getElementById('productsContainer').innerHTML;
            const initialStats = document.getElementById('stats').innerHTML;

            // Add product
            const product = app.controller.addProduct({
                name: 'Real-time Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 20
            });

            // UI should update automatically through controller
            const newHTML = document.getElementById('productsContainer').innerHTML;
            const newStats = document.getElementById('stats').innerHTML;

            expect(newHTML).not.toBe(initialHTML);
            expect(newHTML).toContain('Real-time Test');
            expect(newStats).not.toBe(initialStats);
        });

        it('should maintain data consistency during concurrent operations', () => {
            // Simulate concurrent operations
            const operations = [];

            // Add multiple products simultaneously
            for (let i = 0; i < 10; i++) {
                operations.push(() => app.controller.addProduct({
                    name: `Concurrent Product ${i}`,
                    type: 'coffee',
                    category: 'Test',
                    price: 3000 + i,
                    stock: 10 + i
                }));
            }

            // Execute operations
            const results = operations.map(op => op());

            // Verify data consistency
            const allProducts = app.service.getAllProducts();
            results.forEach(product => {
                expect(allProducts).toContain(product);
            });

            // Verify no duplicate IDs
            const ids = allProducts.map(p => p.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids.length).toBe(uniqueIds.length);

            // Verify storage consistency
            const storageData = StorageManager.getItem(APP_CONFIG.STORAGE_KEY);
            expect(storageData.products.length).toBe(allProducts.length);
        });
    });

    describe('🛠️ Error Handling Integration', () => {
        it('should handle errors gracefully across all layers', () => {
            // Test error propagation from storage layer
            const originalSetItem = StorageManager.setItem;
            StorageManager.setItem = () => false; // Simulate storage failure

            let errorCaught = false;
            try {
                app.controller.addProduct({
                    name: 'Error Test',
                    type: 'coffee',
                    category: 'Test',
                    price: 3000,
                    stock: 15
                });
            } catch (error) {
                errorCaught = true;
            }

            // Application should handle storage errors gracefully
            expect(errorCaught).toBe(false); // Should not throw to user

            // Restore original function
            StorageManager.setItem = originalSetItem;
        });

        it('should maintain application state during errors', () => {
            const initialProductCount = app.service.getAllProducts().length;

            // Attempt invalid operations
            try {
                app.controller.addProduct({ name: '' }); // Invalid product
            } catch (error) {
                // Expected error
            }

            try {
                app.controller.updateProduct('invalid-id', {}); // Invalid ID
            } catch (error) {
                // Expected error
            }

            // Application state should remain consistent
            const finalProductCount = app.service.getAllProducts().length;
            expect(finalProductCount).toBe(initialProductCount);

            // Application should still be functional
            const validProduct = app.controller.addProduct({
                name: 'Recovery Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            expect(validProduct).toBeTruthy();
            expect(app.service.getAllProducts().length).toBe(initialProductCount + 1);
        });
    });

    describe('📈 Performance Integration', () => {
        it('should maintain performance across integrated operations', () => {
            const startTime = performance.now();

            // Perform complex integrated operations
            for (let i = 0; i < 100; i++) {
                const product = app.controller.addProduct({
                    name: `Performance Test ${i}`,
                    type: ['coffee', 'food', 'drink', 'dessert'][i % 4],
                    category: 'Performance',
                    price: 1000 + i,
                    stock: 10 + (i % 50)
                });

                if (i % 10 === 0) {
                    app.controller.updateProduct(product.id, {
                        ...product,
                        price: product.price + 500
                    });
                }

                if (i % 20 === 0) {
                    app.service.filterProducts({ search: 'Performance' });
                    app.service.getStats();
                }
            }

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            // Should complete in reasonable time
            expect(totalTime).toBeLessThan(2000); // 2 seconds for 100 operations

            // Data should be consistent
            const finalProducts = app.service.getAllProducts();
            const performanceProducts = finalProducts.filter(p => p.name.includes('Performance Test'));
            expect(performanceProducts.length).toBe(100);
        });
    });
});