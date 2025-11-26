#!/usr/bin/env node

// ==========================================================================
// CLI Test Runner - Executes tests in Node.js environment for CI/CD
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Create a minimal DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head><title>Test Runner</title></head>
<body></body>
</html>
`, {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
});

// Setup global window and document
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
    _data: {},
    getItem(key) { return this._data[key] || null; },
    setItem(key, value) { this._data[key] = String(value); },
    removeItem(key) { delete this._data[key]; },
    clear() { this._data = {}; }
};

// Mock alert, confirm, prompt for tests
global.alert = (msg) => console.log(`[ALERT] ${msg}`);
global.confirm = (msg) => { console.log(`[CONFIRM] ${msg}`); return true; };
global.prompt = (msg, def) => { console.log(`[PROMPT] ${msg}`); return def; };

console.log('🔧 Setting up test environment...\n');

// Load test framework
const testFrameworkPath = path.join(__dirname, 'testFramework.js');
const testFrameworkCode = fs.readFileSync(testFrameworkPath, 'utf8');
eval(testFrameworkCode);

// Load test runner
const testRunnerPath = path.join(__dirname, 'testRunner.js');
const testRunnerCode = fs.readFileSync(testRunnerPath, 'utf8');
eval(testRunnerCode);

// Load all test files
const testFiles = [
    // Unit tests
    'unit/whiteBoxTests.js',
    'unit/blackBoxTests.js',
    'unit/grayBoxTests.js',
    'unit/domUtilsTests.js',
    'unit/storageManagerTests.js',
    'unit/eventEmitterTests.js',
    'unit/errorHandlingTests.js',
    // Integration tests
    'integration/integrationTests.js',
    // E2E tests
    'e2e/e2eTests.js'
];

// Initialize test runner
const runner = new TestRunner();

// Add all test suites
const testSuites = [
    { name: 'White Box Tests', file: 'unit/whiteBoxTests.js', type: 'unit' },
    { name: 'Black Box Tests', file: 'unit/blackBoxTests.js', type: 'unit' },
    { name: 'Gray Box Tests', file: 'unit/grayBoxTests.js', type: 'unit' },
    { name: 'DOM Utils Tests', file: 'unit/domUtilsTests.js', type: 'unit' },
    { name: 'Storage Manager Tests', file: 'unit/storageManagerTests.js', type: 'unit' },
    { name: 'Event Emitter Tests', file: 'unit/eventEmitterTests.js', type: 'unit' },
    { name: 'Error Handling Tests', file: 'unit/errorHandlingTests.js', type: 'unit' },
    { name: 'Integration Tests', file: 'integration/integrationTests.js', type: 'integration' },
    { name: 'E2E Tests', file: 'e2e/e2eTests.js', type: 'e2e' }
];

// Load application files needed for tests
console.log('📦 Loading application modules...');
const appFiles = [
    '../assets/js/constants/storage.js',
    '../assets/js/constants/ui.js',
    '../assets/js/constants/visual.js',
    '../assets/js/constants/app.js',
    '../assets/js/utils/eventEmitter.js',
    '../assets/js/utils/storageManager.js',
    '../assets/js/utils/domUtils.js',
    '../assets/js/utils/validationUtils.js',
    '../assets/js/models/product.js',
    '../assets/js/services/productService.js',
    '../assets/js/controllers/productController.js',
    '../assets/js/views/productView.js',
    '../assets/js/config.js'
];

appFiles.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const code = fs.readFileSync(filePath, 'utf8');
            eval(code);
        }
    } catch (error) {
        console.warn(`⚠️  Could not load ${file}:`, error.message);
    }
});

console.log('✅ Application modules loaded\n');

// Load test data
const testDataPath = path.join(__dirname, 'fixtures/testData.js');
if (fs.existsSync(testDataPath)) {
    const testDataCode = fs.readFileSync(testDataPath, 'utf8');
    eval(testDataCode);
}

// Load and execute each test file
console.log('📝 Loading test suites...\n');

testFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        try {
            const testCode = fs.readFileSync(filePath, 'utf8');
            eval(testCode);
        } catch (error) {
            console.error(`❌ Error loading ${file}:`, error.message);
        }
    } else {
        console.warn(`⚠️  Test file not found: ${file}`);
    }
});

// Add suites to runner
testSuites.forEach(suite => {
    runner.addSuite(suite.name, suite.file, suite.type);
});

// Run all tests
(async () => {
    try {
        await runner.runAllTests();
    } catch (error) {
        console.error('❌ Fatal error running tests:', error);
        process.exit(1);
    }
})();
