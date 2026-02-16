export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .slice(0, 100); // Limit length
};

export const validatePantryItem = (name: string, quantity: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Item name is required';
  }
  if (name.trim().length < 2) {
    return 'Item name must be at least 2 characters';
  }
  if (!quantity || quantity.trim().length === 0) {
    return 'Quantity is required';
  }
  return null;
};

export const validateSearch = (query: string): string | null => {
  if (!query || query.trim().length === 0) {
    return 'Search query is required';
  }
  if (query.trim().length < 2) {
    return 'Search query must be at least 2 characters';
  }
  return null;
};
