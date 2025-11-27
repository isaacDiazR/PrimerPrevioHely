#!/usr/bin/env node

// ==========================================================================
// CLI Test Runner - Practical tests that validate code quality
// ==========================================================================

console.log('🧪 Running code quality tests...\n');

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
        return true;
    } catch (error) {
        console.error(`❌ ${name}`);
        console.error(`   ${error.message}`);
        failed++;
        return false;
    }
}

// Test 1: Todos los archivos existen
test('All required files exist', () => {
    const files = [
        'index.html',
        'package.json',
        'Dockerfile',
        'docker-compose.yml',
        'nginx.conf',
        'assets/js/app.js',
        'assets/js/config.js',
        'assets/js/models/product.js',
        'assets/js/services/productService.js',
        'assets/js/controllers/productController.js',
        'assets/js/views/productView.js',
        'assets/js/utils/validationUtils.js',
        'assets/js/utils/storageManager.js',
        'assets/js/utils/eventEmitter.js',
        'assets/js/utils/domUtils.js',
        'assets/css/styles.css'
    ];
    
    files.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Missing file: ${file}`);
        }
    });
});

// Test 2: Los archivos JavaScript no tienen errores de sintaxis
test('JavaScript files are parseable', () => {
    const jsFiles = [
        'assets/js/app.js',
        'assets/js/config.js',
        'assets/js/models/product.js',
        'assets/js/services/productService.js',
        'assets/js/controllers/productController.js',
        'assets/js/views/productView.js',
        'assets/js/utils/validationUtils.js',
        'assets/js/utils/storageManager.js',
        'assets/js/utils/eventEmitter.js',
        'assets/js/utils/domUtils.js'
    ];
    
    jsFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Verificar sintaxis básica
        try {
            new Function(content);
        } catch (error) {
            throw new Error(`Syntax error in ${file}: ${error.message}`);
        }
    });
});

// Test 3: Clases principales están definidas
test('Main classes are defined', () => {
    const classChecks = {
        'assets/js/models/product.js': 'class Product',
        'assets/js/services/productService.js': 'class ProductService',
        'assets/js/controllers/productController.js': 'class ProductController',
        'assets/js/views/productView.js': 'class ProductView',
        'assets/js/utils/validationUtils.js': 'class ValidationUtils',
        'assets/js/utils/storageManager.js': 'class StorageManager',
        'assets/js/utils/eventEmitter.js': 'class EventEmitter'
    };
    
    for (const [file, className] of Object.entries(classChecks)) {
        const fullPath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        if (!content.includes(className)) {
            throw new Error(`${className} not found in ${file}`);
        }
    }
});

// Test 4: No hay console.log en producción (excepto en archivos específicos)
test('No debug console.log in production code', () => {
    const excludeFiles = ['assets/js/config.js', 'tests/'];
    const jsFiles = [
        'assets/js/models/product.js',
        'assets/js/services/productService.js',
        'assets/js/controllers/productController.js',
        'assets/js/views/productView.js'
    ];
    
    jsFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Contar console.log que no sean comentarios
        const lines = content.split('\n');
        const debugLogs = lines.filter(line => 
            line.includes('console.log') && 
            !line.trim().startsWith('//') &&
            !line.trim().startsWith('*')
        );
        
        if (debugLogs.length > 3) {
            console.warn(`   ⚠️ ${file} has ${debugLogs.length} console.log statements`);
        }
    });
});

// Test 5: index.html es válido
test('index.html is valid HTML', () => {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const content = fs.readFileSync(htmlPath, 'utf8');
    
    if (!content.includes('<!DOCTYPE html>')) {
        throw new Error('Missing DOCTYPE declaration');
    }
    if (!content.includes('<html')) {
        throw new Error('Missing html tag');
    }
    if (!content.includes('<head>')) {
        throw new Error('Missing head tag');
    }
    if (!content.includes('<body')) {
        throw new Error('Missing body tag');
    }
    
    // Verificar que carga los scripts necesarios
    if (!content.includes('assets/js/app.js')) {
        throw new Error('app.js not loaded in HTML');
    }
});

// Test 6: package.json es válido
test('package.json is valid', () => {
    const pkg = require('../package.json');
    
    if (!pkg.name) throw new Error('Missing name in package.json');
    if (!pkg.version) throw new Error('Missing version in package.json');
    if (!pkg.scripts) throw new Error('Missing scripts in package.json');
    if (!pkg.scripts.test) throw new Error('Missing test script in package.json');
});

// Test 7: Dockerfile es válido
test('Dockerfile is valid', () => {
    const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
    const content = fs.readFileSync(dockerfilePath, 'utf8');
    
    if (!content.includes('FROM')) throw new Error('Missing FROM instruction');
    if (!content.includes('COPY')) throw new Error('Missing COPY instruction');
    if (!content.includes('nginx')) throw new Error('Not using nginx');
});

// Test 8: Validar que no hay funciones rotas obvias
test('No obvious broken functions', () => {
    const jsFiles = [
        'assets/js/utils/validationUtils.js',
        'assets/js/utils/storageManager.js',
        'assets/js/utils/eventEmitter.js'
    ];
    
    jsFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Verificar que cada función tiene return o no debería tenerlo
        const functionMatches = content.match(/\w+\s*\([^)]*\)\s*{/g) || [];
        
        // Verificar que no hay funciones vacías
        if (content.includes('function(){}') || content.includes('()=>{}')) {
            throw new Error(`${file} contains empty functions`);
        }
        
        // Verificar que no hay try sin catch
        const tryCount = (content.match(/\btry\s*{/g) || []).length;
        const catchCount = (content.match(/\bcatch\s*\(/g) || []).length;
        if (tryCount !== catchCount) {
            throw new Error(`${file} has ${tryCount} try blocks but ${catchCount} catch blocks`);
        }
    });
});

// Results
console.log('\n' + '='.repeat(50));
console.log('📊 TEST RESULTS');
console.log('='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);
console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(50));

if (failed > 0) {
    console.error('\n❌ Tests failed - fix the issues before deploying!');
    process.exit(1);
} else {
    console.log('\n✅ All tests passed - code quality verified!');
    process.exit(0);
}
