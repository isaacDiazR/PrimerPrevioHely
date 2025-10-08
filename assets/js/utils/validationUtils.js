// ==========================================================================
// Validation Utilities - Centralized validation functions
// ==========================================================================

class ValidationUtils {
    /**
     * Validate product name
     * @param {string} name - Product name
     * @returns {Object} Validation result
     */
    static validateProductName(name) {
        const result = { isValid: true, errors: [] };
        
        if (!name || name.trim().length === 0) {
            result.isValid = false;
            result.errors.push('El nombre es obligatorio');
            return result;
        }
        
        const trimmedName = name.trim();
        
        if (trimmedName.length < 2) {
            result.isValid = false;
            result.errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (trimmedName.length > 100) {
            result.isValid = false;
            result.errors.push('El nombre no puede exceder 100 caracteres');
        }
        
        // Check for valid characters (letters, numbers, spaces, accents, hyphens, dots)
        const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\d\-\.]+$/;
        if (!pattern.test(trimmedName)) {
            result.isValid = false;
            result.errors.push('El nombre contiene caracteres no válidos');
        }
        
        return result;
    }

    /**
     * Validate product price
     * @param {number|string} price - Product price
     * @returns {Object} Validation result
     */
    static validateProductPrice(price) {
        const result = { isValid: true, errors: [] };
        
        const numPrice = parseFloat(price);
        
        if (isNaN(numPrice)) {
            result.isValid = false;
            result.errors.push('El precio debe ser un número válido');
            return result;
        }
        
        if (numPrice <= 0) {
            result.isValid = false;
            result.errors.push('El precio debe ser mayor a 0');
        }
        
        if (numPrice > 1000000) {
            result.isValid = false;
            result.errors.push('El precio no puede exceder $1,000,000');
        }
        
        return result;
    }

    /**
     * Validate product stock
     * @param {number|string} stock - Product stock
     * @returns {Object} Validation result
     */
    static validateProductStock(stock) {
        const result = { isValid: true, errors: [] };
        
        const numStock = parseInt(stock);
        
        if (isNaN(numStock)) {
            result.isValid = false;
            result.errors.push('El stock debe ser un número válido');
            return result;
        }
        
        if (numStock < 0) {
            result.isValid = false;
            result.errors.push('El stock no puede ser negativo');
        }
        
        if (numStock > 10000) {
            result.isValid = false;
            result.errors.push('El stock no puede exceder 10,000 unidades');
        }
        
        return result;
    }

    /**
     * Validate product description
     * @param {string} description - Product description
     * @returns {Object} Validation result
     */
    static validateProductDescription(description) {
        const result = { isValid: true, errors: [] };
        
        if (description && description.length > 500) {
            result.isValid = false;
            result.errors.push('La descripción no puede exceder 500 caracteres');
        }
        
        return result;
    }

    /**
     * Validate product type
     * @param {string} type - Product type
     * @returns {Object} Validation result
     */
    static validateProductType(type) {
        const result = { isValid: true, errors: [] };
        const validTypes = ['coffee', 'food', 'drink', 'dessert'];
        
        if (!type || !validTypes.includes(type)) {
            result.isValid = false;
            result.errors.push('Debe seleccionar un tipo de producto válido');
        }
        
        return result;
    }

    /**
     * Validate product category
     * @param {string} category - Product category
     * @returns {Object} Validation result
     */
    static validateProductCategory(category) {
        const result = { isValid: true, errors: [] };
        
        if (!category || category.trim().length === 0) {
            result.isValid = false;
            result.errors.push('Debe seleccionar una categoría');
            return result;
        }
        
        const trimmedCategory = category.trim();
        
        if (trimmedCategory.length < 2) {
            result.isValid = false;
            result.errors.push('La categoría debe tener al menos 2 caracteres');
        }
        
        if (trimmedCategory.length > 50) {
            result.isValid = false;
            result.errors.push('La categoría no puede exceder 50 caracteres');
        }
        
        return result;
    }

    /**
     * Validate complete product data
     * @param {Object} productData - Product data object
     * @returns {Object} Validation result
     */
    static validateProduct(productData) {
        const result = { isValid: true, errors: [] };
        
        // Validate each field
        const nameValidation = this.validateProductName(productData.name);
        const priceValidation = this.validateProductPrice(productData.price);
        const stockValidation = this.validateProductStock(productData.stock);
        const descriptionValidation = this.validateProductDescription(productData.description);
        const typeValidation = this.validateProductType(productData.type);
        const categoryValidation = this.validateProductCategory(productData.category);
        
        // Collect all errors
        const validations = [
            nameValidation,
            priceValidation,
            stockValidation,
            descriptionValidation,
            typeValidation,
            categoryValidation
        ];
        
        validations.forEach(validation => {
            if (!validation.isValid) {
                result.isValid = false;
                result.errors.push(...validation.errors);
            }
        });
        
        return result;
    }

    /**
     * Validate email format
     * @param {string} email - Email address
     * @returns {Object} Validation result
     */
    static validateEmail(email) {
        const result = { isValid: true, errors: [] };
        
        if (!email || email.trim().length === 0) {
            result.isValid = false;
            result.errors.push('El email es obligatorio');
            return result;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            result.isValid = false;
            result.errors.push('El formato del email no es válido');
        }
        
        return result;
    }

    /**
     * Sanitize input string
     * @param {string} input - Input string
     * @returns {string} Sanitized string
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
            .substring(0, 1000); // Limit length
    }
}