import { importProductsFile } from './handler';
import AWS from 'aws-sdk-mock';
import mockEventQueryString from  '../../data/mockEventQueryString.json';
import mockEventWrongQueryString from  '../../data/mockEventWrongQueryString.json';
import { OK, BAD_REQUEST } from '../../constants/responseCodes';

const MOCK_URL = 'mock.url';

describe('Import products test suite', () => {

  beforeAll(async () => {
    AWS.mock('S3', 'getSignedUrl', MOCK_URL);
  });

  it('Should return status code OK', async () => {
    const { statusCode } = await importProductsFile(mockEventQueryString);
    expect(statusCode).toBe(OK);
  });

  it('Should return status code BAD REQUEST', async () => {
    const { statusCode } = await importProductsFile(mockEventWrongQueryString);
    expect(statusCode).toBe(BAD_REQUEST);
  });

  it('Should return correct url', async () => {
    const { body } = await importProductsFile(mockEventQueryString);
    expect(body).toBeTruthy();
    expect(JSON.parse(body).url).toBe(MOCK_URL);
  });
});
