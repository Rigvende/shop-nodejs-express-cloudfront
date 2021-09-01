import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProductsByIdAsync } from '../../data/getData';

export const getProductsById = async (event) => {
  const product = await getProductsByIdAsync(event.pathParameters.productId);
  return formatJSONResponse({ product });
}

export const main = middyfy(getProductsById);
