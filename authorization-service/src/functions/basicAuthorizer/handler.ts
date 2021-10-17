import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { UNAUTHORIZED } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';
import { createBrotliCompress } from 'zlib';

const generatePolicy = (creds, arn, effect = 'Allow') => {
  return {
    principalId: creds,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: arn
        }
      ]
    }
  }
};

export const basicAuthorizer = async (event, ctx, cb) => {
  log(event);

  if (event['type'].toLowCase() != 'token') {
    // return formatJSONResponse({ message: responseMessages[UNAUTHORIZED] }, UNAUTHORIZED);
    cb(responseMessages[UNAUTHORIZED]);
  }

  try {
    const { authorizationToken } = event;

    const creds = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(creds, 'base64');
    const plainCreds = buffer.toString('utf-8').split(':');
    const username = plainCreds[0];
    const password = plainCreds[1];

    const storedPassword = process.env[username];
    const effect = !storedPassword || storedPassword != password ? 'Deny' : 'Allow';
    const policy = generatePolicy(creds, event.methodArn, effect);

    // return formatJSONResponse({ policy });
    cb(null, policy);
  } catch (e) {
    // return formatJSONResponse({ message: responseMessages[UNAUTHORIZED] }, UNAUTHORIZED);
    cb(responseMessages[UNAUTHORIZED]);
  }
}

export const main = middyfy(basicAuthorizer);
