import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProductsAsync } from '../../data/getData';

export const getProductsList = async () => {
  const products = await getProductsAsync();
  return formatJSONResponse({ products });
}

export const main = middyfy(getProductsList);
