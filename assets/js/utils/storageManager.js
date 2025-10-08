// ==========================================================================
// Storage Utilities - Centralized localStorage management
// ==========================================================================

// Import constants (when modules are available)
// For now, we'll use the global constants until full module conversion
// import { STORAGE_KEYS, DATA_LIMITS, FILE_FORMATS } from '../constants/index.js';

class StorageManager {
    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed value or default
     */
    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    static setItem(key, value) {
        try {
            const serialized = JSON.stringify(value);
            
            // Check storage limits
            if (this.getStorageSize() + serialized.length > (5 * 1024 * 1024)) { // 5MB limit
                console.warn('Storage limit approaching');
                return false;
            }
            
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    }

    /**
     * Clear all localStorage data
     */
    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage statistics
     */
    static getStorageInfo() {
        try {
            let totalSize = 0;
            const items = {};
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const size = localStorage[key].length;
                    totalSize += size;
                    items[key] = size;
                }
            }
            
            return {
                totalSize,
                totalSizeFormatted: this.formatBytes(totalSize),
                itemCount: Object.keys(items).length,
                items
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { totalSize: 0, itemCount: 0, items: {} };
        }
    }

    /**
     * Format bytes to human readable string
     * @param {number} bytes - Number of bytes
     * @returns {string} Formatted string
     */
    static formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Create backup of current data
     * @param {string} prefix - Backup key prefix
     * @returns {string} Backup key
     */
    static createBackup(prefix = 'backup_') {
        const timestamp = new Date().toISOString();
        const backupKey = `${prefix}${timestamp}`;
        
        const allData = {};
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && !key.startsWith(prefix)) {
                allData[key] = localStorage[key];
            }
        }
        
        this.setItem(backupKey, allData);
        return backupKey;
    }
}