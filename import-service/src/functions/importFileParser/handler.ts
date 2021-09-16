import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { INTERNAL_SERVER_ERROR, SUCCESS } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';

const AWS = require('aws-sdk');
const { BUCKET } = process.env;

const importFileParser = async (event) => {
  log(event);

  const S3 = new AWS.S3({ region: 'eu-west-1' });

  try {
    for (const record of event.Records) {
      const OBJECT_KEY = record.s3.object.key;

      await S3.copyObject({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${OBJECT_KEY}`,
        Key: OBJECT_KEY.replace('parsed', 'uploaded')
      }).promise();

      await S3.deleteObject({
        Bucket: BUCKET,
        Key: OBJECT_KEY
      }).promise();
    }

    return formatJSONResponse({}, SUCCESS);
  } catch (e) {
    return formatJSONResponse({
      message: responseMessages[INTERNAL_SERVER_ERROR]
    }, INTERNAL_SERVER_ERROR);
  }
}

export const main = middyfy(importFileParser);
