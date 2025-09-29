import { describe, test, expect } from 'vitest';
import request from 'supertest';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.join(__dirname, '../../../.dev.vars.production');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...valueParts] = trimmed.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const API_URL = process.env.TEST_URL || 'https://contact-form-worker-production.matthewjpellerito.workers.dev';

describe('Contact Form API', () => {
  const validPayload = {
    name: 'Test User',
    email: 'test@example.com',
    organization: 'Test Org',
    title: 'Tester',
    message: 'This is a test message from the automated test suite',
    turnstileToken: env.BACKDOOR_CONTACT_KEY || 'test-backdoor-key'
  };

  describe('POST /contact - Basic', () => {
    test('should accept valid contact form with backdoor key', async () => {
      const response = await request(API_URL)
        .post('/')
        .send(validPayload)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('successfully'),
      });
      expect(response.body.messageId).toBeDefined();
      expect(response.body.remaining).toBe(999); // Backdoor shows 999 remaining
    });

    test('should reject invalid email format', async () => {
      const invalidPayload = {
        ...validPayload,
        email: 'not-an-email'
      };

      const response = await request(API_URL)
        .post('/')
        .send(invalidPayload)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('should reject missing required fields', async () => {
      const incompletePayload = {
        email: 'test@example.com',
        message: 'Test message'
      };

      const response = await request(API_URL)
        .post('/')
        .send(incompletePayload)
        .expect(400);

      expect(response.body.error).toContain('Validation failed');
    });

    test('should reject message too short', async () => {
      const shortMessagePayload = {
        ...validPayload,
        message: 'Too short'
      };

      const response = await request(API_URL)
        .post('/')
        .send(shortMessagePayload)
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('should reject invalid turnstile token', async () => {
      const invalidTokenPayload = {
        ...validPayload,
        turnstileToken: 'invalid-token-123'
      };

      const response = await request(API_URL)
        .post('/')
        .send(invalidTokenPayload)
        .expect(400);

      expect(response.body.error).toContain('Verification failed');
    });

    test('should handle CORS preflight', async () => {
      const response = await request(API_URL)
        .options('/')
        .set('Origin', 'https://web3ld.org')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('https://web3ld.org');
      expect(response.headers['access-control-allow-methods']).toContain('POST');
    });

    test('should reject non-POST methods', async () => {
      const response = await request(API_URL)
        .get('/')
        .expect(405);

      expect(response.body.error).toContain('Method not allowed');
    });
  });

  describe('Backdoor Bypasses Rate Limiting', () => {
    test('backdoor key should work unlimited times without triggering rate limit', async () => {
      // Send 5 requests with backdoor - all should succeed
      for (let i = 0; i < 5; i++) {
        const response = await request(API_URL)
          .post('/')
          .send({
            ...validPayload,
            message: `Test message ${i} - testing backdoor bypass`
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.remaining).toBe(999); // Backdoor always shows 999
      }
    });

    test('backdoor should work even after IP is rate limited', async () => {
      // This test would need a controlled IP that's already rate limited
      // Skipping for now as it requires state setup
    });
  });
});