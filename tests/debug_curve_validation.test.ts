/**
 * Debug curve validation
 */

import { describe, expect, it } from 'vitest';
import { SM2_CURVE, getBasePoint, isPointOnCurve, pointMultiply } from '@/core/sm2/curve.js';

describe('Debug curve validation', () => {
  it('should validate base point is on curve', () => {
    const basePoint = getBasePoint();
    console.log('Base point:', {
      x: basePoint.x.toString(16),
      y: basePoint.y.toString(16)
    });
    
    const isOnCurve = isPointOnCurve(basePoint);
    console.log('Is base point on curve?', isOnCurve);
    
    // Manual calculation to debug
    const { p, a, b } = SM2_CURVE;
    const { x, y } = basePoint;
    
    const leftSide = (y * y) % p;
    const rightSide = (((x * x * x + a * x + b) % p) + p) % p;
    
    console.log('Manual validation:');
    console.log('  p:', p.toString(16));
    console.log('  a:', a.toString(16));
    console.log('  b:', b.toString(16));
    console.log('  leftSide (y²):', leftSide.toString(16));
    console.log('  rightSide (x³+ax+b):', rightSide.toString(16));
    console.log('  Equal?', leftSide === rightSide);
    
    expect(isOnCurve).toBe(true);
  });
  
  it('should validate a generated point', () => {
    const basePoint = getBasePoint();
    const testPrivateKey = 123456789n;
    const testPublicKey = pointMultiply(testPrivateKey, basePoint);
    
    console.log('Generated point:', {
      x: testPublicKey.x.toString(16),
      y: testPublicKey.y.toString(16)
    });
    
    const isOnCurve = isPointOnCurve(testPublicKey);
    console.log('Is generated point on curve?', isOnCurve);
    
    expect(isOnCurve).toBe(true);
  });
});
