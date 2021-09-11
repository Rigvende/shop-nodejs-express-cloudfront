import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';
import { DbConnect } from '../../db/dbConnect';
import { ProductService} from '../../services/productService';
import { log } from '../../utils/logger';

export const getProductsById = async (event) => {
  log(event);

  try {
    const client = DbConnect.getClient();
    await DbConnect.connect();

    const productService = new ProductService();
    const product = await productService.getProductsByIdAsync(client, event.pathParameters.productId);

    return product
      ? formatJSONResponse({ product })
      : formatJSONResponse({ message: responseMessages[NOT_FOUND] }, NOT_FOUND);
  } catch (e) {
    return formatJSONResponse({ message: responseMessages[INTERNAL_SERVER_ERROR] }, INTERNAL_SERVER_ERROR);
  } finally {
    await DbConnect.end();
  }
}

export const main = middyfy(getProductsById);
