// ==========================================================================
// EventEmitter Tests - Event System Testing
// ==========================================================================

describe('📡 EventEmitter - Event Management System', () => {
    let emitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    describe('🎯 Basic Event Operations', () => {
        it('should create new EventEmitter instance', () => {
            expect(emitter).toBeDefined();
            expect(emitter instanceof EventEmitter).toBe(true);
            expect(typeof emitter.on).toBe('function');
            expect(typeof emitter.emit).toBe('function');
        });

        it('should register event listener', () => {
            const callback = jest.fn();
            
            emitter.on('test', callback);
            
            expect(emitter.listeners('test').length).toBe(1);
        });

        it('should emit event and trigger callback', () => {
            const callback = jest.fn();
            
            emitter.on('test', callback);
            emitter.emit('test');
            
            expect(callback).toHaveBeenCalled();
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should pass data to event callback', () => {
            const callback = jest.fn();
            const testData = { name: 'Café', price: 4000 };
            
            emitter.on('productAdded', callback);
            emitter.emit('productAdded', testData);
            
            expect(callback).toHaveBeenCalledWith(testData);
        });

        it('should pass multiple arguments to callback', () => {
            const callback = jest.fn();
            
            emitter.on('update', callback);
            emitter.emit('update', 'arg1', 'arg2', 'arg3');
            
            expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
        });
    });

    describe('👥 Multiple Listeners', () => {
        it('should register multiple listeners for same event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            const callback3 = jest.fn();
            
            emitter.on('test', callback1);
            emitter.on('test', callback2);
            emitter.on('test', callback3);
            
            expect(emitter.listeners('test').length).toBe(3);
        });

        it('should trigger all listeners when event is emitted', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            const callback3 = jest.fn();
            
            emitter.on('test', callback1);
            emitter.on('test', callback2);
            emitter.on('test', callback3);
            
            emitter.emit('test');
            
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
            expect(callback3).toHaveBeenCalled();
        });

        it('should trigger listeners in registration order', () => {
            const order = [];
            
            emitter.on('test', () => order.push(1));
            emitter.on('test', () => order.push(2));
            emitter.on('test', () => order.push(3));
            
            emitter.emit('test');
            
            expect(order).toEqual([1, 2, 3]);
        });

        it('should handle different events independently', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            emitter.on('event1', callback1);
            emitter.on('event2', callback2);
            
            emitter.emit('event1');
            
            expect(callback1).toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
        });
    });

    describe('🗑️ Removing Listeners', () => {
        it('should remove specific listener', () => {
            const callback = jest.fn();
            
            emitter.on('test', callback);
            expect(emitter.listeners('test').length).toBe(1);
            
            emitter.off('test', callback);
            expect(emitter.listeners('test').length).toBe(0);
        });

        it('should only remove specified callback', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            emitter.on('test', callback1);
            emitter.on('test', callback2);
            
            emitter.off('test', callback1);
            
            expect(emitter.listeners('test').length).toBe(1);
            expect(emitter.listeners('test')[0]).toBe(callback2);
        });

        it('should not trigger removed listener', () => {
            const callback = jest.fn();
            
            emitter.on('test', callback);
            emitter.off('test', callback);
            emitter.emit('test');
            
            expect(callback).not.toHaveBeenCalled();
        });

        it('should handle removing non-existent listener gracefully', () => {
            const callback = jest.fn();
            
            expect(() => {
                emitter.off('nonexistent', callback);
            }).not.toThrow();
        });

        it('should remove all listeners for an event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            emitter.on('test', callback1);
            emitter.on('test', callback2);
            
            emitter.removeAllListeners('test');
            
            expect(emitter.listeners('test').length).toBe(0);
        });
    });

    describe('🎯 Once Listeners', () => {
        it('should trigger once listener only one time', () => {
            const callback = jest.fn();
            
            emitter.once('test', callback);
            
            emitter.emit('test');
            emitter.emit('test');
            emitter.emit('test');
            
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should automatically remove once listener after trigger', () => {
            const callback = jest.fn();
            
            emitter.once('test', callback);
            expect(emitter.listeners('test').length).toBe(1);
            
            emitter.emit('test');
            expect(emitter.listeners('test').length).toBe(0);
        });

        it('should pass data to once listener', () => {
            const callback = jest.fn();
            const data = { test: 'value' };
            
            emitter.once('test', callback);
            emitter.emit('test', data);
            
            expect(callback).toHaveBeenCalledWith(data);
        });

        it('should handle multiple once listeners', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            emitter.once('test', callback1);
            emitter.once('test', callback2);
            
            emitter.emit('test');
            
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
            expect(emitter.listeners('test').length).toBe(0);
        });
    });

    describe('🔍 Event Introspection', () => {
        it('should list all event names', () => {
            emitter.on('event1', () => {});
            emitter.on('event2', () => {});
            emitter.on('event3', () => {});
            
            const events = emitter.eventNames();
            
            expect(events).toContain('event1');
            expect(events).toContain('event2');
            expect(events).toContain('event3');
            expect(events.length).toBe(3);
        });

        it('should return listener count for event', () => {
            emitter.on('test', () => {});
            emitter.on('test', () => {});
            emitter.on('test', () => {});
            
            expect(emitter.listenerCount('test')).toBe(3);
        });

        it('should return 0 for event with no listeners', () => {
            expect(emitter.listenerCount('nonexistent')).toBe(0);
        });

        it('should return all listeners for event', () => {
            const callback1 = () => {};
            const callback2 = () => {};
            
            emitter.on('test', callback1);
            emitter.on('test', callback2);
            
            const listeners = emitter.listeners('test');
            
            expect(listeners.length).toBe(2);
            expect(listeners).toContain(callback1);
            expect(listeners).toContain(callback2);
        });
    });

    describe('⚠️ Error Handling', () => {
        it('should handle callback errors gracefully', () => {
            const errorCallback = () => { throw new Error('Test error'); };
            const normalCallback = jest.fn();
            
            emitter.on('test', errorCallback);
            emitter.on('test', normalCallback);
            
            expect(() => {
                emitter.emit('test');
            }).not.toThrow();
            
            expect(normalCallback).toHaveBeenCalled();
        });

        it('should emit error event on callback failure', () => {
            const errorHandler = jest.fn();
            const errorCallback = () => { throw new Error('Test error'); };
            
            emitter.on('error', errorHandler);
            emitter.on('test', errorCallback);
            
            emitter.emit('test');
            
            expect(errorHandler).toHaveBeenCalled();
        });

        it('should handle emit on non-existent event', () => {
            expect(() => {
                emitter.emit('nonexistent', { data: 'test' });
            }).not.toThrow();
        });
    });

    describe('🎮 Real-World Scenarios', () => {
        it('should handle product lifecycle events', () => {
            const productAdded = jest.fn();
            const productUpdated = jest.fn();
            const productDeleted = jest.fn();
            
            emitter.on('product:added', productAdded);
            emitter.on('product:updated', productUpdated);
            emitter.on('product:deleted', productDeleted);
            
            const product = { id: 1, name: 'Café' };
            
            emitter.emit('product:added', product);
            emitter.emit('product:updated', { ...product, price: 5000 });
            emitter.emit('product:deleted', product.id);
            
            expect(productAdded).toHaveBeenCalledWith(product);
            expect(productUpdated).toHaveBeenCalledWith({ ...product, price: 5000 });
            expect(productDeleted).toHaveBeenCalledWith(product.id);
        });

        it('should handle view update events', () => {
            const viewCallback = jest.fn();
            
            emitter.on('view:update', viewCallback);
            
            emitter.emit('view:update', { 
                action: 'render', 
                data: [1, 2, 3] 
            });
            
            expect(viewCallback).toHaveBeenCalledWith({
                action: 'render',
                data: [1, 2, 3]
            });
        });

        it('should handle notification events', () => {
            const notificationHandler = jest.fn();
            
            emitter.on('notification:show', notificationHandler);
            
            emitter.emit('notification:show', {
                type: 'success',
                message: 'Producto guardado exitosamente'
            });
            
            expect(notificationHandler).toHaveBeenCalledWith({
                type: 'success',
                message: 'Producto guardado exitosamente'
            });
        });

        it('should chain multiple event operations', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();
            
            emitter
                .on('event1', callback1)
                .on('event2', callback2);
            
            emitter.emit('event1');
            emitter.emit('event2');
            
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });
    });

    describe('🧹 Cleanup Operations', () => {
        it('should remove all listeners from all events', () => {
            emitter.on('event1', () => {});
            emitter.on('event2', () => {});
            emitter.on('event3', () => {});
            
            emitter.removeAllListeners();
            
            expect(emitter.eventNames().length).toBe(0);
        });

        it('should clear event emitter state completely', () => {
            emitter.on('test', () => {});
            emitter.on('another', () => {});
            
            emitter.removeAllListeners();
            
            expect(emitter.listenerCount('test')).toBe(0);
            expect(emitter.listenerCount('another')).toBe(0);
            expect(emitter.eventNames().length).toBe(0);
        });
    });
});
