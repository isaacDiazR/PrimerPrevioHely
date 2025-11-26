# 🚀 Guía de Despliegue - Cafetería App

## 📋 Índice
1. [Respuestas a tus dudas](#respuestas-a-tus-dudas)
2. [Configuración de GitHub Actions](#configuración-de-github-actions)
3. [Despliegue con Docker](#despliegue-con-docker)
4. [Múltiples proyectos en el mismo servidor](#múltiples-proyectos)
5. [Troubleshooting](#troubleshooting)

---

## 🤔 Respuestas a tus dudas

### Duda 1: ¿Puedo visualizar 2 proyectos en el mismo servidor?
**Respuesta: Sí, hay 3 opciones:**

#### Opción A: Usar puertos diferentes (MÁS SIMPLE)
- Tu proyecto existente: `http://tu-servidor:3000`
- Cafetería: `http://tu-servidor:8080`

#### Opción B: Usar rutas diferentes con proxy reverso
- Tu proyecto existente: `http://tu-servidor/`
- Cafetería: `http://tu-servidor/cafeteria`

#### Opción C: Usar subdominios
- Tu proyecto existente: `http://principal.tudominio.com`
- Cafetería: `http://cafeteria.tudominio.com`

### Duda 2: ¿Se puede hacer CI/CD con este proyecto?
**Respuesta: ¡SÍ! Ya está configurado.**

El workflow de GitHub Actions:
- ✅ Ejecuta todas las pruebas automáticamente
- ✅ Si las pruebas fallan → NO despliega
- ✅ Si las pruebas pasan → Construye Docker y despliega
- ✅ Solo se despliega en commits a `main`

---

## 🔧 Configuración de GitHub Actions

### Paso 1: Agregar Secrets en GitHub

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret

Agrega estos secrets:

```
SERVER_HOST=tu-ip-o-dominio.com
SERVER_USER=tu-usuario-ssh
SSH_PRIVATE_KEY=tu-clave-privada-ssh
SERVER_PORT=22

# Opcionales (si quieres usar Docker Hub)
DOCKER_USERNAME=tu-usuario-dockerhub
DOCKER_PASSWORD=tu-password-dockerhub
```

### Paso 2: Generar clave SSH (si no tienes)

En tu máquina local:
```bash
ssh-keygen -t ed25519 -C "github-actions"
# Guarda en: ~/.ssh/github_actions

# Copia la clave pública al servidor
ssh-copy-id -i ~/.ssh/github_actions.pub usuario@tu-servidor

# Copia la clave privada (todo el contenido del archivo)
cat ~/.ssh/github_actions
# Pega este contenido en el secret SSH_PRIVATE_KEY
```

### Paso 3: Probar el workflow

```bash
git add .
git commit -m "feat: configurar CI/CD"
git push origin main
```

Ve a GitHub → Actions para ver el progreso.

---

## 🐳 Despliegue con Docker

### Opción 1: Solo contenedor de cafetería (SIN proxy)

```bash
# En tu servidor
cd ~
mkdir cafeteria-app
cd cafeteria-app

# Clona o copia los archivos
git clone https://github.com/tu-usuario/PrimerPrevioHely.git .

# Construye y ejecuta
docker build -t cafeteria-app .
docker run -d -p 8080:80 --name cafeteria cafeteria-app

# Accede en: http://tu-servidor:8080
```

### Opción 2: Con docker-compose (CON proxy reverso)

```bash
# En tu servidor
cd cafeteria-app

# Edita docker-compose.yml para agregar tu proyecto existente
# Descomenta y configura la sección proyecto-existente

# Inicia todo
docker-compose up -d

# Ver logs
docker-compose logs -f cafeteria

# Detener
docker-compose down
```

---

## 🌐 Múltiples proyectos

### Configuración recomendada: Nginx Proxy con puertos

Edita `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Tu proyecto existente (ejemplo con Node.js)
  proyecto-existente:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - /ruta/a/tu/proyecto:/app
    command: npm start
    ports:
      - "3000:3000"
    networks:
      - app-network

  # Cafetería (puerto 8080)
  cafeteria:
    build: .
    ports:
      - "8080:80"
    networks:
      - app-network

networks:
  app-network:
```

**Acceso:**
- Proyecto existente: `http://tu-servidor:3000`
- Cafetería: `http://tu-servidor:8080`

### Configuración con proxy reverso (mismo puerto)

```yaml
version: '3.8'

services:
  proyecto-existente:
    # ... tu configuración
    # NO expongas puertos aquí

  cafeteria:
    build: .
    # NO expongas puertos aquí

  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./proxy-config/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./proxy-config/conf.d:/etc/nginx/conf.d:ro
    depends_on:
      - cafeteria
      - proyecto-existente
    networks:
      - app-network
```

**Acceso:**
- Proyecto existente: `http://tu-servidor/`
- Cafetería: `http://tu-servidor/cafeteria`

---

## 🔍 Verificación

### Ver contenedores corriendo
```bash
docker ps
```

### Ver logs
```bash
docker logs cafeteria-app
# o
docker-compose logs -f
```

### Probar health check
```bash
curl http://localhost:8080
```

---

## 🧪 Ejecutar pruebas localmente

### Antes de hacer commit:

```bash
# Instalar dependencias
npm install

# Ejecutar pruebas
npm test

# Servidor de desarrollo
npm run dev
```

Si las pruebas fallan localmente, también fallarán en GitHub Actions.

---

## 🚨 Troubleshooting

### Las pruebas fallan en GitHub Actions
```bash
# Ejecuta localmente primero
npm test

# Revisa los logs en GitHub Actions
# Ve a: Actions → Tu workflow → Job failed
```

### El contenedor no inicia
```bash
# Ver logs
docker logs cafeteria-app

# Verificar puertos ocupados
netstat -tulpn | grep 8080

# Reconstruir imagen
docker build --no-cache -t cafeteria-app .
```

### No puedo acceder al servidor
```bash
# Verifica firewall
sudo ufw status
sudo ufw allow 8080

# Verifica que el contenedor esté corriendo
docker ps | grep cafeteria
```

### El deploy falla por SSH
```bash
# Prueba la conexión SSH manualmente
ssh -i ~/.ssh/github_actions usuario@tu-servidor

# Verifica que la clave esté en el servidor
cat ~/.ssh/authorized_keys
```

---

## 📝 Workflow CI/CD Explicado

```
1. PUSH a main
   ↓
2. GitHub Actions detecta cambio
   ↓
3. Job: TEST
   - Instala dependencias
   - Ejecuta npm test
   - ❌ Si falla → STOP (no despliega)
   - ✅ Si pasa → continúa
   ↓
4. Job: BUILD
   - Construye imagen Docker
   - Guarda imagen como artifact
   ↓
5. Job: DEPLOY
   - Conecta al servidor por SSH
   - Copia archivos
   - Detiene contenedor viejo
   - Inicia contenedor nuevo
   - ✅ Aplicación actualizada
```

---

## 🎯 Comandos útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Reiniciar un servicio
docker-compose restart cafeteria

# Ver uso de recursos
docker stats

# Limpiar imágenes viejas
docker image prune -a

# Actualizar manualmente (sin CI/CD)
cd cafeteria-app
git pull
docker-compose up -d --build

# Backup de datos (si usas volúmenes)
docker run --rm -v cafeteria_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data
```

---

## ⚡ Despliegue Rápido

```bash
# 1. En tu servidor
mkdir -p ~/cafeteria-app && cd ~/cafeteria-app

# 2. Clonar repositorio
git clone https://github.com/isaacDiazR/PrimerPrevioHely.git .

# 3. Instalar dependencias
npm install

# 4. Ejecutar pruebas
npm test

# 5. Desplegar
docker-compose up -d cafeteria

# 6. Verificar
curl http://localhost:8080
```

---

## 📧 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica GitHub Actions: pestaña "Actions" en tu repo
3. Prueba localmente primero: `npm test`

**¡Listo! Tu aplicación ahora tiene CI/CD completo.** 🎉
