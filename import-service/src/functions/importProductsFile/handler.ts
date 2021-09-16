import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

const AWS = require('aws-sdk');
const { BUCKET } = process.env;

const importProductsFile = async (event) => {
  log(event);

  if (!event.querystrings || !event.querystrings.name) {
    return formatJSONResponse({ message: responseMessages[BAD_REQUEST] }, BAD_REQUEST);
  }

  const S3 = new AWS.S3({ region: 'eu-west-1' });
  const catalogPath = `uploaded/${event.querystrings.name}`;

  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv'
  };

  try {
    S3.getSignedUrl('putObject', params, (error, url) => {
      return error 
      ? formatJSONResponse({ message: responseMessages[BAD_REQUEST] }, BAD_REQUEST)
      : formatJSONResponse({ url });
    });    
  } catch (e) {
    return formatJSONResponse({ 
        message: responseMessages[INTERNAL_SERVER_ERROR] 
      }, INTERNAL_SERVER_ERROR);
  }  
}

export const main = middyfy(importProductsFile);
