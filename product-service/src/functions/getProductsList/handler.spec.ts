import { getProductsList } from './handler';
import { OK } from '../../constants/responseCodes';

const MOCK_PRODUCTS = [
  {
    count: 4,
    description: "It's a lego toy",
    id: "1",
    price: 24,
    title: "Lego: Fools Village",
    url: "/product-images/village.jpg"
  },
  {
    count: 6,
    description: "It's an unicorn toy",
    id: "2",
    price: 10,
    title: "Unicorn",
    url: "/product-images/unicorn.jpg"
  },
  {
    count: 7,
    description: "It's a race track toy",
    id: "3",
    price: 23,
    title: "Race Track",
    url: "/product-images/race.jpg"
  },
  {
    count: 12,
    description: "It's a pop-it toy",
    id: "4",
    price: 15,
    title: "Pop It",
    url: "/product-images/popit.png"
  },
  {
    count: 7,
    description: "It's a Chii toy",
    id: "5",
    price: 23,
    title: "Chii the Cat",
    url: "/product-images/chii.jpg"
  },
  {
    count: 8,
    description: "It's a build car toy",
    id: "6",
    price: 15,
    title: "Build Car",
    url: "/product-images/build.jpg"
  },
  {
    count: 2,
    description: "It's a bakugan toy",
    id: "7",
    price: 23,
    title: "Bakugan",
    url: "/product-images/bakugan.jpg"
  },
  {
    count: 3,
    description: "It's an avocado toy",
    id: "8",
    price: 15,
    title: "Avocado",
    url: "/product-images/avocado.jpg"
  }
];

jest.mock('@libs/lambda');

describe('Test suite for getProductsList function', () => {
  it('Should return status code 200', async () => {
    const { statusCode } = await getProductsList();
    expect(statusCode).toBe(OK);
  });

  it('Should return lenght of products: 8', async () => {
    const { body } = await getProductsList();
    const { products } = JSON.parse(body);
    const lenght = Object.keys(products).length;
    expect(lenght).toBe(8);
  });  

  it('Should return the same products', async () => {
    const { body } = await getProductsList();
    const { products } = JSON.parse(body);
    expect(products).toEqual(MOCK_PRODUCTS);
  });
});
