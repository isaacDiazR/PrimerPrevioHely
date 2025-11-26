# 🔐 Configuración de GitHub Secrets

Esta guía te ayuda a configurar los secrets necesarios para que GitHub Actions pueda desplegar automáticamente tu aplicación.

---

## 📋 Secrets Requeridos

Ve a tu repositorio en GitHub:
```
Settings → Secrets and variables → Actions → New repository secret
```

### Secrets obligatorios:

| Secret Name | Descripción | Ejemplo |
|------------|-------------|---------|
| `SERVER_HOST` | IP o dominio de tu servidor | `192.168.1.100` o `miservidor.com` |
| `SERVER_USER` | Usuario SSH del servidor | `ubuntu` o `root` |
| `SSH_PRIVATE_KEY` | Clave privada SSH completa | Ver sección abajo |
| `SERVER_PORT` | Puerto SSH (opcional, default: 22) | `22` |

### Secrets opcionales (Docker Hub):

| Secret Name | Descripción |
|------------|-------------|
| `DOCKER_USERNAME` | Tu usuario de Docker Hub |
| `DOCKER_PASSWORD` | Tu contraseña/token de Docker Hub |

---

## 🔑 Generar y Configurar Clave SSH

### Paso 1: Generar nueva clave SSH

En tu **máquina local** (Windows/Linux/Mac):

**Windows (PowerShell):**
```powershell
# Generar clave
ssh-keygen -t ed25519 -C "github-actions-deploy" -f $HOME\.ssh\github_actions

# Ver clave privada (copiar TODO el contenido)
Get-Content $HOME\.ssh\github_actions

# Ver clave pública
Get-Content $HOME\.ssh\github_actions.pub
```

**Linux/Mac (Terminal):**
```bash
# Generar clave
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# Ver clave privada (copiar TODO el contenido)
cat ~/.ssh/github_actions

# Ver clave pública
cat ~/.ssh/github_actions.pub
```

### Paso 2: Copiar clave pública al servidor

**Opción A: Con ssh-copy-id (Linux/Mac):**
```bash
ssh-copy-id -i ~/.ssh/github_actions.pub usuario@tu-servidor
```

**Opción B: Manualmente (Windows/Linux/Mac):**
```bash
# Conectarse al servidor
ssh usuario@tu-servidor

# En el servidor, agregar clave pública
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys

# Pegar el contenido de github_actions.pub
# Guardar y salir (Ctrl+O, Enter, Ctrl+X)

chmod 600 ~/.ssh/authorized_keys
exit
```

### Paso 3: Probar la conexión

```bash
# Desde tu máquina local
ssh -i ~/.ssh/github_actions usuario@tu-servidor

# Si funciona, verás el prompt del servidor ✅
```

### Paso 4: Agregar clave privada a GitHub

1. **Copia TODO el contenido** de la clave privada:
   
   **Windows:**
   ```powershell
   Get-Content $HOME\.ssh\github_actions | clip
   ```
   
   **Linux/Mac:**
   ```bash
   cat ~/.ssh/github_actions | pbcopy  # Mac
   # O
   cat ~/.ssh/github_actions | xclip -selection clipboard  # Linux
   ```

2. Ve a GitHub:
   - Tu repositorio → **Settings** → **Secrets and variables** → **Actions**
   - Click en **New repository secret**
   - Name: `SSH_PRIVATE_KEY`
   - Value: Pega TODO el contenido (debe incluir `-----BEGIN` y `-----END`)
   - Click **Add secret**

---

## 🎯 Agregar los demás Secrets

### SERVER_HOST
```
Name: SERVER_HOST
Value: 192.168.1.100
```
O tu dominio:
```
Value: miservidor.com
```

### SERVER_USER
```
Name: SERVER_USER
Value: ubuntu
```
(O el usuario que uses: `root`, `admin`, etc.)

### SERVER_PORT (opcional)
```
Name: SERVER_PORT
Value: 22
```
(Solo si usas un puerto diferente al 22)

---

## ✅ Verificar Configuración

### Checklist:

- [ ] Clave SSH generada
- [ ] Clave pública copiada al servidor
- [ ] Conexión SSH probada exitosamente
- [ ] Secret `SSH_PRIVATE_KEY` agregado (con BEGIN/END completo)
- [ ] Secret `SERVER_HOST` agregado
- [ ] Secret `SERVER_USER` agregado
- [ ] Secret `SERVER_PORT` agregado (si es necesario)
- [ ] Docker instalado en el servidor

---

## 🚨 Troubleshooting

### Error: "Permission denied (publickey)"

**Problema:** La clave no está correctamente configurada.

**Solución:**
```bash
# En el servidor, verifica permisos
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Verifica que la clave pública esté en authorized_keys
cat ~/.ssh/authorized_keys
```

### Error: "Host key verification failed"

**Problema:** GitHub Actions no conoce el servidor.

**Solución 1:** Agregar `StrictHostKeyChecking=no` al workflow (menos seguro):
```yaml
- name: Deploy to server via SSH
  run: |
    ssh -o StrictHostKeyChecking=no ...
```

**Solución 2:** Agregar host key manualmente:
```bash
# En tu máquina local
ssh-keyscan tu-servidor >> ~/.ssh/known_hosts
```

### Error: "Could not resolve hostname"

**Problema:** `SERVER_HOST` incorrecto.

**Solución:**
- Verifica que el valor en GitHub Secrets sea correcto
- Prueba hacer ping desde tu máquina: `ping tu-servidor`

### La clave privada no funciona

**Problema:** Formato incorrecto en GitHub Secret.

**Solución:**
- Asegúrate de copiar TODO el contenido, incluyendo:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...todo el contenido...
  -----END OPENSSH PRIVATE KEY-----
  ```
- No debe haber espacios extra al inicio/final
- Debe incluir los saltos de línea

---

## 📝 Ejemplo de Clave Privada Correcta

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBQx3dK... (muchas líneas más)
...
-----END OPENSSH PRIVATE KEY-----
```

---

## 🐳 Opcional: Configurar Docker Hub

Si quieres subir las imágenes a Docker Hub:

1. Crea cuenta en https://hub.docker.com
2. Genera token de acceso: Settings → Security → New Access Token
3. Agrega secrets en GitHub:
   ```
   DOCKER_USERNAME: tu-usuario
   DOCKER_PASSWORD: tu-token
   ```
4. Modifica `.github/workflows/ci-cd.yml`:
   ```yaml
   - name: Build and push Docker image
     uses: docker/build-push-action@v5
     with:
       push: true  # Cambiar a true
       tags: tu-usuario/cafeteria-app:latest
   ```

---

## 🎉 ¡Todo listo!

Una vez configurados los secrets:

1. Haz un commit y push:
   ```bash
   git add .
   git commit -m "feat: configurar CI/CD"
   git push origin main
   ```

2. Ve a GitHub → **Actions** para ver el workflow en ejecución

3. Si todo está bien, verás:
   - ✅ Test job (pruebas)
   - ✅ Build job (construcción Docker)
   - ✅ Deploy job (despliegue al servidor)

---

## 📚 Recursos Adicionales

- [Documentación GitHub Actions](https://docs.github.com/en/actions)
- [Documentación SSH](https://www.ssh.com/academy/ssh)
- [Docker Hub](https://hub.docker.com)

---

**¿Problemas?** Revisa los logs en GitHub Actions para ver el error específico.
