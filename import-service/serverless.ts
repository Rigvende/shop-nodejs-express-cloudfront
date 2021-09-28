import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import dotenv from 'dotenv';

dotenv.config({
  path: __dirname + './env'
});

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: ["arn:aws:s3:::my-bucket-for-toys-store"],
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ["arn:aws:s3:::my-bucket-for-toys-store/*"],
      }
    ]
  },
  functions: { importProductsFile, importFileParser },
};

module.exports = serverlessConfiguration;
