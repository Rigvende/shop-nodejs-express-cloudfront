import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProductsByIdAsync } from '../../data/getData';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

export const getProductsById = async (event) => {
  try {
    const product = await getProductsByIdAsync(event.pathParameters.productId);
    return product
      ? formatJSONResponse({ product })
      : formatJSONResponse({ message: responseMessages[NOT_FOUND] }, NOT_FOUND);
  } catch (e) {
    return formatJSONResponse({ message: responseMessages[INTERNAL_SERVER_ERROR] }, INTERNAL_SERVER_ERROR);
  }
}

export const main = middyfy(getProductsById);
