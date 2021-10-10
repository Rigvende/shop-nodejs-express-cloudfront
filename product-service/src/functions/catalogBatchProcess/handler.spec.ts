import { catalogBatchProcess } from './handler';
import AWS from 'aws-sdk-mock';
import mockProduct from '../../data/mockProduct.json';

jest.mock('pg', () => {
    const mockClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mockClient) };
});

const Records = {
    Records: [
        {
            body: JSON.stringify(mockProduct)
        },
        {
            body: JSON.stringify(mockProduct)
        }
    ]
};

const mockProducts = [mockProduct, mockProduct];

jest.mock('@src/services/product', () => ({
    addProductsAsync: jest.fn(() => mockProducts)
}));


describe('CatalogBatchProcess test suite', () => {
    beforeAll(() => {
        AWS.mock('SNS', 'publish', (params, cb) => cb(null, params));
    });

    it('Should return the same number of products', async () => {
        const { body } = await catalogBatchProcess(Records);
        const { newProducts } = JSON.parse(body);
        expect(newProducts.length).toEqual(mockProducts.length);
    });

    it('Should return correct snsMessage', async () => {
      const { body } = await catalogBatchProcess(Records);
      const { snsMessage } = JSON.parse(body);
        const { Subject } = snsMessage;
        expect(Subject).toBe('Products added');
    });
});
