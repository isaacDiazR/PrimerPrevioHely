// ==========================================================================
// DOM Utilities - Centralized DOM manipulation helpers
// ==========================================================================

class DOMUtils {
    /**
     * Get element by ID with error handling
     * @param {string} id - Element ID
     * @returns {HTMLElement|null} Element or null
     */
    static getElementById(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.error(`Error getting element by ID (${id}):`, error);
            return null;
        }
    }

    /**
     * Query selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (default: document)
     * @returns {HTMLElement|null} Element or null
     */
    static querySelector(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (error) {
            console.error(`Error querying selector (${selector}):`, error);
            return null;
        }
    }

    /**
     * Query all selectors with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (default: document)
     * @returns {NodeList} NodeList of elements
     */
    static querySelectorAll(selector, parent = document) {
        try {
            return parent.querySelectorAll(selector) || [];
        } catch (error) {
            console.error(`Error querying all selectors (${selector}):`, error);
            return [];
        }
    }

    /**
     * Add class to element safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string|string[]} className - Class name(s) to add
     */
    static addClass(element, className) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        if (Array.isArray(className)) {
            className.forEach(cls => el.classList.add(cls));
        } else {
            el.classList.add(className);
        }
    }

    /**
     * Remove class from element safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string|string[]} className - Class name(s) to remove
     */
    static removeClass(element, className) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        if (Array.isArray(className)) {
            className.forEach(cls => el.classList.remove(cls));
        } else {
            el.classList.remove(className);
        }
    }

    /**
     * Toggle class on element safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} className - Class name to toggle
     */
    static toggleClass(element, className) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        el.classList.toggle(className);
    }

    /**
     * Set element text content safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} text - Text content
     */
    static setText(element, text) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        el.textContent = text;
    }

    /**
     * Set element HTML content safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} html - HTML content
     */
    static setHTML(element, html) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        el.innerHTML = html;
    }

    /**
     * Create element with attributes
     * @param {string} tagName - Tag name
     * @param {Object} attributes - Attributes object
     * @param {string} content - Text content
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, attributes = {}, content = '') {
        const element = document.createElement(tagName);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        if (content) {
            element.textContent = content;
        }

        return element;
    }

    /**
     * Show element safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} display - Display value (default: 'block')
     */
    static show(element, display = 'block') {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        el.style.display = display;
    }

    /**
     * Hide element safely
     * @param {HTMLElement|string} element - Element or ID
     */
    static hide(element) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return;

        el.style.display = 'none';
    }

    /**
     * Check if element is visible
     * @param {HTMLElement|string} element - Element or ID
     * @returns {boolean} Visibility status
     */
    static isVisible(element) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el) return false;

        return el.offsetParent !== null;
    }

    /**
     * Add event listener safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    static addEventListener(element, event, handler, options = {}) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el || typeof handler !== 'function') return;

        el.addEventListener(event, handler, options);
    }

    /**
     * Remove event listener safely
     * @param {HTMLElement|string} element - Element or ID
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    static removeEventListener(element, event, handler) {
        const el = typeof element === 'string' ? this.getElementById(element) : element;
        if (!el || typeof handler !== 'function') return;

        el.removeEventListener(event, handler);
    }
}