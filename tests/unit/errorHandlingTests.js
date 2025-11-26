// ==========================================================================
// Error Handling Tests - Edge Cases and Error Scenarios
// ==========================================================================

describe('⚠️ Error Handling - Edge Cases and Error Recovery', () => {
    let app;

    beforeEach(() => {
        localStorage.clear();
        app = new CafeteriaApp();
    });

    describe('🚨 Validation Errors', () => {
        it('should handle invalid product name', () => {
            const invalidProduct = {
                name: '', // Empty name
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const result = app.controller.addProduct(invalidProduct);
            
            expect(result).toBeFalsy();
        });

        it('should handle negative price', () => {
            const product = {
                name: 'Café',
                type: 'coffee',
                price: -100,
                stock: 10
            };

            const result = app.controller.addProduct(product);
            
            expect(result).toBeFalsy();
        });

        it('should handle negative stock', () => {
            const product = {
                name: 'Café',
                type: 'coffee',
                price: 4000,
                stock: -5
            };

            const result = app.controller.addProduct(product);
            
            expect(result).toBeFalsy();
        });

        it('should handle extremely large price', () => {
            const product = {
                name: 'Café Premium',
                type: 'coffee',
                price: 999999999999,
                stock: 10
            };

            const validation = ValidationUtils.validatePrice(product.price);
            expect(validation.valid).toBe(false);
        });

        it('should handle price as string', () => {
            const product = {
                name: 'Café',
                type: 'coffee',
                price: 'not a number',
                stock: 10
            };

            const validation = ValidationUtils.validatePrice(product.price);
            expect(validation.valid).toBe(false);
        });

        it('should handle special characters in name', () => {
            const product = {
                name: '<script>alert("XSS")</script>',
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const validation = ValidationUtils.validateProductName(product.name);
            expect(validation.valid).toBe(false);
        });

        it('should handle very long product name', () => {
            const product = {
                name: 'A'.repeat(200),
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const validation = ValidationUtils.validateProductName(product.name);
            expect(validation.valid).toBe(false);
        });

        it('should handle missing required fields', () => {
            const incompleteProduct = {
                name: 'Café'
                // Missing type, price, stock
            };

            const result = ValidationUtils.validateProduct(incompleteProduct);
            expect(result.valid).toBe(false);
        });
    });

    describe('🔍 Service Layer Errors', () => {
        it('should handle update on non-existent product', () => {
            const result = app.service.updateProduct('nonexistent-id', {
                name: 'Updated'
            });

            expect(result).toBeFalsy();
        });

        it('should handle delete on non-existent product', () => {
            const result = app.service.deleteProduct('nonexistent-id');
            
            expect(result).toBe(false);
        });

        it('should handle search with null query', () => {
            const results = app.service.searchProducts(null);
            
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle search with empty query', () => {
            const results = app.service.searchProducts('');
            
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle filter with invalid criteria', () => {
            const results = app.service.filterProducts({
                invalidField: 'value'
            });
            
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle corrupted localStorage data', () => {
            localStorage.setItem('products', 'invalid json {]');
            
            expect(() => {
                const service = new ProductService();
                service.loadProducts();
            }).not.toThrow();
        });

        it('should handle localStorage quota exceeded', () => {
            const hugeData = Array(10000).fill({
                id: '1',
                name: 'Product'.repeat(100),
                description: 'Desc'.repeat(100)
            });

            expect(() => {
                app.service.saveProducts(hugeData);
            }).not.toThrow();
        });
    });

    describe('🎮 Controller Errors', () => {
        it('should handle render with no products', () => {
            app.service.products = [];
            
            expect(() => {
                app.controller.render();
            }).not.toThrow();
        });

        it('should handle initialization errors', () => {
            const brokenApp = new CafeteriaApp();
            
            expect(() => {
                brokenApp.initialize();
            }).not.toThrow();
        });

        it('should handle form submission with invalid data', () => {
            document.body.innerHTML = `
                <form id="productForm">
                    <input name="name" value="" />
                    <input name="price" value="invalid" />
                </form>
            `;

            expect(() => {
                app.controller.handleFormSubmit(new Event('submit'));
            }).not.toThrow();
        });

        it('should handle missing DOM elements', () => {
            document.body.innerHTML = '';
            
            expect(() => {
                app.controller.render();
            }).not.toThrow();
        });
    });

    describe('💾 Storage Errors', () => {
        it('should handle localStorage not available', () => {
            const originalLocalStorage = window.localStorage;
            delete window.localStorage;

            expect(() => {
                new StorageManager();
            }).not.toThrow();

            window.localStorage = originalLocalStorage;
        });

        it('should fallback to memory storage when localStorage fails', () => {
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = () => {
                throw new Error('Storage full');
            };

            const manager = new StorageManager();
            expect(() => {
                manager.save('key', 'value');
            }).not.toThrow();

            localStorage.setItem = originalSetItem;
        });

        it('should handle concurrent writes', () => {
            const promises = Array(10).fill(null).map((_, i) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        app.service.addProduct({
                            name: `Product ${i}`,
                            type: 'coffee',
                            price: 4000,
                            stock: 10
                        });
                        resolve();
                    }, Math.random() * 100);
                });
            });

            expect(Promise.all(promises)).resolves.toBeDefined();
        });
    });

    describe('🖼️ View Errors', () => {
        it('should handle rendering null product', () => {
            expect(() => {
                app.view.renderProduct(null);
            }).not.toThrow();
        });

        it('should handle rendering undefined product', () => {
            expect(() => {
                app.view.renderProduct(undefined);
            }).not.toThrow();
        });

        it('should handle rendering with missing container', () => {
            document.body.innerHTML = '';
            
            expect(() => {
                app.view.render([]);
            }).not.toThrow();
        });

        it('should sanitize HTML in product data', () => {
            const maliciousProduct = {
                id: '1',
                name: '<img src=x onerror="alert(1)">',
                description: '<script>alert("XSS")</script>',
                price: 4000,
                stock: 10
            };

            const html = app.view.renderProduct(maliciousProduct);
            expect(html).not.toContain('<script>');
            expect(html).not.toContain('onerror');
        });
    });

    describe('🔄 Race Conditions', () => {
        it('should handle rapid add/delete operations', () => {
            const product = app.controller.addProduct({
                name: 'Café',
                type: 'coffee',
                price: 4000,
                stock: 10
            });

            expect(() => {
                app.controller.deleteProduct(product.id);
                app.controller.deleteProduct(product.id);
                app.controller.deleteProduct(product.id);
            }).not.toThrow();
        });

        it('should handle simultaneous filter changes', () => {
            expect(() => {
                app.controller.filterByType('coffee');
                app.controller.filterByType('food');
                app.controller.filterByType('');
            }).not.toThrow();
        });

        it('should handle rapid search updates', () => {
            const queries = ['caf', 'café', 'c', '', 'coffee'];
            
            expect(() => {
                queries.forEach(q => app.controller.search(q));
            }).not.toThrow();
        });
    });

    describe('📱 Edge Cases', () => {
        it('should handle zero price', () => {
            const freeProduct = {
                name: 'Muestra Gratis',
                type: 'coffee',
                price: 0,
                stock: 100
            };

            const validation = ValidationUtils.validatePrice(freeProduct.price);
            expect(validation.valid).toBe(true);
        });

        it('should handle zero stock', () => {
            const outOfStock = {
                name: 'Café',
                type: 'coffee',
                price: 4000,
                stock: 0
            };

            const result = app.controller.addProduct(outOfStock);
            expect(result).toBeDefined();
            expect(result.stock).toBe(0);
        });

        it('should handle decimal prices', () => {
            const product = {
                name: 'Café',
                type: 'coffee',
                price: 4000.99,
                stock: 10
            };

            const validation = ValidationUtils.validatePrice(product.price);
            expect(validation.valid).toBe(true);
        });

        it('should handle very small positive numbers', () => {
            const product = {
                name: 'Café',
                type: 'coffee',
                price: 0.01,
                stock: 1
            };

            const validation = ValidationUtils.validatePrice(product.price);
            expect(validation.valid).toBe(true);
        });

        it('should handle unicode characters in name', () => {
            const product = {
                name: 'Café con ñ y emojis ☕🥐',
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const validation = ValidationUtils.validateProductName(product.name);
            expect(validation.valid).toBe(true);
        });

        it('should handle empty product list gracefully', () => {
            app.service.products = [];
            
            const stats = app.service.getStatistics();
            
            expect(stats.total).toBe(0);
            expect(stats.totalValue).toBe(0);
        });

        it('should handle duplicate product names', () => {
            const product1 = app.controller.addProduct({
                name: 'Café Americano',
                type: 'coffee',
                price: 4000,
                stock: 10
            });

            const product2 = app.controller.addProduct({
                name: 'Café Americano',
                type: 'coffee',
                price: 4500,
                stock: 5
            });

            expect(product1.id).not.toBe(product2.id);
        });
    });

    describe('🛡️ Security Tests', () => {
        it('should prevent XSS in product name', () => {
            const xssAttempt = {
                name: '"><script>alert("XSS")</script>',
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const validation = ValidationUtils.validateProductName(xssAttempt.name);
            expect(validation.valid).toBe(false);
        });

        it('should prevent SQL injection-like strings', () => {
            const sqlAttempt = {
                name: "'; DROP TABLE products; --",
                type: 'coffee',
                price: 4000,
                stock: 10
            };

            const validation = ValidationUtils.validateProductName(sqlAttempt.name);
            expect(validation.valid).toBe(false);
        });

        it('should sanitize user input', () => {
            const unsafeInput = '<img src=x onerror=alert(1)>';
            const sanitized = ValidationUtils.sanitizeInput(unsafeInput);
            
            expect(sanitized).not.toContain('<');
            expect(sanitized).not.toContain('onerror');
        });
    });
});
