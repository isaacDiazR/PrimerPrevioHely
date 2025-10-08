// ==========================================================================
// Simple Test Framework - Lightweight testing framework for the project
// ==========================================================================

class SimpleTestFramework {
    constructor() {
        this.tests = [];
        this.suites = [];
        this.currentSuite = null;
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Create a test suite
     * @param {string} name - Suite name
     * @param {Function} fn - Suite function
     */
    describe(name, fn) {
        const suite = {
            name,
            tests: [],
            beforeEach: null,
            afterEach: null,
            beforeAll: null,
            afterAll: null
        };

        this.suites.push(suite);
        this.currentSuite = suite;

        try {
            fn();
        } catch (error) {
            console.error(`Error in suite "${name}":`, error);
        }

        this.currentSuite = null;
    }

    /**
     * Create a test case
     * @param {string} name - Test name
     * @param {Function} fn - Test function
     */
    it(name, fn) {
        const test = {
            name,
            fn,
            suite: this.currentSuite?.name || 'Global',
            status: 'pending',
            error: null,
            duration: 0
        };

        if (this.currentSuite) {
            this.currentSuite.tests.push(test);
        }

        this.tests.push(test);
    }

    /**
     * Skip a test
     * @param {string} name - Test name
     * @param {Function} fn - Test function
     */
    xit(name, fn) {
        this.it(name, () => {
            throw new Error('SKIPPED');
        });
    }

    /**
     * Set up before each test in suite
     * @param {Function} fn - Setup function
     */
    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = fn;
        }
    }

    /**
     * Clean up after each test in suite
     * @param {Function} fn - Cleanup function
     */
    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = fn;
        }
    }

    /**
     * Set up before all tests in suite
     * @param {Function} fn - Setup function
     */
    beforeAll(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeAll = fn;
        }
    }

    /**
     * Clean up after all tests in suite
     * @param {Function} fn - Cleanup function
     */
    afterAll(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterAll = fn;
        }
    }

    /**
     * Run all tests
     */
    async run() {
        this.startTime = Date.now();
        console.log('🧪 Starting Test Runner...\n');

        for (const suite of this.suites) {
            await this.runSuite(suite);
        }

        // Run global tests
        const globalTests = this.tests.filter(test => test.suite === 'Global');
        if (globalTests.length > 0) {
            await this.runTests(globalTests, 'Global Tests');
        }

        this.endTime = Date.now();
        this.printResults();
    }

    /**
     * Run a test suite
     * @param {Object} suite - Test suite
     */
    async runSuite(suite) {
        console.log(`📁 ${suite.name}`);

        // Run beforeAll
        if (suite.beforeAll) {
            try {
                await suite.beforeAll();
            } catch (error) {
                console.error(`  ❌ beforeAll failed: ${error.message}`);
                return;
            }
        }

        await this.runTests(suite.tests, suite.name, suite);

        // Run afterAll
        if (suite.afterAll) {
            try {
                await suite.afterAll();
            } catch (error) {
                console.error(`  ⚠️ afterAll failed: ${error.message}`);
            }
        }

        console.log('');
    }

    /**
     * Run tests in a group
     * @param {Array} tests - Array of tests
     * @param {string} groupName - Group name
     * @param {Object} suite - Suite object (optional)
     */
    async runTests(tests, groupName, suite = null) {
        for (const test of tests) {
            const testStart = Date.now();

            try {
                // Run beforeEach
                if (suite?.beforeEach) {
                    await suite.beforeEach();
                }

                // Run the test
                await test.fn();

                test.status = 'passed';
                test.duration = Date.now() - testStart;
                this.results.passed++;
                console.log(`  ✅ ${test.name} (${test.duration}ms)`);

            } catch (error) {
                test.duration = Date.now() - testStart;
                
                if (error.message === 'SKIPPED') {
                    test.status = 'skipped';
                    this.results.skipped++;
                    console.log(`  ⏭️ ${test.name} (skipped)`);
                } else {
                    test.status = 'failed';
                    test.error = error;
                    this.results.failed++;
                    console.log(`  ❌ ${test.name} (${test.duration}ms)`);
                    console.log(`     ${error.message}`);
                }
            } finally {
                // Run afterEach
                if (suite?.afterEach) {
                    try {
                        await suite.afterEach();
                    } catch (error) {
                        console.error(`     ⚠️ afterEach failed: ${error.message}`);
                    }
                }
            }

            this.results.total++;
        }
    }

    /**
     * Print test results summary
     */
    printResults() {
        const duration = this.endTime - this.startTime;
        const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

        console.log('═══════════════════════════════════════');
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⏭️ Skipped: ${this.results.skipped}`);
        console.log(`📈 Pass Rate: ${passRate}%`);
        console.log(`⏱️ Duration: ${duration}ms`);
        console.log('═══════════════════════════════════════');

        if (this.results.failed > 0) {
            console.log('\n💥 FAILED TESTS:');
            this.tests
                .filter(test => test.status === 'failed')
                .forEach(test => {
                    console.log(`  ❌ ${test.suite} > ${test.name}`);
                    console.log(`     ${test.error.message}`);
                    if (test.error.stack) {
                        console.log(`     ${test.error.stack.split('\n')[1]?.trim()}`);
                    }
                });
        }
    }
}

// ==========================================================================
// Assertion Library
// ==========================================================================

class Expect {
    constructor(actual) {
        this.actual = actual;
        this.isNegated = false;
    }

    get not() {
        this.isNegated = !this.isNegated;
        return this;
    }

    toBe(expected) {
        const result = this.actual === expected;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} be ${this._stringify(expected)}`);
        return this;
    }

    toEqual(expected) {
        const result = this._deepEqual(this.actual, expected);
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} equal ${this._stringify(expected)}`);
        return this;
    }

    toBeNull() {
        const result = this.actual === null;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} be null`);
        return this;
    }

    toBeUndefined() {
        const result = this.actual === undefined;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} be undefined`);
        return this;
    }

    toBeTruthy() {
        const result = !!this.actual;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} be truthy`);
        return this;
    }

    toBeFalsy() {
        const result = !this.actual;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} be falsy`);
        return this;
    }

    toContain(expected) {
        const result = this.actual && typeof this.actual.includes === 'function' && this.actual.includes(expected);
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} contain ${this._stringify(expected)}`);
        return this;
    }

    toHaveLength(expected) {
        const result = this.actual && this.actual.length === expected;
        this._assert(result, `Expected ${this._stringify(this.actual)} to${this.isNegated ? ' not' : ''} have length ${expected}`);
        return this;
    }

    toThrow(expected = null) {
        let threw = false;
        let error = null;

        try {
            if (typeof this.actual === 'function') {
                this.actual();
            }
        } catch (e) {
            threw = true;
            error = e;
        }

        if (expected) {
            const messageMatches = error && error.message.includes(expected);
            this._assert(threw && messageMatches, `Expected function to${this.isNegated ? ' not' : ''} throw error containing "${expected}"`);
        } else {
            this._assert(threw, `Expected function to${this.isNegated ? ' not' : ''} throw`);
        }

        return this;
    }

    _assert(condition, message) {
        const result = this.isNegated ? !condition : condition;
        if (!result) {
            throw new Error(message);
        }
    }

    _deepEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return a === b;
        if (typeof a !== typeof b) return false;
        if (typeof a !== 'object') return a === b;
        
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) return false;
        
        for (let key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!this._deepEqual(a[key], b[key])) return false;
        }
        
        return true;
    }

    _stringify(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    }
}

// Global test framework instance
const testFramework = new SimpleTestFramework();

// Export global functions
window.describe = testFramework.describe.bind(testFramework);
window.it = testFramework.it.bind(testFramework);
window.xit = testFramework.xit.bind(testFramework);
window.beforeEach = testFramework.beforeEach.bind(testFramework);
window.afterEach = testFramework.afterEach.bind(testFramework);
window.beforeAll = testFramework.beforeAll.bind(testFramework);
window.afterAll = testFramework.afterAll.bind(testFramework);
window.expect = (actual) => new Expect(actual);
window.runTests = () => testFramework.run();