# Checklist de Auditoría de Seguridad

Use este checklist para verificar las vulnerabilidades detectadas y verificar la remediación.

## 1. ANÁLISIS DE DEPENDENCIAS CON SNYK

### 1.1 Preparación
- [ ] Snyk CLI instalado (`snyk --version`)
- [ ] Proyecto clonado/descargado
- [ ] `npm install` ejecutado
- [ ] Node.js v14+ instalado

### 1.2 Ejecución de Snyk
- [ ] `snyk test` ejecutado sin errores
- [ ] Vulnerabilidades críticas identificadas (≥3)
- [ ] Vulnerabilidades altas identificadas (≥3)
- [ ] JSON report generado (`snyk test --json > report.json`)
- [ ] HTML report generado (`snyk test --html > report.html`)
- [ ] Report HTML abierto en navegador

### 1.3 Análisis de Resultados
- [ ] Identificadas vulnerabilidades en lodash (Prototype Pollution)
- [ ] Identificadas en jsonwebtoken (ReDoS)
- [ ] Identificadas en mongoose (Deserialization)
- [ ] Identificadas en express (RCE)
- [ ] Total de vulnerabilidades ≥ 12
- [ ] CVSS score analizado
- [ ] Severity distribution verificada

## 2. VULNERABILIDADES DE AUTENTICACIÓN

### 2.1 JWT sin Expiración
```javascript
// En routes/auth.js línea ~52
const token = jwt.sign({...}, secret); // Sin expiresIn
```
- [ ] Flujo de registro probado
- [ ] Token obtido
- [ ] Token válido sin límite de tiempo
- [ ] Protocolo HTTP aprovecha esto
- [ ] Documentado en README

### 2.2 Contraseña Expuesta en Respuesta
```javascript
// En routes/auth.js línea ~59
password: user.password // NUNCA retornar
```
- [ ] Endpoint /api/auth/login analizado
- [ ] Response contiene password field
- [ ] Documentado como CRÍTICO
- [ ] Captura de pantalla tomada

### 2.3 Token de Recuperación Predecible
```javascript
// En routes/auth.js línea ~87
const resetToken = 'reset-' + email + '-' + Date.now();
```
- [ ] Endpoint /api/auth/forgot-password analizado
- [ ] Token se retorna en response
- [ ] Token es predecible (email + timestamp)
- [ ] Documentado como vulnerabilidad

## 3. VULNERABILIDADES DE INYECCIÓN

### 3.1 NoSQL Injection
```javascript
// En routes/admin.js línea ~140
const user = await User.findOne({ email: email });
```
- [ ] Payload probado: `{"email": {"$ne": null}}`
- [ ] Todos los usuarios retornados
- [ ] Documentado con captura

### 3.2 Command Injection
```javascript
// En routes/admin.js línea ~100
const output = execSync(command);
```
- [ ] Payload probado: `"whoami; cat /etc/passwd"`
- [ ] Comando ejecutado en servidor
- [ ] Output recibido en respuesta
- [ ] Documentado

### 3.3 XXE/XML Injection
```javascript
// En routes/admin.js línea ~70
const parser = new xml.Parser({...});
```
- [ ] XXE payload testeado
- [ ] Entidades externas procesadas
- [ ] Documentado

## 4. VULNERABILIDADES DE ACCESO

### 4.1 IDOR - Ver Carrito Ajeno
```javascript
// En routes/cart.js línea ~37
GET /api/cart/:userId
```
- [ ] userId de otro usuario usado
- [ ] Carrito accesible sin autenticación
- [ ] Información sensible visible
- [ ] Documentado

### 4.2 IDOR - Ver Orden Ajena
```javascript
// En routes/payment.js línea ~96
GET /api/payment/orders/:orderId
```
- [ ] orderId de otro usuario usado
- [ ] Detalles de pago visibles
- [ ] Sin validación de propietario
- [ ] Documentado

### 4.3 Eliminación sin Autorización
```javascript
// En routes/admin.js línea ~153
DELETE /api/admin/user/:userId
```
- [ ] Objeto eliminado sin ser admin
- [ ] Sin verificación de rol
- [ ] Documentado

## 5. VULNERABILIDADES DE DATOS

