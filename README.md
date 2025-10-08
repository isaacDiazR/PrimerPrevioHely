# ☕ Sistema de Gestión - Tienda Cafetería

Sistema CRUD completo para gestión de inventarios de una cafetería, construido con JavaScript vanilla siguiendo el patrón MVC.

## 📁 Estructura del Proyecto

```
PrimerPrevioHely/
├── index.html                           # Página principal del sistema
├── README.md                           # Documentación del proyecto
├── package.json                        # Configuración del proyecto Node.js
├── archive/                            # Archivos históricos y backups
│   ├── Index-backup.html               # Versión original con CSS inline
│   └── new-index.html                  # Versión duplicada (removida)
└── assets/                             # Recursos organizados
└── assets/                             # Recursos organizados
    ├── css/                            # Estilos CSS
    │   ├── styles.css                  # Estilos principales
    │   └── components.css              # Estilos de componentes (modal, notificaciones, etc.)
    └── js/                             # JavaScript modular
        ├── config.js                   # Configuración de la aplicación
        ├── app.js                      # Aplicación principal y inicialización
        ├── models/                     # Modelos de datos
        │   └── product.js              # Clase Product
        ├── services/                   # Servicios de datos
        │   └── productService.js       # Servicio para manejo de productos
        ├── controllers/                # Controladores (lógica de negocio)
        │   └── productController.js    # Controlador de productos
        ├── views/                      # Vistas (interfaz de usuario)
        │   └── productView.js          # Vista de productos
        └── utils/                      # Utilidades
            └── eventEmitter.js         # Sistema de eventos
```

## 🏗️ Arquitectura

El proyecto ahora sigue el patrón **MVC (Model-View-Controller)** con las siguientes ventajas:

### 🧩 **Separación de Responsabilidades**
- **Model (`product.js`)**: Maneja la estructura y validación de datos
- **View (`productView.js`)**: Maneja la interfaz de usuario y renderizado
- **Controller (`productController.js`)**: Coordina la lógica de negocio
- **Service (`productService.js`)**: Maneja persistencia y operaciones de datos

### 🎯 **Características Principales**

1. **Modularidad**: Cada archivo tiene una responsabilidad específica
2. **Escalabilidad**: Fácil agregar nuevas funcionalidades
3. **Mantenibilidad**: Código más fácil de leer y mantener
4. **Reutilización**: Componentes reutilizables
5. **Debugging**: Mejor rastreo de errores

## 🚀 **Funcionalidades**

### ✨ **Gestión de Productos**
- ➕ Crear productos con validación completa
- ✏️ Editar productos existentes
- 🗑️ Eliminar productos con confirmación
- 👁️ Visualizar productos en tarjetas organizadas

### 🔍 **Filtros y Búsqueda**
- 🔍 Búsqueda por nombre, descripción o categoría
- 📂 Filtro por tipo de producto (café, comida, bebida, postre)
- ✅ Filtro por estado (activo/inactivo)
- ⚡ Búsqueda en tiempo real

### 📊 **Dashboard y Estadísticas**
- 📈 Estadísticas en tiempo real
- ⚠️ Alertas de stock bajo
- 💰 Valor total del inventario
- 📋 Conteo de productos por categoría

### 💾 **Gestión de Datos**
- 💾 Persistencia en localStorage
- 📤 Exportación de datos a JSON
- 📥 Importación de datos desde JSON
- 🔄 Sincronización entre pestañas

## 🎨 **Interfaz de Usuario**

### 🖥️ **Diseño Responsive**
- 📱 Optimizado para móviles
- 💻 Adaptable a tablets y desktops
- 🎨 Diseño moderno y atractivo

### 🎭 **Componentes Interactivos**
- 🪟 Modales para formularios
- 🔔 Notificaciones informativas
- 🎬 Animaciones suaves
- ⌨️ Atajos de teclado

