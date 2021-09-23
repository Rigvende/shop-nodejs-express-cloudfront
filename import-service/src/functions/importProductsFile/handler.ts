import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

const AWS = require('aws-sdk');
const { BUCKET, REGION } = process.env;

export const importProductsFile = async (event) => {
  log(event);

  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    return formatJSONResponse({ message: responseMessages[BAD_REQUEST] }, BAD_REQUEST);
  }

  const S3 = new AWS.S3({ region: REGION });
  const OBJECT_KEY = `uploaded/${event.queryStringParameters.name}`;

  const params = {
    Bucket: BUCKET,
    Key: OBJECT_KEY,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    const url = await S3.getSignedUrlPromise('putObject', params);
    return formatJSONResponse({ url });    
  } catch (e) {
    return formatJSONResponse({ 
        message: responseMessages[INTERNAL_SERVER_ERROR] 
      }, INTERNAL_SERVER_ERROR);
  }  
}

export const main = middyfy(importProductsFile);
