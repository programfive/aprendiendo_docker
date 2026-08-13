import { expect, test } from 'vitest';
import { add } from './math';

test('suma 1 + 2 y da como resultado 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('suma números negativos', () => {
  expect(add(-1, -2)).toBe(-3);
});
