# =========================================================================
# Deploy Helper Script (PowerShell version)
# Script de ayuda para despliegue de la aplicación Cafetería
# =========================================================================

param(
    [Parameter(Position=0)]
    [ValidateSet('test', 'build', 'start', 'stop', 'restart', 'logs', 'status', 'clean', 'update', 'setup', 'help')]
    [string]$Command = 'help'
)

# Colores
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Info { Write-Host $args -ForegroundColor Cyan }

Write-Host "🚀 Cafetería App - Deploy Helper" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\deploy.ps1 [comando]"
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  test        - Ejecutar pruebas"
    Write-Host "  build       - Construir imagen Docker"
    Write-Host "  start       - Iniciar contenedores"
    Write-Host "  stop        - Detener contenedores"
    Write-Host "  restart     - Reiniciar contenedores"
    Write-Host "  logs        - Ver logs"
    Write-Host "  status      - Ver estado de contenedores"
    Write-Host "  clean       - Limpiar imágenes viejas"
    Write-Host "  update      - Actualizar y redesplegar"
    Write-Host "  setup       - Configuración inicial"
    Write-Host ""
}

# Verificar dependencias
function Test-Dependencies {
    Write-Info "🔍 Verificando dependencias..."
    
    $allOk = $true
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "❌ Docker no está instalado"
        $allOk = $false
    }
    
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "❌ Docker Compose no está instalado"
        $allOk = $false
    }
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Warning "⚠️  Node.js no está instalado (necesario para pruebas)"
    }
    
    if ($allOk) {
        Write-Success "✅ Dependencias OK"
        Write-Host ""
    } else {
        exit 1
    }
}

# Ejecutar pruebas
function Invoke-Tests {
    Write-Info "🧪 Ejecutando pruebas..."
    
    if (-not (Test-Path "node_modules")) {
        Write-Info "📦 Instalando dependencias..."
        npm install
    }
    
    npm test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Todas las pruebas pasaron"
        return $true
    } else {
        Write-Error "❌ Las pruebas fallaron"
        return $false
    }
}

# Construir imagen
function Build-Image {
    Write-Info "🏗️  Construyendo imagen Docker..."
    docker build -t cafeteria-app:latest .
    Write-Success "✅ Imagen construida"
}

# Iniciar contenedores
function Start-Containers {
    Write-Info "▶️  Iniciando contenedores..."
    docker-compose up -d cafeteria
    Write-Success "✅ Contenedores iniciados"
    Write-Host ""
    Write-Host "📍 Aplicación disponible en:"
    Write-Host "   http://localhost:8080"
}

# Detener contenedores
function Stop-Containers {
    Write-Info "⏹️  Deteniendo contenedores..."
    docker-compose down
    Write-Success "✅ Contenedores detenidos"
}

# Reiniciar contenedores
function Restart-Containers {
    Write-Info "🔄 Reiniciando contenedores..."
    docker-compose restart cafeteria
    Write-Success "✅ Contenedores reiniciados"
}

# Ver logs
function Show-Logs {
    Write-Info "📋 Mostrando logs (Ctrl+C para salir)..."
    docker-compose logs -f cafeteria
}

# Ver estado
function Show-Status {
    Write-Info "📊 Estado de contenedores:"
    Write-Host ""
    docker-compose ps
    Write-Host ""
    Write-Info "🐳 Uso de recursos:"
    docker stats --no-stream cafeteria-app
}

# Limpiar
function Clear-Images {
    Write-Info "🧹 Limpiando imágenes viejas..."
    docker image prune -f
    Write-Success "✅ Limpieza completada"
}

# Actualizar y redesplegar
function Update-Deploy {
    Write-Info "🔄 Actualizando aplicación..."
    
    # Pull cambios
    if (Test-Path ".git") {
        Write-Info "📥 Descargando cambios..."
        git pull
    }
    
    # Ejecutar pruebas
    if (-not (Invoke-Tests)) {
        Write-Error "❌ Actualización cancelada - pruebas fallaron"
        exit 1
    }
    
    # Detener contenedores
    Stop-Containers
    
    # Construir nueva imagen
    Build-Image
    
    # Iniciar contenedores
    Start-Containers
    
    Write-Success "✅ Actualización completada"
}

# Setup inicial
function Initialize-Setup {
    Write-Info "⚙️  Configuración inicial..."
    
    Test-Dependencies
    
    # Instalar dependencias
    if (-not (Test-Path "node_modules")) {
        Write-Info "📦 Instalando dependencias de Node.js..."
        npm install
    }
    
    # Ejecutar pruebas
    if (-not (Invoke-Tests)) {
        Write-Warning "⚠️  Las pruebas fallaron - ¿continuar de todos modos? (S/N)"
        $response = Read-Host
        if ($response -notmatch '^[SsYy]') {
            exit 1
        }
    }
    
    # Construir imagen
    Build-Image
    
    # Iniciar
    Start-Containers
    
    Write-Host ""
    Write-Success "✅ Setup completado"
    Write-Host ""
    Write-Host "🎉 Tu aplicación está lista!"
    Write-Host "   Accede en: http://localhost:8080"
    Write-Host ""
    Write-Host "Comandos útiles:"
    Write-Host "  .\deploy.ps1 logs      - Ver logs"
    Write-Host "  .\deploy.ps1 status    - Ver estado"
    Write-Host "  .\deploy.ps1 restart   - Reiniciar"
    Write-Host "  .\deploy.ps1 update    - Actualizar"
}

# Main
switch ($Command) {
    'test' {
        Test-Dependencies
        Invoke-Tests
    }
    'build' {
        Test-Dependencies
        Build-Image
    }
    'start' {
        Test-Dependencies
        Start-Containers
    }
    'stop' {
        Stop-Containers
    }
    'restart' {
        Test-Dependencies
        Restart-Containers
    }
    'logs' {
        Show-Logs
    }
    'status' {
        Show-Status
    }
    'clean' {
        Clear-Images
    }
    'update' {
        Test-Dependencies
        Update-Deploy
    }
    'setup' {
        Initialize-Setup
    }
    default {
        Show-Help
    }
}
