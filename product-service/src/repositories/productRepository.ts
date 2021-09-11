import { Client } from 'pg';

export class ProductRepository {
  
  async getProducts(client: Client) {
    return await client.query(`
      SELECT p.id, p.title, p.description, p.price, p.url, s.count 
      FROM products p 
      INNER JOIN stocks s 
      ON p.id = s.product_id
    `);
  }

  async getProductsById(client: Client, id: string) {
    return await client.query(`
      SELECT p.id, p.title, p.description, p.price, p.url, s.count 
      FROM products p 
      INNER JOIN stocks s 
      ON p.id = s.product_id 
      WHERE p.id='${id}'
    `);
  }

  async addProduct(client: Client, product) {
    const { title, description, price, url } = product;

    try {
      await client.query('begin');

      const addProductResult = await client.query(`
        INSERT INTO products (title, description, price, url)
        VALUES ('${title}', '${description}', ${price}, '${url}')
        RETURNING id
      `);

      const newProductId = addProductResult.rows[0].id;

      await client.query(`
        INSERT INTO stocks (product_id, count)
        VALUES ('${newProductId}', 1)
      `);

      const newProduct = await this.getProductsById(client, newProductId);

      await client.query('commit');

      return newProductId;
    } catch (e) {
      await client.query('rollback');
      throw e;
    }
  }

}
