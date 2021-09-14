import { Client } from 'pg';
import { ProductRepository } from '../repositories/productRepository';

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
    return product.rows;
  };

  addProductAsync = async (client: Client, product) => {
    return await this.productRepository.addProduct(client, product);
  };

}
