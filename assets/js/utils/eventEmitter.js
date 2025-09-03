// ==========================================================================
// EventEmitter Utility Class
// ==========================================================================

class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} callback - Event handler function
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {function} callback - Event handler function to remove
     */
    off(event, callback) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        
        if (this.events[event].length === 0) {
            delete this.events[event];
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to event handlers
     */
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }

    /**
     * Subscribe to an event only once
     * @param {string} event - Event name
     * @param {function} callback - Event handler function
     */
    once(event, callback) {
        const onceWrapper = (data) => {
            callback(data);
            this.off(event, onceWrapper);
        };
        this.on(event, onceWrapper);
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners() {
        this.events = {};
    }

    /**
     * Get all registered events
     * @returns {string[]} Array of event names
     */
    getEvents() {
        return Object.keys(this.events);
    }

    /**
     * Get number of listeners for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    listenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
}
