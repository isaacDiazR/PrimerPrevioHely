// ==========================================================================
// Test Fixtures - Sample data for testing
// ==========================================================================

const TestFixtures = {
    // Valid product data
    validProducts: [
        {
            id: 'test-1',
            name: 'Café Americano Test',
            type: 'coffee',
            category: 'Americano',
            price: 3500,
            stock: 50,
            description: 'Café de prueba para testing',
            active: true
        },
        {
            id: 'test-2',
            name: 'Sandwich Test',
            type: 'food',
            category: 'Sándwich',
            price: 8500,
            stock: 15,
            description: 'Sandwich de prueba',
            active: true
        },
        {
            id: 'test-3',
            name: 'Jugo Test',
            type: 'drink',
            category: 'Jugo Natural',
            price: 4000,
            stock: 3,
            description: 'Jugo con stock bajo para testing',
            active: true
        }
    ],

    // Invalid product data for validation testing
    invalidProducts: [
        {
            name: '', // Empty name
            type: 'coffee',
            category: 'Americano',
            price: 3500,
            stock: 50
        },
        {
            name: 'Producto Válido',
            type: 'invalid_type', // Invalid type
            category: 'Americano',
            price: 3500,
            stock: 50
        },
        {
            name: 'Producto Válido',
            type: 'coffee',
            category: 'Americano',
            price: -100, // Negative price
            stock: 50
        },
        {
            name: 'Producto Válido',
            type: 'coffee',
            category: 'Americano',
            price: 3500,
            stock: -5 // Negative stock
        }
    ],

    // Edge cases
    edgeCases: [
        {
            name: 'A', // Minimum valid name length
            type: 'coffee',
            category: 'Americano',
            price: 0.01, // Minimum valid price
            stock: 0 // Minimum valid stock
        },
        {
            name: 'X'.repeat(100), // Maximum valid name length
            type: 'coffee',
            category: 'Americano',
            price: 999999, // Near maximum valid price
            stock: 9999 // Near maximum valid stock
        }
    ],

    // Filter test data
    filterTestData: {
        byType: {
            coffee: ['test-1'],
            food: ['test-2'],
            drink: ['test-3']
        },
        byStatus: {
            active: ['test-1', 'test-2', 'test-3'],
            inactive: []
        },
        byStock: {
            lowStock: ['test-3'], // stock <= 5
            normalStock: ['test-1', 'test-2']
        }
    },

    // Form validation test cases
    formValidation: {
        productName: {
            valid: ['Café Americano', 'Sándwich Club', 'Jugo de Naranja', 'A', 'X'.repeat(100)],
            invalid: ['', ' ', 'X'.repeat(101), '<script>alert("xss")</script>']
        },
        productPrice: {
            valid: [0.01, 1000, 99999.99, '3500', '4.50'],
            invalid: [0, -1, -100, 'abc', '', null, undefined, 1000001]
        },
        productStock: {
            valid: [0, 1, 100, 9999, '50', '0'],
            invalid: [-1, -100, 'abc', '', null, undefined, 10001, 1.5]
        }
    },

    // localStorage test data
    storageTestData: {
        validJSON: '{"products":[{"id":"1","name":"Test"}]}',
        invalidJSON: '{"products":[{"id":"1","name":}', // Malformed JSON
        largeData: JSON.stringify({
            products: Array(1000).fill().map((_, i) => ({
                id: `large-${i}`,
                name: `Product ${i}`,
                type: 'coffee',
                price: 1000 + i
            }))
        })
    },

    // Mock DOM elements
    mockDOM: {
        productForm: {
            id: 'productForm',
            elements: [
                { name: 'productName', value: 'Test Product' },
                { name: 'productType', value: 'coffee' },
                { name: 'productCategory', value: 'Americano' },
                { name: 'productPrice', value: '3500' },
                { name: 'productStock', value: '50' },
                { name: 'productDescription', value: 'Test description' }
            ]
        }
    },

    // Statistics test data
    statsTestData: {
        emptyStats: {
            totalProducts: 0,
            activeProducts: 0,
            totalValue: 0,
            lowStockProducts: 0
        },
        sampleStats: {
            totalProducts: 3,
            activeProducts: 3,
            totalValue: 240000, // (3500*50) + (8500*15) + (4000*3)
            lowStockProducts: 1
        }
    },

    // API response mocks
    apiMocks: {
        success: {
            status: 'success',
            data: [],
            message: 'Operation completed successfully'
        },
        error: {
            status: 'error',
            data: null,
            message: 'Operation failed'
        }
    },

    // Performance test data
    performanceTestData: {
        largeProductList: Array(1000).fill().map((_, i) => ({
            id: `perf-${i}`,
            name: `Performance Test Product ${i}`,
            type: ['coffee', 'food', 'drink', 'dessert'][i % 4],
            category: 'Test Category',
            price: 1000 + (i * 10),
            stock: 10 + (i % 100),
            active: i % 2 === 0
        }))
    }
};

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestFixtures;
}

// Make available globally for browser tests
if (typeof window !== 'undefined') {
    window.TestFixtures = TestFixtures;
}