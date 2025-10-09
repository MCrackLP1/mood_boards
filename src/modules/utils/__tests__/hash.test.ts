/**
 * Tests for password hashing utilities
 */

import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../hash';

describe('hashPassword', () => {
  it('should generate consistent hash for same input', async () => {
    const password = 'test123';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    
    expect(hash1).toBe(hash2);
  });
  
  it('should generate different hashes for different inputs', async () => {
    const hash1 = await hashPassword('password1');
    const hash2 = await hashPassword('password2');
    
    expect(hash1).not.toBe(hash2);
  });
  
  it('should generate 64-character hex string', async () => {
    const hash = await hashPassword('test');
    
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });
});

describe('verifyPassword', () => {
  it('should verify correct password', async () => {
    const password = 'mySecret123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });
  
  it('should reject incorrect password', async () => {
    const password = 'mySecret123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword('wrongPassword', hash);
    expect(isValid).toBe(false);
  });
  
  it('should be case-sensitive', async () => {
    const password = 'Password';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword('password', hash);
    expect(isValid).toBe(false);
  });
});

