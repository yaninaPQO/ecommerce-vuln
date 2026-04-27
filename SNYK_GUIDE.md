# Guía Rápida: Análisis de Seguridad con Snyk

## 1. INSTALACIÓN RÁPIDA

### Opción A: Instalación Global
```bash
npm install -g snyk
snyk --version
```

### Opción B: Usando npx (sin instalación)
```bash
npx snyk test
```

## 2. PRIMEROS PASOS

### Paso 1: Cambiar al directorio del proyecto
```bash
cd /home/yanina/Documents/example-proy
```

### Paso 2: Ejecutar análisis básico
```bash
snyk test
```

**Resultado esperado:** Detectará 30+ vulnerabilidades en las dependencias

### Paso 3: Ver resultados en HTML
```bash
snyk test --html > snyk-report.html
open snyk-report.html  # En macOS
# o
firefox snyk-report.html  # En Linux
```

## 3. COMANDOS PRINCIPALES

### Ver todas las vulnerabilidades
```bash
snyk test --all-projects
```

### Mostrar solo vulnerabilidades críticas
```bash
snyk test --severity-threshold=critical
```

### Mostrar solo altas y críticas
```bash
snyk test --severity-threshold=high
```

### Generar reporte JSON detallado
```bash
snyk test --json > vulnerabilities.json
```

### Ver estructura de dependencias
```bash
snyk test --show-vulnerable-paths=true
```

### Analizar también dependencias indirectas
```bash
snyk test --nested-jars
```

## 4. MONITOREO CONTINUO (Requiere cuenta en snyk.io)

### Autenticarse con Snyk
```bash
snyk auth
# Se abrirá el navegador para autenticación
```

### Registrar proyecto para monitoreo
```bash
snyk monitor
```

### Ver proyectos monitoreados
```bash
snyk monitor --list
```

## 5. INTENTAR REPARACIONES

### Ver qué se puede arreglar
```bash
snyk fix --dry-run
```

### Comenzar reparaciones
```bash
snyk fix
```

### Arreglar solo una vulnerabilidad específica
```bash
snyk fix --id=SNYK-JS-LODASH-450202
```

## 6. POLÍTICAS Y CONFIGURACIÓN

### Crear archivo de política
```bash
snyk policy --create
```

### Usar política existente
```bash
snyk test --policy-path=.snyk
```

### Ignorar una vulnerabilidad específica
```bash
snyk ignore --id=SNYK-JS-LODASH-450202 --expiry=2025-12-31
```

## 7. GENERACIÓN DE REPORTES

### Reporte completo en JSON
```bash
snyk test --json | jq '.'
```

### Exportar a archivo
```bash
snyk test --json > report.json
snyk test --sarifOutput=report.sarif
```

### Integración con GitHub
```bash
snyk monitor --remote-repo-url=https://github.com/usuario/repo
```

## 8. ANÁLISIS POR TIPO DE VULNERABILIDAD

```bash
# Ver protección contra prototype pollution
snyk test --filter="prototype"

# Ver inyecciones
snyk test --filter="injection"

# Ver problemas de autenticación  
snyk test --filter="auth"

# Ver information disclosure
snyk test --filter="information"
```

## 9. ANÁLISIS ESPECÍFICO DEL PROYECTO

### 9.1 Vulnerabilidades encontradas esperadas:

#### En Dependencias:
- ✓ lodash@3.10.1 - Prototype Pollution (CRÍTICA)
- ✓ jsonwebtoken@7.0.0 - ReDoS (CRÍTICA)
- ✓ mongoose@4.7.0 - Deserialize (CRÍTICA)
- ✓ express@4.16.0 - RCE (ALTA)
- ✓ bcryptjs@2.0.0 - Versión antigua (ALTA)
- ✓ axios@0.16.0 - Authorization Bypass (ALTA)
- ✓ mysql@2.11.1 - Information Disclosure (ALTA)
- ✓ ejs@2.5.5 - XSS (MEDIA)
- ✓ request@2.79.0 - ReDoS (MEDIA)
- ✓ multer@1.2.0 - File Upload (MEDIA)
- Y muchas más...

### 9.2 Problemas en el código (Snyk Code)

Para análisis de código (requiere Snyk CLI con plugin):
```bash
snyk code test
```

Detectará:
- SQL Injection potencial
- NoSQL Injection
- Command Injection
- SSRF
- XXE
- Exposición de credenciales
- JWT sin expiración
- Etc.

## 10. BENCHMARKING Y COMPARACIÓN

### Comparar antes y después de arreglos
```bash
snyk test > before.txt
snyk fix
snyk test > after.txt
diff before.txt after.txt
```

### Ver histórico de monitoreo
```bash
snyk monitor --history-days=30
```

## 11. TROUBLESHOOTING

### Si Snyk no encuentra vulnerabilidades:
```bash
# Limpiar cache
rm -rf ~/.snyk

# Reinstalar
npm install
snyk test --force-update
```

### Si hay problemas de conexión:
```bash
snyk test --insecure
snyk test --proxy=http://proxy-url
```

### Ver logs de debug
```bash
DEBUG=snyk snyk test
```

## 12. CASO DE USO ESPECÍFICO: DEMOSTRACIONES

### Demo 1: Mostrar vulnerabilidades críticas
```bash
snyk test --severity-threshold=critical --json | jq '.vulnerabilities[] | {id, title, severity}'
```

### Demo 2: Listar todas las dependencias vulnerables
```bash
snyk test --show-vulnerable-paths=false | grep "✓"
```

### Demo 3: Comparar con versiones seguras
```bash
snyk test --json | jq '.vulnerabilities[] | {module: .moduleName, vulnerable: .from[1], upgraded: .upgradePath[1]}'
```

### Demo 4: Ver impacto en la aplicación
```bash
snyk test --all-projects --show-vulnerable-paths=true
```

## 13. INTEGRACIÓN CONTINUA

### GitHub Actions
```yaml
- name: Run Snyk
  run: |
    npm install -g snyk
    snyk test --severity-threshold=high
```

### GitLab CI
```yaml
snyk_test:
  script:
    - npm install -g snyk
    - snyk test --severity-threshold=high
```

## 14. RESUMEN RÁPIDO

| Comando | Uso |
|---------|-----|
| `snyk test` | Análisis básico |
| `snyk test --json` | Formato JSON |
| `snyk test --html` | Reporte HTML |
| `snyk fix` | Intentar arreglarse |
| `snyk monitor` | Monitoreo continuo |
| `snyk auth` | Autentificarse |
| `snyk test --help` | Ver más opciones |

## 15. PRÓXIMOS PASOS

1. Ejecutar `snyk test` para ver vulnerabilidades
2. Usar `snyk test --html` para ver reporte visual
3. Revisar `VULNERABILITIES.md` para detalles
4. Intentar `snyk fix` para ver reparaciones automáticas
5. Registrar proyecto en snyk.io para monitoreo continuo

---

**Más información:** https://docs.snyk.io/

**Reportar vulnerabilidades encontradas:** https://snyk.io/test/

**Comunidad:** https://snyk.io/community
