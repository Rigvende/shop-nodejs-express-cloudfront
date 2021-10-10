import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import addProduct from '@functions/addProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
import dotenv from 'dotenv';

dotenv.config({
  path: __dirname + './env'
});

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'createProductTopic'
        }
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      SNS_TOPIC: {
        Ref: 'createProductTopic'
      },
    },
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'create-product-topic-toys-store'
        }
      },
      SingleAdditionSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: '${env:SNS_EMAIL_SINGLE}',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            count: [{ numeric: ['=', 1] }]
          }
        }
      },
      MultipleAdditionSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'email',
          Endpoint: '${env:SNS_EMAIL_MULT}',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicy: {
            count: [{ numeric: ['>', 1] }]
          }
        }
      }
    }
  },
  functions: { 
    getProductsList, 
    getProductsById, 
    addProduct, 
    catalogBatchProcess 
  },
};

module.exports = serverlessConfiguration;
