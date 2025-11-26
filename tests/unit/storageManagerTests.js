// ==========================================================================
// StorageManager Tests - Enhanced Storage Testing
// ==========================================================================

describe('💾 StorageManager - Enhanced Storage Operations', () => {
    let storageManager;
    let mockLocalStorage;

    beforeAll(() => {
        // Create mock localStorage
        mockLocalStorage = {
            data: {},
            getItem: function(key) {
                return this.data[key] || null;
            },
            setItem: function(key, value) {
                this.data[key] = value.toString();
            },
            removeItem: function(key) {
                delete this.data[key];
            },
            clear: function() {
                this.data = {};
            }
        };

        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        storageManager = new StorageManager();
    });

    beforeEach(() => {
        mockLocalStorage.clear();
    });

    describe('💿 Basic Storage Operations', () => {
        it('should save and retrieve simple string', () => {
            storageManager.save('testKey', 'testValue');
            const result = storageManager.get('testKey');
            
            expect(result).toBe('testValue');
        });

        it('should save and retrieve number', () => {
            storageManager.save('price', 4000);
            const result = storageManager.get('price');
            
            expect(result).toBe(4000);
        });

        it('should save and retrieve boolean', () => {
            storageManager.save('isActive', true);
            const result = storageManager.get('isActive');
            
            expect(result).toBe(true);
        });

        it('should save and retrieve object', () => {
            const product = { 
                name: 'Café', 
                price: 4000, 
                stock: 10 
            };
            
            storageManager.save('product', product);
            const result = storageManager.get('product');
            
            expect(result).toEqual(product);
            expect(result.name).toBe('Café');
        });

        it('should save and retrieve array', () => {
            const products = [
                { id: 1, name: 'Café' },
                { id: 2, name: 'Té' },
                { id: 3, name: 'Jugo' }
            ];
            
            storageManager.save('products', products);
            const result = storageManager.get('products');
            
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(3);
            expect(result[0].name).toBe('Café');
        });

        it('should return null for non-existent key', () => {
            const result = storageManager.get('nonExistent');
            
            expect(result).toBeNull();
        });

        it('should return default value for non-existent key', () => {
            const defaultValue = { default: true };
            const result = storageManager.get('nonExistent', defaultValue);
            
            expect(result).toEqual(defaultValue);
        });
    });

    describe('🗑️ Delete Operations', () => {
        it('should remove item from storage', () => {
            storageManager.save('temp', 'value');
            expect(storageManager.get('temp')).toBe('value');
            
            storageManager.remove('temp');
            expect(storageManager.get('temp')).toBeNull();
        });

        it('should handle removing non-existent key', () => {
            expect(() => {
                storageManager.remove('nonExistent');
            }).not.toThrow();
        });

        it('should clear all storage', () => {
            storageManager.save('key1', 'value1');
            storageManager.save('key2', 'value2');
            storageManager.save('key3', 'value3');
            
            storageManager.clear();
            
            expect(storageManager.get('key1')).toBeNull();
            expect(storageManager.get('key2')).toBeNull();
            expect(storageManager.get('key3')).toBeNull();
        });
    });

    describe('🔍 Storage Introspection', () => {
        it('should check if key exists', () => {
            storageManager.save('existing', 'value');
            
            expect(storageManager.has('existing')).toBe(true);
            expect(storageManager.has('nonExisting')).toBe(false);
        });

        it('should get all keys', () => {
            storageManager.save('key1', 'value1');
            storageManager.save('key2', 'value2');
            storageManager.save('key3', 'value3');
            
            const keys = storageManager.keys();
            
            expect(keys.length).toBe(3);
            expect(keys).toContain('key1');
            expect(keys).toContain('key2');
            expect(keys).toContain('key3');
        });

        it('should get storage size', () => {
            storageManager.save('small', 'x');
            const size = storageManager.getSize();
            
            expect(size).toBeGreaterThan(0);
            expect(typeof size).toBe('number');
        });

        it('should calculate storage size in bytes', () => {
            const largeData = 'x'.repeat(1000);
            storageManager.save('large', largeData);
            
            const size = storageManager.getSize();
            expect(size).toBeGreaterThan(1000);
        });

        it('should format storage size', () => {
            storageManager.save('data', 'x'.repeat(1024));
            const formatted = storageManager.formatSize();
            
            expect(formatted).toMatch(/KB|bytes/);
        });
    });

    describe('⚠️ Error Handling', () => {
        it('should handle JSON serialization errors', () => {
            const circular = {};
            circular.self = circular;
            
            expect(() => {
                storageManager.save('circular', circular);
            }).not.toThrow();
        });

        it('should handle JSON parse errors gracefully', () => {
            mockLocalStorage.setItem('invalid', '{invalid json}');
            
            const result = storageManager.get('invalid');
            expect(result).toBeDefined();
        });

        it('should handle null values', () => {
            storageManager.save('nullValue', null);
            const result = storageManager.get('nullValue');
            
            expect(result).toBeNull();
        });

        it('should handle undefined values', () => {
            storageManager.save('undefinedValue', undefined);
            const result = storageManager.get('undefinedValue');
            
            expect(result).toBeDefined();
        });

        it('should handle empty string', () => {
            storageManager.save('empty', '');
            const result = storageManager.get('empty');
            
            expect(result).toBe('');
        });

        it('should handle storage quota exceeded', () => {
            const hugeData = 'x'.repeat(10000000);
            
            expect(() => {
                storageManager.save('huge', hugeData);
            }).not.toThrow();
        });
    });

    describe('🔄 Update Operations', () => {
        it('should update existing value', () => {
            storageManager.save('counter', 1);
            storageManager.save('counter', 2);
            const result = storageManager.get('counter');
            
            expect(result).toBe(2);
        });

        it('should update complex object', () => {
            const product = { id: 1, name: 'Café', price: 4000 };
            storageManager.save('product', product);
            
            product.price = 5000;
            storageManager.save('product', product);
            
            const result = storageManager.get('product');
            expect(result.price).toBe(5000);
        });

        it('should merge objects if merge flag is set', () => {
            const original = { id: 1, name: 'Café' };
            const update = { price: 4000 };
            
            storageManager.save('product', original);
            storageManager.merge('product', update);
            
            const result = storageManager.get('product');
            expect(result.id).toBe(1);
            expect(result.name).toBe('Café');
            expect(result.price).toBe(4000);
        });
    });

    describe('📊 Batch Operations', () => {
        it('should save multiple items at once', () => {
            const items = {
                key1: 'value1',
                key2: 'value2',
                key3: 'value3'
            };
            
            storageManager.saveMultiple(items);
            
            expect(storageManager.get('key1')).toBe('value1');
            expect(storageManager.get('key2')).toBe('value2');
            expect(storageManager.get('key3')).toBe('value3');
        });

        it('should get multiple items at once', () => {
            storageManager.save('key1', 'value1');
            storageManager.save('key2', 'value2');
            
            const results = storageManager.getMultiple(['key1', 'key2']);
            
            expect(results.key1).toBe('value1');
            expect(results.key2).toBe('value2');
        });

        it('should remove multiple items at once', () => {
            storageManager.save('key1', 'value1');
            storageManager.save('key2', 'value2');
            storageManager.save('key3', 'value3');
            
            storageManager.removeMultiple(['key1', 'key2']);
            
            expect(storageManager.get('key1')).toBeNull();
            expect(storageManager.get('key2')).toBeNull();
            expect(storageManager.get('key3')).toBe('value3');
        });
    });

    describe('🎯 Real-World Scenarios', () => {
        it('should persist user preferences', () => {
            const preferences = {
                theme: 'dark',
                language: 'es',
                notifications: true,
                itemsPerPage: 20
            };
            
            storageManager.save('userPreferences', preferences);
            const saved = storageManager.get('userPreferences');
            
            expect(saved).toEqual(preferences);
        });

        it('should handle product inventory', () => {
            const inventory = [
                { id: 1, name: 'Café', stock: 50 },
                { id: 2, name: 'Té', stock: 30 },
                { id: 3, name: 'Jugo', stock: 20 }
            ];
            
            storageManager.save('inventory', inventory);
            const saved = storageManager.get('inventory');
            
            expect(saved.length).toBe(3);
            expect(saved[0].stock).toBe(50);
        });

        it('should cache API responses', () => {
            const cacheKey = 'products_cache';
            const cacheData = {
                timestamp: Date.now(),
                data: [{ id: 1, name: 'Café' }],
                expires: Date.now() + 3600000
            };
            
            storageManager.save(cacheKey, cacheData);
            const cached = storageManager.get(cacheKey);
            
            expect(cached.data).toEqual(cacheData.data);
            expect(cached.timestamp).toBe(cacheData.timestamp);
        });

        it('should handle shopping cart data', () => {
            const cart = {
                items: [
                    { productId: 1, quantity: 2, price: 4000 },
                    { productId: 2, quantity: 1, price: 3000 }
                ],
                total: 11000,
                userId: 'user123'
            };
            
            storageManager.save('cart', cart);
            const savedCart = storageManager.get('cart');
            
            expect(savedCart.items.length).toBe(2);
            expect(savedCart.total).toBe(11000);
        });
    });

    describe('🧹 Storage Maintenance', () => {
        it('should cleanup old cache entries', () => {
            const oldCache = {
                timestamp: Date.now() - 7200000,
                data: 'old'
            };
            
            storageManager.save('oldCache', oldCache);
            storageManager.cleanupOldEntries(3600000); // 1 hour
            
            expect(storageManager.get('oldCache')).toBeNull();
        });

        it('should export all storage data', () => {
            storageManager.save('key1', 'value1');
            storageManager.save('key2', { data: 'value2' });
            
            const exported = storageManager.exportAll();
            
            expect(exported).toHaveProperty('key1');
            expect(exported).toHaveProperty('key2');
        });

        it('should import storage data', () => {
            const importData = {
                key1: 'value1',
                key2: 'value2',
                key3: { nested: 'value3' }
            };
            
            storageManager.importAll(importData);
            
            expect(storageManager.get('key1')).toBe('value1');
            expect(storageManager.get('key3').nested).toBe('value3');
        });
    });
});
