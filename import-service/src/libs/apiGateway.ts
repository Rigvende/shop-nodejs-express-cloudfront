import { GatewayResponseType } from 'aws-sdk/clients/apigateway';
import { OK } from '../constants/responseCodes';

const HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  'Access-Control-Allow-Credentials': true
};

const GATEWAY_HEADERS = {
  "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
  "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
};

export const formatGatewayResponse = (responseType: GatewayResponseType) => {
  return {
    Type: "AWS::ApiGateway::GatewayResponse",
    Properties: {
      RestApiId: {
        Ref: "ApiGatewayRestApi",
      },
      ResponseParameters: GATEWAY_HEADERS,
      ResponseType: responseType,
    },
  };
};

export const formatJSONResponse = (response: Record<string, unknown>, code: number = OK) => {
  return {
    statusCode: code,
    headers: HEADERS,
    body: JSON.stringify(response)
  }
}
