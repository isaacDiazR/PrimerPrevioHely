// ==========================================================================
// Coverage Analyzer - Analiza la cobertura de pruebas del proyecto
// ==========================================================================

class CoverageAnalyzer {
    constructor() {
        this.sourceFiles = [];
        this.testFiles = [];
        this.coverage = {
            totalFunctions: 0,
            testedFunctions: 0,
            totalLines: 0,
            executedLines: 0,
            percentage: 0
        };
    }

    /**
     * Analizar archivos fuente y determinar cobertura
     */
    async analyzeCoverage() {
        console.log('🔍 Analizando cobertura de código...\n');

        // Definir archivos fuente principales
        const sourceFiles = [
            'assets/js/models/product.js',
            'assets/js/services/productService.js',
            'assets/js/controllers/productController.js',
            'assets/js/views/productView.js',
            'assets/js/utils/validationUtils.js',
            'assets/js/utils/storageManager.js',
            'assets/js/utils/eventEmitter.js',
            'assets/js/utils/domUtils.js',
            'assets/js/app.js'
        ];

        // Definir archivos de pruebas
        const testFiles = [
            'tests/unit/whiteBoxTests.js',
            'tests/unit/blackBoxTests.js',
            'tests/unit/grayBoxTests.js',
            'tests/integration/integrationTests.js',
            'tests/e2e/e2eTests.js'
        ];

        // Analizar cada archivo fuente
        for (const filePath of sourceFiles) {
            await this.analyzeSourceFile(filePath);
        }

        // Analizar archivos de pruebas
        for (const testPath of testFiles) {
            await this.analyzeTestFile(testPath);
        }

        this.calculateCoverage();
        this.generateReport();
    }

    /**
     * Analizar archivo fuente para extraer funciones
     */
    async analyzeSourceFile(filePath) {
        try {
            const response = await fetch(filePath);
            const content = await response.text();
            
            const file = {
                path: filePath,
                functions: this.extractFunctions(content),
                lines: content.split('\n').length,
                className: this.extractClassName(content)
            };

            this.sourceFiles.push(file);
            console.log(`📁 ${filePath}: ${file.functions.length} funciones, ${file.lines} líneas`);
        } catch (error) {
            console.warn(`⚠️ No se pudo analizar ${filePath}: ${error.message}`);
        }
    }

    /**
     * Analizar archivo de pruebas
     */
    async analyzeTestFile(testPath) {
        try {
            const response = await fetch(testPath);
            const content = await response.text();
            
            const file = {
                path: testPath,
                tests: this.extractTests(content),
                describes: this.extractDescribes(content)
            };

            this.testFiles.push(file);
            console.log(`🧪 ${testPath}: ${file.tests.length} pruebas, ${file.describes.length} suites`);
        } catch (error) {
            console.warn(`⚠️ No se pudo analizar ${testPath}: ${error.message}`);
        }
    }

