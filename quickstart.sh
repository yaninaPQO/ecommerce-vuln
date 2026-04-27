#!/bin/bash

# Quick Start Script para Ecommerce Vulnerable App
# Este script facilita la instalación y testing con Snyk

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Ecommerce Vulnerable App - Quick Start with Snyk Analysis     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Función para pedir confirmación
confirm() {
    read -p "$(echo -e ${BLUE}?)${NC} $1 (s/n) " -r
    [[ $REPLY =~ ^[Ss]$ ]]
}

# Verificar Node.js
print_info "Verificando requisitos..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_success "Node.js $(node -v)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm -v)"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 1: Instalación de Dependencias"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ ! -d "node_modules" ]; then
    print_info "Instalando dependencias..."
    npm install
    print_success "Dependencias instaladas"
else
    print_warning "node_modules ya existe"
    if confirm "¿Reinstalar dependencias?"; then
        rm -rf node_modules package-lock.json
        npm install
        print_success "Dependencias reinstaladas"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 2: Verificación de Snyk"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Verificar Snyk
if ! command -v snyk &> /dev/null; then
    print_warning "Snyk CLI no está instalado globalmente"
    if confirm "¿Instalar Snyk CLI globalmente?"; then
        npm install -g snyk
        print_success "Snyk instalado"
    else
        print_info "Usando snyk con npx (requiere npm)"
    fi
else
    print_success "Snyk $(snyk --version)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 3: Análisis de Seguridad con Snyk"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if confirm "¿Ejecutar análisis de seguridad con Snyk?"; then
    print_info "Ejecutando snyk test..."
    echo ""
    
    if command -v snyk &> /dev/null; then
        snyk test --json-file-output=snyk-report.json || true
        snyk test || true
    else
        print_info "Ejecutando con npx snyk..."
        npx snyk test --json-file-output=snyk-report.json || true
        npx snyk test || true
    fi
    
    if [ -f "snyk-report.json" ]; then
        print_success "Reporte JSON guardado: snyk-report.json"
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 4: Generación de Reportes"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if confirm "¿Generar reporte HTML?"; then
    print_info "Generando reporte HTML..."
    if command -v snyk &> /dev/null; then
        snyk test --html=snyk-report.html || true
    else
        npx snyk test --html=snyk-report.html || true
    fi
    
    if [ -f "snyk-report.html" ]; then
        print_success "Reporte HTML guardado: snyk-report.html"
        if confirm "¿Abrir reporte en navegador?"; then
            if command -v xdg-open &> /dev/null; then
                xdg-open snyk-report.html
            elif command -v open &> /dev/null; then
                open snyk-report.html
            else
                print_info "Abre manualmente: snyk-report.html"
            fi
        fi
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 5: Opciones Adicionales"
echo "═══════════════════════════════════════════════════════════════"
echo ""

while true; do
    echo ""
    echo "¿Qué deseas hacer ahora?"
    echo "1) Iniciar servidor (npm start)"
    echo "2) Ver documentación"
    echo "3) Intentar reparar vulnerabilidades (snyk fix)"
    echo "4) Monitoreo continuo (snyk monitor)"
    echo "5) Ver ejemplos de explotación"
    echo "6) Salir"
    echo ""
    
    read -p "Selecciona una opción (1-6): " option
    
    case $option in
        1)
            print_info "Iniciando servidor en puerto 3000..."
            npm start
            break
            ;;
        2)
            print_info "Abriendo README.md..."
            if command -v less &> /dev/null; then
                less README.md
            else
                cat README.md
            fi
            ;;
        3)
            print_warning "ADVERTENCIA: snyk fix puede romper la aplicación"
            if confirm "¿Proceder con snyk fix?"; then
                if command -v snyk &> /dev/null; then
                    snyk fix
                else
                    npx snyk fix
                fi
                print_success "Vulnerabilidades reparadas"
                npm install
                print_info "Ejecuta 'npm test' para verificar"
            fi
            ;;
        4)
            print_info "Configurando monitoreo continuo..."
            if command -v snyk &> /dev/null; then
                snyk monitor
            else
                npx snyk monitor
            fi
            break
            ;;
        5)
            print_info "Abriendo EXPLOITATION_EXAMPLES.md..."
            if command -v less &> /dev/null; then
                less EXPLOITATION_EXAMPLES.md
            else
                cat EXPLOITATION_EXAMPLES.md
            fi
            ;;
        6)
            print_success "¡Hasta luego!"
            break
            ;;
        *)
            print_error "Opción inválida"
            ;;
    esac
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "Comandos Útiles (ejecuta en otro terminal):"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Snyk:"
echo "  snyk test                    # Análisis básico"
echo "  snyk test --json             # Formato JSON"
echo "  snyk test --html             # Reporte HTML"
echo "  snyk fix                     # Intentar reparar"
echo "  snyk monitor                 # Monitoreo continuo"
echo ""
echo "NPM:"
echo "  npm start                    # Iniciar servidor"
echo "  npm test                     # Ejecutar tests"
echo "  npm run dev                  # Desarrollo con nodemon"
echo ""
echo "Docker:"
echo "  docker-compose up            # Iniciar con Docker"
echo "  docker-compose down          # Detener"
echo ""
echo "Documentación:"
echo "  README.md                    # Información general"
echo "  SNYK_GUIDE.md                # Guía de Snyk"
echo "  VULNERABILITIES.md           # Detalles de vulnerabilidades"
echo "  EXPLOITATION_EXAMPLES.md     # Ejemplos de ataque"
echo "  SECURITY_AUDIT_CHECKLIST.md  # Checklist de auditoría"
echo ""
echo "═══════════════════════════════════════════════════════════════"
print_success "¡Listo! Tu proyecto está configurado para análisis de seguridad"
echo "═══════════════════════════════════════════════════════════════"
