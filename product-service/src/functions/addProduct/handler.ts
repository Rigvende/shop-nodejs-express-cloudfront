import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR, OK, SUCCESS } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';
import { DbConnect } from '../../db/dbConnect';
import { ProductService} from '../../services/productService';
import { log } from '../../utils/logger';
import { validateProduct } from '../../utils/productValidator';

export const addProduct = async (event) => {
  log(event);

  try {
    const validationResult = validateProduct(event.body);
    const notValidProduct = validationResult.length > 0;

    if (notValidProduct) {
      return formatJSONResponse({ 
        message: responseMessages[BAD_REQUEST], 
        errorProps: validationResult }, 
        BAD_REQUEST);
    }
 
    const client = DbConnect.getClient();
    await DbConnect.connect();

    const productService = new ProductService();
    const newProductId = await productService.addProductAsync(client, event.body);

    return newProductId
      ? formatJSONResponse({}, SUCCESS)
      : formatJSONResponse({ message: responseMessages[NOT_FOUND] }, NOT_FOUND);
  } catch (e) {
    return formatJSONResponse({ message: responseMessages[INTERNAL_SERVER_ERROR] }, INTERNAL_SERVER_ERROR);
  } finally {
    await DbConnect.end();
  }
}

export const main = middyfy(addProduct);
