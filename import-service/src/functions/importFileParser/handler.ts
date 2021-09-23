import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { log } from '../../utils/logger';
import { INTERNAL_SERVER_ERROR, PARSED } from '../../constants/responseCodes';
import { responseMessages } from '../../constants/responseMessages';
import AWS from 'aws-sdk';
import CSV from 'csv-parser';

const { BUCKET, REGION } = process.env;

const importFileParser = async (event) => {
  log(event);

  const S3 = new AWS.S3({ region: REGION });

  try {
    for (const record of event.Records) {
      const OBJECT_KEY = decodeURIComponent(record.s3.object.key);

      const params = {
        Bucket: BUCKET,
        Key: OBJECT_KEY
      };

      const OBJECT = S3.getObject(params);
      const s3ReadStream = OBJECT.createReadStream();

      s3ReadStream
        .pipe(CSV())
        .on('data', (chunk) => {
          log(`Next chunk received: ${JSON.stringify(chunk)}`);
        })
        .on('error', (e) => {
          throw new Error(`Error occured: ${e}`);
        })
        .on('end', async () => {
          await S3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${OBJECT_KEY}`,
            Key: OBJECT_KEY.replace('uploaded', 'parsed')
          }).promise();

          await S3.deleteObject(params).promise();
        });
    }

    return formatJSONResponse({ 
      message: responseMessages[PARSED] 
    }, PARSED);
  } catch (e) {
    return formatJSONResponse({
      message: responseMessages[INTERNAL_SERVER_ERROR]
    }, INTERNAL_SERVER_ERROR);
  }
}

export const main = middyfy(importFileParser);
