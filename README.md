# Aplicación E-Commerce Vulnerable - Análisis de Seguridad con Snyk

Esta es una aplicación de e-commerce **intencionalmente vulnerable** creada para demostrar cómo identificar y remediar problemas de seguridad usando **Snyk**.

## ⚠️ ADVERTENCIA

Esta aplicación contiene múltiples vulnerabilidades de seguridad intencionales. **NO debe ser utilizada en producción** bajo ninguna circunstancia. Es únicamente para propósitos educativos y de prueba de herramientas de seguridad.

## Características de la Aplicación

- API REST completa de e-commerce
- Gestión de usuarios y autenticación
- Catálogo de productos
- Carrito de compras
- Procesamiento de pagos (Stripe)
- Panel de administración
- Base de datos MongoDB

## Vulnerabilidades Incluidas

### 1. **Dependencias con Vulnerabilidades Conocidas**
- `express@4.16.0` - Múltiples vulnerabilidades
- `lodash@3.10.1` - Prototype Pollution
- `bcryptjs@2.0.0` - Versión antigua insegura
- `jsonwebtoken@7.0.0` - Algoritmos débiles
- `mongoose@4.7.0` - Vulnerabilidades de validación
- `axios@0.16.0` - Vulnerabilidades de seguridad
- Y muchas otras dependencias vulnerables

### 2. **Vulnerabilidades de Código**

#### Autenticación y Autorización
- ❌ JWT sin expiración
- ❌ Contraseñas enviadas en respuestas API
- ❌ Sin validación en endpoints sensibles
- ❌ Tokens predecibles en recuperación de contraseña
- ❌ Rounds de bcrypt muy bajos

#### Inyección
- ❌ SQL Injection potencial
- ❌ NoSQL Injection
- ❌ Command Injection
- ❌ Eval de código arbitrario
- ❌ XXE (XML External Entity)
- ❌ LDAP Injection
- ❌ Server-Side Template Injection

#### Exposición de Datos
- ❌ Números de tarjeta almacenados sin encriptación
- ❌ CVV almacenado en base de datos
- ❌ Credenciales hardcodeadas en código
- ❌ API keys en archivos .env
- ❌ Información sensible expuesta en API responses

#### Control de Acceso
- ❌ IDOR (Insecure Direct Object Reference)
- ❌ Missing Function Level Access Control
- ❌ Path Traversal
- ❌ Acceso sin autenticación a endpoints críticos

#### Carga de Archivos
- ❌ Validación débil de extensiones
- ❌ Sin sanitización de nombres de archivo
- ❌ Uploads sin restricción de tamaño adecuada

#### Seguridad de Aplicación
- ❌ CORS configurado para permitir cualquier origen
- ❌ CSRF sin protección
- ❌ Headers de seguridad débiles
- ❌ Información de error expuesta
- ❌ SSRF (Server-Side Request Forgery)
- ❌ Open Redirects

#### Procesamiento de Pagos
- ❌ Sin verificación de webhook de Stripe
- ❌ Stripe key hardcodeada
- ❌ Manipulación de precios en carrito
- ❌ Logging de datos sensibles de tarjeta
- ❌ Race conditions en checkout

#### Base de Datos
- ❌ Conexión MongoDB sin autenticación
- ❌ Información interna en modelos expuesta

## Instalación y Configuración

### Requisitos
- Node.js 14+ 
- npm o yarn
- MongoDB en ejecución (local o remoto)
- Snyk CLI instalado

### Pasos de Instalación

1. **Clonar o copiar el proyecto:**
```bash
cd /home/yanina/Documents/example-proy
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar el servidor:**
```bash
npm start
# O para desarrollo con auto-reload:
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Análisis de Seguridad con Snyk

### Instalación de Snyk CLI

```bash
npm install -g snyk
# O usando npm local
npx snyk --version
```

### Ejecutar Pruebas de Seguridad

#### 1. **Escanear Vulnerabilidades de Dependencias**
```bash
snyk test
```

Este comando escanea todas las dependencias en `package.json` y reporta vulnerabilidades conocidas.

#### 2. **Generar Reporte HTML Detallado**
```bash
snyk test --json > snyk-report.json
snyk test --html
```

#### 3. **Monitorear Proyecto en Continuo**
```bash
snyk monitor
```

Esto registra tu proyecto en Snyk para monitoreo continuo en la nube.

#### 4. **Intentar Arreglar Vulnerabilidades Automáticamente**
```bash
snyk fix
```

⚠️ **Nota:** Algunos fixes pueden no funcionar o romper la aplicación.

#### 5. **Generar Reporte de Política**
```bash
snyk test --policy-path=snyk-policy.json
```

### Tipos de Vulnerabilidades que Snyk Detectará

```
vulnerabilidades de terceros
├── Direct dependencies
│   ├── express@4.16.0
│   ├── lodash@3.10.1
│   ├── bcryptjs@2.0.0
│   └── jsonwebtoken@7.0.0
│
├── Vulnerabilidades por Severidad
│   ├── CRITICAL (6+)
│   ├── HIGH (8+)
│   ├── MEDIUM (12+)
│   └── LOW (4+)
│
└── Tipos
    ├── Prototype Pollution
    ├── Remote Code Execution (RCE)
    ├── Regular Expression DoS
    ├── Path Traversal
    └── Information Disclosure
```

## Estructura del Proyecto