    /**
     * Extraer funciones de un archivo fuente
     */
    extractFunctions(content) {
        const functions = [];
        
        // Métodos de clase
        const methodRegex = /^\s*(async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm;
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            if (!['if', 'for', 'while', 'switch', 'catch'].includes(match[2])) {
                functions.push({
                    name: match[2],
                    type: 'method',
                    line: content.substring(0, match.index).split('\n').length
                });
            }
        }

        // Funciones independientes
        const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*\{/g;
        while ((match = functionRegex.exec(content)) !== null) {
            functions.push({
                name: match[1],
                type: 'function',
                line: content.substring(0, match.index).split('\n').length
            });
        }

        // Arrow functions
        const arrowRegex = /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g;
        while ((match = arrowRegex.exec(content)) !== null) {
            functions.push({
                name: match[1],
                type: 'arrow',
                line: content.substring(0, match.index).split('\n').length
            });
        }

        return functions;
    }

    /**
     * Extraer nombre de clase
     */
    extractClassName(content) {
        const classMatch = content.match(/class\s+(\w+)/);
        return classMatch ? classMatch[1] : null;
    }

    /**
     * Extraer pruebas de un archivo de test
     */
    extractTests(content) {
        const tests = [];
        const testRegex = /it\s*\(\s*['"`](.*?)['"`]/g;
        let match;
        while ((match = testRegex.exec(content)) !== null) {
            tests.push(match[1]);
        }
        return tests;
    }

    /**
     * Extraer describes de un archivo de test
     */
    extractDescribes(content) {
        const describes = [];
        const describeRegex = /describe\s*\(\s*['"`](.*?)['"`]/g;
        let match;
        while ((match = describeRegex.exec(content)) !== null) {
            describes.push(match[1]);
        }
        return describes;
    }

    /**
     * Calcular cobertura basada en análisis heurístico
     */
    calculateCoverage() {
        // Contar funciones totales
        this.coverage.totalFunctions = this.sourceFiles.reduce((total, file) => 
            total + file.functions.length, 0);

        // Contar líneas totales
        this.coverage.totalLines = this.sourceFiles.reduce((total, file) => 
            total + file.lines, 0);

        // Estimar funciones probadas basado en las pruebas
        const totalTests = this.testFiles.reduce((total, file) => 
            total + file.tests.length, 0);

        // Análisis heurístico de cobertura
        const coverageEstimate = this.estimateCoverage();
        
        this.coverage.testedFunctions = Math.floor(this.coverage.totalFunctions * coverageEstimate);
        this.coverage.executedLines = Math.floor(this.coverage.totalLines * coverageEstimate);
        this.coverage.percentage = Math.round(coverageEstimate * 100);

        console.log('\n📊 Cálculo de cobertura completado');
    }

    /**
     * Estimar cobertura basado en análisis heurístico
     */
    estimateCoverage() {
        // Factores para estimar cobertura
        const factors = {
            unitTests: 0.3,      // 30% de peso para unit tests
            integrationTests: 0.25,  // 25% para integration
            e2eTests: 0.2,       // 20% para e2e
            coverage: 0.25       // 25% para cobertura específica
        };

        // Analizar tipos de pruebas
        const unitTestCount = this.testFiles.filter(f => f.path.includes('unit')).length;
        const integrationTestCount = this.testFiles.filter(f => f.path.includes('integration')).length;
        const e2eTestCount = this.testFiles.filter(f => f.path.includes('e2e')).length;

        // Calcular score basado en pruebas existentes
        let score = 0;
        
        // Unit tests
        if (unitTestCount >= 3) score += factors.unitTests;
        else score += (unitTestCount / 3) * factors.unitTests;

        // Integration tests
        if (integrationTestCount >= 1) score += factors.integrationTests;
        
        // E2E tests
        if (e2eTestCount >= 1) score += factors.e2eTests;

        // Análisis de cobertura específica
        const coverageKeywords = [
            'Product', 'Service', 'Controller', 'View', 'Validation',
            'Storage', 'Event', 'DOM', 'CRUD', 'Filter', 'Search'
        ];

        let keywordCoverage = 0;
        this.testFiles.forEach(file => {
            file.describes.forEach(describe => {
                coverageKeywords.forEach(keyword => {
                    if (describe.includes(keyword)) {
                        keywordCoverage++;
                    }
                });
            });
        });

        const maxKeywords = coverageKeywords.length * this.testFiles.length;
        const keywordScore = Math.min(keywordCoverage / maxKeywords, 1);
        score += keywordScore * factors.coverage;

        return Math.min(score, 0.95); // Máximo 95% sin instrumentación real
    }

    /**
     * Generar reporte de cobertura
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 REPORTE DE COBERTURA DE CÓDIGO');
        console.log('='.repeat(60));

        console.log('\n📈 RESUMEN GENERAL:');
        console.log(`   • Archivos fuente analizados: ${this.sourceFiles.length}`);
        console.log(`   • Archivos de pruebas: ${this.testFiles.length}`);
        console.log(`   • Total de funciones: ${this.coverage.totalFunctions}`);
        console.log(`   • Total de líneas: ${this.coverage.totalLines}`);

        console.log('\n🎯 COBERTURA ESTIMADA:');
        console.log(`   • Funciones probadas: ${this.coverage.testedFunctions}/${this.coverage.totalFunctions}`);
        console.log(`   • Líneas ejecutadas: ${this.coverage.executedLines}/${this.coverage.totalLines}`);
        console.log(`   • PORCENTAJE DE COBERTURA: ${this.coverage.percentage}%`);

        // Indicador visual
        const barLength = 40;
        const filledLength = Math.floor((this.coverage.percentage / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        console.log(`   • Progreso: [${bar}] ${this.coverage.percentage}%`);

        console.log('\n📋 DETALLES POR ARCHIVO:');
        this.sourceFiles.forEach(file => {
            const fileName = file.path.split('/').pop();
            console.log(`   • ${fileName}: ${file.functions.length} funciones`);
        });

        console.log('\n🧪 TIPOS DE PRUEBAS:');
        const testTypes = {
            'Unit Tests (Caja Blanca)': this.testFiles.filter(f => f.path.includes('whiteBox')).length,
            'Unit Tests (Caja Negra)': this.testFiles.filter(f => f.path.includes('blackBox')).length,
            'Unit Tests (Caja Gris)': this.testFiles.filter(f => f.path.includes('grayBox')).length,
            'Integration Tests': this.testFiles.filter(f => f.path.includes('integration')).length,
            'E2E Tests': this.testFiles.filter(f => f.path.includes('e2e')).length
        };

        Object.entries(testTypes).forEach(([type, count]) => {
            const status = count > 0 ? '✅' : '❌';
            console.log(`   ${status} ${type}: ${count} archivo(s)`);
        });

        console.log('\n💡 RECOMENDACIONES:');
        if (this.coverage.percentage < 70) {
            console.log('   ⚠️ Cobertura baja - Agregar más pruebas unitarias');
        } else if (this.coverage.percentage < 85) {
            console.log('   📈 Cobertura buena - Considerar agregar pruebas de edge cases');
        } else {
            console.log('   🎉 Excelente cobertura de pruebas');
        }

        console.log('   📊 Para cobertura precisa, usar herramientas como Istanbul/NYC');
        console.log('   🔍 Considerar agregar pruebas de rendimiento');
        console.log('   🛡️ Verificar cobertura de casos de error');

        return this.coverage;
    }
}

// Función global para ejecutar análisis
window.analyzeCoverage = async function() {
    const analyzer = new CoverageAnalyzer();
    return await analyzer.analyzeCoverage();
};

console.log('📊 Coverage Analyzer cargado. Ejecuta analyzeCoverage() para analizar.');