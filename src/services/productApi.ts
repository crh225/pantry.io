// Open Food Facts API - free product database
const BASE_URL = 'https://world.openfoodfacts.org/api/v0';

export interface ProductInfo {
  name: string;
  brand?: string;
  quantity?: string;
  category?: string;
}

export const productApi = {
  getByBarcode: async (barcode: string): Promise<ProductInfo | null> => {
    try {
      const response = await fetch(`${BASE_URL}/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        return {
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          quantity: product.quantity,
          category: product.categories_tags?.[0]?.replace('en:', ''),
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  },
};
