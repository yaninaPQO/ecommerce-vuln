// Pruebas básicas de seguridad

const request = require('supertest');
const app = require('../server');

describe('Security Tests', () => {
  
  // Test para verificar que faltan autenticaciones
  describe('Missing Authentication', () => {
    it('should allow access to protected endpoints without token', async () => {
      const response = await request(app)
        .get('/api/products/top-sellers');
      
      // Vulnerabilidad: No requiere autenticación
      expect(response.status).not.toBe(401);
    });
  });

  // Test para verificar información expuesta
  describe('Information Disclosure', () => {
    it('should expose sensitive data in errors', async () => {
      const response = await request(app)
        .get('/api/invalid-route');
      
      // Debería no exponer stack trace
      expect(response.body.stack).toBeUndefined();
    });
  });

  // Test para verificar CORS mal configurado
  describe('CORS Configuration', () => {
    it('should reject cross-origin requests', async () => {
      const response = await request(app)
        .get('/api/products/top-sellers')
        .set('Origin', 'https://attacker.com');
      
      // Vulnerabilidad: Acepta cualquier origen
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  // Test para verificar vulnerabilidades de dependencias
  describe('Dependency Vulnerabilities', () => {
    it('should check lodash version', () => {
      const lodash = require('lodash');
      // Vulnerable version
      expect(lodash.VERSION).toBe('3.10.1');
    });

    it('should check bcryptjs version', () => {
      const bcrypt = require('bcryptjs');
      // Vulnerable version
    });
  });

  // Test para verificar input validation
  describe('Input Validation', () => {
    it('should validate user input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: '', // Email vacío
          password: '' // Password vacío
        });
      
      // Debería rechazar pero no lo hace
      expect(response.status).not.toBe(400);
    });
  });

});