```
.
├── server.js                 # Entrada principal de la aplicación
├── package.json              # Dependencias vulnerables
├── .env                      # Credenciales inseguras (ejemplo)
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Archivos a ignorar
├── .eslintrc.json            # Configuración de eslint
│
├── routes/
│   ├── auth.js               # Endpoints de autenticación (vulnerables)
│   ├── products.js           # Endpoints de productos (SSRF, Path Traversal)
│   ├── cart.js               # Endpoints de carrito (manipulación de precios)
│   ├── payment.js            # Endpoints de pagos (datos sensibles expuestos)
│   └── admin.js              # Endpoints admin (sin autenticación, eval, xxe, etc)
│
├── models/
│   ├── User.js               # Modelo de usuario (datos sensibles sin encripción)
│   ├── Product.js            # Modelo de producto
│   ├── Cart.js               # Modelo de carrito
│   └── Order.js              # Modelo de orden (datos de pago inseguros)
│
├── middleware/               # Middleware (actual vacío - oportunidad de mejora)
├── config/                   # Configuración (actual vacío)
└── uploads/                  # Directorio para cargas de archivos
```

## Endpoints de Prueba

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/change-password` - Cambiar contraseña (sin validación)
- `POST /api/auth/forgot-password` - Recuperar contraseña (token predecible)

### Productos
- `GET /api/products/top-sellers` - Listar productos principales
- `GET /api/products/image/:imageName` - Descargar imagen (Path Traversal)
- `POST /api/products/search` - Buscar productos (NoSQL Injection)
- `POST /api/products/create` - Crear producto (sin autenticación)
- `POST /api/products/import-from-url` - Importar desde URL (SSRF)
- `GET /api/products/:id/full-details` - Detalles completos (información sensible)
- `DELETE /api/products/:id` - Eliminar producto (sin autorización)

### Carrito
- `POST /api/cart/add` - Añadir al carrito
- `GET /api/cart/:userId` - Ver carrito de otro usuario (IDOR)
- `PUT /api/cart/update-price` - Cambiar precio en carrito
- `POST /api/cart/checkout` - Procesar pago (race condition)
- `POST /api/cart/clear` - Limpiar carrito (sin CSRF token)

### Pagos
- `POST /api/payment/process` - Procesar pago
- `POST /api/payment/paypal-payment` - Pago con PayPal (credenciales expuestas)
- `POST /api/payment/webhook` - Webhook de Stripe (sin verificación)
- `GET /api/payment/orders/:orderId` - Ver orden (IDOR)
- `POST /api/payment/refund` - Procesar reembolso

### Admin
- `GET /api/admin/users` - Listar usuarios (sin autenticación)
- `GET /api/admin/config` - Ver configuración (credenciales expuestas)
- `POST /api/admin/execute-script` - Ejecutar script (eval injection)
- `POST /api/admin/system-command` - Ejecutar comando (command injection)
- `GET /api/admin/redirect?url=` - Redirección abierta (open redirect)

## Cómo Usar Para Demostración

### Escenario 1: Análisis Inicial
1. Instalar Snyk CLI
2. Ejecutar `snyk test` en la carpeta del proyecto
3. Observar todas las vulnerabilidades encontradas
4. Tomar screenshots para documentación

### Escenario 2: Análisis Detallado
1. Ejecutar `snyk test --json > report.json`
2. Abrir el reporte en formato JSON
3. Usar `snyk test --html > report.html`
4. Ver el reporte interactivo en navegador

### Escenario 3: Monitoreo Continuo
1. Crear cuenta en snyk.io
2. Ejecutar `snyk auth`
3. Ejecutar `snyk monitor`
4. Ver el proyecto en el dashboard de Snyk

### Escenario 4: Intentar Reparaciones
1. Ejecutar `snyk fix`
2. Comparar cambios en package.json
3. Notar qué vulnerabilidades se pueden arreglar automáticamente
4. Identificar cuáles requieren cambios de código

## Remediación Manual

Aunque el objetivo es mostrar vulnerabilidades para Snyk, aquí están algunos pasos para remediación:

### Para Actualizar Dependencias:
```bash
# Actualizar a versiones seguras
npm update express lodash bcryptjs jsonwebtoken mongoose axios

# O especificar versiones seguras
npm install express@latest
```

### Para Vulnerabilidades de Código:
- Agregar validación de entrada
- Implementar CORS restringido
- Agregar autenticación a endpoints sensibles
- Encriptar datos sensibles
- Usar prepared statements
- Implementar rate limiting
- Agregar CSRF tokens
- Encriptar contraseñas con bcrypt (rounds > 10)
- Agregar expiración a JWT
- Verificar webhooks
- Logging seguro sin datos sensibles

## Herramientas Adicionales

Además de Snyk, puedes usar:

1. **OWASP Dependency-Check**
```bash
npm install -g dependency-check
dependency-check --project Ecommerce --scan .
```

2. **Safety (para Python)**
```bash
pip install safety
safety check
```

3. **ESLint con plugins de seguridad**
```bash
npm install --save-dev eslint-plugin-security
```

4. **SonarQube**
Para análisis de código estático más profundo

## Referencias de Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Snyk Documentation](https://docs.snyk.io/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Secure Coding Practices](https://owasp.org/www-community/attacks/)

## Descargo de Responsabilidad

Este proyecto es **únicamente para propósitos educativos y de investigación de seguridad**. 

- No debe ser desplegado en producción
- No debe ser utilizado para atacar sistemas
- El usuario es responsable de su uso
- Las vulnerabilidades son intencionales y educativas

## Licencia

MIT - Este proyecto está disponible para uso educativo libre.

## Autor

Creado para demostración de análisis de seguridad con Snyk.

---

**¡Feliz análisis de seguridad! 🔐**
