import { Client } from 'pg';
import { ProductRepository } from '../repositories/productRepository';
import { validateProduct } from '../utils/productValidator';

export class ProductService {
  productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  getProductsAsync = async (client: Client) => {
    const products = await this.productRepository.getProducts(client);
    return products.rows;
  };

  getProductsByIdAsync = async (client: Client, id: string) => {
    const product = await this.productRepository.getProductsById(client, id);
    return product.rows.length > 0 ? product.rows[0] : null;
  };

  addProductAsync = async (client: Client, product) => {
    return await this.productRepository.addProduct(client, product);
  };

  async addProductsAsync(client: Client, records) {
    const result = {
      newProducts: [],
      errors: []
    };

    const products = records.map(record => JSON.parse(record.body));

    try {
        for (const product of products) {
          const validationResult = validateProduct(product);
          const notValidProduct = validationResult.length > 0;
      
          if (notValidProduct) {
            result.errors.push(validationResult);
          } else {
            const newProduct = await this.addProductAsync(client, product);
            result.newProducts.push(newProduct);
          }          
        }
        return result;
    } catch (e) {
        throw e;
    }
  }
}
