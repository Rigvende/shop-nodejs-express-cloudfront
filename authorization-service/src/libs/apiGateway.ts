import { OK } from '../constants/responseCodes';

const JSON_HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  'Access-Control-Allow-Credentials': true
};

export const formatJSONResponse = (response: Record<string, unknown>, code: number = OK) => {
  return {
    statusCode: code,
    headers: JSON_HEADERS,
    body: JSON.stringify(response)
  }
}