## 🛠️ **Tecnologías Utilizadas**

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con flexbox y grid
- **JavaScript ES6+**: Clases, módulos y funciones modernas
- **LocalStorage**: Persistencia de datos local

## ⌨️ **Atajos de Teclado**

- `Ctrl + N`: Añadir nuevo producto
- `Ctrl + E`: Exportar productos
- `Ctrl + F`: Enfocar búsqueda
- `Esc`: Cerrar modal

## 🔧 **API para Desarrolladores**

La aplicación expone una API global `window.CafeteriaAPI` con los siguientes métodos:

```javascript
// Gestión de productos
CafeteriaAPI.products.getAll()           // Obtener todos los productos
CafeteriaAPI.products.getById(id)        // Obtener producto por ID
CafeteriaAPI.products.create(data)       // Crear nuevo producto
CafeteriaAPI.products.update(id, data)   // Actualizar producto
CafeteriaAPI.products.delete(id)         // Eliminar producto

// Estadísticas
CafeteriaAPI.stats()                     // Obtener estadísticas
CafeteriaAPI.lowStock()                  // Productos con stock bajo

// Gestión de datos
CafeteriaAPI.export()                    // Exportar datos
CafeteriaAPI.reset()                     // Restablecer a valores por defecto

// Interfaz de usuario
CafeteriaAPI.ui.showNotification(msg)    // Mostrar notificación
CafeteriaAPI.ui.refresh()                // Actualizar interfaz
```

## 🧪 **Ejemplos de Uso**

```javascript
// Crear un producto programáticamente
CafeteriaAPI.products.create({
    name: 'Latte Especial',
    type: 'coffee',
    category: 'Latte',
    price: 5500,
    stock: 20,
    description: 'Latte con sabor especial'
});

// Obtener estadísticas
const stats = CafeteriaAPI.stats();
console.log(`Total productos: ${stats.totalProducts}`);

// Buscar productos
const cafes = CafeteriaAPI.products.filter({ type: 'coffee' });
```

## 🔄 **Mejoras Implementadas**

### 📦 **Desde la versión anterior**
1. **Separación de archivos**: Un solo archivo de 1199 líneas dividido en 11 archivos modulares
2. **Mejor organización**: Estructura de carpetas clara y lógica
3. **Código reutilizable**: Componentes independientes y reutilizables
4. **Mejor mantenimiento**: Cada funcionalidad en su archivo correspondiente
5. **Escalabilidad**: Fácil agregar nuevas características
6. **Debugging mejorado**: Errores más fáciles de rastrear
7. **Performance**: Mejor organización del código
8. **Documentación**: Código bien documentado y comentado

## 🚀 **Cómo usar**

1. Abre `index.html` en tu navegador
2. La aplicación se carga automáticamente con productos de ejemplo
3. Usa los controles para gestionar tu inventario:
   - **Añadir**: Botón "➕ Añadir Producto"
   - **Buscar**: Campo de búsqueda en tiempo real
   - **Filtrar**: Menús desplegables de filtros
   - **Editar**: Botón "✏️ Editar" en cada tarjeta
   - **Eliminar**: Botón "🗑️ Eliminar" en cada tarjeta
   - **Exportar**: Botón "📤 Exportar" para descargar datos

## 🔮 **Próximas Mejoras Sugeridas**

- 🌐 **Backend Integration**: Conectar con API REST
- 🔐 **Authentication**: Sistema de usuarios y permisos
- 📱 **PWA**: Convertir en Progressive Web App
- 🎨 **Themes**: Múltiples temas de color
- 📊 **Charts**: Gráficos y reportes avanzados
- 🔔 **Push Notifications**: Notificaciones del navegador
- 📷 **Image Upload**: Subida de imágenes de productos
- 🏷️ **Tags System**: Sistema de etiquetas para productos

---

**Desarrollado con ❤️ para mejorar la gestión de inventarios de cafeterías**
