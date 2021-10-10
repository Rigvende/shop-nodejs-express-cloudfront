import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';
import { DbConnect } from '../../db/dbConnect';
import { ProductService } from '../../services/productService';
import { log } from '../../utils/logger';

export const catalogBatchProcess = async (event) => {
  log(event);

  const { REGION, SNS_TOPIC } = process.env;
  const { Records } = event;

  const SNS = new AWS.SNS({ region: REGION });
  const snsMessage = {
    Subject: 'Products added',
    Message: `Added ${Records.length} product(s) in DB`,
    TopicArn: SNS_TOPIC,
    MessageAttributes: {
      count: {
        DataType: 'Number',
        StringValue: `${Records.length}`
      }
    }
  };

  try {
    const client = DbConnect.getClient();
    await DbConnect.connect();   

    const productService = new ProductService();
    const addProductsResult = await productService.addProductsAsync(client, Records);
    
    await SNS.publish(snsMessage).promise();

    return addProductsResult.newProducts.length === Records.length
      ? formatJSONResponse({ snsMessage, newProducts: addProductsResult.newProducts }, SUCCESS)
      : formatJSONResponse({ message: responseMessages[BAD_REQUEST] }, BAD_REQUEST);
  } catch (e) {
    return formatJSONResponse({ message: responseMessages[INTERNAL_SERVER_ERROR] }, INTERNAL_SERVER_ERROR);
  } finally {
    await DbConnect.end();
  }
}

export const main = middyfy(catalogBatchProcess);