### 5.1 Información Sensible Expuesta
```javascript
// En routes/admin.js línea ~70
GET /api/admin/config
```
- [ ] Endpoint accedido sin autenticación
- [ ] Database password visible
- [ ] API keys expuestas
- [ ] JWT secret visible
- [ ] Stripe key visible
- [ ] Captura tomada

### 5.2 Almacenamiento Inseguro
```javascript
// En models/User.js
creditCard: { number, cvv, expiry }
```
- [ ] Números de tarjeta almacenados sin encripción
- [ ] CVV guardado (NUNCA HACER ESTO)
- [ ] SSN sin protección
- [ ] Documentado

### 5.3 Logging de Datos Sensibles
```javascript
// En routes/payment.js línea ~26
console.log(`Card=${cardNumber}, CVV=${cvv}`);
```
- [ ] Logs analizados
- [ ] Datos sensibles en logs
- [ ] Log files encontrados
- [ ] Documentado

## 6. VULNERABILIDADES DE CARGAS

### 6.1 Path Traversal
```javascript
// En routes/products.js línea ~43
GET /api/products/image/:imageName
// Sin validación: imageName = "../../../../etc/passwd"
```
- [ ] Payload testeado: `../../etc/passwd`
- [ ] Archivos del sistema accesibles
- [ ] Documentado

### 6.2 File Upload Weak Validation
```javascript
// En routes/products.js línea ~12
const allowedExtensions = ['.jpg', '.png', '.pdf', '.exe', '.sh'];
```
- [ ] Extensiones peligrosas permitidas
- [ ] .exe y .sh uploadables
- [ ] Sin sanitización de nombre
- [ ] Documentado

## 7. VULNERABILIDADES DE SEGURIDAD GENERAL

### 7.1 CORS Abierto
```javascript
// En server.js línea ~11
app.use(cors({ origin: "*" }));
```
- [ ] Verificado CORS headers
- [ ] Origin: * retornado
- [ ] Credenciales: true con origin abierto
- [ ] Documentado

### 7.2 Sin CSRF
```javascript
// En routes/cart.js línea ~120
router.post('/clear', async (req, res) => {
// Sin token CSRF
```
- [ ] POST sin CSRF token
- [ ] CSRF attack posible
- [ ] Documentado

### 7.3 Error Disclosure
```javascript
// En server.js línea ~28
stack: process.env.NODE_ENV === 'development' ? err.stack
```
- [ ] Error con stack trace
- [ ] Código interno revelado
- [ ] Rutas expuestas
- [ ] Documentado

## 8. VULNERABILIDADES DE PAGOS

### 8.1 Stripe Key Hardcodeada
```javascript
// En routes/payment.js línea ~7
const STRIPE_SECRET = 'sk_test_4eC39HqLyjWDarhtT657j8AqHrY';
```
- [ ] Stripe key en el código
- [ ] Visible en GitHub si public
- [ ] Completamente comprometida
- [ ] Documentado

### 8.2 Sin Verificación de Webhook
```javascript
// En routes/payment.js línea ~53
router.post('/webhook', async (req, res) => {
// Sin verificar firma
```
- [ ] Webhook sin verificación
- [ ] Eventos fake inyectables
- [ ] Pagos fraudulentos posibles
- [ ] Documentado

### 8.3 Manipulación de Precios
```javascript
// En routes/cart.js línea ~78
item.price = newPrice; // Sin validación
```
- [ ] Cliente puede cambiar precios
- [ ] $1000 producto → $0.01
- [ ] Documentado

## 9. REMEDIACIÓN

### 9.1 Actualizar Dependencias
```bash
# Antes
npm list | grep -E "express|lodash|mongoose|bcryptjs"

[ ] express@4.16.0 → express@4.18.2
[ ] lodash@3.10.1 → lodash@4.17.21
[ ] mongoose@4.7.0 → mongoose@5.13.15
[ ] bcryptjs@2.0.0 → bcryptjs@2.4.3
[ ] jsonwebtoken@7.0.0 → jsonwebtoken@9.0.0
[ ] axios@0.16.0 → axios@0.27.2
```

