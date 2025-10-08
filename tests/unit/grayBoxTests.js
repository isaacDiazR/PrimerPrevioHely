// ==========================================================================
// Gray Box Tests - Hybrid Testing (Testing de Caja Gris)
// Combina conocimiento interno con testing funcional
// ==========================================================================

describe('🔘 Gray Box Tests - Hybrid Functional + Structural', () => {
    let app;
    let mockLocalStorage;

    beforeAll(() => {
        // Setup mock localStorage with limited capacity for testing
        mockLocalStorage = {
            data: {},
            quota: 1024, // Simulate storage quota
            used: 0,
            getItem: function(key) {
                return this.data[key] || null;
            },
            setItem: function(key, value) {
                const size = value.toString().length;
                if (this.used + size > this.quota) {
                    throw new Error('QuotaExceededError');
                }
                this.data[key] = value.toString();
                this.used += size;
            },
            removeItem: function(key) {
                if (this.data[key]) {
                    this.used -= this.data[key].length;
                    delete this.data[key];
                }
            },
            clear: function() {
                this.data = {};
                this.used = 0;
            }
        };

        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });
    });

    beforeEach(() => {
        mockLocalStorage.clear();
        app = new CafeteriaApp();
    });

    describe('🔄 State Management Integration', () => {
        it('should maintain consistency between service and view layers', () => {
            // Gray Box: Test internal state + external behavior
            const productData = {
                name: 'Integration Test Product',
                type: 'coffee',
                category: 'Americano',
                price: 3500,
                stock: 25
            };

            // Act: Add product through controller
            const addedProduct = app.controller.addProduct(productData);

            // Assert: Check internal service state
            expect(app.service.products).toContain(addedProduct);
            expect(app.service.products.length).toBeGreaterThan(0);

            // Assert: Check external behavior
            const retrievedProduct = app.service.getProductById(addedProduct.id);
            expect(retrievedProduct).toEqual(addedProduct);

            // Check that localStorage was updated (internal mechanism)
            const storageData = JSON.parse(mockLocalStorage.getItem(APP_CONFIG.STORAGE_KEY));
            expect(storageData.products.some(p => p.id === addedProduct.id)).toBe(true);
        });

        it('should handle view updates when data changes', () => {
            // Setup DOM for view testing
            document.body.innerHTML = `
                <div id="productsContainer"></div>
                <div id="stats"></div>
            `;

            // Act: Add product and trigger view update
            const product = app.controller.addProduct({
                name: 'View Update Test',
                type: 'food',
                category: 'Sandwich',
                price: 8000,
                stock: 15
            });

            // Simulate controller render call (internal knowledge)
            app.controller.render();

            // Assert: Check DOM was updated (external behavior)
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('View Update Test');

            // Assert: Check internal state consistency
            expect(app.service.getAllProducts()).toContain(product);

            document.body.innerHTML = '';
        });
    });

    describe('💾 Storage Layer Performance', () => {
        it('should handle storage quota limitations gracefully', () => {
            // Gray Box: Test internal storage mechanics + external behavior
            let quotaExceeded = false;
            let lastSuccessfulProduct = null;

            try {
                // Add products until quota is exceeded
                for (let i = 0; i < 100; i++) {
                    const product = app.controller.addProduct({
                        name: `Large Product ${i} with very long description to consume storage`,
                        type: 'coffee',
                        category: 'Americano',
                        price: 3000 + i,
                        stock: 50,
                        description: 'Very long description '.repeat(10)
                    });
                    lastSuccessfulProduct = product;
                }
            } catch (error) {
                quotaExceeded = true;
            }

            // Assert: Should handle quota gracefully
            expect(quotaExceeded).toBe(true);
            expect(lastSuccessfulProduct).toBeTruthy();

            // Check internal state remains consistent
            expect(app.service.getAllProducts().length).toBeGreaterThan(0);

            // Check external behavior - app should still function
            const stats = app.service.getStats();
            expect(stats.totalProducts).toBeGreaterThan(0);
        });

        it('should optimize storage when possible', () => {
            // Add several products
            const products = [];
            for (let i = 0; i < 5; i++) {
                products.push(app.controller.addProduct({
                    name: `Product ${i}`,
                    type: 'coffee',
                    category: 'Test',
                    price: 3000,
                    stock: 10
                }));
            }

            // Check initial storage size
            const initialUsage = mockLocalStorage.used;

            // Delete some products (internal operation)
            app.controller.deleteProduct(products[0].id);
            app.controller.deleteProduct(products[1].id);

            // Assert: Storage should be reduced (internal knowledge)
            expect(mockLocalStorage.used).toBeLessThan(initialUsage);

            // Assert: External behavior should be correct
            const remainingProducts = app.service.getAllProducts();
            expect(remainingProducts).not.toContain(products[0]);
            expect(remainingProducts).not.toContain(products[1]);
        });
    });

    describe('🔍 Search Algorithm Efficiency', () => {
        beforeEach(() => {
            // Add large dataset to test search performance
            for (let i = 0; i < 50; i++) {
                app.controller.addProduct({
                    name: `Performance Test Product ${i}`,
                    type: ['coffee', 'food', 'drink', 'dessert'][i % 4],
                    category: `Category ${i % 10}`,
                    price: 1000 + (i * 100),
                    stock: 10 + (i % 50),
                    description: `Description for product ${i}`
                });
            }
        });

        it('should perform search efficiently with large datasets', () => {
            // Gray Box: Test internal algorithm + external performance
            const startTime = performance.now();

            // Test different search scenarios
            const coffeeProducts = app.service.filterProducts({ type: 'coffee' });
            const searchResults = app.service.filterProducts({ search: 'Performance' });
            const complexFilter = app.service.filterProducts({
                type: 'coffee',
                search: 'Product 1',
                status: 'true'
            });

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            // Assert: Search should be fast (performance requirement)
            expect(executionTime).toBeLessThan(100); // Should complete in <100ms

            // Assert: Results should be accurate (functional requirement)
            expect(coffeeProducts.length).toBeGreaterThan(0);
            coffeeProducts.forEach(product => {
                expect(product.type).toBe('coffee');
            });

            expect(searchResults.length).toBeGreaterThan(0);
            searchResults.forEach(product => {
                expect(product.name.toLowerCase()).toContain('performance');
            });

            // Check internal algorithm correctness
            expect(complexFilter.length).toBeLessThanOrEqual(coffeeProducts.length);
            expect(complexFilter.length).toBeLessThanOrEqual(searchResults.length);
        });

        it('should handle edge cases in search algorithm', () => {
            // Test search algorithm with edge cases
            const edgeCases = [
                '', // Empty search
                '   ', // Whitespace only
                'UPPERCASE', // Case sensitivity
                'nonexistent', // No results
                '123', // Numeric search
                'Ñ', // Special characters
                'Product 1' // Partial matches
            ];

            edgeCases.forEach(searchTerm => {
                // Should not throw errors (internal robustness)
                expect(() => {
                    const results = app.service.filterProducts({ search: searchTerm });
                    expect(Array.isArray(results)).toBe(true);
                }).not.toThrow();
            });
        });
    });

    describe('🎨 UI State Synchronization', () => {
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
                    <input id="productPrice" name="price" type="number" />
                    <input id="productStock" name="stock" type="number" />
                </form>
                <div id="notification" style="display: none;"></div>
            `;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('should synchronize UI state with data changes', () => {
            // Initial render
            app.view.renderProducts(app.service.getAllProducts());
            app.view.renderStats(app.service.getStats());

            const initialProductCount = document.getElementById('productsContainer').children.length;
            const statsContainer = document.getElementById('stats');
            const initialStatsHTML = statsContainer.innerHTML;

            // Add product through internal API
            const newProduct = app.controller.addProduct({
                name: 'UI Sync Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            // Trigger re-render (simulating real app behavior)
            app.controller.render();

            // Assert: UI should reflect changes
            const newProductCount = document.getElementById('productsContainer').children.length;
            expect(newProductCount).toBe(initialProductCount + 1);

            // Check that new product appears in UI
            const container = document.getElementById('productsContainer');
            expect(container.innerHTML).toContain('UI Sync Test');

            // Check stats are updated
            expect(statsContainer.innerHTML).not.toBe(initialStatsHTML);

            // Verify internal state matches UI state
            const renderedProducts = Array.from(container.children);
            const dataProducts = app.service.getAllProducts();
            expect(renderedProducts.length).toBe(dataProducts.length);
        });

        it('should handle form validation with real-time feedback', () => {
            // Test internal validation + UI feedback integration
            const form = document.getElementById('productForm');
            const nameInput = document.getElementById('productName');
            const priceInput = document.getElementById('productPrice');

            // Test invalid data scenarios
            const invalidCases = [
                { name: '', price: '1000', expectedError: 'nombre' },
                { name: 'Valid Product', price: '-100', expectedError: 'precio' },
                { name: 'Valid Product', price: '', expectedError: 'precio' }
            ];

            invalidCases.forEach(testCase => {
                // Set form values
                nameInput.value = testCase.name;
                priceInput.value = testCase.price;

                // Simulate form submission
                let validationPassed = true;
                let errorMessage = '';

                try {
                    const formData = new FormData(form);
                    const productData = {
                        name: formData.get('name'),
                        type: formData.get('type') || 'coffee',
                        category: 'Test',
                        price: parseFloat(formData.get('price')),
                        stock: 10
                    };

                    // Use internal validation
                    const validation = ValidationUtils.validateProduct(productData);
                    if (!validation.isValid) {
                        validationPassed = false;
                        errorMessage = validation.errors[0];
                    }
                } catch (error) {
                    validationPassed = false;
                    errorMessage = error.message;
                }

                // Assert: Should catch validation errors
                expect(validationPassed).toBe(false);
                expect(errorMessage.toLowerCase()).toContain(testCase.expectedError);
            });
        });
    });

    describe('📊 Business Logic Integration', () => {
        it('should calculate complex business metrics correctly', () => {
            // Add products with specific business scenarios
            const businessScenarios = [
                { name: 'High Value Product', price: 15000, stock: 100, type: 'food' },
                { name: 'Low Stock Item', price: 3000, stock: 2, type: 'coffee' },
                { name: 'Zero Stock Item', price: 5000, stock: 0, type: 'drink' },
                { name: 'Inactive Product', price: 4000, stock: 50, type: 'dessert', active: false }
            ];

            businessScenarios.forEach(scenario => {
                const product = app.controller.addProduct(scenario);
                if (scenario.active === false) {
                    app.controller.updateProduct(product.id, { ...product, active: false });
                }
            });

            const stats = app.service.getStats();

            // Assert: Business calculations should be accurate
            expect(stats.lowStockProducts).toBeGreaterThan(0); // Should detect low stock
            expect(stats.totalValue).toBeGreaterThan(0); // Should calculate total inventory value

            // Test internal business logic
            const lowStockProducts = app.service.getAllProducts().filter(p => 
                p.stock <= PRODUCT_CONFIG.MIN_STOCK_THRESHOLD && p.active
            );
            expect(stats.lowStockProducts).toBe(lowStockProducts.length);

            // Test external behavior - warnings should be triggered
            let lowStockWarningTriggered = false;
            app.service.on('low:stock', () => {
                lowStockWarningTriggered = true;
            });

            app.controller.checkLowStock();
            expect(lowStockWarningTriggered).toBe(true);
        });

        it('should handle inventory movements correctly', () => {
            // Create product with initial stock
            const product = app.controller.addProduct({
                name: 'Inventory Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 100
            });

            const initialStock = product.stock;
            const initialValue = app.service.getStats().totalValue;

            // Simulate stock movement (update)
            const updatedProduct = app.controller.updateProduct(product.id, {
                ...product,
                stock: 80 // Reduce stock by 20
            });

            const newStats = app.service.getStats();

            // Assert: Stock movement should affect calculations
            expect(updatedProduct.stock).toBe(80);
            expect(newStats.totalValue).toBeLessThan(initialValue);

            // Check internal consistency
            const storedProduct = app.service.getProductById(product.id);
            expect(storedProduct.stock).toBe(80);

            // Check persistence layer
            const persistedData = JSON.parse(mockLocalStorage.getItem(APP_CONFIG.STORAGE_KEY));
            const persistedProduct = persistedData.products.find(p => p.id === product.id);
            expect(persistedProduct.stock).toBe(80);
        });
    });

    describe('⚡ Performance and Memory Management', () => {
        it('should handle large datasets efficiently', () => {
            // Test with large dataset to check memory usage
            const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const largeDataset = [];

            // Create large dataset
            for (let i = 0; i < 1000; i++) {
                largeDataset.push({
                    name: `Performance Product ${i}`,
                    type: ['coffee', 'food', 'drink', 'dessert'][i % 4],
                    category: `Category ${i % 20}`,
                    price: 1000 + (i * 10),
                    stock: 10 + (i % 100),
                    description: `Performance test description ${i}`.repeat(5)
                });
            }

            // Measure performance of batch operations
            const startTime = performance.now();

            largeDataset.forEach(productData => {
                app.controller.addProduct(productData);
            });

            const addTime = performance.now() - startTime;

            // Test search performance
            const searchStartTime = performance.now();
            const searchResults = app.service.filterProducts({ search: 'Performance' });
            const searchTime = performance.now() - searchStartTime;

            // Test stats calculation performance
            const statsStartTime = performance.now();
            const stats = app.service.getStats();
            const statsTime = performance.now() - statsStartTime;

            const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;

            // Assert: Performance should be acceptable
            expect(addTime).toBeLessThan(5000); // Should add 1000 products in <5s
            expect(searchTime).toBeLessThan(100); // Search should be <100ms
            expect(statsTime).toBeLessThan(50); // Stats calculation should be <50ms

            // Assert: Results should be correct
            expect(searchResults.length).toBe(1000); // All products contain "Performance"
            expect(stats.totalProducts).toBe(1000 + 8); // 1000 + default products

            // Memory usage should be reasonable (if available)
            if (performance.memory) {
                const memoryIncrease = endMemory - startMemory;
                expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Should use <50MB
            }
        });

        it('should clean up resources properly', () => {
            // Add event listeners to test cleanup
            let eventCount = 0;
            const testHandler = () => { eventCount++; };

            app.service.on('product:added', testHandler);
            app.service.on('product:updated', testHandler);
            app.service.on('product:deleted', testHandler);

            // Perform operations
            const product = app.controller.addProduct({
                name: 'Cleanup Test',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            app.controller.updateProduct(product.id, { ...product, price: 3500 });
            app.controller.deleteProduct(product.id);

            // Assert: Events should have been triggered
            expect(eventCount).toBe(3);

            // Test cleanup
            app.service.removeAllListeners();

            // Add another product - no events should fire
            app.controller.addProduct({
                name: 'After Cleanup',
                type: 'coffee',
                category: 'Test',
                price: 3000,
                stock: 15
            });

            // Assert: Event count should remain the same
            expect(eventCount).toBe(3);

            // Assert: Internal state should still be consistent
            expect(app.service.getAllProducts().length).toBeGreaterThan(0);
        });
    });
});