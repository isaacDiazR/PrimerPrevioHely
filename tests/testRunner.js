// ==========================================================================
// Test Runner - Main test execution orchestrator
// ==========================================================================

class TestRunner {
    constructor() {
        this.suites = [];
        this.results = {
            totalSuites: 0,
            passedSuites: 0,
            failedSuites: 0,
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            duration: 0
        };
    }

    /**
     * Add test suite to runner
     * @param {string} name - Suite name
     * @param {string} file - Test file path
     * @param {string} type - Test type (unit, integration, e2e)
     */
    addSuite(name, file, type = 'unit') {
        this.suites.push({ name, file, type });
    }

    /**
     * Run all test suites
     */
    async runAllTests() {
        console.log('🚀 Starting Test Runner...\n');
        const startTime = Date.now();

        console.log('📋 Test Suite Summary:');
        console.log(`   • ${this.suites.length} test suites loaded`);
        console.log(`   • Types: ${[...new Set(this.suites.map(s => s.type))].join(', ')}`);
        console.log('');

        for (const suite of this.suites) {
            await this.runSuite(suite);
        }

        this.results.duration = Date.now() - startTime;
        this.printFinalResults();
    }

    /**
     * Run specific test suite
     * @param {Object} suite - Test suite configuration
     */
    async runSuite(suite) {
        console.log(`📁 Running ${suite.type.toUpperCase()} Suite: ${suite.name}`);
        console.log(`   File: ${suite.file}`);
        console.log('');

        try {
            // Create new test framework instance for each suite
            const suiteFramework = new SimpleTestFramework();
            
            // Override global functions for this suite
            const originalDescribe = window.describe;
            const originalIt = window.it;
            const originalExpect = window.expect;

            window.describe = suiteFramework.describe.bind(suiteFramework);
            window.it = suiteFramework.it.bind(suiteFramework);
            window.expect = (actual) => new Expect(actual);

            // Load and execute the test file
            await this.loadTestFile(suite.file);

            // Run the tests
            await suiteFramework.run();

            // Collect results
            this.results.totalSuites++;
            this.results.totalTests += suiteFramework.results.total;
            this.results.passedTests += suiteFramework.results.passed;
            this.results.failedTests += suiteFramework.results.failed;
            this.results.skippedTests += suiteFramework.results.skipped;

            if (suiteFramework.results.failed === 0) {
                this.results.passedSuites++;
            } else {
                this.results.failedSuites++;
            }

            // Restore global functions
            window.describe = originalDescribe;
            window.it = originalIt;
            window.expect = originalExpected;

        } catch (error) {
            console.error(`❌ Error running suite ${suite.name}:`, error);
            this.results.totalSuites++;
            this.results.failedSuites++;
        }

        console.log('─'.repeat(50));
        console.log('');
    }

    /**
     * Load test file dynamically
     * @param {string} file - Test file path
     */
    async loadTestFile(file) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = file;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
            
            // Clean up after loading
            setTimeout(() => {
                document.head.removeChild(script);
            }, 100);
        });
    }

    /**
     * Print final test results
     */
    printFinalResults() {
        const passRate = this.results.totalTests > 0 
            ? ((this.results.passedTests / this.results.totalTests) * 100).toFixed(1)
            : 0;

        console.log('═'.repeat(60));
        console.log('🏆 FINAL TEST RESULTS');
        console.log('═'.repeat(60));
        console.log(`📊 Test Suites: ${this.results.totalSuites}`);
        console.log(`   ✅ Passed: ${this.results.passedSuites}`);
        console.log(`   ❌ Failed: ${this.results.failedSuites}`);
        console.log('');
        console.log(`🧪 Individual Tests: ${this.results.totalTests}`);
        console.log(`   ✅ Passed: ${this.results.passedTests}`);
        console.log(`   ❌ Failed: ${this.results.failedTests}`);
        console.log(`   ⏭️ Skipped: ${this.results.skippedTests}`);
        console.log(`   📈 Pass Rate: ${passRate}%`);
        console.log('');
        console.log(`⏱️ Total Duration: ${this.results.duration}ms`);
        console.log('═'.repeat(60));

        // Update UI if available
        this.updateUI();

        // Exit with error code if running in Node.js (CI mode)
        if (typeof process !== 'undefined' && process.exit) {
            const exitCode = this.results.failedTests > 0 ? 1 : 0;
            if (exitCode === 1) {
                console.error('\n❌ Tests failed - exiting with code 1');
            } else {
                console.log('\n✅ All tests passed - exiting with code 0');
            }
            setTimeout(() => process.exit(exitCode), 100);
        }
    }

    /**
     * Update UI with test results
     */
    updateUI() {
        const resultsContainer = document.getElementById('testResults');
        if (!resultsContainer) return;

        const passRate = this.results.totalTests > 0 
            ? ((this.results.passedTests / this.results.totalTests) * 100).toFixed(1)
            : 0;

        const statusColor = this.results.failedTests === 0 ? '#4CAF50' : '#F44336';
        const statusIcon = this.results.failedTests === 0 ? '✅' : '❌';
        const statusText = this.results.failedTests === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED';

        resultsContainer.innerHTML = `
            <div class="test-results-summary" style="background: ${statusColor}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2>${statusIcon} ${statusText}</h2>
                <div class="test-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div class="stat-item">
                        <div class="stat-label">Test Suites</div>
                        <div class="stat-value">${this.results.passedSuites}/${this.results.totalSuites}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Tests</div>
                        <div class="stat-value">${this.results.passedTests}/${this.results.totalTests}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Pass Rate</div>
                        <div class="stat-value">${passRate}%</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Duration</div>
                        <div class="stat-value">${this.results.duration}ms</div>
                    </div>
                </div>
            </div>

            <div class="test-breakdown" style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3>📊 Test Breakdown by Type</h3>
                <div class="breakdown-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    ${this.generateBreakdownHTML()}
                </div>
            </div>

            <div class="test-coverage" style="background: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3>🎯 Test Coverage Areas</h3>
                <ul style="list-style: none; padding: 0;">
                    <li>✅ Unit Tests (White/Black/Gray Box)</li>
                    <li>✅ Integration Tests</li>
                    <li>✅ End-to-End Tests</li>
                    <li>✅ Error Handling</li>
                    <li>✅ Performance Testing</li>
                    <li>✅ Data Persistence</li>
                    <li>✅ UI Interactions</li>
                </ul>
            </div>
        `;
    }

    /**
     * Generate breakdown HTML by test type
     */
    generateBreakdownHTML() {
        const typeGroups = this.suites.reduce((groups, suite) => {
            if (!groups[suite.type]) {
                groups[suite.type] = [];
            }
            groups[suite.type].push(suite);
            return groups;
        }, {});

        return Object.keys(typeGroups).map(type => {
            const suites = typeGroups[type];
            return `
                <div class="type-breakdown" style="border: 1px solid #ddd; border-radius: 4px; padding: 15px;">
                    <h4 style="margin-top: 0; color: #333;">${type.toUpperCase()} Tests</h4>
                    <div class="type-stats">
                        <div>Suites: ${suites.length}</div>
                        <div>Status: <span style="color: ${this.results.failedSuites === 0 ? '#4CAF50' : '#F44336'};">
                            ${this.results.failedSuites === 0 ? '✅ Passing' : '❌ Some Failed'}
                        </span></div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Initialize global test runner
window.TestRunner = TestRunner;