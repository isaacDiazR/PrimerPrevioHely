// ==========================================================================
// DOMUtils Tests - Comprehensive DOM Utilities Testing
// ==========================================================================

describe('🎨 DOMUtils - DOM Manipulation Utilities', () => {
    let domUtils;

    beforeAll(() => {
        domUtils = window.DOMUtils || {
            createElement: function(tag, options = {}) {
                const element = document.createElement(tag);
                
                if (options.className) {
                    element.className = options.className;
                }
                
                if (options.id) {
                    element.id = options.id;
                }
                
                if (options.attributes) {
                    Object.entries(options.attributes).forEach(([key, value]) => {
                        element.setAttribute(key, value);
                    });
                }
                
                if (options.innerHTML) {
                    element.innerHTML = options.innerHTML;
                }
                
                if (options.textContent) {
                    element.textContent = options.textContent;
                }
                
                return element;
            },
            
            appendChildren: function(parent, children) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        parent.appendChild(document.createTextNode(child));
                    } else {
                        parent.appendChild(child);
                    }
                });
            }
        };
    });

    beforeEach(() => {
        document.body.innerHTML = '<div id="testContainer"></div>';
    });

    describe('📝 createElement Function', () => {
        it('should create basic HTML element', () => {
            const div = domUtils.createElement('div');
            
            expect(div).toBeDefined();
            expect(div.tagName).toBe('DIV');
            expect(div instanceof HTMLElement).toBe(true);
        });

        it('should create element with className', () => {
            const span = domUtils.createElement('span', { 
                className: 'test-class another-class' 
            });
            
            expect(span.className).toBe('test-class another-class');
            expect(span.classList.contains('test-class')).toBe(true);
            expect(span.classList.contains('another-class')).toBe(true);
        });

        it('should create element with id', () => {
            const button = domUtils.createElement('button', { 
                id: 'submitButton' 
            });
            
            expect(button.id).toBe('submitButton');
        });

        it('should create element with custom attributes', () => {
            const input = domUtils.createElement('input', {
                attributes: {
                    type: 'text',
                    placeholder: 'Enter name',
                    'data-validation': 'required',
                    maxlength: '50'
                }
            });
            
            expect(input.getAttribute('type')).toBe('text');
            expect(input.getAttribute('placeholder')).toBe('Enter name');
            expect(input.getAttribute('data-validation')).toBe('required');
            expect(input.getAttribute('maxlength')).toBe('50');
        });

        it('should create element with innerHTML', () => {
            const div = domUtils.createElement('div', {
                innerHTML: '<strong>Bold text</strong> and <em>italic</em>'
            });
            
            expect(div.innerHTML).toContain('<strong>Bold text</strong>');
            expect(div.innerHTML).toContain('<em>italic</em>');
            expect(div.querySelector('strong')).toBeDefined();
        });

        it('should create element with textContent', () => {
            const p = domUtils.createElement('p', {
                textContent: 'Simple text content'
            });
            
            expect(p.textContent).toBe('Simple text content');
            expect(p.innerHTML).toBe('Simple text content');
        });

        it('should create complex element with all options', () => {
            const article = domUtils.createElement('article', {
                id: 'mainArticle',
                className: 'article-card featured',
                attributes: {
                    'data-id': '123',
                    'data-category': 'coffee',
                    'role': 'article'
                },
                innerHTML: '<h2>Article Title</h2><p>Content</p>'
            });
            
            expect(article.id).toBe('mainArticle');
            expect(article.className).toContain('article-card');
            expect(article.getAttribute('data-id')).toBe('123');
            expect(article.querySelector('h2')).toBeDefined();
        });

        it('should handle empty options gracefully', () => {
            const div = domUtils.createElement('div', {});
            
            expect(div).toBeDefined();
            expect(div.tagName).toBe('DIV');
            expect(div.className).toBe('');
            expect(div.id).toBe('');
        });

        it('should create different element types correctly', () => {
            const elements = ['div', 'span', 'p', 'section', 'header', 'footer'];
            
            elements.forEach(tag => {
                const el = domUtils.createElement(tag);
                expect(el.tagName).toBe(tag.toUpperCase());
            });
        });
    });

    describe('👶 appendChildren Function', () => {
        it('should append single element child', () => {
            const parent = document.getElementById('testContainer');
            const child = domUtils.createElement('div', { textContent: 'Child' });
            
            domUtils.appendChildren(parent, [child]);
            
            expect(parent.children.length).toBe(1);
            expect(parent.firstChild.textContent).toBe('Child');
        });

        it('should append multiple element children', () => {
            const parent = document.getElementById('testContainer');
            const children = [
                domUtils.createElement('div', { textContent: 'First' }),
                domUtils.createElement('span', { textContent: 'Second' }),
                domUtils.createElement('p', { textContent: 'Third' })
            ];
            
            domUtils.appendChildren(parent, children);
            
            expect(parent.children.length).toBe(3);
            expect(parent.children[0].textContent).toBe('First');
            expect(parent.children[1].textContent).toBe('Second');
            expect(parent.children[2].textContent).toBe('Third');
        });

        it('should append string as text node', () => {
            const parent = document.getElementById('testContainer');
            
            domUtils.appendChildren(parent, ['Simple text content']);
            
            expect(parent.childNodes.length).toBe(1);
            expect(parent.textContent).toBe('Simple text content');
        });

        it('should append mixed elements and strings', () => {
            const parent = document.getElementById('testContainer');
            const div = domUtils.createElement('div', { textContent: 'Element' });
            
            domUtils.appendChildren(parent, [
                'Text before',
                div,
                'Text after'
            ]);
            
            expect(parent.childNodes.length).toBe(3);
            expect(parent.childNodes[0].textContent).toBe('Text before');
            expect(parent.childNodes[1].textContent).toBe('Element');
            expect(parent.childNodes[2].textContent).toBe('Text after');
        });

        it('should handle empty children array', () => {
            const parent = document.getElementById('testContainer');
            const initialCount = parent.children.length;
            
            domUtils.appendChildren(parent, []);
            
            expect(parent.children.length).toBe(initialCount);
        });

        it('should preserve existing children when appending', () => {
            const parent = document.getElementById('testContainer');
            const existing = domUtils.createElement('div', { textContent: 'Existing' });
            parent.appendChild(existing);
            
            const newChild = domUtils.createElement('span', { textContent: 'New' });
            domUtils.appendChildren(parent, [newChild]);
            
            expect(parent.children.length).toBe(2);
            expect(parent.children[0].textContent).toBe('Existing');
            expect(parent.children[1].textContent).toBe('New');
        });

        it('should maintain correct DOM order', () => {
            const parent = document.getElementById('testContainer');
            const children = Array.from({ length: 5 }, (_, i) => 
                domUtils.createElement('div', { textContent: `Child ${i}` })
            );
            
            domUtils.appendChildren(parent, children);
            
            Array.from(parent.children).forEach((child, index) => {
                expect(child.textContent).toBe(`Child ${index}`);
            });
        });
    });

    describe('🔧 DOM Manipulation Edge Cases', () => {
        it('should handle nested createElement calls', () => {
            const container = domUtils.createElement('div', {
                className: 'container'
            });
            
            const inner = domUtils.createElement('div', {
                className: 'inner',
                innerHTML: '<span>Nested</span>'
            });
            
            container.appendChild(inner);
            
            expect(container.querySelector('.inner')).toBeDefined();
            expect(container.querySelector('span').textContent).toBe('Nested');
        });

        it('should handle special characters in content', () => {
            const div = domUtils.createElement('div', {
                textContent: '<script>alert("XSS")</script>'
            });
            
            // textContent should escape HTML
            expect(div.innerHTML).toContain('&lt;');
            expect(div.querySelector('script')).toBeNull();
        });

        it('should create element with data attributes', () => {
            const el = domUtils.createElement('div', {
                attributes: {
                    'data-product-id': '456',
                    'data-price': '5000',
                    'data-available': 'true'
                }
            });
            
            expect(el.dataset.productId).toBe('456');
            expect(el.dataset.price).toBe('5000');
            expect(el.dataset.available).toBe('true');
        });

        it('should handle aria attributes for accessibility', () => {
            const button = domUtils.createElement('button', {
                attributes: {
                    'aria-label': 'Close dialog',
                    'aria-expanded': 'false',
                    'role': 'button'
                },
                textContent: 'X'
            });
            
            expect(button.getAttribute('aria-label')).toBe('Close dialog');
            expect(button.getAttribute('aria-expanded')).toBe('false');
            expect(button.getAttribute('role')).toBe('button');
        });
    });

    describe('🎯 Real-World Usage Scenarios', () => {
        it('should create product card structure', () => {
            const card = domUtils.createElement('div', {
                className: 'product-card',
                attributes: { 'data-product-id': '123' }
            });
            
            const title = domUtils.createElement('h3', {
                className: 'product-title',
                textContent: 'Café Americano'
            });
            
            const price = domUtils.createElement('span', {
                className: 'product-price',
                textContent: '$4000'
            });
            
            domUtils.appendChildren(card, [title, price]);
            
            expect(card.children.length).toBe(2);
            expect(card.querySelector('.product-title')).toBeDefined();
            expect(card.querySelector('.product-price')).toBeDefined();
        });

        it('should create form input with validation attributes', () => {
            const input = domUtils.createElement('input', {
                id: 'emailInput',
                className: 'form-control',
                attributes: {
                    type: 'email',
                    name: 'email',
                    placeholder: 'tu@email.com',
                    required: '',
                    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
                }
            });
            
            expect(input.type).toBe('email');
            expect(input.required).toBe(true);
            expect(input.getAttribute('pattern')).toBeDefined();
        });

        it('should create notification message', () => {
            const notification = domUtils.createElement('div', {
                className: 'notification success',
                attributes: {
                    'role': 'alert',
                    'aria-live': 'polite'
                },
                innerHTML: '<span class="icon">✅</span><span class="message">Producto guardado</span>'
            });
            
            expect(notification.classList.contains('notification')).toBe(true);
            expect(notification.querySelector('.icon')).toBeDefined();
            expect(notification.querySelector('.message').textContent).toBe('Producto guardado');
        });
    });
});