### 9.2 Snyk Fix
```bash
[ ] snyk fix --dry-run ejecutado
[ ] Cambios previsualizados
[ ] snyk fix ejecutado
[ ] package.json actualizado
[ ] npm install ejecutado
```

### 9.3 Validación Post-Fix
```bash
[ ] npm test ejecutado
[ ] snyk test --json duplicado
[ ] Vulnerabilidades reducidas
[ ] Reportes comparados
```

## 10. DOCUMENTACIÓN

### 10.1 Reportes Generados
- [ ] snyk-report.json generado
- [ ] snyk-report.html generado
- [ ] VULNERABILITIES.md completado
- [ ] EXPLOITATION_EXAMPLES.md revisado
- [ ] README.md actualizado
- [ ] SNYK_GUIDE.md revisado

### 10.2 Screenshots Tomadas
- [ ] Salida de snyk test
- [ ] Reporte HTML en navegador
- [ ] Vulnerabilidades críticas listadas
- [ ] JSON report sample
- [ ] Modelo de arquitectura

### 10.3 Presentación
- [ ] Estructura del proyecto explicada
- [ ] Vulnerabilidades demostradas
- [ ] Impacto explicado
- [ ] Remediación mostrada
- [ ] Proceso de Snyk demostrado

## 11. TESTING CON EJEMPLOS

### 11.1 Endpoints Testeados
- [ ] `GET /api/products/top-sellers` - Sin autenticación
- [ ] `POST /api/auth/login` - Password en response
- [ ] `GET /api/products/image/../../etc/passwd` - Path Traversal
- [ ] `POST /api/admin/system-command` - Command Injection
- [ ] `GET /api/cart/OTRO_USER_ID` - IDOR
- [ ] `GET /api/admin/config` - Information Disclosure
- [ ] `POST /api/products/import-from-url` - SSRF

### 11.2 Payloads Usados
- [ ] NoSQL injection documentada
- [ ] Command injection documentada
- [ ] Path traversal documentada
- [ ] SSRF documentada
- [ ] IDOR documentada
- [ ] Prototype pollution documentada

## 12. ENTREGABLES FINALES

### 12.1 Archivos Generados
- [ ] /home/yanina/Documents/example-proy/package.json
- [ ] /home/yanina/Documents/example-proy/server.js
- [ ] /home/yanina/Documents/example-proy/README.md
- [ ] /home/yanina/Documents/example-proy/VULNERABILITIES.md
- [ ] /home/yanina/Documents/example-proy/SNYK_GUIDE.md
- [ ] /home/yanina/Documents/example-proy/EXPLOITATION_EXAMPLES.md
- [ ] /home/yanina/Documents/example-proy/.env (con credenciales de ejemplo)
- [ ] /home/yanina/Documents/example-proy/routes/* (5 archivos)
- [ ] /home/yanina/Documents/example-proy/models/* (4 archivos)
- [ ] /home/yanina/Documents/example-proy/docker-compose.yml
- [ ] /home/yanina/Documents/example-proy/Dockerfile

### 12.2 Documentación Completa
- [ ] Instalación y setup documentado
- [ ] Vulnerabilidades listadas
- [ ] Guía de Snyk creada
- [ ] Ejemplos de explotación
- [ ] Checklist de remediación
- [ ] Referencias incluidas

### 12.3 Pruebas de Snyk
- [ ] Snyk test ejecutado exitosamente
- [ ] 30+ vulnerabilidades encontradas
- [ ] Reportes generados (JSON y HTML)
- [ ] Severidad criticada
- [ ] Snyk fix probado
- [ ] Monitoreo demostrado (opcional)

## 13. NOTAS FINALES

```
Proyecto: Ecommerce Vulnerable para Snyk Analysis
Estado: ✅ COMPLETADO
Vulnerabilidades: 30+
Dependencias Vulnerables: 10+
Archivos Creados: 15+
Total de Líneas de Código: 1000+

Objetivo: Proporcionar ejemplo completo para:
- Demostración de análisis de seguridad
- Aprendizaje de vulnerabilidades comunes
- Testing con herramientas como Snyk
- Buenas prácticas de remediación
```

---

**Última revisión:** 2026-04-27
**Versión:** 1.0
**Estado:** Listo para pruebas de Snyk
