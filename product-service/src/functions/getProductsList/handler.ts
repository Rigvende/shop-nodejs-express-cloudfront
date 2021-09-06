import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getProductsAsync } from '../../data/getData';
import { INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

export const getProductsList = async () => {
  try {
    const products = await getProductsAsync();
    return formatJSONResponse({ products });
  } catch (e) {
    return formatJSONResponse({ message: responseMessages[INTERNAL_SERVER_ERROR] }, INTERNAL_SERVER_ERROR);
  }
}

export const main = middyfy(getProductsList);
