import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

export const basicAuthorizer = async (event) => {
  log(event);

  
  try {
    
  } catch (e) {
   
  }  
}

export const main = middyfy(basicAuthorizer);
