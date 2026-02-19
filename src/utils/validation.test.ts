import { sanitizeInput, validatePantryItem, validateSearch } from './validation';

describe('sanitizeInput', () => {
  it('should trim whitespace', () => { expect(sanitizeInput('  test  ')).toBe('test'); });
  it('should remove angle brackets', () => { expect(sanitizeInput('<script>alert</script>')).toBe('scriptalert/script'); });
  it('should limit length to 100', () => { expect(sanitizeInput('a'.repeat(150)).length).toBe(100); });
});

describe('validatePantryItem', () => {
  it('should return error for empty name', () => { expect(validatePantryItem('', 'qty')).toBeTruthy(); });
  it('should return error for short name', () => { expect(validatePantryItem('a', 'qty')).toBeTruthy(); });
  it('should return error for empty quantity', () => { expect(validatePantryItem('name', '')).toBeTruthy(); });
  it('should return null for valid inputs', () => { expect(validatePantryItem('Milk', '1 gallon')).toBeNull(); });
});

describe('validateSearch', () => {
  it('should return error for empty query', () => { expect(validateSearch('')).toBeTruthy(); });
  it('should return error for short query', () => { expect(validateSearch('a')).toBeTruthy(); });
  it('should return null for valid query', () => { expect(validateSearch('chicken')).toBeNull(); });
});
