import { getProductsById } from './handler';

const MOCK_PRODUCT =
  {
    count: 12,
    description: "It's a pop-it toy",
    id: "4",
    price: 15,
    title: "Pop It",
    url: "/product-images/popit.png"
  };

const createMockEvent = productId => ({ pathParameters: { productId }});

jest.mock('@libs/lambda');

describe('Test suite for getProductsById function', () => {
  it('Should return status code 200', async () => {
    const mockId = createMockEvent("4");
    const { statusCode } = await getProductsById(mockId);
    expect(statusCode).toBe(200);
  });

  it('Should return empty object', async () => {
    const mockId = createMockEvent("13");
    const { body } = await getProductsById(mockId);
    expect(body).toEqual("{}");
  });  

  it('Should return the same product', async () => {
    const mockId = createMockEvent("4");
    const { body } = await getProductsById(mockId);
    const { product } = JSON.parse(body);
    expect(product).toEqual(MOCK_PRODUCT);
  });
});
