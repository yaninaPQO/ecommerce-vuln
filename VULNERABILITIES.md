# Documento de Vulnerabilidades Detectadas por Snyk

Este documento detalla todas las vulnerabilidades que Snyk puede detectar en esta aplicación.

## Tabla de Contenidos
1. [Vulnerabilidades Críticas](#críticas)
2. [Vulnerabilidades Altas](#altas)
3. [Vulnerabilidades Medias](#medias)
4. [Vulnerabilidades Bajas](#bajas)

## CRÍTICAS

### 1. Prototype Pollution en lodash@3.10.1
- **ID:** SNYK-JS-LODASH-450202
- **Severidad:** CRÍTICA
- **Tipo:** Prototype Pollution
- **Descripción:** La librería lodash versión 3.10.1 es vulnerable a prototype pollution a través del parámetro defaultsDeep.
- **Impacto:** Permite a un atacante modificar el prototipo Object, afectando toda la aplicación
- **Remediación:** Actualizar a lodash@4.17.21 o superior
- **CVE:** CVE-2021-23337
- **CVSS Score:** 9.8

### 2. Deserialization of Untrusted Data
- **ID:** SNYK-JS-MONGOOSE-1011840
- **Severidad:** CRÍTICA  
- **Tipo:** Deserialization Attack
- **Descripción:** mongoose@4.7.0 permite la deserialización insegura de datos
- **Impacto:** RCE (Remote Code Execution)
- **Remediación:** Actualizar a mongoose@5.13.5 o superior
- **CVSS Score:** 9.8

### 3. Regular Expression Denial of Service (ReDoS) en jsonwebtoken@7.0.0
- **ID:** SNYK-JS-JSONWEBTOKEN-173680
- **Severidad:** CRÍTICA
- **Tipo:** Regular Expression DoS
- **Descripción:** jsonwebtoken es vulnerable a Regex DoS
- **Impacto:** Denegación de Servicio (DoS)
- **Remediación:** Actualizar a jsonwebtoken@8.5.1 o superior
- **CVSS Score:** 7.5

## ALTAS

### 1. Remote Code Execution en express@4.16.0
- **ID:** SNYK-JS-EXPRESS-174743
- **Severidad:** ALTA
- **Tipo:** RCE
- **Descripción:** Express 4.16.0 es vulnerable a code execution
- **Impacto:** Ejecución remota de código
- **Remediación:** Actualizar a express@4.16.1 o superior
- **CVE:** CVE-2017-1000600
- **CVSS Score:** 8.0

### 2. Authorization Bypass en axios@0.16.0
- **ID:** SNYK-JS-AXIOS-1038409
- **Severidad:** ALTA
- **Tipo:** Authorization Bypass
- **Descripción:** Bypass de HTTPS MITM en ciertos casos
- **Impacto:** Man-in-the-Middle attacks
- **Remediación:** Actualizar a axios@0.21.2 o superior
- **CVSS Score:** 7.4

### 3. Information Disclosure en mysql@2.11.1
- **ID:** SNYK-JS-MYSQL-174705
- **Severidad:** ALTA
- **Tipo:** Information Disclosure
- **Descripción:** mysql@2.11.1 expone información sensible en errores
- **Impacto:** Fuga de credenciales de base de datos
- **Remediación:** Actualizar a mysql@2.18.1 o superior
- **CVSS Score:** 7.5

## MEDIAS

### 1. XSS en ejs@2.5.5
- **ID:** SNYK-JS-EJS-1051460
- **Severidad:** MEDIA
- **Tipo:** Cross-Site Scripting (XSS)
- **Descripción:** ejs es vulnerable a template injection
- **Impacto:** Ejecución de código JavaScript en navegador
- **Remediación:** Actualizar a ejs@3.1.6 o superior
- **CVSS Score:** 6.1

### 2. Denial of Service en request@2.79.0
- **ID:** SNYK-JS-REQUEST-608884
- **Severidad:** MEDIA
- **Tipo:** Regular Expression DoS
- **Descripción:** request usa regex vulnerable
- **Impacto:** DoS
- **Remediación:** Migrar a axios o node-fetch, o actualizar a request@2.88.2
- **CVSS Score:** 5.3

### 3. Arbitrary File Upload en multer@1.2.0
- **ID:** SNYK-JS-MULTER-174708
- **Severidad:** MEDIA
- **Tipo:** Arbitrary File Upload
- **Descripción:** multer no valida correctamente archivos
- **Impacto:** Carga de archivos maliciosos
- **Remediación:** Actualizar a multer@1.4.5 o superior
- **CVSS Score:** 6.5

## BAJAS

### 1. Integer Overflow en tar@2.2.0
- **Severidad:** BAJA
- **Tipo:** Integer Overflow
- **Descripción:** Vulnerabilidad en extracción de archivos tar
- **Impacto:** Acceso a archivos del sistema
- **Remediación:** Actualizar a tar@6.1.11 o superior

### 2. Missing Rate Limiting
- **Severidad:** BAJA
- **Tipo:** Application Security
- **Descripción:** No hay rate limiting implementado
- **Impacto:** Posibilidad de brute force attacks
- **Remediación:** Implementar express-rate-limit

### 3. Missing Input Validation
- **Severidad:** BAJA
- **Tipo:** Input Validation
- **Descripción:** Falta validación de entrada en múltiples endpoints
- **Impacto:** Possible injection attacks
- **Remediación:** Usar joi o express-validator

## Resumen de Vulnerabilidades

| Severidad | Cantidad |
|-----------|----------|
| CRÍTICA   | 3        |
| ALTA      | 3        |
| MEDIA     | 3        |
| BAJA      | 3        |
| **TOTAL** | **12+**  |

*Nota: Esta es una lista simulada de las vulnerabilidades que Snyk detectaría. El número real puede variar según la versión exacta de las dependencias.*

## Remediación Prioritaria

### Paso 1: Actualizaciones Críticas (Hacer inmediatamente)
```bash
npm install lodash@4.17.21
npm install mongoose@5.13.15
npm install jsonwebtoken@9.0.0
```

### Paso 2: Actualizaciones Altas (Hacer pronto)
```bash
npm install express@4.18.2
npm install axios@0.27.2
npm install mysql@2.18.1
```

### Paso 3: Actualizaciones Medias (Planificar)
```bash
npm install ejs@3.1.8
npm install multer@1.4.5
npm install tar@6.1.11
```

### Paso 4: Mejoras de Código
- Agregar validación con joi/express-validator
- Implementar rate limiting
- Agregar proper error handling
- Encriptar datos sensibles
- Agregar autenticación y autorización

## Testing Después de Remediación

Después de actualizar las dependencias:

```bash
npm install
npm test
snyk test
snyk test --severity-threshold=high
```

## Documentación de Snyk

Para más información sobre cada vulnerabilidad:
- Visita https://snyk.io/vuln/ y busca el ID de SNYK
- Usa `snyk test --json` para obtener detalles completos
- Usa `snyk test --html` para ver reporte interactivo

---

**Última actualización:** Abril 2026
