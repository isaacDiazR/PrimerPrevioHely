#!/bin/bash

# ==========================================================================
# Deploy Helper Script
# Script de ayuda para despliegue de la aplicación Cafetería
# ==========================================================================

set -e

echo "🚀 Cafetería App - Deploy Helper"
echo "=================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función de ayuda
show_help() {
    echo "Uso: ./deploy.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  test        - Ejecutar pruebas"
    echo "  build       - Construir imagen Docker"
    echo "  start       - Iniciar contenedores"
    echo "  stop        - Detener contenedores"
    echo "  restart     - Reiniciar contenedores"
    echo "  logs        - Ver logs"
    echo "  status      - Ver estado de contenedores"
    echo "  clean       - Limpiar imágenes viejas"
    echo "  update      - Actualizar y redesplegar"
    echo "  setup       - Configuración inicial"
    echo ""
}

# Verificar dependencias
check_dependencies() {
    echo "🔍 Verificando dependencias..."
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose no está instalado${NC}"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${YELLOW}⚠️  Node.js no está instalado (necesario para pruebas)${NC}"
    fi
    
    echo -e "${GREEN}✅ Dependencias OK${NC}"
    echo ""
}

# Ejecutar pruebas
run_tests() {
    echo "🧪 Ejecutando pruebas..."
    
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias..."
        npm install
    fi
    
    npm test
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Todas las pruebas pasaron${NC}"
        return 0
    else
        echo -e "${RED}❌ Las pruebas fallaron${NC}"
        return 1
    fi
}

# Construir imagen
build_image() {
    echo "🏗️  Construyendo imagen Docker..."
    docker build -t cafeteria-app:latest .
    echo -e "${GREEN}✅ Imagen construida${NC}"
}

# Iniciar contenedores
start_containers() {
    echo "▶️  Iniciando contenedores..."
    docker-compose up -d cafeteria
    echo -e "${GREEN}✅ Contenedores iniciados${NC}"
    echo ""
    echo "📍 Aplicación disponible en:"
    echo "   http://localhost:8080"
}

# Detener contenedores
stop_containers() {
    echo "⏹️  Deteniendo contenedores..."
    docker-compose down
    echo -e "${GREEN}✅ Contenedores detenidos${NC}"
}

# Reiniciar contenedores
restart_containers() {
    echo "🔄 Reiniciando contenedores..."
    docker-compose restart cafeteria
    echo -e "${GREEN}✅ Contenedores reiniciados${NC}"
}

# Ver logs
show_logs() {
    echo "📋 Mostrando logs (Ctrl+C para salir)..."
    docker-compose logs -f cafeteria
}

# Ver estado
show_status() {
    echo "📊 Estado de contenedores:"
    echo ""
    docker-compose ps
    echo ""
    echo "🐳 Uso de recursos:"
    docker stats --no-stream cafeteria-app 2>/dev/null || echo "Contenedor no está corriendo"
}

# Limpiar
clean_images() {
    echo "🧹 Limpiando imágenes viejas..."
    docker image prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Actualizar y redesplegar
update_deploy() {
    echo "🔄 Actualizando aplicación..."
    
    # Pull cambios
    if [ -d ".git" ]; then
        echo "📥 Descargando cambios..."
        git pull
    fi
    
    # Ejecutar pruebas
    if ! run_tests; then
        echo -e "${RED}❌ Actualización cancelada - pruebas fallaron${NC}"
        exit 1
    fi
    
    # Detener contenedores
    stop_containers
    
    # Construir nueva imagen
    build_image
    
    # Iniciar contenedores
    start_containers
    
    echo -e "${GREEN}✅ Actualización completada${NC}"
}

# Setup inicial
setup() {
    echo "⚙️  Configuración inicial..."
    
    check_dependencies
    
    # Instalar dependencias
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias de Node.js..."
        npm install
    fi
    
    # Ejecutar pruebas
    if ! run_tests; then
        echo -e "${YELLOW}⚠️  Las pruebas fallaron - continuar de todos modos? (y/n)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Construir imagen
    build_image
    
    # Iniciar
    start_containers
    
    echo ""
    echo -e "${GREEN}✅ Setup completado${NC}"
    echo ""
    echo "🎉 Tu aplicación está lista!"
    echo "   Accede en: http://localhost:8080"
    echo ""
    echo "Comandos útiles:"
    echo "  ./deploy.sh logs      - Ver logs"
    echo "  ./deploy.sh status    - Ver estado"
    echo "  ./deploy.sh restart   - Reiniciar"
    echo "  ./deploy.sh update    - Actualizar"
}

# Main
case "${1}" in
    test)
        check_dependencies
        run_tests
        ;;
    build)
        check_dependencies
        build_image
        ;;
    start)
        check_dependencies
        start_containers
        ;;
    stop)
        stop_containers
        ;;
    restart)
        check_dependencies
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_images
        ;;
    update)
        check_dependencies
        update_deploy
        ;;
    setup)
        setup
        ;;
    *)
        show_help
        ;;
esac
